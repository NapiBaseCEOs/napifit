import { redirect } from "next/navigation";
import HealthForms from "../../../components/HealthForms";
import ActivityCalendar from "../../../components/calendar/ActivityCalendar";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export default async function HealthPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  const userId = session.user.id;

  const [{ data: healthMetricsData }, { data: workoutsData }, { data: mealsData }] = await Promise.all([
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

  const healthMetrics =
    (healthMetricsData as Database["public"]["Tables"]["health_metrics"]["Row"][] | null)?.map((metric) => ({
      id: metric.id,
      weight: metric.weight_kg,
      bowelMovementDays: metric.bowel_movement_days,
      createdAt: new Date(metric.created_at),
    })) ?? [];

  const workouts =
    (workoutsData as Database["public"]["Tables"]["workouts"]["Row"][] | null)?.map((workout) => ({
      id: workout.id,
      name: workout.name,
      duration: workout.duration_minutes,
      calories: workout.calories,
      createdAt: new Date(workout.created_at),
    })) ?? [];

  const meals =
    (mealsData as Database["public"]["Tables"]["meals"]["Row"][] | null)?.map((meal) => ({
      id: meal.id,
      mealType: meal.meal_type,
      foods: meal.foods,
      totalCalories: meal.total_calories,
      createdAt: new Date(meal.created_at),
    })) ?? [];

  return (
    <main className="relative min-h-screen px-4 py-8 sm:px-6 overflow-hidden bg-[#0a0a0a]">
      {/* Modern Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-primary-500/20 via-fitness-orange/20 to-transparent blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-fitness-purple/20 via-fitness-blue/20 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Modern Header */}
        <div className="rounded-3xl border border-primary-500/30 bg-gradient-to-br from-gray-900/90 via-primary-900/10 to-fitness-orange/10 backdrop-blur-xl p-6 shadow-2xl shadow-primary-500/20 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/40 bg-primary-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-primary-300 shadow-lg shadow-primary-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Sağlık Kontrol Paneli
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-white">
            Sağlığınızı Takip Edin
          </h1>
          <p className="mt-2 text-lg text-gray-300">
            Metriklerinizi kaydedin, egzersizlerinizi takip edin ve öğünlerinizi kaydedin.
          </p>
        </div>

        {/* Modern Quick Stats */}
        <div className="grid gap-6 sm:grid-cols-3">
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
        <div className="grid gap-6 sm:grid-cols-3">
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

        {/* Activity Calendar */}
        <ActivityCalendar 
          onDateClick={(date) => {
            // Gelecekte bu güne ait detayları gösterebiliriz
            console.log("Selected date:", date);
          }}
        />

        {/* Add Forms */}
        <HealthForms />

        {/* Modern Info Card */}
        <div className="rounded-2xl border border-gray-800/60 bg-gradient-to-br from-gray-900/80 via-primary-900/5 to-transparent backdrop-blur-sm p-6 shadow-lg">
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
        </div>
      </div>
    </main>
  );
}
