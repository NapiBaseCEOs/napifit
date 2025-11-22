import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const supabase = createSupabaseRouteClient();
    const today = new Date().toISOString().split("T")[0];

    // Bugünkü aktiviteleri kontrol et
    const { data: todayMeals } = await supabase
      .from("meals")
      .select("calories, meal_type")
      .eq("user_id", userId)
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`);

    const { data: todayWorkouts } = await supabase
      .from("workouts")
      .select("calories")
      .eq("user_id", userId)
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`);

    const { data: profile } = await supabase
      .from("profiles")
      .select("weight, target_weight, daily_water_goal_ml")
      .eq("id", userId)
      .single();

    const suggestions: Array<{
      id: string;
      message: string;
      action: string;
      priority: "low" | "medium" | "high";
    }> = [];

    // Öğün kontrolü
    const mealCount = todayMeals?.length || 0;
    if (mealCount === 0) {
      suggestions.push({
        id: "no-meals",
        message: "Bugün henüz öğün kaydı yok. İlk öğününüzü kaydetmek ister misiniz?",
        action: "Bugünkü öğünlerimi kaydet",
        priority: "high",
      });
    } else if (mealCount < 3) {
      suggestions.push({
        id: "few-meals",
        message: `Bugün sadece ${mealCount} öğün kaydettiniz. Düzenli beslenme için daha fazla öğün ekleyebilirsiniz.`,
        action: "Öğün ekle",
        priority: "medium",
      });
    }

    // Egzersiz kontrolü
    const workoutCount = todayWorkouts?.length || 0;
    if (workoutCount === 0) {
      suggestions.push({
        id: "no-workouts",
        message: "Bugün henüz egzersiz kaydı yok. Harekete geçmek için bir egzersiz ekleyebilirsiniz!",
        action: "Egzersiz ekle",
        priority: "medium",
      });
    }

    // Su tüketimi kontrolü (eğer hedef varsa)
    if (profile?.daily_water_goal_ml) {
      // Bu kontrolü water intake API'sinden alabiliriz, şimdilik basit tutuyoruz
      suggestions.push({
        id: "water-reminder",
        message: "Su tüketiminizi takip etmeyi unutmayın! Yeterli su içmek sağlık için çok önemli.",
        action: "Su tüketimimi kontrol et",
        priority: "low",
      });
    }

    // Kilo hedefi kontrolü
    if (profile?.target_weight && profile?.weight) {
      const diff = profile.target_weight - profile.weight;
      if (Math.abs(diff) > 5) {
        suggestions.push({
          id: "weight-goal",
          message: `Hedef kilonuza ulaşmak için ${Math.abs(diff)} kg ${diff > 0 ? "almanız" : "kaybetmeniz"} gerekiyor. Size özel bir plan hazırlayabilirim!`,
          action: "Hedefime nasıl ulaşırım?",
          priority: "high",
        });
      }
    }

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error("Proactive suggestions error:", error);
    return NextResponse.json(
      { error: error.message || "Proactive suggestions hatası" },
      { status: 500 }
    );
  }
}

