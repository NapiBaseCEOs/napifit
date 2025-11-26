import { Router } from "express";
import { z } from "zod";
import { supabase } from "../config/supabase";
import { authenticateRequest, AuthenticatedRequest } from "../middleware/auth";
// import { estimateWorkoutCalories, hasOpenAIKey } from "../lib/ai/calorie-estimator";

const router = Router();

const workoutSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.enum(["cardio", "strength", "flexibility", "sports", "other"]),
  duration: z.number().min(1).max(1440).optional().nullable(),
  calories: z.number().min(0).max(10000).optional().nullable(),
  distance: z.number().min(0).max(1000).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

// GET /api/workouts - List all workouts
router.get("/", authenticateRequest, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Yetkisiz erişim" });
    }

    const limit = Math.min(parseInt(req.query.limit as string || "50", 10), 100);
    const offset = parseInt(req.query.offset as string || "0", 10);

    const { data, error, count } = await supabase
      .from("workouts")
      .select("*", { count: "exact" })
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return res.json({
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
    next(error);
  }
});

// POST /api/workouts - Create new workout
router.post("/", authenticateRequest, async (req: AuthenticatedRequest, res, next) => {
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

    const { data, error } = await supabase
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
  } catch (error) {
    next(error);
  }
});

export default router;

