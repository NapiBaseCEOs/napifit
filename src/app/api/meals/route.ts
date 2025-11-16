import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { estimateMealCalories, hasOpenAIKey } from "@/lib/ai/calorie-estimator";

const mealSchema = z.object({
  imageUrl: z.string().url().optional().nullable(),
  foods: z.array(z.object({
    name: z.string(),
    calories: z.number().min(0).optional(),
    quantity: z.string().optional(),
  })),
  totalCalories: z.number().min(0).max(50000).optional(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  recommendations: z.any().optional().nullable(),
});

// GET - Tüm öğünleri listele
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
    const date = searchParams.get("date");

    let query = supabase
      .from("meals")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query = query.gte("created_at", startDate.toISOString()).lte("created_at", endDate.toISOString());
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      meals:
        data?.map((meal) => ({
          ...meal,
          createdAt: meal.created_at,
        })) ?? [],
      total: count ?? 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Meals fetch error:", error);
    return NextResponse.json(
      {
        message: "Öğünler alınırken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

// POST - Yeni öğün ekle
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
    const validatedData = mealSchema.parse(body);

    let foods = validatedData.foods;
    let totalCalories = validatedData.totalCalories ?? null;

    const requiresAi =
      hasOpenAIKey &&
      (totalCalories === null || foods.some((food) => typeof food.calories !== "number"));

    if (requiresAi) {
      try {
        const aiResult = await estimateMealCalories({
          mealType: validatedData.mealType ?? null,
          notes: validatedData.notes ?? null,
          foods: foods.map((food, index) => ({
            index,
            name: food.name,
            quantity: food.quantity ?? undefined,
          })),
        });

        totalCalories = aiResult.totalCalories;
        const breakdownMap = new Map(aiResult.breakdown.map((item) => [item.index, item]));
        foods = foods.map((food, index) => {
          const aiFood = breakdownMap.get(index);
          if (typeof food.calories === "number") {
            return food;
          }
          return {
            ...food,
            calories: aiFood?.calories ?? undefined,
          };
        });
      } catch (aiError) {
        console.warn("Meal AI estimation failed:", aiError);
      }
    }

    if (totalCalories == null) {
      totalCalories = foods.reduce((sum, food) => sum + (food.calories ?? 0), 0);
    }

    if (foods.some((food) => typeof food.calories !== "number")) {
      return NextResponse.json(
        { message: "Kalori bilgisi belirlenemedi. Lütfen değer girin veya AI özelliğini kullanın." },
        { status: 400 }
      );
    }

    const meal = await supabase
      .from("meals")
      .insert({
        user_id: user.id,
        image_url: validatedData.imageUrl ?? null,
        foods: foods as any,
        total_calories: totalCalories,
        meal_type: validatedData.mealType ?? null,
        notes: validatedData.notes ?? null,
        recommendations: validatedData.recommendations ?? null,
      })
      .select()
      .single();

    if (meal.error || !meal.data) {
      throw meal.error;
    }

    return NextResponse.json(
      {
        message: "Öğün başarıyla eklendi",
        meal: meal.data,
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

    console.error("Meal create error:", error);
    return NextResponse.json(
      {
        message: "Öğün eklenirken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

