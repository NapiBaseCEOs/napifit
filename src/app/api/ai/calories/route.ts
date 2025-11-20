import { NextResponse } from "next/server";
import { z } from "zod";
import { estimateMealCalories, estimateWorkoutCalories, hasGeminiKey, hasOpenAIKey } from "@/lib/ai/calorie-estimator";

const workoutSchema = z.object({
  mode: z.literal("workout"),
  workout: z.object({
    name: z.string().min(2),
    type: z.string().optional().nullable(),
    duration: z.number().min(1).max(1440).optional().nullable(),
    distance: z.number().min(0).max(1000).optional().nullable(),
    intensity: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  }),
});

const mealSchema = z.object({
  mode: z.literal("meal"),
  meal: z.object({
    mealType: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    foods: z
      .array(
        z.object({
          index: z.number().int().nonnegative(),
          name: z.string().min(1),
          quantity: z.string().optional().nullable(),
        })
      )
      .min(1),
  }),
});

const requestSchema = z.discriminatedUnion("mode", [workoutSchema, mealSchema]);

export async function POST(request: Request) {
  if (!hasGeminiKey && !hasOpenAIKey) {
    return NextResponse.json({ 
      message: "GEMINI_API_KEY veya OPENAI_API_KEY tanımlı değil. En az birini tanımlayın." 
    }, { status: 503 });
  }

  try {
    const body = await request.json();
    const parsed = requestSchema.parse(body);

    if (parsed.mode === "workout") {
      const workoutPayload = {
        name: parsed.workout.name,
        type: parsed.workout.type ?? undefined,
        duration: parsed.workout.duration ?? null,
        distance: parsed.workout.distance ?? null,
        intensity: parsed.workout.intensity ?? null,
        notes: parsed.workout.notes ?? null,
      };
      const result = await estimateWorkoutCalories(workoutPayload);
      return NextResponse.json({ mode: "workout", result });
    }

    const mealResult = await estimateMealCalories({
      mealType: parsed.meal.mealType ?? null,
      notes: parsed.meal.notes ?? null,
      foods: parsed.meal.foods,
    });
    return NextResponse.json({ mode: "meal", result: mealResult });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Geçersiz istek", errors: error.errors }, { status: 400 });
    }
    console.error("AI calorie route error:", error);
    return NextResponse.json({ message: "Kalori tahmini yapılamadı" }, { status: 500 });
  }
}

