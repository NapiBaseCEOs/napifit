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
    .from("health_metrics")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ message: "Sağlık metrik bulunamadı" }, { status: 404 });
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
    const validatedData = healthMetricSchema.parse(body);

    const { data: existing } = await supabase
      .from("health_metrics")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (!existing) {
      return NextResponse.json({ message: "Sağlık metrik bulunamadı" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (validatedData.weight !== undefined) updateData.weight_kg = validatedData.weight;
    if (validatedData.bodyFat !== undefined) updateData.body_fat = validatedData.bodyFat;
    if (validatedData.muscleMass !== undefined) updateData.muscle_mass = validatedData.muscleMass;
    if (validatedData.water !== undefined) updateData.water = validatedData.water;
    if (validatedData.bmi !== undefined) updateData.bmi = validatedData.bmi;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "Güncellenecek veri yok" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("health_metrics")
      .update(updateData)
      .eq("id", params.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error || !data) {
      throw error;
    }

    if (validatedData.weight !== undefined) {
      await supabase
        .from("profiles")
        .update({ weight_kg: validatedData.weight, updated_at: new Date().toISOString() })
        .eq("id", user.id);
    }

    return NextResponse.json({
      message: "Sağlık metrik güncellendi",
      healthMetric: data,
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

    console.error("Health metric update error:", error);
    return NextResponse.json(
      {
        message: "Sağlık metrik güncellenirken hata oluştu",
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
    .from("health_metrics")
    .select("id")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!existing) {
    return NextResponse.json({ message: "Sağlık metrik bulunamadı" }, { status: 404 });
  }

  const { error } = await supabase.from("health_metrics").delete().eq("id", params.id).eq("user_id", user.id);

  if (error) {
    return NextResponse.json(
      {
        message: "Sağlık metrik silinirken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Sağlık metrik silindi" });
}

