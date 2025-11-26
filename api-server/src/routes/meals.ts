import { Router } from "express";
import { z } from "zod";
import { supabase } from "../config/supabase";
import { authenticateRequest, AuthenticatedRequest } from "../middleware/auth";
// import { estimateMealCalories, hasOpenAIKey } from "../lib/ai/calorie-estimator";

const router = Router();

const mealSchema = z.object({
  imageUrl: z.string().url().optional().nullable(),
  foods: z.array(
    z.object({
      name: z.string(),
      calories: z.number().min(0).optional(),
      quantity: z.string().optional(),
    })
  ),
  totalCalories: z.number().min(0).max(50000).optional(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  recommendations: z.any().optional().nullable(),
});

// GET /api/meals - List all meals
router.get("/", authenticateRequest, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Yetkisiz erişim" });
    }

    const limit = Math.min(parseInt(req.query.limit as string || "50", 10), 100);
    const offset = parseInt(req.query.offset as string || "0", 10);
    const date = req.query.date as string | undefined;

    let query = supabase
      .from("meals")
      .select("*", { count: "exact" })
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query = query
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return res.json({
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
    next(error);
  }
});

// POST /api/meals - Create new meal
router.post("/", authenticateRequest, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Yetkisiz erişim" });
    }

    const validatedData = mealSchema.parse(req.body);

    let foods = validatedData.foods;
    let totalCalories = validatedData.totalCalories ?? null;

    // TODO: AI calorie estimation (will be added later)
    // const requiresAi = hasOpenAIKey && (totalCalories === null || foods.some((food) => typeof food.calories !== "number"));
    // if (requiresAi) { ... }

    if (totalCalories == null) {
      totalCalories = foods.reduce((sum, food) => sum + (food.calories ?? 0), 0);
    }

    if (foods.some((food) => typeof food.calories !== "number")) {
      return res.status(400).json({
        message: "Kalori bilgisi belirlenemedi. Lütfen değer girin veya AI özelliğini kullanın.",
      });
    }

    const { data: meal, error } = await supabase
      .from("meals")
      .insert({
        user_id: req.user.id,
        image_url: validatedData.imageUrl ?? null,
        foods: foods as any,
        total_calories: totalCalories,
        meal_type: validatedData.mealType ?? null,
        notes: validatedData.notes ?? null,
        recommendations: validatedData.recommendations ?? null,
      })
      .select()
      .single();

    if (error || !meal) {
      throw error;
    }

    return res.status(201).json({
      message: "Öğün başarıyla eklendi",
      meal,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

