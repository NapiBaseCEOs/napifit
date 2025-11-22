import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export const dynamic = 'force-dynamic';

/**
 * Takvim aktivite verilerini döndürür
 * Her gün için öğün ve egzersiz sayısını içerir
 * 
 * Query params:
 * - month: YYYY-MM formatında ay (opsiyonel, varsayılan: mevcut ay)
 * - year: Yıl (opsiyonel, varsayılan: mevcut yıl)
 */
export async function GET(request: Request) {
  try {
    const supabase = createSupabaseRouteClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");

    // Ay ve yıl belirleme
    const now = new Date();
    const year = yearParam ? parseInt(yearParam, 10) : now.getFullYear();
    const month = monthParam ? parseInt(monthParam.split("-")[1] || monthParam, 10) : now.getMonth() + 1;

    // Ayın ilk ve son günü
    const firstDay = new Date(year, month - 1, 1);
    firstDay.setHours(0, 0, 0, 0);
    const lastDay = new Date(year, month, 0);
    lastDay.setHours(23, 59, 59, 999);

    // Öğünleri getir
    const { data: meals, error: mealsError } = await supabase
      .from("meals")
      .select("created_at")
      .eq("user_id", user.id)
      .gte("created_at", firstDay.toISOString())
      .lte("created_at", lastDay.toISOString());

    if (mealsError) {
      console.error("Meals fetch error:", mealsError);
      return NextResponse.json({ error: "Failed to fetch meals" }, { status: 500 });
    }

    // Egzersizleri getir
    const { data: workouts, error: workoutsError } = await supabase
      .from("workouts")
      .select("created_at")
      .eq("user_id", user.id)
      .gte("created_at", firstDay.toISOString())
      .lte("created_at", lastDay.toISOString());

    if (workoutsError) {
      console.error("Workouts fetch error:", workoutsError);
      return NextResponse.json({ error: "Failed to fetch workouts" }, { status: 500 });
    }

    // Günlere göre veri sayılarını hesapla
    const activityMap: Record<string, { meals: number; workouts: number }> = {};

    // Tüm günleri başlat (0 ile)
    const daysInMonth = lastDay.getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      activityMap[dateKey] = { meals: 0, workouts: 0 };
    }

    // Öğünleri say
    meals?.forEach((meal) => {
      const date = new Date(meal.created_at);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      if (activityMap[dateKey]) {
        activityMap[dateKey].meals += 1;
      }
    });

    // Egzersizleri say
    workouts?.forEach((workout) => {
      const date = new Date(workout.created_at);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      if (activityMap[dateKey]) {
        activityMap[dateKey].workouts += 1;
      }
    });

    // Bugün için kontrol
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const todayActivity = activityMap[todayKey] || { meals: 0, workouts: 0 };
    const isTodayComplete = todayActivity.meals > 0 && todayActivity.workouts > 0;

    return NextResponse.json({
      month,
      year,
      activities: activityMap,
      today: {
        meals: todayActivity.meals,
        workouts: todayActivity.workouts,
        isComplete: isTodayComplete,
        hasMeal: todayActivity.meals > 0,
        hasWorkout: todayActivity.workouts > 0,
      },
    });
  } catch (error) {
    console.error("Calendar activity API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

