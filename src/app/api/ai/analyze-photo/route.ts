import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeMealPhoto, hasRoboflowConfig, hasGeminiKey } from "@/lib/ai/calorie-estimator";

const photoAnalysisSchema = z.object({
  imageBase64: z.string().optional(), // Base64 (opsiyonel)
  imageUrl: z.string().url().optional(), // Public URL (opsiyonel)
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]).optional().nullable(),
}).refine((data) => data.imageBase64 || data.imageUrl, {
  message: "imageBase64 veya imageUrl gerekli",
});

export async function POST(request: Request) {
  if (!hasRoboflowConfig && !hasGeminiKey) {
    return NextResponse.json({ 
      message: "ROBOFLOW_API_KEY veya GEMINI_API_KEY gerekli. En az birini tanımlayın." 
    }, { status: 503 });
  }

  try {
    const body = await request.json();
    const validated = photoAnalysisSchema.parse(body);

    const result = await analyzeMealPhoto({
      imageBase64: validated.imageBase64 ?? undefined,
      imageUrl: validated.imageUrl ?? undefined,
      mealType: validated.mealType ?? null,
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Geçersiz istek", errors: error.errors }, { status: 400 });
    }
    
    console.error("Photo analysis error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Fotoğraf analizi yapılamadı";
    const isQuotaError = errorMessage.includes("kota") || errorMessage.includes("quota") || errorMessage.includes("rate limit") || errorMessage.includes("rate limit");
    
    return NextResponse.json(
      { 
        message: errorMessage,
        isQuotaError,
      },
      { status: isQuotaError ? 429 : 500 }
    );
  }
}

