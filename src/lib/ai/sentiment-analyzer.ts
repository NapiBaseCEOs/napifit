import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface SentimentAnalysisResult {
  score: number; // 0-1 arası, 1 = çok övgü dolu, 0 = çok olumsuz
  reasoning: string;
}

export async function analyzeReviewSentiment(comment: string, rating: number): Promise<SentimentAnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Analyze the sentiment of the following user review and provide a sentiment score from 0 to 1, where:
- 1.0 = Extremely positive, highly praising, very enthusiastic
- 0.8-0.9 = Very positive, praising, enthusiastic
- 0.6-0.7 = Positive, mostly favorable
- 0.4-0.5 = Neutral, mixed feelings
- 0.2-0.3 = Negative, mostly unfavorable
- 0.0-0.1 = Extremely negative, very critical

The user gave a rating of ${rating} out of 5 stars.

Review text: "${comment}"

Respond ONLY with a valid JSON object in this exact format (no markdown, no explanations, just the JSON):
{
  "score": 0.85,
  "reasoning": "Brief explanation of why this score was given"
}

The score should reflect how praising and positive the review is. Higher scores mean more praise and positive sentiment.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // JSON'ı parse et
    let jsonStr = response.trim();
    // Markdown code blocks'u temizle
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.split("```")[1];
      if (jsonStr.startsWith("json")) {
        jsonStr = jsonStr.substring(4);
      }
      jsonStr = jsonStr.trim();
    }
    if (jsonStr.endsWith("```")) {
      jsonStr = jsonStr.split("```")[0].trim();
    }

    const parsed = JSON.parse(jsonStr) as SentimentAnalysisResult;
    
    // Score'u 0-1 aralığına sınırla
    parsed.score = Math.max(0, Math.min(1, parsed.score || 0.5));
    
    return parsed;
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    // Hata durumunda rating'e göre bir score döndür
    const fallbackScore = rating / 5; // 5 yıldız = 1.0, 1 yıldız = 0.2
    return {
      score: Math.max(0.2, fallbackScore),
      reasoning: "Automatic fallback based on rating",
    };
  }
}

