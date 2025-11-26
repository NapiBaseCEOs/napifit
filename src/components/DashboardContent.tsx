"use client";

import Link from "next/link";
import Image from "next/image";
import { calculateBMR, calculateTDEE, type ActivityLevel } from "@/lib/utils/bmr";
import AdSenseAd from "@/components/ads/AdSenseAd";
import ActivityCalendar from "@/components/calendar/ActivityCalendar";
import { useLocale } from "@/components/i18n/LocaleProvider";

interface DashboardContentProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    height: number | null;
    weight: number | null;
    age: number | null;
    gender: string | null;
    targetWeight: number | null;
    dailySteps: number | null;
    createdAt: Date;
  };
  bmi: number | null;
  bmiCategory: { label: string; color: string };
  weightDifference: number | null;
  todayCalories: number;
  todayBurnedCalories: number;
  todayMeals: Array<{
    id: string;
    totalCalories: number;
    mealType: string | null;
    foods: any;
    createdAt: Date;
  }>;
  todayWorkouts: Array<{
    id: string;
    name: string;
    type: string;
    duration: number | null;
    calories: number | null;
    distance: number | null;
    createdAt: Date;
  }>;
  bowelMovementDays: number | null;
}

export default function DashboardContent({
  user,
  bmi,
  bmiCategory,
  weightDifference,
  todayCalories,
  todayBurnedCalories,
  todayMeals,
  todayWorkouts,
  bowelMovementDays,
}: DashboardContentProps) {
  const { t } = useLocale();
  const getColorClass = (color: string) => {
    switch (color) {
      case "green":
        return "text-green-400 border-green-500/40 bg-green-500/10";
      case "yellow":
        return "text-yellow-400 border-yellow-500/40 bg-yellow-500/10";
      case "red":
        return "text-red-400 border-red-500/40 bg-red-500/10";
      case "blue":
        return "text-blue-400 border-blue-500/40 bg-blue-500/10";
      default:
        return "text-gray-400 border-gray-500/40 bg-gray-500/10";
    }
  };

  // BMR hesapla
  const bmr = user.weight && user.height && user.age && user.gender
    ? calculateBMR({
        weight: user.weight,
        height: user.height,
        age: user.age,
        gender: user.gender as "male" | "female" | "other",
      })
    : null;

  // Aktivite seviyesini tahmin et (günlük adıma göre)
  const estimateActivityLevel = (): ActivityLevel => {
    const steps = user.dailySteps ?? 0;
    if (steps < 5000) return "sedentary";
    if (steps < 8000) return "light";
    if (steps < 10000) return "moderate";
    if (steps < 12000) return "active";
    return "very_active";
  };

  // TDEE hesapla (BMR + aktivite)
  const activityLevel = estimateActivityLevel();
  const tdee = bmr ? calculateTDEE(bmr, activityLevel) : null;

  // Günlük kalori dengesi = BMR + yakılan kalori - alınan kalori
  const dailyCalorieBalance = bmr !== null
    ? bmr + todayBurnedCalories - todayCalories
    : null;

  // Bağırsak sağlığı değerlendirmesi
  const getBowelHealthStatus = (days: number | null): { status: string; color: string; message: string } => {
    if (days === null) return { status: t("dashboard.bowelStatus.unknown"), color: "gray", message: t("dashboard.bowelMessage.noData") };
    if (days <= 1) return { status: t("dashboard.bowelStatus.veryHealthy"), color: "green", message: t("dashboard.bowelMessage.perfect") };
    if (days <= 1.5) return { status: t("dashboard.bowelStatus.healthy"), color: "green", message: t("dashboard.bowelMessage.normal") };
    if (days <= 2) return { status: t("dashboard.bowelStatus.normal"), color: "yellow", message: t("dashboard.bowelMessage.needsFiber") };
    if (days <= 3) return { status: t("dashboard.bowelStatus.warning"), color: "yellow", message: t("dashboard.bowelMessage.needsWater") };
    return { status: t("dashboard.bowelStatus.unhealthy"), color: "red", message: t("dashboard.bowelMessage.risk") };
  };

  const bowelHealth = getBowelHealthStatus(bowelMovementDays);

  return (
    <main className="relative min-h-screen px-4 py-6 sm:px-5 md:px-6 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-primary-500/15 via-fitness-orange/15 to-transparent blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-fitness-purple/15 via-fitness-blue/15 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="mx-auto max-w-5xl space-y-5 md:space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-gray-800/60 bg-gray-900/90 backdrop-blur-xl p-5 shadow-2xl shadow-primary-500/20 sm:p-7">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/40 bg-primary-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-primary-300 shadow-lg shadow-primary-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                {t("dashboard.healthPanel")}
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-white">
                {t("dashboard.welcome")}, <span className="bg-gradient-to-r from-primary-400 to-fitness-orange bg-clip-text text-transparent">{user.name || user.email}</span>!
              </h1>
            </div>
            
            {/* Sağlık Durumu - Modern Badge */}
            <div className="flex items-center gap-3">
              {bmi && (
                <div className="flex items-center gap-3 rounded-2xl border border-gray-800/60 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-sm px-4 py-3 shadow-lg">
                  <div className="flex flex-col items-end">
                    <div className="text-xs uppercase tracking-wide text-gray-400">BMI</div>
                    <div className="text-2xl font-bold text-white">{bmi}</div>
                  </div>
                  <div className="h-12 w-px bg-gray-700/50"></div>
                  <div className="flex flex-col">
                    <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getColorClass(bmiCategory.color)}`}>
                      {bmiCategory.label}
                    </div>
                    {weightDifference !== null && (
                      <div className={`mt-2 text-xs ${weightDifference > 0 ? "text-green-400" : weightDifference < 0 ? "text-red-400" : "text-gray-400"}`}>
                        {weightDifference > 0 ? "+" : ""}{weightDifference} {t("dashboard.toGoal")}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {user.image && (
                <Image
                  src={user.image}
                  alt="Profil"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full border-2 border-gray-700 object-cover shadow-lg"
                />
              )}
            </div>
          </div>
        </div>

        {/* Reklam: Dashboard üstü - Sadece doğrulama için gizli (AdSense script yüklü kalacak) */}
        <div className="hidden">
          <AdSenseAd 
            adSlot="1680336225" 
            adFormat="auto"
            fullWidthResponsive={true}
            className="min-h-[100px] w-full max-w-5xl"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {/* Weight Card */}
          <div className="group relative rounded-2xl border border-gray-800/70 bg-gray-900/80 backdrop-blur-sm p-6 shadow-lg hover:border-fitness-orange/50 hover:shadow-fitness-orange/20 transition-all duration-300">
            <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">{t("dashboard.currentWeight")}</div>
            <div className="text-3xl font-bold text-white">{user.weight || "—"} kg</div>
            {weightDifference !== null && (
              <div
                className={`mt-2 text-sm ${
                  weightDifference > 0 ? "text-green-400" : weightDifference < 0 ? "text-red-400" : "text-gray-400"
                }`}
              >
                {weightDifference > 0 ? "+" : ""}
                {weightDifference} {t("dashboard.toGoal")}
              </div>
            )}
          </div>

          {/* Target Weight Card */}
          <div className="group relative rounded-2xl border border-gray-800/70 bg-gray-900/80 backdrop-blur-sm p-6 shadow-lg hover:border-primary-500/50 hover:shadow-primary-500/20 transition-all duration-300">
            <div className="mb-2 text-xs uppercase tracking-wide text-gray-400">{t("dashboard.targetWeight")}</div>
            <div className="text-3xl font-bold text-white">{user.targetWeight || "—"} kg</div>
            {weightDifference !== null && (
              <div className="mt-2 text-sm text-gray-400">
                {Math.abs(weightDifference)} kg {weightDifference > 0 ? t("dashboard.toGain") : t("dashboard.toLose")}
              </div>
            )}
          </div>

          {/* Daily Steps Card */}
          <div className="group relative rounded-2xl border border-gray-800/70 bg-gray-900/80 backdrop-blur-sm p-6 shadow-lg hover:border-fitness-purple/50 hover:shadow-fitness-purple/20 transition-all duration-300">
            <div className="mb-2 text-xs uppercase tracking-wide text-gray-400">{t("dashboard.dailyGoal")}</div>
            <div className="text-3xl font-bold text-white">{user.dailySteps?.toLocaleString() || "—"} {t("health.steps")}</div>
            <div className="mt-2 text-sm text-gray-400">{t("dashboard.avgSteps")}</div>
          </div>

          {/* Today's Calories Card */}
          <Link
            href="/health"
            className="group relative rounded-2xl border border-gray-800/70 bg-gradient-to-br from-primary-500/20 via-primary-600/20 to-fitness-orange/20 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-primary-500/50 hover:shadow-primary-500/30 hover:scale-[1.02]"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-gray-400">{t("dashboard.todayCalories")}</span>
              <span className="text-xs text-primary-400 font-semibold group-hover:text-primary-300 transition-colors">{t("dashboard.track")}</span>
            </div>
            <div className="text-3xl font-bold text-white">{Math.round(todayCalories)} <span className="text-lg text-primary-400">kcal</span></div>
            <div className="mt-2 text-sm text-gray-400">
              {todayMeals.length} {t("dashboard.mealsLogged")}
            </div>
          </Link>

          {/* Today's Burned Calories Card */}
          <Link
            href="/health"
            className="group relative rounded-2xl border border-gray-800/70 bg-gradient-to-br from-fitness-orange/20 via-red-500/20 to-fitness-purple/20 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-fitness-orange/50 hover:shadow-fitness-orange/30 hover:scale-[1.02]"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-gray-400">{t("dashboard.burnedCalories")}</span>
              <span className="text-xs text-fitness-orange font-semibold group-hover:text-fitness-orange/80 transition-colors">{t("dashboard.track")}</span>
            </div>
            <div className="text-3xl font-bold text-white">{Math.round(todayBurnedCalories)} <span className="text-lg text-fitness-orange">kcal</span></div>
            <div className="mt-2 text-sm text-gray-400">
              {todayWorkouts.length} {t("dashboard.workoutsLogged")}
            </div>
          </Link>

          {/* BMR Card */}
          {bmr && (
            <div className="group relative rounded-2xl border border-gray-800/70 bg-gradient-to-br from-blue-500/20 via-primary-500/20 to-purple-500/20 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-blue-500/30 hover:scale-[1.02]">
              <div className="mb-2 text-xs uppercase tracking-wide text-gray-400">{t("dashboard.bmr")}</div>
              <div className="text-3xl font-bold text-white">{bmr} <span className="text-lg text-blue-400">kcal</span></div>
              <div className="mt-2 text-sm text-gray-400">
                {t("dashboard.bmrDesc")}
              </div>
              {tdee && (
                <div className="mt-2 text-xs text-gray-500">
                  {t("dashboard.tdee").replace("{tdee}", tdee.toString())}
                </div>
              )}
            </div>
          )}

          {/* Daily Calorie Balance Card */}
          {dailyCalorieBalance !== null && (
            <div className="group relative rounded-2xl border border-gray-800/70 bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/50 hover:shadow-emerald-500/30 hover:scale-[1.02]">
              <div className="mb-2 text-xs uppercase tracking-wide text-gray-400">{t("dashboard.dailyBalance")}</div>
              <div className={`text-3xl font-bold ${dailyCalorieBalance > 0 ? 'text-emerald-400' : dailyCalorieBalance < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                {dailyCalorieBalance > 0 ? '+' : ''}{Math.round(dailyCalorieBalance)} <span className="text-lg text-gray-400">kcal</span>
              </div>
              <div className="mt-2 text-sm text-gray-400">
                {dailyCalorieBalance > 0 
                  ? t("dashboard.calorieDeficit")
                  : dailyCalorieBalance < 0
                  ? t("dashboard.calorieSurplus")
                  : t("dashboard.balanced")}
              </div>
            </div>
          )}

          {/* Bowel Health Card */}
          {bowelMovementDays !== null && (
            <Link
              href="/health"
              className="group relative rounded-2xl border border-gray-800/70 bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-amber-500/50 hover:shadow-amber-500/30 hover:scale-[1.02]"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-gray-400">{t("dashboard.bowelHealth")}</span>
                <span className="text-xs text-amber-400 font-semibold group-hover:text-amber-300 transition-colors">{t("dashboard.track")}</span>
              </div>
              <div className={`text-3xl font-bold ${bowelHealth.color === 'green' ? 'text-green-400' : bowelHealth.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'}`}>
                {bowelHealth.status}
              </div>
              <div className="mt-2 text-sm text-gray-400">
                {bowelMovementDays} {t("dashboard.bowelFrequency")}
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    bowelHealth.color === 'green'
                      ? 'bg-green-500'
                      : bowelHealth.color === 'yellow'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.min(100, bowelMovementDays <= 1 ? 100 : bowelMovementDays <= 2 ? 80 : bowelMovementDays <= 3 ? 60 : 40)}%`,
                  }}
                />
              </div>
            </Link>
          )}
        </div>

        {/* Activity Calendar and Today's Activities - Side by Side */}
        <div className="grid gap-5 md:gap-6 lg:grid-cols-3">
          {/* Activity Calendar - 2 columns */}
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary-200">{t("common.calendar")}</p>
                <h3 className="text-xl sm:text-2xl font-semibold text-white">{t("dashboard.activityCalendar")}</h3>
              </div>
            </div>
            <ActivityCalendar 
              onDateClick={(date) => {
                // Gelecekte bu güne ait detayları gösterebiliriz
                console.log("Selected date:", date);
              }}
            />
          </div>

          {/* Today's Activities - 1 column */}
          <div className="space-y-3 md:space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary-200">{t("common.today")}</p>
              <h3 className="text-xl sm:text-2xl font-semibold text-white">{t("dashboard.todayActivities")}</h3>
            </div>
            <div className="rounded-2xl border border-gray-800/60 bg-gray-900/80 backdrop-blur-sm p-5 shadow-lg space-y-4">
              {/* Today's Date */}
              <div className="pb-4 border-b border-gray-800/60">
                <p className="text-sm font-medium text-gray-300">
                  {new Date().toLocaleDateString(t("common.locale") || "en-US", { 
                    weekday: "long", 
                    year: "numeric", 
                    month: "long", 
                    day: "numeric" 
                  })}
                </p>
              </div>

              {/* Today's Meals */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🍽️</span>
                    <h4 className="text-sm font-semibold text-white">{t("dashboard.todayMeals")}</h4>
                  </div>
                  <Link
                    href="/health"
                    className="text-xs text-green-400 hover:text-green-300"
                  >
                    {t("dashboard.add")}
                  </Link>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {todayMeals.length > 0 ? (
                    todayMeals.map((meal) => {
                      const mealTypeLabels: Record<string, string> = {
                        breakfast: t("dashboard.mealTypes.breakfast"),
                        lunch: t("dashboard.mealTypes.lunch"),
                        dinner: t("dashboard.mealTypes.dinner"),
                        snack: t("dashboard.mealTypes.snack"),
                      };
                      const foods = Array.isArray(meal.foods) ? meal.foods : [];
                      return (
                        <div
                          key={meal.id}
                          className="rounded-lg border border-emerald-500/20 bg-gray-800/40 p-3"
                        >
                          <div className="text-xs font-medium text-white">
                            {mealTypeLabels[meal.mealType || ""] || t("dashboard.mealTypes.meal")}
                          </div>
                          <div className="mt-1 text-xs text-gray-400 line-clamp-1">
                            {foods.slice(0, 2).map((food: any) => food.name).join(", ") || t("dashboard.food")}
                            {foods.length > 2 && "..."}
                          </div>
                          <div className="mt-1 text-xs text-emerald-400">
                            {Math.round(meal.totalCalories)} kcal
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {new Date(meal.createdAt).toLocaleTimeString(t("common.locale") || "en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-400 italic">{t("dashboard.noMeals")}</p>
                  )}
                </div>
              </div>

              {/* Today's Workouts */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💪</span>
                    <h4 className="text-sm font-semibold text-white">{t("dashboard.todayWorkouts")}</h4>
                  </div>
                  <Link
                    href="/health"
                    className="text-xs text-fitness-orange hover:text-fitness-orange/80"
                  >
                    + Ekle
                  </Link>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {todayWorkouts.length > 0 ? (
                    todayWorkouts.map((workout) => {
                      const typeLabels: Record<string, string> = {
                        cardio: "Kardiyovasküler",
                        strength: "Güç",
                        flexibility: "Esneklik",
                        sports: "Spor",
                        other: "Diğer",
                      };
                      return (
                        <div
                          key={workout.id}
                          className="rounded-lg border border-fitness-orange/20 bg-gray-800/40 p-3"
                        >
                          <div className="text-xs font-medium text-white">{workout.name}</div>
                          <div className="mt-1 text-xs text-fitness-orange">
                            {typeLabels[workout.type] || workout.type}
                            {workout.duration && ` • ${workout.duration} dk`}
                            {workout.calories && ` • ${Math.round(workout.calories)} kcal`}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {new Date(workout.createdAt).toLocaleTimeString("tr-TR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-400 italic">{t("dashboard.noWorkouts")}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reklam: Dashboard içerik arası - Sadece doğrulama için gizli */}
        <div className="hidden">
          <AdSenseAd 
            adSlot="2095269194" 
            adFormat="auto"
            fullWidthResponsive={true}
            className="min-h-[250px] w-full max-w-5xl"
          />
        </div>

      </div>
    </main>
  );
}

