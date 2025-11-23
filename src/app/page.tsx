import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseClientEnv } from "@/lib/supabase/config";
import HomePageClient from "@/components/homepage/HomePageClient";

type LandingStats = {
  members: number;
  workouts: number;
  meals: number;
  avgDailySteps: number;
  streaks: number;
};

const fallbackStats: LandingStats = {
  members: 1280,
  workouts: 9421,
  meals: 18654,
  avgDailySteps: 9340,
  streaks: 214,
};


async function getLandingStats(): Promise<LandingStats> {
  try {
    const [membersResponse, workoutsResponse, mealsResponse, avgStepsResponse] = await Promise.all([
      supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("workouts").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("meals").select("id", { count: "exact", head: true }),
      supabaseAdmin.rpc("avg_daily_steps"),
    ]);

    const members = membersResponse.count ?? fallbackStats.members;
    const workouts = workoutsResponse.count ?? fallbackStats.workouts;
    const meals = mealsResponse.count ?? fallbackStats.meals;
    const avgDailySteps = Math.round((avgStepsResponse.data as number | null) ?? 8200);
    const streaks = Math.max(50, Math.round(workouts * 0.12));

    return {
      members: Math.max(members, 120),
      workouts,
      meals,
      avgDailySteps,
      streaks,
    };
  } catch (error) {
    console.warn("Landing stats fallback:", error);
    return fallbackStats;
  }
}

// Build sırasında database'e erişmeyi önlemek için dynamic export
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  // Eğer kullanıcı giriş yapmışsa dashboard'a yönlendir
  if (hasSupabaseClientEnv) {
    try {
      const supabase = createSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Kullanıcı profilini kontrol et
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", user.id)
          .maybeSingle();

        if (profile && !profileError) {
          if (profile.onboarding_completed) {
            // Onboarding tamamlanmışsa dashboard'a yönlendir
            redirect("/dashboard");
          } else {
            // Onboarding tamamlanmamışsa onboarding'e yönlendir
            redirect("/onboarding");
          }
        }
      }
    } catch (error) {
      // Hata durumunda ana sayfayı göster (non-critical)
      console.warn("Ana sayfa session kontrolü hatası:", error);
    }
  }

  const stats = await getLandingStats();

  return <HomePageClient initialStats={stats} />;
}

