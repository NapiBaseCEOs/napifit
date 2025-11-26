import { Router } from "express";
import { supabase, supabaseAdmin } from "../config/supabase";

const router = Router();

// GET /api/feature-requests/leaderboard - Get leaderboard
router.get("/", async (req, res, next) => {
  try {
    // Use admin client if available, otherwise use regular client
    const client = supabaseAdmin || supabase;

    const { data: implementedRequests, error: countError } = await client
      .from("feature_requests")
      .select("user_id, title")
      .eq("is_implemented", true)
      .is("deleted_at", null);

    if (countError) {
      throw countError;
    }

    const userCounts: Record<string, number> = {};
    const userTitleMap: Record<string, Set<string>> = {};

    implementedRequests?.forEach((req: { user_id: string; title: string }) => {
      const userId = req.user_id;
      const titleKey = req.title.trim().toLowerCase();

      if (!userTitleMap[userId]) {
        userTitleMap[userId] = new Set();
      }

      if (!userTitleMap[userId].has(titleKey)) {
        userTitleMap[userId].add(titleKey);
        userCounts[userId] = (userCounts[userId] || 0) + 1;
      }
    });

    const topUserIds = Object.entries(userCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([userId]) => userId);

    if (topUserIds.length === 0) {
      return res.json({ leaderboard: [] });
    }

    const { data: profiles, error: profilesError } = await client
      .from("profiles")
      .select("id, full_name, avatar_url, show_public_profile, show_community_stats, country_code, created_at")
      .in("id", topUserIds);

    if (profilesError) {
      throw profilesError;
    }

    type ProfileType = {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
      show_public_profile: boolean | null;
      show_community_stats: boolean | null;
      country_code: string | null;
      created_at: string;
    };

    const leaderboard = topUserIds
      .map((userId) => {
        const profile = (profiles as ProfileType[] | null)?.find((p) => p.id === userId);
        if (!profile) return null;

        return {
          userId: profile.id,
          name: profile.show_public_profile ? (profile.full_name || "Kullanıcı") : "Gizli Kullanıcı",
          avatar: profile.show_public_profile ? profile.avatar_url : null,
          implementedCount: userCounts[userId],
          joinedAt: profile.created_at,
          showStats: profile.show_community_stats ?? true,
          showPublicProfile: profile.show_public_profile ?? true,
          countryCode: profile.country_code,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.implementedCount - a.implementedCount);

    return res.json({ leaderboard });
  } catch (error) {
    next(error);
  }
});

export default router;

