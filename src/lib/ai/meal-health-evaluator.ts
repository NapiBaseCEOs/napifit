import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY;

export type MealHealthEvaluation = {
  healthScore: number; // 0-100
  isHealthy: boolean;
  isMealAdequate: boolean; // Öğün için yeterli mi
  fatLevel: "low" | "medium" | "high";
  recommendation: "recommended" | "caution" | "not_recommended";
  messages: string[]; // Türkçe mesajlar
  explanation: string;
};

export type MealHealthInput = {
  foods: Array<{
    name: string;
    calories: number;
    quantity?: string | null;
  }>;
  totalCalories: number;
  mealType: "breakfast" | "lunch" | "dinner" | "snack" | null;
  targetWeight?: number | null; // Hedef kilo
  currentWeight?: number | null; // Mevcut kilo
};

function getGeminiClient() {
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }
  return new GoogleGenerativeAI(geminiApiKey);
}

function parseGeminiJSON(response: any): any {
  const text = response.response.text();
  if (!text) {
    throw new Error("AI yanıtı boş döndü");
  }
  
  let cleanedText = text.trim();
  
  // Markdown code block varsa çıkar
  if (cleanedText.includes("```json")) {
    cleanedText = cleanedText.split("```json")[1]?.split("```")[0]?.trim() || cleanedText;
  } else if (cleanedText.includes("```")) {
    cleanedText = cleanedText.split("```")[1]?.split("```")[0]?.trim() || cleanedText;
  }
  
  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("AI yanıtı geçerli JSON formatında değil");
  }
}

export async function evaluateMealHealth(input: MealHealthInput): Promise<MealHealthEvaluation> {
  if (!geminiApiKey) {
    // Fallback: Basit hesaplama
    return getBasicHealthEvaluation(input);
  }

  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

  const foodsList = input.foods.map((food) => {
    const quantity = food.quantity ? ` (${food.quantity})` : "";
    return `${food.name} - ${food.calories} kcal${quantity}`;
  }).join("\n");

  const weightInfo = input.targetWeight && input.currentWeight
    ? `\nHedef kilo: ${input.targetWeight} kg\nMevcut kilo: ${input.currentWeight} kg\nKilo farkı: ${input.targetWeight - input.currentWeight} kg`
    : "";

  const prompt = `Sen bir diyetisyen ve beslenme uzmanısın. Aşağıdaki öğünü değerlendir:

Öğün tipi: ${input.mealType || "belirtilmemiş"}
Toplam kalori: ${input.totalCalories} kcal${weightInfo}

Yiyecekler:
${foodsList}

Aşağıdaki kriterlere göre değerlendir:
1. Sağlıklılık: Besin değeri, vitamin, mineral, protein içeriği
2. Yağ seviyesi: Çok yağlı mı, dengeli mi
3. Öğün için yeterlilik: Bu öğün tipi için yeterli kalori ve besin değeri var mı
4. Kilo hedefine uygunluk: Hedef kiloya ulaşmak için uygun mu

Lütfen aşağıdaki JSON formatında cevap ver:
{
  "healthScore": 0-100 arası sağlık skoru,
  "isHealthy": true/false,
  "isMealAdequate": true/false (bu öğün tipi için yeterli mi),
  "fatLevel": "low" | "medium" | "high",
  "recommendation": "recommended" | "caution" | "not_recommended",
  "messages": ["Türkçe mesaj 1", "Türkçe mesaj 2"],
  "explanation": "Türkçe açıklama"
}

Mesajlar örnekleri:
- "Çok yağlı, tavsiye edilmez"
- "Sağlıklı ve dengeli, tavsiye edilir"
- "Bu öğün için yetersiz, daha fazla protein ekleyin"
- "Hedef kilonuza ulaşmak için uygun"

Sadece JSON döndür, başka metin ekleme.`;

  try {
    const result = await model.generateContent(prompt);
    const json = parseGeminiJSON(result);

    return {
      healthScore: Math.max(0, Math.min(100, Math.round(json.healthScore || 50))),
      isHealthy: json.isHealthy ?? true,
      isMealAdequate: json.isMealAdequate ?? true,
      fatLevel: json.fatLevel || "medium",
      recommendation: json.recommendation || "caution",
      messages: Array.isArray(json.messages) ? json.messages : [],
      explanation: json.explanation || "Değerlendirme yapıldı.",
    };
  } catch (error) {
    console.error("Meal health evaluation error:", error);
    // Fallback: Basit hesaplama
    return getBasicHealthEvaluation(input);
  }
}

function getBasicHealthEvaluation(input: MealHealthInput): MealHealthEvaluation {
  // Basit hesaplama: kalori bazlı
  const mealTypeCalorieRanges: Record<string, { min: number; max: number }> = {
    breakfast: { min: 300, max: 600 },
    lunch: { min: 400, max: 800 },
    dinner: { min: 400, max: 800 },
    snack: { min: 100, max: 300 },
  };

  const range = mealTypeCalorieRanges[input.mealType || "snack"] || { min: 200, max: 600 };
  const isAdequate = input.totalCalories >= range.min && input.totalCalories <= range.max;
  
  let healthScore = 50;
  if (isAdequate) healthScore = 70;
  if (input.totalCalories > range.max * 1.5) healthScore = 30;

  return {
    healthScore,
    isHealthy: healthScore >= 50,
    isMealAdequate: isAdequate,
    fatLevel: input.totalCalories > range.max ? "high" : "medium",
    recommendation: healthScore >= 70 ? "recommended" : healthScore >= 50 ? "caution" : "not_recommended",
    messages: isAdequate 
      ? ["Öğün yeterli görünüyor"]
      : ["Kalori miktarını kontrol edin"],
    explanation: isAdequate ? "Öğün kalori açısından yeterli." : "Kalori miktarı öğün tipi için uygun değil.",
  };
}

