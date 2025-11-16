import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { redirect } from "next/navigation";
import HealthForms from "../../../components/HealthForms";

export default async function HealthPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || "" },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Sağlık metrikleri, egzersizler ve öğünleri al
  const healthMetrics = await prisma.healthMetric.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const workouts = await prisma.workout.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const meals = await prisma.meal.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <main className="relative min-h-screen px-4 py-8 sm:px-6 bg-[#0a0a0a]">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-primary-500/15 via-fitness-orange/15 to-transparent blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-fitness-purple/15 via-fitness-blue/15 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-gray-800/60 bg-gray-900/80 p-6 shadow-2xl shadow-emerald-500/20 backdrop-blur sm:p-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-emerald-300">
            Sağlık Takibi
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-white">
            Sağlığınızı Takip Edin
          </h1>
          <p className="mt-2 text-gray-400">
            Metriklerinizi kaydedin, egzersizlerinizi takip edin ve öğünlerinizi kaydedin.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-800/70 bg-gray-900/80 p-6 shadow-lg">
            <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">Sağlık Metrikleri</div>
            <div className="text-3xl font-bold text-white">{healthMetrics.length}</div>
            <div className="mt-2 text-sm text-gray-400">Toplam kayıt</div>
          </div>
          <div className="rounded-2xl border border-gray-800/70 bg-gray-900/80 p-6 shadow-lg">
            <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">Egzersizler</div>
            <div className="text-3xl font-bold text-white">{workouts.length}</div>
            <div className="mt-2 text-sm text-gray-400">Toplam kayıt</div>
          </div>
          <div className="rounded-2xl border border-gray-800/70 bg-gray-900/80 p-6 shadow-lg">
            <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">Öğünler</div>
            <div className="text-3xl font-bold text-white">{meals.length}</div>
            <div className="mt-2 text-sm text-gray-400">Toplam kayıt</div>
          </div>
        </div>

        {/* Recent Items */}
        <div className="grid gap-6 sm:grid-cols-3">
          {/* Health Metrics */}
          <div className="rounded-2xl border border-gray-800/70 bg-gray-900/80 p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-white">Son Metrikler</h3>
            <div className="space-y-3">
              {healthMetrics.length > 0 ? (
                healthMetrics.slice(0, 5).map((metric) => (
                  <div
                    key={metric.id}
                    className="rounded-lg border border-gray-800/70 bg-gray-900/60 p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {metric.weight && `${metric.weight} kg`}
                          {metric.bmi && ` • BMI: ${metric.bmi}`}
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          {new Date(metric.createdAt).toLocaleDateString("tr-TR")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">Henüz metrik kaydı yok</p>
              )}
            </div>
          </div>

          {/* Workouts */}
          <div className="rounded-2xl border border-gray-800/70 bg-gray-900/80 p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-white">Son Egzersizler</h3>
            <div className="space-y-3">
              {workouts.length > 0 ? (
                workouts.slice(0, 5).map((workout) => (
                  <div
                    key={workout.id}
                    className="rounded-lg border border-gray-800/70 bg-gray-900/60 p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-white">{workout.name}</div>
                        <div className="mt-1 text-xs text-gray-400">
                          {workout.duration && `${workout.duration} dk`}
                          {workout.calories && ` • ${workout.calories} kcal`}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {new Date(workout.createdAt).toLocaleDateString("tr-TR")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">Henüz egzersiz kaydı yok</p>
              )}
            </div>
          </div>

          {/* Meals */}
          <div className="rounded-2xl border border-gray-800/70 bg-gray-900/80 p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-white">Son Öğünler</h3>
            <div className="space-y-3">
              {meals.length > 0 ? (
                meals.slice(0, 5).map((meal) => {
                  const foods = Array.isArray(meal.foods) ? meal.foods : [];
                  return (
                    <div
                      key={meal.id}
                      className="rounded-lg border border-gray-800/70 bg-gray-900/60 p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium text-white">
                            {meal.mealType || "Öğün"}
                          </div>
                          <div className="mt-1 text-xs text-gray-400">
                            {foods.map((food: any) => food.name).join(", ") || "Yemek"}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {Math.round(meal.totalCalories)} kcal • {new Date(meal.createdAt).toLocaleDateString("tr-TR")}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-400">Henüz öğün kaydı yok</p>
              )}
            </div>
          </div>
        </div>

        {/* Add Forms */}
        <HealthForms />

        {/* Info Card */}
        <div className="rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-white">Nasıl Kullanılır?</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• Sağlık metriklerinizi kaydederek ilerlemenizi takip edin</p>
            <p>• Egzersizlerinizi kaydederek aktivite geçmişinizi görüntüleyin</p>
            <p>• Öğünlerinizi kaydederek kalori alımınızı takip edin</p>
            <p className="mt-4 text-xs text-gray-500">
              Bu özellikler yakında mobil uygulamada da kullanılabilir olacak.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

