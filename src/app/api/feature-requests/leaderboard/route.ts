import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ensureWaterSuggestionExists, getWaterPlaceholderLeaderboardEntry } from "@/lib/community/water-reminder";

export const dynamic = "force-dynamic";

// Yılın adamı - en çok önerisi uygulanan kullanıcılar
export async function GET() {
  try {
    await ensureWaterSuggestionExists();
    // Uygulanan önerileri say (title ve user_id ile birlikte)
    const { data: implementedRequests, error: countError } = await supabaseAdmin
      .from("feature_requests")
      .select("user_id, title")
      .eq("is_implemented", true)
      .is("deleted_at", null);

    if (countError) {
      console.error("Leaderboard fetch error:", countError);
      return NextResponse.json({ leaderboard: [] });
    }

    // Kullanıcı başına say - duplicate önerileri filtrele (aynı başlığa sahip önerileri tek say)
    const userCounts: Record<string, number> = {};
    const userTitleMap: Record<string, Set<string>> = {}; // Her kullanıcı için unique title'ları tut
    
    implementedRequests?.forEach((req: { user_id: string; title: string }) => {
      const userId = req.user_id;
      const titleKey = req.title.trim().toLowerCase();
      
      // Kullanıcı için title map'i oluştur
      if (!userTitleMap[userId]) {
        userTitleMap[userId] = new Set();
      }
      
      // Eğer bu title daha önce eklenmemişse say
      if (!userTitleMap[userId].has(titleKey)) {
        userTitleMap[userId].add(titleKey);
        userCounts[userId] = (userCounts[userId] || 0) + 1;
      }
    });

    // En çok önerisi uygulanan kullanıcıları al
    const topUserIds = Object.entries(userCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([userId]) => userId);

    if (topUserIds.length === 0) {
      return NextResponse.json({ leaderboard: [] });
    }

    // Kullanıcı bilgilerini al
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, avatar_url, show_public_profile, show_community_stats, country_code, created_at")
      .in("id", topUserIds);

    if (profilesError) {
      console.error("Profiles fetch error:", profilesError);
      return NextResponse.json({ leaderboard: [] });
    }

    // Leaderboard oluştur
    type ProfileType = {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
      show_public_profile: boolean | null;
      show_community_stats: boolean | null;
      country_code: string | null;
      created_at: string;
    };
    
    let leaderboard = topUserIds
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

    if (leaderboard.length === 0) {
      leaderboard = [getWaterPlaceholderLeaderboardEntry()];
    }

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json({ leaderboard: [] });
  }
}

