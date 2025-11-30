import { createSupabaseRouteClient } from "@/lib/supabase/route";

export type UserContext = {
    profile: any;
    todayMeals: any[];
    todayWorkouts: any[];
    weeklyStats: {
        avgDailyCalories: number;
        totalMeals: number;
        weightTrend: number; // + or - kg change in last 30 days
    };
    recentSuggestions: any[];
};

export class UserContextBuilder {
    private supabase = createSupabaseRouteClient();

    async build(userId: string): Promise<UserContext> {
        const today = new Date().toISOString().split("T")[0];
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);

        // Parallel data fetching for performance
        const [profileRes, mealsRes, workoutsRes, weeklyMealsRes, suggestionsRes, weightRes] = await Promise.all([
            this.supabase.from("profiles").select("*").eq("id", userId).single(),
            this.supabase.from("meals").select("*").eq("user_id", userId).gte("created_at", `${today}T00:00:00`).order("created_at", { ascending: false }),
            this.supabase.from("workouts").select("*").eq("user_id", userId).gte("created_at", `${today}T00:00:00`).order("created_at", { ascending: false }),
            this.supabase.from("meals").select("calories").eq("user_id", userId).gte("created_at", weekAgo.toISOString()),
            this.supabase.from("coach_suggestions").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
            this.supabase.from("health_metrics").select("weight, created_at").eq("user_id", userId).gte("created_at", monthAgo.toISOString()).order("created_at", { ascending: true })
        ]);

        // Calculate stats
        const weeklyCalories = weeklyMealsRes.data?.reduce((sum, m) => sum + (m.calories || 0), 0) || 0;
        const avgDailyCalories = Math.round(weeklyCalories / 7);

        // Calculate weight trend
        let weightTrend = 0;
        if (weightRes.data && weightRes.data.length >= 2) {
            const first = weightRes.data[0].weight;
            const last = weightRes.data[weightRes.data.length - 1].weight;
            weightTrend = Number((last - first).toFixed(1));
        }

        return {
            profile: profileRes.data || {},
            todayMeals: mealsRes.data || [],
            todayWorkouts: workoutsRes.data || [],
            weeklyStats: {
                avgDailyCalories,
                totalMeals: weeklyMealsRes.data?.length || 0,
                weightTrend,
            },
            recentSuggestions: suggestionsRes.data || [],
        };
    }
}

export const contextBuilder = new UserContextBuilder();
