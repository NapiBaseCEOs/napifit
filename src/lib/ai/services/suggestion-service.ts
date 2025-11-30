import { geminiClient } from "@/lib/ai/core/client";
import { UserContext } from "@/lib/ai/core/context";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export type Suggestion = {
    type: "water" | "calorie" | "workout" | "general";
    message: string;
    actionLink?: string;
};

export class SuggestionService {
    private supabase = createSupabaseRouteClient();

    async generateDailySuggestions(userId: string, context: UserContext): Promise<Suggestion[]> {
        // Check if we already have fresh suggestions today
        const today = new Date().toISOString().split("T")[0];
        const { data: existing } = await this.supabase
            .from("coach_suggestions")
            .select("*")
            .eq("user_id", userId)
            .gte("created_at", `${today}T00:00:00`);

        if (existing && existing.length > 0) {
            return []; // Already generated for today
        }

        const prompt = `
    Analyze this user's recent data and provide 1-2 proactive, short, punchy health tips (in Turkish).
    
    Context: ${JSON.stringify(context)}
    
    Return JSON:
    [
      {
        "type": "water" | "calorie" | "workout" | "general",
        "message": "Tip text",
        "actionLink": "/health" (optional)
      }
    ]
    `;

        const suggestions = await geminiClient.generateJSON<Suggestion[]>(prompt);

        // Save to DB
        if (suggestions.length > 0) {
            await this.supabase.from("coach_suggestions").insert(
                suggestions.map(s => ({
                    user_id: userId,
                    type: s.type,
                    message: s.message,
                    action_link: s.actionLink,
                    is_read: false
                }))
            );
        }

        return suggestions;
    }

    async getUnreadSuggestions(userId: string) {
        const { data } = await this.supabase
            .from("coach_suggestions")
            .select("*")
            .eq("user_id", userId)
            .eq("is_read", false)
            .order("created_at", { ascending: false });

        return data || [];
    }

    async markAsRead(ids: string[]) {
        await this.supabase
            .from("coach_suggestions")
            .update({ is_read: true })
            .in("id", ids);
    }
}

export const suggestionService = new SuggestionService();
