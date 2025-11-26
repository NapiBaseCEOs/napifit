"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const supabase_1 = require("../config/supabase");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const waterIntakeSchema = zod_1.z.object({
    amount_ml: zod_1.z.number().min(1).max(10000),
});
// GET /api/water-intake - Get today's water intake
router.get("/", auth_1.authenticateRequest, async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const dateParam = req.query.date;
        const today = dateParam ? new Date(dateParam) : new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const { data: waterIntake, error } = await supabase_1.supabase
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
        const { data: profile } = await supabase_1.supabase
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
    }
    catch (error) {
        next(error);
    }
});
// POST /api/water-intake - Add water intake
router.post("/", auth_1.authenticateRequest, async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const validated = waterIntakeSchema.parse(req.body);
        const { data, error } = await supabase_1.supabase
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
        const { data: waterIntake } = await supabase_1.supabase
            .from("water_intake")
            .select("*")
            .eq("user_id", req.user.id)
            .gte("created_at", today.toISOString())
            .lt("created_at", tomorrow.toISOString());
        const totalAmount = waterIntake?.reduce((sum, intake) => sum + Number(intake.amount_ml), 0) || 0;
        const { data: profile } = await supabase_1.supabase
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
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=water-intake.js.map