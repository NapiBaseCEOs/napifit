import { Router } from "express";
import { z } from "zod";
import { supabase } from "../config/supabase";
import { authenticateRequest, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

const waterIntakeSchema = z.object({
  amount_ml: z.number().min(1).max(10000),
});

// GET /api/water-intake - Get today's water intake
router.get("/", authenticateRequest, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const dateParam = req.query.date as string | undefined;
    const today = dateParam ? new Date(dateParam) : new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: waterIntake, error } = await supabase
      .from("water_intake")
      .select("*")
      .eq("user_id", req.user.id)
      .gte("created_at", today.toISOString())
      .lt("created_at", tomorrow.toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const totalAmount = waterIntake?.reduce((sum, intake) => sum + Number(intake.amount_ml), 0) || 0;

    const { data: profile } = await supabase
      .from("profiles")
      .select("daily_water_goal_ml, water_reminder_enabled, water_reminder_interval_minutes")
      .eq("id", req.user.id)
      .single();

    const dailyGoal = profile?.daily_water_goal_ml || 2000;
    const reminderEnabled = profile?.water_reminder_enabled ?? true;
    const reminderInterval = profile?.water_reminder_interval_minutes || 120;

    return res.json({
      intakes: waterIntake || [],
      totalAmount,
      dailyGoal: Number(dailyGoal),
      progress: Math.min(100, (totalAmount / Number(dailyGoal)) * 100),
      reminderEnabled,
      reminderInterval,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/water-intake - Add water intake
router.post("/", authenticateRequest, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const validated = waterIntakeSchema.parse(req.body);

    const { data, error } = await supabase
      .from("water_intake")
      .insert({
        user_id: req.user.id,
        amount_ml: validated.amount_ml,
      })
      .select()
      .single();

    if (error || !data) {
      throw error;
    }

    // Get updated totals
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: waterIntake } = await supabase
      .from("water_intake")
      .select("*")
      .eq("user_id", req.user.id)
      .gte("created_at", today.toISOString())
      .lt("created_at", tomorrow.toISOString());

    const totalAmount = waterIntake?.reduce((sum, intake) => sum + Number(intake.amount_ml), 0) || 0;

    const { data: profile } = await supabase
      .from("profiles")
      .select("daily_water_goal_ml")
      .eq("id", req.user.id)
      .single();

    const dailyGoal = profile?.daily_water_goal_ml || 2000;

    return res.status(201).json({
      message: "Su tüketimi eklendi",
      intake: data,
      totalAmount,
      dailyGoal: Number(dailyGoal),
      progress: Math.min(100, (totalAmount / Number(dailyGoal)) * 100),
    });
  } catch (error) {
    next(error);
  }
});

export default router;

