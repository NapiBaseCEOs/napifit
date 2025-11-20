import { NextResponse } from "next/server";
import { z } from "zod";
import { estimateMealCalories, estimateWorkoutCalories, hasGeminiKey, hasOpenAIKey } from "@/lib/ai/calorie-estimator";
import { findLearnedFoodCalories, findLearnedWorkoutCalories, saveLearnedFoodCalories, saveLearnedWorkoutCalories } from "@/lib/db/learned-calories";

const workoutSchema = z.object({
  mode: z.literal("workout"),
  workout: z.object({
    name: z.string().min(2),
    type: z.string().optional().nullable(),
    duration: z.number().min(1).max(1440).optional().nullable(),
    distance: z.number().min(0).max(1000).optional().nullable(),
    sets: z.number().min(1).max(100).optional().nullable(),
    reps: z.number().min(1).max(1000).optional().nullable(),
    intensity: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  }),
  userProfile: z.object({
    height: z.number().min(50).max(260).nullable().optional(),
    weight: z.number().min(20).max(300).nullable().optional(),
    age: z.number().min(13).max(120).nullable().optional(),
    gender: z.string().nullable().optional(),
  }).optional(),
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
  userProfile: z.object({
    height: z.number().min(50).max(260).nullable().optional(),
    weight: z.number().min(20).max(300).nullable().optional(),
    age: z.number().min(13).max(120).nullable().optional(),
    gender: z.string().nullable().optional(),
  }).optional(),
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
      // Önce veritabanından kontrol et
      const workoutName = parsed.workout.name;
      const preparationMethod = parsed.workout.intensity || null;
      const duration = parsed.workout.duration ?? null;
      const type = parsed.workout.type ?? null;

      // Yiyecek adından preparation_method'u çıkar (varsa)
      const nameMatch = workoutName.match(/^(.+?)\s*\((.+?)\)$/);
      const cleanWorkoutName = nameMatch ? nameMatch[1].trim() : workoutName;
      const extractedPreparationMethod = nameMatch ? nameMatch[2].trim() : preparationMethod;

      const learnedData = await findLearnedWorkoutCalories(
        cleanWorkoutName,
        extractedPreparationMethod,
        duration,
        type
      );

      if (learnedData) {
        // Veritabanından bulundu, AI'a gitme
        return NextResponse.json({
          mode: "workout",
          result: {
            calories: learnedData.calories,
            explanation: "Önceden öğrenilmiş kalori değeri (veritabanından)",
            confidence: "high" as const,
          },
          fromCache: true,
        });
      }

      // Veritabanında yok, AI'dan hesapla
      const workoutPayload = {
        name: cleanWorkoutName,
        type: parsed.workout.type ?? undefined,
        duration: parsed.workout.duration ?? null,
        distance: parsed.workout.distance ?? null,
        sets: parsed.workout.sets ?? null,
        reps: parsed.workout.reps ?? null,
        intensity: extractedPreparationMethod ?? null,
        notes: parsed.workout.notes ?? null,
        userProfile: parsed.userProfile ?? undefined,
      };
      const result = await estimateWorkoutCalories(workoutPayload);

      // AI sonucunu veritabanına kaydet (async, hata olsa bile devam et)
      saveLearnedWorkoutCalories(
        cleanWorkoutName,
        result.calories,
        extractedPreparationMethod,
        duration,
        type
      ).catch(err => console.error("Error saving learned workout calories:", err));

      return NextResponse.json({ mode: "workout", result, fromCache: false });
    }

    // Yiyecekler için önce veritabanından kontrol et (her biri için)
    const foods = parsed.meal.foods;
    const learnedCaloriesMap: Map<number, { caloriesPer100g: number; caloriesPerGram: number }> = new Map();
    const foodsToEstimate: Array<{ index: number; name: string; quantity?: string | null }> = [];
    const originalIndexMap: Map<number, number> = new Map(); // AI index -> Original index mapping

    for (const food of foods) {
      // Yiyecek adından preparation_method'u çıkar (varsa)
      const nameMatch = food.name.match(/^(.+?)\s*\((.+?)\)$/);
      const cleanFoodName = nameMatch ? nameMatch[1].trim() : food.name;
      const extractedPreparationMethod = nameMatch ? nameMatch[2].trim() : null;

      // Veritabanından kontrol et (100g için)
      const learnedData = await findLearnedFoodCalories(
        cleanFoodName,
        extractedPreparationMethod,
        "100g"
      );

      if (learnedData) {
        // Veritabanından bulundu
        learnedCaloriesMap.set(food.index, {
          caloriesPer100g: learnedData.caloriesPer100g,
          caloriesPerGram: learnedData.caloriesPerGram,
        });
      } else {
        // Veritabanında yok, AI'dan hesaplanacak
        // Index'i 0'dan başlat (AI için), ama orijinal index'i sakla
        const aiIndex = foodsToEstimate.length;
        originalIndexMap.set(aiIndex, food.index);
        foodsToEstimate.push({
          index: aiIndex,
          name: extractedPreparationMethod 
            ? `${cleanFoodName} (${extractedPreparationMethod})`
            : cleanFoodName,
          quantity: food.quantity || "100g",
        });
      }
    }

    let mealResult;

    if (foodsToEstimate.length > 0) {
      // Bazı yiyecekler için AI'dan hesapla
      const aiResult = await estimateMealCalories({
      mealType: parsed.meal.mealType ?? null,
      notes: parsed.meal.notes ?? null,
        foods: foodsToEstimate,
        userProfile: parsed.userProfile ?? undefined,
      });

      // AI sonuçlarını veritabanına kaydet ve learnedCaloriesMap'e ekle
      // Orijinal foods array'indeki index'leri korumak için mapping
      for (const aiFood of foodsToEstimate) {
        const originalIndex = originalIndexMap.get(aiFood.index);
        if (originalIndex === undefined) continue;

        const breakdown = aiResult.breakdown.find(b => b.index === aiFood.index);
        
        if (breakdown && breakdown.calories > 0) {
          const nameMatch = aiFood.name.match(/^(.+?)\s*\((.+?)\)$/);
          const cleanFoodName = nameMatch ? nameMatch[1].trim() : aiFood.name;
          const extractedPreparationMethod = nameMatch ? nameMatch[2].trim() : null;
          
          // 100g için kalori hesapla
          // Eğer quantity varsa ve "100g" ise direkt kullan, yoksa breakdown'dan hesapla
          let caloriesPer100g = breakdown.calories;
          if (aiFood.quantity && aiFood.quantity !== "100g") {
            // Miktar bilgisi varsa, 100g için kaloriyi tahmin et
            // Örnek: 1 tabak = ~200g, 200g için 300 kcal ise 100g için 150 kcal
            const grams = parseInt(aiFood.quantity) || 200; // Varsayılan 200g
            caloriesPer100g = Math.round((breakdown.calories / grams) * 100);
          }
          const caloriesPerGram = caloriesPer100g / 100;

          learnedCaloriesMap.set(originalIndex, {
            caloriesPer100g,
            caloriesPerGram,
          });

          // Veritabanına kaydet (async, hata olsa bile devam et)
          saveLearnedFoodCalories(
            cleanFoodName,
            caloriesPer100g,
            caloriesPerGram,
            extractedPreparationMethod,
            "100g"
          ).catch(err => console.error("Error saving learned food calories:", err));
        }
      }

      // Veritabanından ve AI'dan gelen sonuçları birleştir
      const combinedBreakdown = foods.map(food => {
        const learned = learnedCaloriesMap.get(food.index);
        
        if (learned) {
          // Veritabanından veya AI'dan öğrenilen
          const quantity = food.quantity || "100g";
          const grams = quantity === "100g" ? 100 : parseInt(quantity) || 100;
          return {
            index: food.index,
            name: food.name,
            calories: Math.round(learned.caloriesPerGram * grams),
            quantity: food.quantity ?? null,
            notes: "Önceden öğrenilmiş veya AI ile hesaplanmış",
          };
        }
        return {
          index: food.index,
          name: food.name,
          calories: 0,
          quantity: food.quantity ?? null,
          notes: "Kalori hesaplanamadı",
        };
      });

      const totalCalories = combinedBreakdown.reduce((sum, item) => sum + item.calories, 0);

      mealResult = {
        totalCalories,
        breakdown: combinedBreakdown,
        explanation: aiResult?.explanation || "Kalori hesaplandı",
      };
    } else {
      // Tüm yiyecekler veritabanından geldi, AI'a gitme
      const breakdown = foods.map(food => {
        const learned = learnedCaloriesMap.get(food.index);
        if (!learned) {
          throw new Error(`Öğrenilmiş kalori bulunamadı: ${food.name}`);
        }

        const quantity = food.quantity || "100g";
        const grams = quantity === "100g" ? 100 : parseInt(quantity) || 100;
        return {
          index: food.index,
          name: food.name,
          calories: Math.round(learned.caloriesPerGram * grams),
          quantity: food.quantity ?? null,
          notes: "Önceden öğrenilmiş kalori değeri",
        };
      });

      const totalCalories = breakdown.reduce((sum, item) => sum + item.calories, 0);

      mealResult = {
        totalCalories,
        breakdown,
        explanation: "Tüm kalori değerleri veritabanından alındı",
      };
    }

    return NextResponse.json({ 
      mode: "meal", 
      result: mealResult,
      fromCache: foodsToEstimate.length === 0,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Geçersiz istek", errors: error.errors }, { status: 400 });
    }
    
    console.error("AI calorie route error:", error);
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
    
    // Detaylı hata mesajı oluştur
    let userMessage = "Kalori tahmini yapılamadı";
    if (errorMessage.includes("API_KEY") || errorMessage.includes("403") || errorMessage.includes("401")) {
      userMessage = "API anahtarı geçersiz veya eksik. Lütfen yöneticiye bildirin.";
    } else if (errorMessage.includes("404") || errorMessage.includes("model") || errorMessage.includes("not found")) {
      userMessage = "AI model bulunamadı. Lütfen tekrar deneyin veya yöneticiye bildirin.";
    } else if (errorMessage.includes("quota") || errorMessage.includes("rate limit")) {
      userMessage = "API kota limiti aşıldı. Lütfen daha sonra tekrar deneyin.";
    }
    
    return NextResponse.json({ 
      message: userMessage,
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined
    }, { status: 500 });
  }
}

