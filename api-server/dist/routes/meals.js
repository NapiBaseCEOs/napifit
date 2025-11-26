"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const supabase_1 = require("../config/supabase");
const auth_1 = require("../middleware/auth");
// import { estimateMealCalories, hasOpenAIKey } from "../lib/ai/calorie-estimator";
const router = (0, express_1.Router)();
const mealSchema = zod_1.z.object({
    imageUrl: zod_1.z.string().url().optional().nullable(),
    foods: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        calories: zod_1.z.number().min(0).optional(),
        quantity: zod_1.z.string().optional(),
    })),
    totalCalories: zod_1.z.number().min(0).max(50000).optional(),
    mealType: zod_1.z.enum(["breakfast", "lunch", "dinner", "snack"]).optional().nullable(),
    notes: zod_1.z.string().max(1000).optional().nullable(),
    recommendations: zod_1.z.any().optional().nullable(),
});
// GET /api/meals - List all meals
router.get("/", auth_1.authenticateRequest, async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Yetkisiz erişim" });
        }
        const limit = Math.min(parseInt(req.query.limit || "50", 10), 100);
        const offset = parseInt(req.query.offset || "0", 10);
        const date = req.query.date;
        let query = supabase_1.supabase
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
            meals: data?.map((meal) => ({
                ...meal,
                createdAt: meal.created_at,
            })) ?? [],
            total: count ?? 0,
            limit,
            offset,
        });
    }
    catch (error) {
        next(error);
    }
});
// POST /api/meals - Create new meal
router.post("/", auth_1.authenticateRequest, async (req, res, next) => {
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
        const { data: meal, error } = await supabase_1.supabase
            .from("meals")
            .insert({
            user_id: req.user.id,
            image_url: validatedData.imageUrl ?? null,
            foods: foods,
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
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=meals.js.map