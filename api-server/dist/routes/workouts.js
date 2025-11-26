"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const supabase_1 = require("../config/supabase");
const auth_1 = require("../middleware/auth");
// import { estimateWorkoutCalories, hasOpenAIKey } from "../lib/ai/calorie-estimator";
const router = (0, express_1.Router)();
const workoutSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(200),
    type: zod_1.z.enum(["cardio", "strength", "flexibility", "sports", "other"]),
    duration: zod_1.z.number().min(1).max(1440).optional().nullable(),
    calories: zod_1.z.number().min(0).max(10000).optional().nullable(),
    distance: zod_1.z.number().min(0).max(1000).optional().nullable(),
    notes: zod_1.z.string().max(1000).optional().nullable(),
});
// GET /api/workouts - List all workouts
router.get("/", auth_1.authenticateRequest, async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Yetkisiz erişim" });
        }
        const limit = Math.min(parseInt(req.query.limit || "50", 10), 100);
        const offset = parseInt(req.query.offset || "0", 10);
        const { data, error, count } = await supabase_1.supabase
            .from("workouts")
            .select("*", { count: "exact" })
            .eq("user_id", req.user.id)
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);
        if (error) {
            throw error;
        }
        return res.json({
            workouts: data?.map((workout) => ({
                ...workout,
                createdAt: workout.created_at,
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
// POST /api/workouts - Create new workout
router.post("/", auth_1.authenticateRequest, async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Yetkisiz erişim" });
        }
        const validatedData = workoutSchema.parse(req.body);
        let calories = validatedData.calories ?? null;
        // TODO: AI calorie estimation (will be added later)
        // if ((calories === null || Number.isNaN(calories)) && hasOpenAIKey) {
        //   try {
        //     const aiResult = await estimateWorkoutCalories({ ... });
        //     calories = aiResult.calories;
        //   } catch (aiError) {
        //     console.warn("Workout AI estimation failed:", aiError);
        //   }
        // }
        const { data, error } = await supabase_1.supabase
            .from("workouts")
            .insert({
            user_id: req.user.id,
            name: validatedData.name,
            type: validatedData.type,
            duration: validatedData.duration ?? null,
            calories: calories,
            distance: validatedData.distance ?? null,
            notes: validatedData.notes ?? null,
        })
            .select()
            .single();
        if (error || !data) {
            throw error;
        }
        return res.status(201).json({
            message: "Egzersiz başarıyla eklendi",
            workout: data,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=workouts.js.map