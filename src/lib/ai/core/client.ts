import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set. AI features will be disabled.");
}

export class GeminiClient {
    private client: GoogleGenerativeAI;
    private modelName: string = "gemini-2.5-flash";

    constructor() {
        if (!GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is missing");
        }
        this.client = new GoogleGenerativeAI(GEMINI_API_KEY);
    }

    private getModel() {
        return this.client.getGenerativeModel({ model: this.modelName });
    }

    async generateJSON<T>(prompt: string): Promise<T> {
        try {
            const model = this.getModel();
            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.7,
                },
            });

            const text = result.response.text();
            if (!text) throw new Error("Empty response from AI");

            return JSON.parse(text) as T;
        } catch (error: any) {
            console.error("Gemini Generation Error:", error);
            throw this.handleError(error);
        }
    }

    async generateText(prompt: string): Promise<string> {
        try {
            const model = this.getModel();
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            return text || "";
        } catch (error: any) {
            console.error("Gemini Text Generation Error:", error);
            throw this.handleError(error);
        }
    }

    private handleError(error: any): Error {
        const msg = error.message || String(error);

        if (msg.includes("API_KEY") || msg.includes("403")) {
            return new Error("AI API Key invalid or expired. Please check settings.");
        }
        if (msg.includes("quota") || msg.includes("429")) {
            return new Error("AI Rate limit exceeded. Please try again later.");
        }
        if (msg.includes("REFERRER")) {
            return new Error("API Key blocked by referrer policy. Check Google AI Studio settings.");
        }

        return new Error("AI Service unavailable. Please try again.");
    }
}

export const geminiClient = new GeminiClient();
