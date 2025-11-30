import { redirect } from "next/navigation";
import DashboardContent from "../../../components/DashboardContent";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user: authUser },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("User fetch error:", userError);
      redirect("/login");
    }

    if (!authUser) {
      redirect("/login");
    }

    const userId = authUser.id;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        "id,email,full_name,avatar_url,height_cm,weight_kg,age,gender,target_weight_kg,daily_steps,onboarding_completed,created_at"
      )
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      redirect("/login");
    }

    if (!profile) {
      redirect("/login");
    }

    if (!profile.onboarding_completed) {
      redirect("/onboarding");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Use maybeSingle() instead of single() to handle cases where no record exists
    const [{ data: todayMealsData, error: mealsError }, { data: todayWorkoutsData, error: workoutsError }, { data: latestHealthMetricData, error: healthMetricError }] = await Promise.all([
      supabase
        .from("meals")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", today.toISOString())
        .lt("created_at", tomorrow.toISOString())
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("workouts")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", today.toISOString())
        .lt("created_at", tomorrow.toISOString())
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("health_metrics")
        .select("bowel_movement_days")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    // Log errors but don't fail the page - use empty data instead
    if (mealsError) {
      console.error("Meals fetch error:", mealsError);
    }
    if (workoutsError) {
      console.error("Workouts fetch error:", workoutsError);
    }
    if (healthMetricError) {
      console.error("Health metrics fetch error:", healthMetricError);
    }

    const todayMeals =
      (todayMealsData as Database["public"]["Tables"]["meals"]["Row"][] | null)?.map((meal) => ({
        id: meal.id,
        foods: meal.foods,
        mealType: meal.meal_type,
        totalCalories: meal.total_calories,
        createdAt: new Date(meal.created_at),
      })) ?? [];

    const todayWorkouts =
      (todayWorkoutsData as Database["public"]["Tables"]["workouts"]["Row"][] | null)?.map((workout) => ({
        id: workout.id,
        name: workout.name,
        type: workout.type,
        duration: workout.duration_minutes,
        calories: workout.calories,
        distance: workout.distance_km,
        createdAt: new Date(workout.created_at),
      })) ?? [];

    const user = {
      id: profile.id,
      name: profile.full_name,
      email: profile.email,
      image: profile.avatar_url,
      height: profile.height_cm,
      weight: profile.weight_kg,
      age: profile.age,
      gender: profile.gender,
      targetWeight: profile.target_weight_kg,
      dailySteps: profile.daily_steps,
      onboardingCompleted: profile.onboarding_completed,
      createdAt: new Date(profile.created_at),
    };

    const todayCalories = todayMeals.reduce((sum, meal) => sum + meal.totalCalories, 0);
    const todayBurnedCalories = todayWorkouts.reduce((sum, workout) => sum + (workout.calories || 0), 0);

    // BMI hesapla
    const calculateBMI = (height: number | null, weight: number | null): number | null => {
      if (!height || !weight) return null;
      const heightInMeters = height / 100;
      return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
    };

    // BMI kategorisi
    const getBMICategory = (bmi: number | null): { label: string; color: string } => {
      if (!bmi) return { label: "Hesaplanamadı", color: "gray" };
      if (bmi < 18.5) return { label: "Zayıf", color: "blue" };
      if (bmi < 25) return { label: "Normal", color: "green" };
      if (bmi < 30) return { label: "Fazla Kilolu", color: "yellow" };
      return { label: "Obez", color: "red" };
    };

    // Kilo farkı hesapla
    const weightDifference = user.weight && user.targetWeight
      ? parseFloat((user.targetWeight - user.weight).toFixed(1))
      : null;

    const bmi = calculateBMI(user.height, user.weight);
    const bmiCategory = getBMICategory(bmi);

    // Latest health metric'ten bağırsak sağlığı
    const latestHealthMetric = latestHealthMetricData as Database["public"]["Tables"]["health_metrics"]["Row"] | null;
    const bowelMovementDays = latestHealthMetric?.bowel_movement_days ?? null;

    return (
      <DashboardContent
        user={user}
        bmi={bmi}
        bmiCategory={bmiCategory}
        weightDifference={weightDifference}
        todayCalories={todayCalories}
        todayBurnedCalories={todayBurnedCalories}
        todayMeals={todayMeals}
        todayWorkouts={todayWorkouts}
        bowelMovementDays={bowelMovementDays}
      />
    );
  } catch (error) {
    // Log the error for debugging
    console.error("Dashboard page error:", error);

    // If it's an authentication error, redirect to login
    if (error instanceof Error && (error.message.includes("auth") || error.message.includes("session"))) {
      redirect("/login");
    }

    // For other errors, throw a proper error page
    // Next.js will catch this and show the error page
    throw error;
  }
}

