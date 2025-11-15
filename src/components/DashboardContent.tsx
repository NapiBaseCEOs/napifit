"use client";

import Link from "next/link";

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
  todayMeals: Array<{
    id: string;
    totalCalories: number;
    mealType: string | null;
    foods: any;
    createdAt: Date;
  }>;
}

export default function DashboardContent({
  user,
  bmi,
  bmiCategory,
  weightDifference,
  todayCalories,
  todayMeals,
}: DashboardContentProps) {
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

  return (
    <main className="relative min-h-screen px-4 py-8 sm:px-6 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-primary-500/15 via-fitness-orange/15 to-transparent blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-fitness-purple/15 via-fitness-blue/15 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-gray-800/60 bg-gray-900/90 backdrop-blur-xl p-6 shadow-2xl shadow-primary-500/20 sm:p-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/40 bg-primary-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-primary-300 shadow-lg shadow-primary-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                Sağlık Dashboard
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-white">
                Hoş geldin, <span className="bg-gradient-to-r from-primary-400 to-fitness-orange bg-clip-text text-transparent">{user.name || user.email}</span>!
              </h1>
            </div>
            {user.image && (
              <img
                src={user.image}
                alt="Profil"
                className="h-16 w-16 rounded-full border-2 border-gray-700"
              />
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* BMI Card */}
          <div className="group relative rounded-2xl border border-gray-800/70 bg-gray-900/80 backdrop-blur-sm p-6 shadow-lg hover:border-primary-500/50 hover:shadow-primary-500/20 transition-all duration-300">
            <div className="mb-2 text-xs uppercase tracking-wide text-gray-400">BMI</div>
            <div className="mb-2 text-3xl font-bold text-white">{bmi || "—"}</div>
            <div
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getColorClass(
                bmiCategory.color
              )}`}
            >
              {bmiCategory.label}
            </div>
          </div>

          {/* Weight Card */}
          <div className="group relative rounded-2xl border border-gray-800/70 bg-gray-900/80 backdrop-blur-sm p-6 shadow-lg hover:border-fitness-orange/50 hover:shadow-fitness-orange/20 transition-all duration-300">
            <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">Mevcut Kilo</div>
            <div className="text-3xl font-bold text-white">{user.weight || "—"} kg</div>
            {weightDifference !== null && (
              <div
                className={`mt-2 text-sm ${
                  weightDifference > 0 ? "text-green-400" : weightDifference < 0 ? "text-red-400" : "text-gray-400"
                }`}
              >
                {weightDifference > 0 ? "+" : ""}
                {weightDifference} kg hedefe
              </div>
            )}
          </div>

          {/* Target Weight Card */}
          <div className="group relative rounded-2xl border border-gray-800/70 bg-gray-900/80 backdrop-blur-sm p-6 shadow-lg hover:border-primary-500/50 hover:shadow-primary-500/20 transition-all duration-300">
            <div className="mb-2 text-xs uppercase tracking-wide text-gray-400">Hedef Kilo</div>
            <div className="text-3xl font-bold text-white">{user.targetWeight || "—"} kg</div>
            {weightDifference !== null && (
              <div className="mt-2 text-sm text-gray-400">
                {Math.abs(weightDifference)} kg {weightDifference > 0 ? "alınmalı" : "verilmeli"}
              </div>
            )}
          </div>

          {/* Daily Steps Card */}
          <div className="group relative rounded-2xl border border-gray-800/70 bg-gray-900/80 backdrop-blur-sm p-6 shadow-lg hover:border-fitness-purple/50 hover:shadow-fitness-purple/20 transition-all duration-300">
            <div className="mb-2 text-xs uppercase tracking-wide text-gray-400">Günlük Hedef</div>
            <div className="text-3xl font-bold text-white">{user.dailySteps?.toLocaleString() || "—"} adım</div>
            <div className="mt-2 text-sm text-gray-400">Ortalama adım sayısı</div>
          </div>

          {/* Today's Calories Card */}
          <Link
            href="/health"
            className="group relative rounded-2xl border border-gray-800/70 bg-gradient-to-br from-primary-500/20 via-primary-600/20 to-fitness-orange/20 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-primary-500/50 hover:shadow-primary-500/30 hover:scale-[1.02]"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-gray-400">Bugünkü Kalori</span>
              <span className="text-xs text-primary-400 font-semibold group-hover:text-primary-300 transition-colors">+ Takip Et →</span>
            </div>
            <div className="text-3xl font-bold text-white">{Math.round(todayCalories)} <span className="text-lg text-primary-400">kcal</span></div>
            <div className="mt-2 text-sm text-gray-400">
              {todayMeals.length} öğün kaydedildi
            </div>
          </Link>
        </div>

        {/* Today's Meals */}
        {todayMeals.length > 0 && (
          <div className="rounded-2xl border border-gray-800/70 bg-gray-900/80 p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Bugünkü Öğünler</h3>
              <Link
                href="/health"
                className="text-sm text-green-400 hover:text-green-300"
              >
                + Yeni Ekle
              </Link>
            </div>
            <div className="space-y-3">
              {todayMeals.map((meal) => {
                const mealTypeLabels: Record<string, string> = {
                  breakfast: "Kahvaltı",
                  lunch: "Öğle",
                  dinner: "Akşam",
                  snack: "Atıştırmalık",
                };
                const foods = Array.isArray(meal.foods) ? meal.foods : [];
                return (
                  <div
                    key={meal.id}
                    className="rounded-lg border border-gray-800/70 bg-gray-900/60 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">
                          {mealTypeLabels[meal.mealType || ""] || "Öğün"}
                        </div>
                        <div className="mt-1 text-sm text-gray-400">
                          {foods.map((food: any) => food.name).join(", ") || "Yemek"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-400">
                          {Math.round(meal.totalCalories)} kcal
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(meal.createdAt).toLocaleTimeString("tr-TR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Profile Info */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-800/70 bg-gray-900/80 p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-white">Kişisel Bilgiler</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Boy</span>
                <span className="text-gray-200">{user.height || "—"} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Yaş</span>
                <span className="text-gray-200">{user.age || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cinsiyet</span>
                <span className="text-gray-200">
                  {user.gender === "male"
                    ? "Erkek"
                    : user.gender === "female"
                    ? "Kadın"
                    : user.gender === "other"
                    ? "Diğer"
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email</span>
                <span className="text-gray-200">{user.email || "—"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800/70 bg-gray-900/80 p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-white">Sağlık Özeti</h3>
            <div className="space-y-4">
              {bmi && (
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-gray-400">BMI Durumu</span>
                    <span className={`font-medium ${getColorClass(bmiCategory.color).split(" ")[0]}`}>
                      {bmiCategory.label}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-800">
                    <div
                      className={`h-full rounded-full ${
                        bmiCategory.color === "green"
                          ? "bg-green-500"
                          : bmiCategory.color === "yellow"
                          ? "bg-yellow-500"
                          : bmiCategory.color === "red"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                      style={{
                        width: `${Math.min(100, ((bmi - 15) / 20) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
              {weightDifference !== null && (
                <div className="rounded-lg border border-gray-800/70 bg-gray-900/60 p-4">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Hedef İlerleme</div>
                  <div className="mt-2 text-2xl font-bold text-white">
                    {weightDifference > 0 ? "+" : ""}
                    {weightDifference} kg
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {weightDifference > 0
                      ? "Hedef kiloya ulaşmak için kilo alınmalı"
                      : weightDifference < 0
                      ? "Hedef kiloya ulaşmak için kilo verilmeli"
                      : "Hedef kiloya ulaşıldı! 🎉"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

