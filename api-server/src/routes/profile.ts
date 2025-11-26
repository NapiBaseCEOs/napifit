import { Router } from "express";
import { z } from "zod";
import { supabase, supabaseAdmin, hasSupabaseServiceRole } from "../config/supabase";
import { authenticateRequest, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

const profileUpdateSchema = z.object({
  name: z.string().max(200).optional(),
  height: z.number().min(50).max(260).nullable().optional(),
  weight: z.number().min(20).max(300).nullable().optional(),
  age: z.number().min(13).max(120).nullable().optional(),
  gender: z.enum(["male", "female", "other"]).nullable().optional(),
  targetWeight: z.number().min(20).max(300).nullable().optional(),
  dailySteps: z.number().min(0).max(200000).nullable().optional(),
  showPublicProfile: z.boolean().optional(),
  showCommunityStats: z.boolean().optional(),
  dailyWaterGoalMl: z.number().min(500).max(10000).optional(),
  waterReminderEnabled: z.boolean().optional(),
  waterReminderIntervalMinutes: z.number().min(30).max(480).optional(),
});

// GET /api/profile - Get user profile
router.get("/", authenticateRequest, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Yetkisiz erişim" });
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select(
        "id,email,full_name,avatar_url,height_cm,weight_kg,age,gender,target_weight_kg,daily_steps,onboarding_completed,show_public_profile,show_community_stats,created_at"
      )
      .eq("id", req.user.id)
      .maybeSingle();

    if (error) {
      return res.status(500).json({
        message: "Profil alınırken hata oluştu",
        error: error.message,
      });
    }

    if (!profile) {
      if (hasSupabaseServiceRole && supabaseAdmin) {
        const fallbackPayload = {
          id: req.user.id,
          email: req.user.email ?? "",
          full_name: req.user.email ?? "",
          onboarding_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        await (supabaseAdmin as any)
          .from("profiles")
          .upsert(fallbackPayload, { onConflict: "id" })
          .select("id")
          .single()
          .catch(() => null);

        return res.json({
          id: req.user.id,
          name: fallbackPayload.full_name,
          email: fallbackPayload.email,
          image: null,
          height: null,
          weight: null,
          age: null,
          gender: null,
          targetWeight: null,
          dailySteps: null,
          onboardingCompleted: false,
          createdAt: fallbackPayload.created_at,
        });
      }

      return res.status(404).json({ message: "Profil bulunamadı" });
    }

    return res.json({
      id: profile.id,
      name: profile.full_name,
      email: profile.email,
      image: profile.avatar_url,
      height: profile.height_cm,
      weight: profile.weight_kg,
      age: profile.age,
      gender: profile.gender,
      targetWeight: profile.target_weight_kg,
      dailySteps: profile.daily_steps,
      onboardingCompleted: profile.onboarding_completed,
      showPublicProfile: profile.show_public_profile ?? true,
      showCommunityStats: profile.show_community_stats ?? true,
      createdAt: profile.created_at,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/profile - Update user profile
router.put("/", authenticateRequest, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Yetkisiz erişim" });
    }

    const parsed = profileUpdateSchema.parse(req.body);

    if (Object.keys(parsed).length === 0) {
      return res.status(400).json({ message: "Güncellenecek veri yok" });
    }

    const updateData: any = {
      full_name: parsed.name,
      height_cm: parsed.height,
      weight_kg: parsed.weight,
      age: parsed.age,
      gender: parsed.gender,
      target_weight_kg: parsed.targetWeight,
      daily_steps: parsed.dailySteps,
      show_public_profile: parsed.showPublicProfile,
      show_community_stats: parsed.showCommunityStats,
      updated_at: new Date().toISOString(),
    };

    if (parsed.dailyWaterGoalMl !== undefined) {
      updateData.daily_water_goal_ml = parsed.dailyWaterGoalMl;
    }
    if (parsed.waterReminderEnabled !== undefined) {
      updateData.water_reminder_enabled = parsed.waterReminderEnabled;
    }
    if (parsed.waterReminderIntervalMinutes !== undefined) {
      updateData.water_reminder_interval_minutes = parsed.waterReminderIntervalMinutes;
    }

    // Remove undefined values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const { data, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", req.user.id)
      .select()
      .single();

    if (error || !data) {
      return res.status(500).json({
        message: "Profil güncellenirken hata oluştu",
        error: error?.message,
      });
    }

    return res.json({
      message: "Profil güncellendi",
      user: {
        id: data.id,
        name: data.full_name,
        email: data.email,
        image: data.avatar_url,
        height: data.height_cm,
        weight: data.weight_kg,
        age: data.age,
        gender: data.gender,
        targetWeight: data.target_weight_kg,
        dailySteps: data.daily_steps,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

