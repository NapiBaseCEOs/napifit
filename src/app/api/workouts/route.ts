import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { estimateWorkoutCalories, hasOpenAIKey } from "@/lib/ai/calorie-estimator";

const workoutSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.enum(["cardio", "strength", "flexibility", "sports", "other"]),
  duration: z.number().min(1).max(1440).optional().nullable(),
  calories: z.number().min(0).max(10000).optional().nullable(),
  distance: z.number().min(0).max(1000).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

// GET - Tüm egzersizleri listele
export async function GET(request: Request) {
  const supabase = createSupabaseRouteClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const { data, error, count } = await supabase
      .from("workouts")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      workouts:
        data?.map((workout) => ({
          ...workout,
          createdAt: workout.created_at,
        })) ?? [],
      total: count ?? 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Workouts fetch error:", error);
    return NextResponse.json(
      {
        message: "Egzersizler alınırken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

// POST - Yeni egzersiz ekle
export async function POST(request: Request) {
  const supabase = createSupabaseRouteClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = workoutSchema.parse(body);

    let calories = validatedData.calories ?? null;

    if ((calories === null || Number.isNaN(calories)) && hasOpenAIKey) {
      try {
        const aiResult = await estimateWorkoutCalories({
          name: validatedData.name,
          type: validatedData.type,
          duration: validatedData.duration ?? null,
          distance: validatedData.distance ?? null,
          intensity: null,
          notes: validatedData.notes ?? null,
        });
        calories = aiResult.calories;
      } catch (aiError) {
        console.warn("Workout AI estimation failed:", aiError);
      }
    }

    const { data, error } = await supabase
      .from("workouts")
      .insert({
        user_id: user.id,
        name: validatedData.name,
        type: validatedData.type,
        duration_minutes: validatedData.duration ?? null,
        calories: calories ?? null,
        distance_km: validatedData.distance ?? null,
        notes: validatedData.notes ?? null,
      })
      .select()
      .single();

    if (error || !data) {
      throw error;
    }

    return NextResponse.json(
      {
        message: "Egzersiz başarıyla eklendi",
        workout: data,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Geçersiz veri",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Workout create error:", error);
    return NextResponse.json(
      {
        message: "Egzersiz eklenirken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

