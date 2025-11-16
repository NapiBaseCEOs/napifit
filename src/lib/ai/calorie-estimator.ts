import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

export const hasOpenAIKey = Boolean(apiKey);

let client: OpenAI | null = null;

function getClient() {
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }
  if (!client) {
    client = new OpenAI({
      apiKey,
    });
  }
  return client;
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

function parseResponseJSON(response: any) {
  const textOutput = response.output_text?.[0];
  if (!textOutput) {
    throw new Error("AI yanıtı boş döndü");
  }
  return JSON.parse(textOutput);
}

export async function estimateWorkoutCalories(input: WorkoutEstimateInput): Promise<WorkoutEstimateResult> {
  const openai = getClient();
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content:
          "Sen Türkçe konuşan bir egzersiz fizyoloğusun. MET değerleri, süre, tempo ve varsa mesafeyi kullanarak yakılan kalori miktarını tahmin edersin. Veriler eksikse yetişkin için 70 kg varsay. Sonuçları sadece JSON olarak döndür.",
      },
      {
        role: "user",
        content: `Egzersiz JSON verisi: ${JSON.stringify(input)}`,
      },
    ],
  });

  const json = parseResponseJSON(response);
  return {
    calories: Math.max(0, Math.round(json.calories)),
    explanation: json.explanation,
    confidence: json.confidence,
    references: json.references ?? [],
  };
}

export async function estimateMealCalories(input: MealEstimateInput): Promise<MealEstimateResult> {
  const openai = getClient();
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content:
          "Sen bir diyetisyensin. Gönderilen yiyecek listesindeki isim ve porsiyon bilgisinden faydalanarak her öğenin kalorisini ve toplamı tahmin et. Kısa ve Türkçe açıkla. Sadece JSON döndür.",
      },
      {
        role: "user",
        content: `Öğün JSON verisi: ${JSON.stringify(input)}`,
      },
    ],
  });

  const json = parseResponseJSON(response);

  const breakdown = Array.isArray(json.breakdown)
    ? json.breakdown.map((item: any) => ({
        index: item.index,
        name: item.name,
        calories: Math.max(0, Math.round(item.calories)),
        quantity: item.quantity ?? null,
        notes: item.notes ?? undefined,
      }))
    : [];

  return {
    totalCalories: Math.max(0, Math.round(json.totalCalories)),
    breakdown,
    explanation: json.explanation,
  };
}

