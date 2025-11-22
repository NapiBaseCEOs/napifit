import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

const workoutSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  type: z.enum(["cardio", "strength", "flexibility", "sports", "other"]).optional(),
  duration: z.number().min(1).max(1440).optional().nullable(),
  calories: z.number().min(0).max(10000).optional().nullable(),
  distance: z.number().min(0).max(1000).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseRouteClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ message: "Egzersiz bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

    const { data: existing } = await supabase
      .from("workouts")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (!existing) {
      return NextResponse.json({ message: "Egzersiz bulunamadı" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.type !== undefined) updateData.type = validatedData.type;
    if (validatedData.duration !== undefined) updateData.duration_minutes = validatedData.duration;
    if (validatedData.calories !== undefined) updateData.calories = validatedData.calories;
    if (validatedData.distance !== undefined) updateData.distance_km = validatedData.distance;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "Güncellenecek veri yok" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("workouts")
      .update(updateData)
      .eq("id", params.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error || !data) {
      throw error;
    }

    return NextResponse.json({
      message: "Egzersiz güncellendi",
      workout: data,
    });
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

    console.error("Workout update error:", error);
    return NextResponse.json(
      {
        message: "Egzersiz güncellenirken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseRouteClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const { data: existing } = await supabase
    .from("workouts")
    .select("id")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!existing) {
    return NextResponse.json({ message: "Egzersiz bulunamadı" }, { status: 404 });
  }

  const { error } = await supabase.from("workouts").delete().eq("id", params.id).eq("user_id", user.id);

  if (error) {
    return NextResponse.json(
      {
        message: "Egzersiz silinirken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Egzersiz silindi" });
}

