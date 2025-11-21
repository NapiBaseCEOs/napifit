import { createSupabaseRouteClient } from "@/lib/supabase/route";
import type { Database } from "@/lib/supabase/types";

type LearnedCaloriesInsert = Database["public"]["Tables"]["learned_calories"]["Insert"];

/**
 * Yiyecek için öğrenilmiş kalori bilgisini veritabanından bul
 */
export async function findLearnedFoodCalories(
  foodName: string,
  preparationMethod?: string | null,
  quantity?: string | null
): Promise<{
  caloriesPer100g: number;
  caloriesPerGram: number;
  id: string;
} | null> {
  const supabase = createSupabaseRouteClient();

  // preparation_method kontrolü için esnek sorgu
  // quantity kontrolü yok çünkü her zaman "100g" için kaydediyoruz ve kontrol ediyoruz
  let query = supabase
    .from("learned_calories")
    .select("id, calories_per_100g, calories_per_gram")
    .eq("food_name", foodName.toLowerCase().trim())
    .is("workout_name", null)
    .eq("quantity", "100g"); // Her zaman 100g için kontrol et

  if (preparationMethod) {
    query = query.eq("preparation_method", preparationMethod.toLowerCase().trim());
  } else {
    query = query.is("preparation_method", null);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    return null;
  }

  // Kullanım sayısını artır
  await incrementUsageCount(data.id);

  return {
    caloriesPer100g: Number(data.calories_per_100g),
    caloriesPerGram: Number(data.calories_per_gram),
    id: data.id,
  };
}

/**
 * Egzersiz için öğrenilmiş kalori bilgisini veritabanından bul
 */
export async function findLearnedWorkoutCalories(
  workoutName: string,
  preparationMethod?: string | null,
  duration?: number | null,
  type?: string | null
): Promise<{
  calories: number;
  id: string;
} | null> {
  const supabase = createSupabaseRouteClient();

  // Esnek sorgu için null kontrolü
  let query = supabase
    .from("learned_calories")
    .select("id, workout_calories")
    .eq("workout_name", workoutName.toLowerCase().trim())
    .is("food_name", null);

  if (preparationMethod) {
    query = query.eq("workout_preparation_method", preparationMethod.toLowerCase().trim());
  } else {
    query = query.is("workout_preparation_method", null);
  }

  if (duration) {
    query = query.eq("workout_duration_minutes", duration);
  } else {
    query = query.is("workout_duration_minutes", null);
  }

  if (type) {
    query = query.eq("workout_type", type);
  } else {
    query = query.is("workout_type", null);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    return null;
  }

  // Kullanım sayısını artır
  await incrementUsageCount(data.id);

  return {
    calories: Number(data.workout_calories),
    id: data.id,
  };
}

/**
 * Yiyecek için öğrenilmiş kalori bilgisini veritabanına kaydet
 */
export async function saveLearnedFoodCalories(
  foodName: string,
  caloriesPer100g: number,
  caloriesPerGram: number,
  preparationMethod?: string | null,
  quantity?: string | null
): Promise<void> {
  const supabase = createSupabaseRouteClient();

  const insertData: LearnedCaloriesInsert = {
    food_name: foodName.toLowerCase().trim(),
    preparation_method: preparationMethod?.toLowerCase().trim() || null,
    quantity: quantity || null,
    calories_per_100g: caloriesPer100g,
    calories_per_gram: caloriesPerGram,
    workout_name: null,
    workout_preparation_method: null,
    workout_duration_minutes: null,
    workout_type: null,
    workout_calories: null,
    usage_count: 1,
    last_used_at: new Date().toISOString(),
  };

  // Önce aynı kayıt var mı kontrol et (duplicate önleme)
  const existing = await findLearnedFoodCalories(
    foodName,
    preparationMethod,
    quantity || "100g"
  );

  if (existing) {
    // Zaten var, güncelle
    const { error: updateError } = await supabase
      .from("learned_calories")
      .update({
        calories_per_100g: caloriesPer100g,
        calories_per_gram: caloriesPerGram,
        last_used_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (updateError) {
      console.error("Error updating learned food calories:", updateError);
    }
    return;
  }

  // Yeni kayıt ekle
  const { error } = await supabase.from("learned_calories").insert(insertData);

  if (error) {
    console.error("Error saving learned food calories:", error);
    // Hata olsa bile devam et (non-critical)
  }
}

/**
 * Egzersiz için öğrenilmiş kalori bilgisini veritabanına kaydet
 */
export async function saveLearnedWorkoutCalories(
  workoutName: string,
  calories: number,
  preparationMethod?: string | null,
  duration?: number | null,
  type?: string | null
): Promise<void> {
  const supabase = createSupabaseRouteClient();

  const insertData: LearnedCaloriesInsert = {
    food_name: null,
    preparation_method: null,
    quantity: null,
    calories_per_100g: null,
    calories_per_gram: null,
    workout_name: workoutName.toLowerCase().trim(),
    workout_preparation_method: preparationMethod?.toLowerCase().trim() || null,
    workout_duration_minutes: duration || null,
    workout_type: type || null,
    workout_calories: calories,
    usage_count: 1,
    last_used_at: new Date().toISOString(),
  };

  // Önce aynı kayıt var mı kontrol et (duplicate önleme)
  const existing = await findLearnedWorkoutCalories(
    workoutName,
    preparationMethod,
    duration,
    type
  );

  if (existing) {
    // Zaten var, güncelle
    const { error: updateError } = await supabase
      .from("learned_calories")
      .update({
        workout_calories: calories,
        last_used_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (updateError) {
      console.error("Error updating learned workout calories:", updateError);
    }
    return;
  }

  // Yeni kayıt ekle
  const { error } = await supabase.from("learned_calories").insert(insertData);

  if (error) {
    console.error("Error saving learned workout calories:", error);
    // Hata olsa bile devam et (non-critical)
  }
}

/**
 * Kullanım sayısını artır ve last_used_at güncelle
 */
async function incrementUsageCount(id: string): Promise<void> {
  const supabase = createSupabaseRouteClient();

  // Önce mevcut kullanım sayısını al
  const { data } = await supabase
    .from("learned_calories")
    .select("usage_count")
    .eq("id", id)
    .single();

  if (data) {
    const { error } = await supabase
      .from("learned_calories")
      .update({
        usage_count: (data.usage_count || 0) + 1,
        last_used_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Error incrementing usage count:", error);
      // Hata olsa bile devam et (non-critical)
    }
  }
}

