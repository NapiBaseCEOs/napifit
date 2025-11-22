import { supabaseAdmin } from "@/lib/supabase/admin";
import { APP_VERSION } from "@/config/version";

export const WATER_PROFILE_ID = "ce507534-ab1a-4ccf-b0c3-4d42e8a608b1";
export const WATER_PROFILE_EMAIL = "dmert67900@gmail.com";
export const WATER_REQUEST_ID = "00000000-0000-4000-8000-0000000000b1";
export const WATER_TITLE = "Su İçme Hatırlatıcısı";
export const WATER_DESCRIPTION = "Su içme hatırlatıcısı olsa çok güzel olur";
export const WATER_CREATED_AT = "2024-01-01T00:00:00.000Z";

export const WATER_PROFILE_PLACEHOLDER = {
  id: WATER_PROFILE_ID,
  email: WATER_PROFILE_EMAIL,
  full_name: "Mert Demir",
  avatar_url: null,
  created_at: WATER_CREATED_AT,
  height_cm: null,
  weight_kg: null,
  age: null,
  gender: null,
  target_weight_kg: null,
  daily_steps: null,
  show_public_profile: true,
  show_community_stats: true,
};

export const WATER_FEATURE_PLACEHOLDER = {
  id: WATER_REQUEST_ID,
  user_id: WATER_PROFILE_ID,
  title: WATER_TITLE,
  description: WATER_DESCRIPTION,
  like_count: 0,
  dislike_count: 0,
  is_implemented: true,
  implemented_version: APP_VERSION,
  implemented_at: WATER_CREATED_AT,
  created_at: WATER_CREATED_AT,
  updated_at: WATER_CREATED_AT,
  deleted_at: null,
  deleted_reason: null,
  profiles: WATER_PROFILE_PLACEHOLDER,
};

export function getWaterPlaceholderFeatureResponse() {
  return {
    id: WATER_REQUEST_ID,
    title: WATER_TITLE,
    description: WATER_DESCRIPTION,
    likeCount: 0,
    dislikeCount: 0,
    isLiked: false,
    isDisliked: false,
    isImplemented: true,
    implementedAt: WATER_CREATED_AT,
    implementedVersion: APP_VERSION,
    createdAt: WATER_CREATED_AT,
    deletedAt: null,
    deletedReason: null,
    user: {
      id: WATER_PROFILE_ID,
      name: "MERT DEMİR",
      avatar: null,
      joinedAt: WATER_CREATED_AT,
      showStats: true,
      showPublicProfile: true,
    },
  };
}

export function getWaterPlaceholderLeaderboardEntry() {
  return {
    userId: WATER_PROFILE_ID,
    name: "MERT DEMİR",
    avatar: null,
    implementedCount: 1,
    joinedAt: WATER_CREATED_AT,
    showStats: true,
    showPublicProfile: true,
  };
}

export async function ensureWaterSuggestionExists() {
  try {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", WATER_PROFILE_ID)
      .maybeSingle();

    if (!profile) {
      console.warn("[feature-requests] Water reminder profile missing; skipping seed.");
      return;
    }

    const { data: existing } = await supabaseAdmin
      .from("feature_requests")
      .select("id, deleted_at")
      .eq("id", WATER_REQUEST_ID)
      .maybeSingle();

    const target = existing as { id: string; deleted_at: string | null } | null;

    if (!target) {
      await (supabaseAdmin.from("feature_requests") as any).upsert(
        {
          id: WATER_REQUEST_ID,
          user_id: WATER_PROFILE_ID,
          title: WATER_TITLE,
          description: WATER_DESCRIPTION,
          like_count: 0,
          dislike_count: 0,
          is_implemented: true,
          implemented_version: APP_VERSION,
          implemented_at: new Date("2024-01-01").toISOString(),
          created_at: new Date("2024-01-01").toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
      return;
    }

    if (target.deleted_at) {
      await (supabaseAdmin.from("feature_requests") as any)
        .update({
          deleted_at: null,
          deleted_reason: null,
          is_implemented: true,
          implemented_version: APP_VERSION,
          implemented_at: new Date().toISOString(),
        })
        .eq("id", WATER_REQUEST_ID);
    }
  } catch (error) {
    console.warn("[feature-requests] Unable to ensure water reminder record:", error);
  }
}

