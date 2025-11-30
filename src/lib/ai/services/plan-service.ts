import { geminiClient } from "@/lib/ai/core/client";
import { UserContext } from "@/lib/ai/core/context";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export type WeeklyPlan = {
    startDate: string;
    endDate: string;
    days: Array<{
        day: string; // "Monday", "Tuesday"...
        meals: Array<{ type: string; suggestion: string; calories: number }>;
        workout: { activity: string; duration: string; calories: number };
    }>;
    summary: string;
};

export class PlanService {
    private supabase = createSupabaseRouteClient();

    async generateWeeklyPlan(userId: string, context: UserContext): Promise<WeeklyPlan> {
        const prompt = `
    Act as a professional fitness coach. Create a 7-day meal and workout plan for this user:
    
    Profile: ${JSON.stringify(context.profile)}
    Goal: ${context.profile.target_weight ? `Reach ${context.profile.target_weight}kg` : "Maintain healthy lifestyle"}
    Current Stats: Avg ${context.weeklyStats.avgDailyCalories} kcal/day intake.
    
    Requirements:
    - 7 days (Monday to Sunday)
    - 3 main meals + 1 snack per day
    - 1 workout per day (include rest days)
    - Calorie targets should align with the goal.
    
    Return ONLY valid JSON:
    {
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "summary": "Brief motivational summary of the plan (in Turkish)",
      "days": [
        {
          "day": "Pazartesi",
          "meals": [
            { "type": "breakfast", "suggestion": "Food item", "calories": 500 },
            ...
          ],
          "workout": { "activity": "Run", "duration": "30 min", "calories": 300 }
        }
      ]
    }
    `;

        const plan = await geminiClient.generateJSON<WeeklyPlan>(prompt);

        // Save to DB
        await this.supabase.from("weekly_plans").insert({
            user_id: userId,
            start_date: plan.startDate,
            end_date: plan.endDate,
            plan_data: plan,
        });

        return plan;
    }

    async getActivePlan(userId: string) {
        const today = new Date().toISOString().split("T")[0];
        const { data } = await this.supabase
            .from("weekly_plans")
            .select("*")
            .eq("user_id", userId)
            .lte("start_date", today)
            .gte("end_date", today)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        return data?.plan_data as WeeklyPlan | null;
    }
}

export const planService = new PlanService();
