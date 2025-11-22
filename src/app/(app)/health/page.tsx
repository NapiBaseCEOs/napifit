import { redirect } from "next/navigation";
import HealthForms from "../../../components/HealthForms";
import ActivityCalendar from "../../../components/calendar/ActivityCalendar";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HealthPage() {
  try {
    // Create Supabase client with error handling
    let supabase;
    try {
      supabase = createSupabaseServerClient();
    } catch (supabaseError) {
      console.error("Failed to create Supabase client:", supabaseError);
      throw new Error("Database bağlantısı kurulamadı");
    }

    let userId: string | null = null;
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) {
        console.error("User fetch error:", userError);
        redirect("/login");
        return null;
      }
      if (!user) {
        redirect("/login");
        return null;
      }
      userId = user.id;
    } catch (authError) {
      console.error("Auth user error:", authError);
      redirect("/login");
      return null;
    }
    
    if (!userId) {
      console.error("User ID is missing from authenticated user");
      redirect("/login");
      return null;
    }

    let healthMetricsData = null;
    let workoutsData = null;
    let mealsData = null;
    let healthMetricsError = null;
    let workoutsError = null;
    let mealsError = null;

    try {
      const results = await Promise.allSettled([
        supabase
          .from("health_metrics")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("workouts")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("meals")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      // Process health_metrics result
      if (results[0].status === "fulfilled") {
        healthMetricsData = results[0].value.data ?? null;
        healthMetricsError = results[0].value.error ?? null;
      } else {
        console.error("Health metrics query failed:", results[0].reason);
        healthMetricsError = results[0].reason instanceof Error ? results[0].reason : new Error(String(results[0].reason));
      }

      // Process workouts result
      if (results[1].status === "fulfilled") {
        workoutsData = results[1].value.data ?? null;
        workoutsError = results[1].value.error ?? null;
      } else {
        console.error("Workouts query failed:", results[1].reason);
        workoutsError = results[1].reason instanceof Error ? results[1].reason : new Error(String(results[1].reason));
      }

      // Process meals result
      if (results[2].status === "fulfilled") {
        mealsData = results[2].value.data ?? null;
        mealsError = results[2].value.error ?? null;
      } else {
        console.error("Meals query failed:", results[2].reason);
        mealsError = results[2].reason instanceof Error ? results[2].reason : new Error(String(results[2].reason));
      }
    } catch (queryError) {
      console.error("Database queries error:", queryError);
      // Continue with empty data - don't fail the page
      healthMetricsData = null;
      workoutsData = null;
      mealsData = null;
    }

    // Log errors but don't fail the page - use empty data instead
    if (healthMetricsError) {
      console.error("Health metrics fetch error:", healthMetricsError);
    }
    if (workoutsError) {
      console.error("Workouts fetch error:", workoutsError);
    }
    if (mealsError) {
      console.error("Meals fetch error:", mealsError);
    }

    // Safely map data with error handling
    const healthMetrics = Array.isArray(healthMetricsData)
      ? healthMetricsData
          .filter((metric) => metric != null)
          .map((metric) => ({
            id: metric.id,
            weight: metric.weight_kg ?? null,
            bowelMovementDays: metric.bowel_movement_days ?? null,
            createdAt: metric.created_at ? new Date(metric.created_at) : new Date(),
          }))
      : [];

    const workouts = Array.isArray(workoutsData)
      ? workoutsData
          .filter((workout) => workout != null)
          .map((workout) => ({
            id: workout.id,
            name: workout.name ?? "Egzersiz",
            duration: workout.duration_minutes ?? null,
            calories: workout.calories ?? null,
            createdAt: workout.created_at ? new Date(workout.created_at) : new Date(),
          }))
      : [];

    const meals = Array.isArray(mealsData)
      ? mealsData
          .filter((meal) => meal != null)
          .map((meal) => ({
            id: meal.id,
            mealType: meal.meal_type ?? "snack",
            foods: Array.isArray(meal.foods) ? meal.foods : [],
            totalCalories: meal.total_calories ?? 0,
            createdAt: meal.created_at ? new Date(meal.created_at) : new Date(),
          }))
      : [];

    return (
    <main className="relative min-h-screen px-4 py-6 sm:px-5 md:px-6 overflow-hidden bg-[#0a0a0a]">
      {/* Modern Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-primary-500/20 via-fitness-orange/20 to-transparent blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-fitness-purple/20 via-fitness-blue/20 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="mx-auto max-w-5xl space-y-5 md:space-y-6">
        {/* Modern Header */}
        <div className="rounded-3xl border border-primary-500/30 bg-gradient-to-br from-gray-900/90 via-primary-900/10 to-fitness-orange/10 backdrop-blur-xl p-5 shadow-2xl shadow-primary-500/20 sm:p-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/40 bg-primary-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-primary-300 shadow-lg shadow-primary-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Sağlık Kontrol Paneli
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-white">
            Sağlığınızı Takip Edin
          </h1>
          <p className="mt-2 text-lg text-gray-300">
            Metriklerinizi kaydedin, egzersizlerinizi takip edin ve öğünlerinizi kaydedin.
          </p>
        </div>

        {/* Quick Nav */}
        <div className="flex flex-wrap gap-3">
          {[
            { href: "#quick-log", label: "Hızlı Kayıt", icon: "⚡" },
            { href: "#calendar", label: "Takvim", icon: "🗓️" },
            { href: "#insights", label: "İpuçları", icon: "💡" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-200 hover:border-primary-500/40 hover:bg-primary-500/10 transition-all"
            >
              <span>{link.icon}</span>
              {link.label}
            </a>
          ))}
        </div>

        {/* Modern Quick Stats */}
        <div className="grid gap-5 md:gap-6 sm:grid-cols-3">
          <div className="group relative rounded-2xl border border-gray-800/70 bg-gradient-to-br from-primary-500/20 via-primary-600/10 to-transparent backdrop-blur-sm p-6 shadow-lg hover:border-primary-500/50 hover:shadow-primary-500/30 transition-all duration-300 hover:scale-[1.02]">
            <div className="mb-2 text-xs uppercase tracking-wide text-primary-300 font-semibold">Kilo Takibi</div>
            <div className="text-3xl font-bold text-white">{healthMetrics.length}</div>
            <div className="mt-2 text-sm text-gray-400">Toplam kayıt</div>
            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
              <span className="text-4xl">⚖️</span>
            </div>
          </div>
          <div className="group relative rounded-2xl border border-gray-800/70 bg-gradient-to-br from-fitness-orange/20 via-red-500/10 to-transparent backdrop-blur-sm p-6 shadow-lg hover:border-fitness-orange/50 hover:shadow-fitness-orange/30 transition-all duration-300 hover:scale-[1.02]">
            <div className="mb-2 text-xs uppercase tracking-wide text-fitness-orange font-semibold">Egzersizler</div>
            <div className="text-3xl font-bold text-white">{workouts.length}</div>
            <div className="mt-2 text-sm text-gray-400">Toplam kayıt</div>
            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
              <span className="text-4xl">💪</span>
            </div>
          </div>
          <div className="group relative rounded-2xl border border-gray-800/70 bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-transparent backdrop-blur-sm p-6 shadow-lg hover:border-emerald-500/50 hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02]">
            <div className="mb-2 text-xs uppercase tracking-wide text-emerald-300 font-semibold">Öğünler</div>
            <div className="text-3xl font-bold text-white">{meals.length}</div>
            <div className="mt-2 text-sm text-gray-400">Toplam kayıt</div>
            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
              <span className="text-4xl">🍽️</span>
            </div>
          </div>
        </div>

        {/* Modern Recent Items */}
        <div className="grid gap-5 md:gap-6 sm:grid-cols-3">
          {/* Health Metrics */}
          <div className="rounded-2xl border border-primary-500/30 bg-gradient-to-br from-gray-900/90 via-primary-900/10 to-transparent backdrop-blur-sm p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xl">⚖️</span>
              <h3 className="text-lg font-semibold text-white">Kilo Geçmişi</h3>
            </div>
            <div className="space-y-3">
              {healthMetrics.length > 0 ? (
                healthMetrics.slice(0, 5).map((metric) => (
                  <div
                    key={metric.id}
                    className="rounded-lg border border-primary-500/20 bg-gradient-to-r from-gray-800/60 to-gray-800/40 p-4 hover:border-primary-500/40 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {metric.weight && `${metric.weight} kg`}
                        </div>
                        {metric.bowelMovementDays && (
                          <div className="mt-1 text-xs text-emerald-400">
                            Bağırsak: {metric.bowelMovementDays} günde bir
                          </div>
                        )}
                        <div className="mt-1 text-xs text-gray-400">
                          {new Date(metric.createdAt).toLocaleDateString("tr-TR")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">Henüz kayıt yok</p>
              )}
            </div>
          </div>

          {/* Workouts */}
          <div className="rounded-2xl border border-fitness-orange/30 bg-gradient-to-br from-gray-900/90 via-fitness-orange/10 to-transparent backdrop-blur-sm p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xl">💪</span>
              <h3 className="text-lg font-semibold text-white">Son Egzersizler</h3>
            </div>
            <div className="space-y-3">
              {workouts.length > 0 ? (
                workouts.slice(0, 5).map((workout) => (
                  <div
                    key={workout.id}
                    className="rounded-lg border border-fitness-orange/20 bg-gradient-to-r from-gray-800/60 to-gray-800/40 p-4 hover:border-fitness-orange/40 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-white">{workout.name}</div>
                        <div className="mt-1 text-xs text-fitness-orange">
                          {workout.duration && `${workout.duration} dk`}
                          {workout.calories && ` • ${Math.round(workout.calories)} kcal`}
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          {new Date(workout.createdAt).toLocaleDateString("tr-TR")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">Henüz kayıt yok</p>
              )}
            </div>
          </div>

          {/* Meals */}
          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-gray-900/90 via-emerald-500/10 to-transparent backdrop-blur-sm p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xl">🍽️</span>
              <h3 className="text-lg font-semibold text-white">Son Öğünler</h3>
            </div>
            <div className="space-y-3">
              {meals.length > 0 ? (
                meals.slice(0, 5).map((meal) => {
                  const foods = Array.isArray(meal.foods) ? meal.foods : [];
                  const mealTypeLabels: Record<string, string> = {
                    breakfast: "🌅 Kahvaltı",
                    lunch: "☀️ Öğle",
                    dinner: "🌙 Akşam",
                    snack: "🍿 Atıştırmalık",
                  };
                  return (
                    <div
                      key={meal.id}
                      className="rounded-lg border border-emerald-500/20 bg-gradient-to-r from-gray-800/60 to-gray-800/40 p-4 hover:border-emerald-500/40 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium text-white">
                            {mealTypeLabels[meal.mealType || ""] || "🍽️ Öğün"}
                          </div>
                          <div className="mt-1 text-xs text-gray-400">
                            {foods.slice(0, 2).map((food: any) => food.name).join(", ") || "Yemek"}
                            {foods.length > 2 && "..."}
                          </div>
                          <div className="mt-1 text-xs text-emerald-400">
                            {Math.round(meal.totalCalories)} kcal • {new Date(meal.createdAt).toLocaleDateString("tr-TR")}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-400 italic">Henüz kayıt yok</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Log Section */}
        <section id="quick-log" className="space-y-3 md:space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary-200">Hızlı Kayıt</p>
              <h3 className="text-2xl font-semibold text-white">Kilo, egzersiz ve öğünlerini anında kaydet</h3>
            </div>
            <span className="rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1 text-xs text-primary-200">
              1 dakikada kayıt
            </span>
          </div>
          <HealthForms />
        </section>

        {/* Activity Calendar */}
        <section id="calendar" className="space-y-3 md:space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary-200">Takvim</p>
              <h3 className="text-2xl font-semibold text-white">Günün boş mu dolu mu?</h3>
            </div>
          </div>
          <ActivityCalendar />
        </section>

        {/* Modern Info Card */}
        <section id="insights" className="rounded-2xl border border-gray-800/60 bg-gradient-to-br from-gray-900/80 via-primary-900/5 to-transparent backdrop-blur-sm p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
            <span>💡</span>
            Nasıl Kullanılır?
          </h3>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-start gap-3">
              <span className="text-primary-400 mt-0.5">✓</span>
              <p>Kilonuzu düzenli olarak kaydederek ilerlemenizi takip edin</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-fitness-orange mt-0.5">✓</span>
              <p>Egzersizlerinizi kaydederek aktivite geçmişinizi görüntüleyin</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <p>Öğünlerinizi kaydederek kalori alımınızı takip edin</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400 mt-0.5">✓</span>
              <p>Bağırsak sağlığınızı takip ederek genel sağlığınızı koruyun</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
  } catch (error) {
    // Log the error for debugging
    console.error("Health page error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : "Unknown",
    });
    
    // If it's an authentication error, redirect to login
    if (error instanceof Error && (error.message.includes("auth") || error.message.includes("session") || error.message.includes("cookie"))) {
      try {
        redirect("/login");
        return null;
      } catch (redirectError) {
        console.error("Redirect failed:", redirectError);
        // Fall through to throw error
      }
    }
    
    // For other errors, throw a proper error page
    // Next.js will catch this and show the error page
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu";
    throw new Error(`Sağlık sayfası yüklenirken hata: ${errorMessage}`);
  }
}
