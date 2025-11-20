import { NextResponse } from "next/server";
import { z } from "zod";
import { getFoodPreparationMethods, getWorkoutPreparationMethods, hasGeminiKey } from "@/lib/ai/calorie-estimator";

const requestSchema = z.object({
  type: z.enum(["food", "workout"]),
  name: z.string().min(2),
});

export async function POST(request: Request) {
  if (!hasGeminiKey) {
    return NextResponse.json({ 
      message: "GEMINI_API_KEY tanımlı değil." 
    }, { status: 503 });
  }

  try {
    const body = await request.json();
    const parsed = requestSchema.parse(body);

    if (parsed.type === "food") {
      const methods = await getFoodPreparationMethods(parsed.name);
      return NextResponse.json({ type: "food", methods });
    }

    const methods = await getWorkoutPreparationMethods(parsed.name);
    return NextResponse.json({ type: "workout", methods });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Geçersiz istek", errors: error.errors }, { status: 400 });
    }
    
    console.error("Preparation methods route error:", error);
    return NextResponse.json({ 
      message: "Yapılış yöntemleri alınamadı",
      error: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : "Bilinmeyen hata") : undefined
    }, { status: 500 });
  }
}
