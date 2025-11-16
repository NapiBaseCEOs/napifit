import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

const healthMetricSchema = z.object({
  weight: z.number().min(30).max(300).optional().nullable(),
  bodyFat: z.number().min(0).max(100).optional().nullable(),
  muscleMass: z.number().min(0).max(200).optional().nullable(),
  water: z.number().min(0).max(100).optional().nullable(),
  bmi: z.number().min(10).max(60).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

// GET - Tüm sağlık metriklerini listele
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
      .from("health_metrics")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      healthMetrics:
        data?.map((metric) => ({
          ...metric,
          createdAt: metric.created_at,
        })) ?? [],
      total: count ?? 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Health metrics fetch error:", error);
    return NextResponse.json(
      {
        message: "Sağlık metrikleri alınırken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

// POST - Yeni sağlık metrik ekle
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
    const validatedData = healthMetricSchema.parse(body);

    if (
      !validatedData.weight &&
      !validatedData.bodyFat &&
      !validatedData.muscleMass &&
      !validatedData.water &&
      !validatedData.bmi
    ) {
      return NextResponse.json(
        { message: "En az bir metrik değeri gerekli" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("health_metrics")
      .insert({
        user_id: user.id,
        weight_kg: validatedData.weight ?? null,
        body_fat: validatedData.bodyFat ?? null,
        muscle_mass: validatedData.muscleMass ?? null,
        water: validatedData.water ?? null,
        bmi: validatedData.bmi ?? null,
        notes: validatedData.notes ?? null,
      })
      .select()
      .single();

    if (error || !data) {
      throw error;
    }

    if (validatedData.weight) {
      await supabase
        .from("profiles")
        .update({
          weight_kg: validatedData.weight,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    }

    return NextResponse.json(
      {
        message: "Sağlık metrik başarıyla eklendi",
        healthMetric: data,
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

    console.error("Health metric create error:", error);
    return NextResponse.json(
      {
        message: "Sağlık metrik eklenirken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

