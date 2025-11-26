"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const supabase_1 = require("../config/supabase");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const healthMetricSchema = zod_1.z.object({
    weight: zod_1.z.number().min(30).max(300).optional().nullable(),
    bodyFat: zod_1.z.number().min(0).max(100).optional().nullable(),
    muscleMass: zod_1.z.number().min(0).max(200).optional().nullable(),
    water: zod_1.z.number().min(0).max(100).optional().nullable(),
    bmi: zod_1.z.number().min(10).max(60).optional().nullable(),
    bowelMovementDays: zod_1.z.number().min(0.5).max(7).optional().nullable(),
    notes: zod_1.z.string().max(1000).optional().nullable(),
});
// GET /api/health-metrics - List all health metrics
router.get("/", auth_1.authenticateRequest, async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Yetkisiz erişim" });
        }
        const limit = Math.min(parseInt(req.query.limit || "50", 10), 100);
        const offset = parseInt(req.query.offset || "0", 10);
        const { data, error, count } = await supabase_1.supabase
            .from("health_metrics")
            .select("*", { count: "exact" })
            .eq("user_id", req.user.id)
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);
        if (error) {
            throw error;
        }
        return res.json({
            healthMetrics: data?.map((metric) => ({
                ...metric,
                createdAt: metric.created_at,
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
// POST /api/health-metrics - Create new health metric
router.post("/", auth_1.authenticateRequest, async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Yetkisiz erişim" });
        }
        const validatedData = healthMetricSchema.parse(req.body);
        if (!validatedData.weight &&
            !validatedData.bodyFat &&
            !validatedData.muscleMass &&
            !validatedData.water &&
            !validatedData.bmi &&
            !validatedData.bowelMovementDays) {
            return res.status(400).json({
                message: "En az bir metrik değeri gerekli",
            });
        }
        const { data, error } = await supabase_1.supabase
            .from("health_metrics")
            .insert({
            user_id: req.user.id,
            weight_kg: validatedData.weight ?? null,
            body_fat: validatedData.bodyFat ?? null,
            muscle_mass: validatedData.muscleMass ?? null,
            water: validatedData.water ?? null,
            bmi: validatedData.bmi ?? null,
            bowel_movement_days: validatedData.bowelMovementDays ?? null,
            notes: validatedData.notes ?? null,
        })
            .select()
            .single();
        if (error || !data) {
            throw error;
        }
        return res.status(201).json({
            message: "Sağlık metrik başarıyla eklendi",
            healthMetric: data,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=health-metrics.js.map