import { geminiClient } from "@/lib/ai/core/client";
import { UserContext } from "@/lib/ai/core/context";
import { planService } from "./plan-service";
import { suggestionService } from "./suggestion-service";

export type ChatResponse = {
    reply: string;
    suggestedButtons: Array<{ label: string; action: string }>;
    autoLogs: Array<any>;
    weeklyPlan?: any; // If a plan was generated
};

export class ChatService {
    async processMessage(
        userId: string,
        message: string,
        history: any[],
        context: UserContext,
        locale: string = "tr"
    ): Promise<ChatResponse> {

        // 1. Check intent for special actions
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes("plan") && (lowerMsg.includes("hazırla") || lowerMsg.includes("oluştur") || lowerMsg.includes("yap"))) {
            const plan = await planService.generateWeeklyPlan(userId, context);
            return {
                reply: "Harika! Senin için hedeflerine uygun yeni bir haftalık plan hazırladım. Aşağıdan inceleyebilirsin.",
                suggestedButtons: [],
                autoLogs: [],
                weeklyPlan: plan
            };
        }

        // 2. Standard Chat with Gemini
        const systemPrompt = `
    You are NapiFit's AI Coach. You are motivating, friendly, and professional.
    Language: ${locale === "tr" ? "Turkish" : "English"} (Must respond in this language).
    
    User Context:
    ${JSON.stringify(context)}
    
    History:
    ${JSON.stringify(history.slice(-5))}
    
    Task: Respond to the user's message: "${message}"
    
    Output JSON Schema:
    {
      "reply": "Your response text (max 3 sentences)",
      "suggestedButtons": [
        { "label": "Button Label", "action": "log_meal" | "log_workout" | "log_water" | "view_plan" }
      ],
      "autoLogs": [] (Only if user explicitly states they did something, e.g. 'I drank water')
    }
    `;

        try {
            const response = await geminiClient.generateJSON<ChatResponse>(systemPrompt);

            // Post-process buttons to ensure valid actions
            const validActions = ["log_meal", "log_workout", "log_water", "view_plan"];
            response.suggestedButtons = response.suggestedButtons.filter(b => validActions.includes(b.action));

            return response;
        } catch (error) {
            console.error("Chat Service Error:", error);
            return {
                reply: "Üzgünüm, şu anda bağlantıda bir sorun var. Lütfen tekrar dene.",
                suggestedButtons: [],
                autoLogs: []
            };
        }
    }
}

export const chatService = new ChatService();
