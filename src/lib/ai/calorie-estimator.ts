import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

export const hasGeminiKey = Boolean(geminiApiKey);
export const hasOpenAIKey = Boolean(openaiApiKey);

let geminiClient: GoogleGenerativeAI | null = null;

function getGeminiClient() {
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(geminiApiKey);
  }
  return geminiClient;
}

export type WorkoutEstimateInput = {
  name: string;
  type?: string;
  duration?: number | null;
  distance?: number | null;
  intensity?: string | null;
  notes?: string | null;
};

export type WorkoutEstimateResult = {
  calories: number;
  explanation: string;
  confidence: "low" | "medium" | "high";
  references?: string[];
};

export type MealEstimateInput = {
  foods: Array<{
    index: number;
    name: string;
    quantity?: string | null;
  }>;
  mealType?: string | null;
  notes?: string | null;
};

export type MealEstimateResult = {
  totalCalories: number;
  breakdown: Array<{
    index: number;
    name: string;
    calories: number;
    quantity?: string | null;
    notes?: string;
  }>;
  explanation: string;
};

function parseGeminiJSON(response: any): any {
  const text = response.response.text();
  if (!text) {
    throw new Error("AI yanıtı boş döndü");
  }
  
  // JSON'u temizle ve parse et
  let cleanedText = text.trim();
  
  // Eğer markdown code block içindeyse çıkar
  if (cleanedText.includes("```json")) {
    cleanedText = cleanedText.split("```json")[1]?.split("```")[0]?.trim() || cleanedText;
  } else if (cleanedText.includes("```")) {
    cleanedText = cleanedText.split("```")[1]?.split("```")[0]?.trim() || cleanedText;
  }
  
  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    // JSON parse hatası varsa, sadece ilk JSON objesini bul
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("AI yanıtı geçerli JSON formatında değil");
  }
}

export async function estimateWorkoutCalories(input: WorkoutEstimateInput): Promise<WorkoutEstimateResult> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Sen Türkçe konuşan bir egzersiz fizyoloğusun. MET değerleri, süre, tempo ve varsa mesafeyi kullanarak yakılan kalori miktarını tahmin et. Veriler eksikse yetişkin için 70 kg varsay.

Egzersiz bilgileri:
${JSON.stringify(input, null, 2)}

Lütfen aşağıdaki JSON formatında cevap ver:
{
  "calories": sayı,
  "explanation": "Türkçe açıklama",
  "confidence": "low" | "medium" | "high",
  "references": ["referans1", "referans2"]
}

Sadece JSON döndür, başka metin ekleme.`;

  try {
    const result = await model.generateContent(prompt);
    const json = parseGeminiJSON(result);
    
    return {
      calories: Math.max(0, Math.round(json.calories || 0)),
      explanation: json.explanation || "Kalori tahmini yapıldı.",
      confidence: json.confidence || "medium",
      references: json.references || [],
    };
  } catch (error) {
    console.error("Gemini workout estimation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
    if (errorMessage.includes("404") || errorMessage.includes("model")) {
      throw new Error("AI model bulunamadı. Lütfen yöneticiye bildirin.");
    }
    if (errorMessage.includes("API_KEY") || errorMessage.includes("403")) {
      throw new Error("API anahtarı geçersiz. Lütfen yöneticiye bildirin.");
    }
    throw new Error(`Egzersiz kalori tahmini yapılamadı: ${errorMessage}`);
  }
}

export async function estimateMealCalories(input: MealEstimateInput): Promise<MealEstimateResult> {
  // Fallback: If Gemini is not available, use OpenAI if available
  if (!hasGeminiKey && hasOpenAIKey) {
    // TODO: Implement OpenAI fallback
    throw new Error("Gemini API key eksik. OpenAI fallback henüz implement edilmedi.");
  }
  
  const client = getGeminiClient();
  // Try gemini-1.5-pro first, then fallback to gemini-pro
  let model;
  try {
    model = client.getGenerativeModel({ model: "gemini-1.5-pro" });
  } catch {
    model = client.getGenerativeModel({ model: "gemini-pro" });
  }

  // Miktar örnekleri: 1-2 tabak, 2 kaşık, 1 kaşık, 1 kepçe, 1 porsiyon, 200g, vb.
  const foodsList = input.foods.map((food) => {
    const quantity = food.quantity ? ` (${food.quantity})` : "";
    return `${food.index + 1}. ${food.name}${quantity}`;
  }).join("\n");

  const prompt = `Sen bir diyetisyensin. Aşağıdaki yiyecek listesindeki her öğenin kalorisini hesapla.

Öğün tipi: ${input.mealType || "belirtilmemiş"}
Notlar: ${input.notes || "yok"}

Yiyecekler:
${foodsList}

Önemli notlar:
- Miktar bilgisi verilmişse (ör: 1-2 tabak, 2 kaşık, 1 kaşık, 1 kepçe, 200g, 1 porsiyon) bunu dikkate al
- Miktar belirtilmemişse standart porsiyon kabul et
- Her yiyecek için kaloriyi gerçekçi hesapla

Lütfen aşağıdaki JSON formatında cevap ver:
{
  "totalCalories": toplam_kalori_sayısı,
  "breakdown": [
    {
      "index": 0,
      "name": "yiyecek adı",
      "calories": kalori_sayısı,
      "quantity": "miktar (varsa)",
      "notes": "açıklama (opsiyonel)"
    }
  ],
  "explanation": "Türkçe açıklama"
}

Sadece JSON döndür, başka metin ekleme. Tüm kalori değerleri gerçekçi olmalı.`;

  try {
    const result = await model.generateContent(prompt);
    const json = parseGeminiJSON(result);

    const breakdown = Array.isArray(json.breakdown)
      ? json.breakdown.map((item: any) => ({
          index: item.index ?? 0,
          name: item.name || "",
          calories: Math.max(0, Math.round(item.calories || 0)),
          quantity: item.quantity ?? null,
          notes: item.notes ?? undefined,
        }))
      : input.foods.map((food, idx) => ({
          index: idx,
          name: food.name,
          calories: 0,
          quantity: food.quantity ?? null,
          notes: undefined,
        }));

    const calculatedTotal = breakdown.reduce((sum: number, item: any) => sum + item.calories, 0);
    
    return {
      totalCalories: Math.max(0, Math.round(json.totalCalories || calculatedTotal)),
      breakdown,
      explanation: json.explanation || "Kalori tahmini yapıldı.",
    };
  } catch (error) {
    console.error("Gemini meal estimation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
    if (errorMessage.includes("404") || errorMessage.includes("model")) {
      throw new Error("AI model bulunamadı. Lütfen yöneticiye bildirin.");
    }
    if (errorMessage.includes("API_KEY") || errorMessage.includes("403")) {
      throw new Error("API anahtarı geçersiz. Lütfen yöneticiye bildirin.");
    }
    throw new Error(`Öğün kalori tahmini yapılamadı: ${errorMessage}`);
  }
}

// Photo analysis functions (stub implementations for now)
export const hasRoboflowConfig = Boolean(process.env.ROBOFLOW_API_KEY && process.env.ROBOFLOW_MODEL_ID);

export type PhotoAnalysisInput = {
  imageBase64?: string;
  imageUrl?: string;
  mealType?: string | null;
};

export type PhotoAnalysisResult = {
  foods: Array<{
    name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  }>;
  totalCalories: number;
  explanation: string;
};

export async function analyzeMealPhoto(_input: PhotoAnalysisInput): Promise<PhotoAnalysisResult> {
  // TODO: Implement photo analysis with Roboflow or Gemini
  // For now, return a placeholder response
  throw new Error("Fotoğraf analizi henüz implement edilmedi. ROBOFLOW_API_KEY veya GEMINI_API_KEY tanımlayın.");
}

