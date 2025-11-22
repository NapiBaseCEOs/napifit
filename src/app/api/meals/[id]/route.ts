import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

const mealSchema = z.object({
  imageUrl: z.string().url().optional().nullable(),
  foods: z
    .array(
      z.object({
        name: z.string(),
        calories: z.number().min(0),
        quantity: z.string().optional(),
      })
    )
    .optional(),
  totalCalories: z.number().min(0).max(50000).optional(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  recommendations: z.any().optional().nullable(),
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
    .from("meals")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ message: "Öğün bulunamadı" }, { status: 404 });
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
    const validatedData = mealSchema.parse(body);

    const { data: existing } = await supabase
      .from("meals")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (!existing) {
      return NextResponse.json({ message: "Öğün bulunamadı" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (validatedData.imageUrl !== undefined) updateData.image_url = validatedData.imageUrl;
    if (validatedData.foods !== undefined) updateData.foods = validatedData.foods as any;
    if (validatedData.totalCalories !== undefined) updateData.total_calories = validatedData.totalCalories;
    if (validatedData.mealType !== undefined) updateData.meal_type = validatedData.mealType;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes;
    if (validatedData.recommendations !== undefined) updateData.recommendations = validatedData.recommendations;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "Güncellenecek veri yok" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("meals")
      .update(updateData)
      .eq("id", params.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error || !data) {
      throw error;
    }

    return NextResponse.json({
      message: "Öğün güncellendi",
      meal: data,
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

    console.error("Meal update error:", error);
    return NextResponse.json(
      {
        message: "Öğün güncellenirken hata oluştu",
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
    .from("meals")
    .select("id")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!existing) {
    return NextResponse.json({ message: "Öğün bulunamadı" }, { status: 404 });
  }

  const { error } = await supabase.from("meals").delete().eq("id", params.id).eq("user_id", user.id);

  if (error) {
    return NextResponse.json(
      {
        message: "Öğün silinirken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Öğün silindi" });
}

