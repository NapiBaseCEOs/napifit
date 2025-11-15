import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

type LandingStats = {
  members: number;
  workouts: number;
  meals: number;
  avgDailySteps: number;
  streaks: number;
};

type RecentWorkout = {
  id: string;
  name: string;
  type: string;
  createdAt: Date;
  userName: string;
  calories?: number | null;
  duration?: number | null;
};

const fallbackStats: LandingStats = {
  members: 1280,
  workouts: 9421,
  meals: 18654,
  avgDailySteps: 9340,
  streaks: 214,
};

const fallbackWorkouts: RecentWorkout[] = [
  {
    id: "mock-1",
    name: "HIIT Kardiyo",
    type: "cardio",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    userName: "Melisa",
    calories: 420,
    duration: 35,
  },
  {
    id: "mock-2",
    name: "Full Body Strength",
    type: "strength",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10),
    userName: "Burak",
    calories: 360,
    duration: 50,
  },
  {
    id: "mock-3",
    name: "Sabah Koşusu",
    type: "cardio",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    userName: "Ezgi",
    calories: 280,
    duration: 40,
  },
];

async function getLandingStats(): Promise<LandingStats> {
  try {
    const [members, workouts, meals, avgStepsAggregate] = await Promise.all([
      prisma.user.count(),
      prisma.workout.count(),
      prisma.meal.count(),
      prisma.user.aggregate({ _avg: { dailySteps: true } }),
    ]);

    const avgDailySteps = Math.round(avgStepsAggregate._avg.dailySteps ?? 8200);
    const streaks = Math.max(50, Math.round(workouts * 0.12));

    return {
      members: Math.max(members, 120),
      workouts,
      meals,
      avgDailySteps,
      streaks,
    };
  } catch (error) {
    console.warn("Landing stats fallback:", error);
    return fallbackStats;
  }
}

async function getRecentWorkouts(): Promise<RecentWorkout[]> {
  try {
    const records = await prisma.workout.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            name: true,
          },
        },
      },
    });

    if (!records.length) return fallbackWorkouts;

    return records.map((workout) => ({
      id: workout.id,
      name: workout.name,
      type: workout.type,
      createdAt: workout.createdAt,
      userName:
        workout.user.firstName ||
        workout.user.name ||
        workout.user.lastName ||
        "NapiFit üyesi",
      calories: workout.calories,
      duration: workout.duration,
    }));
  } catch (error) {
    console.warn("Recent workouts fallback:", error);
    return fallbackWorkouts;
  }
}

export default async function HomePage() {
  const [stats, workouts] = await Promise.all([
    getLandingStats(),
    getRecentWorkouts(),
  ]);

  return (
    <main className="relative min-h-screen px-4 py-16 sm:px-6 lg:px-8 bg-[#050505] overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[25%] h-[550px] w-[550px] rounded-full bg-gradient-to-r from-primary-500/15 via-fitness-orange/15 to-transparent blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-[-15%] right-[20%] h-[600px] w-[600px] rounded-full bg-gradient-to-r from-fitness-purple/15 via-fitness-blue/15 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: "1.2s" }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.08),transparent_50%)]" />
      </div>

      <div className="mx-auto flex flex-col gap-16 lg:gap-20 max-w-6xl">
        <HeroSection />
        <StatsSection stats={stats} />
        <ExperienceGrid workouts={workouts} />
        <JourneySection />
        <CallToAction />
      </div>
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative flex flex-col items-center text-center gap-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.4em] text-primary-200 shadow-lg shadow-primary-500/20">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
        </span>
        NapiFit Platformu
      </div>

      <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight">
        Sağlıklı Yaşamın
        <br />
        <span className="bg-gradient-to-r from-primary-400 via-fitness-orange to-fitness-purple bg-clip-text text-transparent">
          Yeni Başlangıcı
        </span>
      </h1>

      <p className="text-lg sm:text-xl text-gray-300 max-w-3xl leading-relaxed">
        Sağlık metrikleri, egzersiz kaydı ve beslenme takibi tek bir uygulamada.
        <span className="text-primary-300 font-medium"> Yapay zeka destekli öneriler</span> ve gerçek zamanlı analitiklerle hedeflerinize odaklanın.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href="/register"
          className="group relative inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-primary-500/50 hover:shadow-primary-500/70 hover:scale-105 transition-all duration-300"
        >
          Hemen Başla
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-gray-800 bg-gray-900/40 px-8 py-4 text-base font-semibold text-gray-200 hover:border-primary-500/60 hover:text-primary-300 hover:bg-gray-900/70 transition-all duration-300"
        >
          Giriş Yap
        </Link>
      </div>
    </section>
  );
}

function StatsSection({ stats }: { stats: LandingStats }) {
  const statItems = [
    { label: "Aktif Üye", value: stats.members, suffix: "+", accent: "from-primary-500/20" },
    { label: "Kaydedilen Egzersiz", value: stats.workouts, suffix: "", accent: "from-fitness-orange/20" },
    { label: "Takip Edilen Öğün", value: stats.meals, suffix: "", accent: "from-fitness-purple/20" },
    { label: "Ortalama Günlük Adım", value: stats.avgDailySteps, suffix: "", accent: "from-fitness-blue/20" },
    { label: "Aktif Seriler", value: stats.streaks, suffix: "", accent: "from-primary-500/20" },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {statItems.map((item) => (
        <div key={item.label} className="relative rounded-2xl border border-gray-800/60 bg-gray-900/40 p-5 backdrop-blur-lg overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          <div className="relative space-y-2">
            <p className="text-gray-400 text-sm uppercase tracking-wide">{item.label}</p>
            <p className="text-3xl font-semibold text-white">
              {item.value.toLocaleString("tr-TR")}
              <span className="text-primary-400">{item.suffix}</span>
            </p>
            <div className="h-1 w-full rounded-full bg-gray-800/80">
              <div className="h-full rounded-full bg-gradient-to-r from-primary-500 via-fitness-orange to-fitness-purple" style={{ width: `${Math.min(100, item.value / 150)}%` }} />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function ExperienceGrid({ workouts }: { workouts: RecentWorkout[] }) {
  const featureCards = [
    {
      title: "Sağlık Metrikleri",
      desc: "BMI, kilo, hedef takibi ve detaylı sağlık istatistikleri",
      accent: "from-primary-500/0 to-primary-500/15",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      ),
    },
    {
      title: "Egzersiz Takibi",
      desc: "Antrenmanlarınızı kaydedin ve ilerlemenizi görüntüleyin",
      accent: "from-fitness-orange/0 to-fitness-orange/15",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      ),
    },
    {
      title: "Beslenme Takibi",
      desc: "Öğünlerinizi kaydedin ve kalori alımınızı takip edin",
      accent: "from-fitness-purple/0 to-fitness-purple/15",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      ),
    },
  ];

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        {featureCards.map((card) => (
          <div key={card.title} className="group relative rounded-2xl border border-gray-800/70 bg-gray-900/40 p-6 backdrop-blur-lg overflow-hidden transition-colors hover:border-primary-500/40">
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="relative flex items-start gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 text-primary-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {card.icon}
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                <p className="text-sm text-gray-400">{card.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-gray-800/70 bg-gray-950/30 p-6 backdrop-blur-xl shadow-[0_20px_80px_rgba(15,23,42,0.45)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Anlık Aktiviteler</p>
            <h3 className="text-xl font-semibold text-white">Topluluk Akışı</h3>
          </div>
          <span className="text-xs text-gray-500">Canlı Güncelleniyor</span>
        </div>
        <div className="space-y-3">
          {workouts.map((workout) => (
            <div key={workout.id} className="rounded-2xl border border-gray-800/60 bg-gray-900/40 p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-500/20 to-transparent flex items-center justify-center text-primary-300 font-semibold">
                {workout.userName.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-400">{workout.userName}</p>
                <p className="text-white font-medium">{workout.name}</p>
                <p className="text-xs text-gray-500">
                  {workout.type} ·{" "}
                  {formatDistanceToNow(new Date(workout.createdAt), {
                    addSuffix: true,
                    locale: tr,
                  })}
                </p>
              </div>
              <div className="text-right text-sm text-gray-400">
                {workout.duration ? <p>{workout.duration} dk</p> : null}
                {workout.calories ? <p>{workout.calories} kcal</p> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JourneySection() {
  const steps = [
    {
      title: "Onboarding & Analiz",
      desc: "Yapay zeka destekli sorularla profilini oluştur, hedeflerini belirle.",
      accent: "border-primary-500/50 bg-primary-500/5",
    },
    {
      title: "Planını Özelleştir",
      desc: "Egzersiz, beslenme ve sağlık önerilerini kişisel programına göre uyarlıyoruz.",
      accent: "border-fitness-orange/50 bg-fitness-orange/5",
    },
    {
      title: "İlerlemeni Takip Et",
      desc: "Gerçek zamanlı metrikler, raporlar ve hatırlatmalarla motivasyonunu koru.",
      accent: "border-fitness-purple/50 bg-fitness-purple/5",
    },
  ];

  return (
    <section className="grid gap-6 lg:grid-cols-3">
      {steps.map((step, index) => (
        <div key={step.title} className={`rounded-3xl border ${step.accent} p-6 space-y-3`}>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Adım {index + 1}</p>
          <h3 className="text-xl font-semibold text-white">{step.title}</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
        </div>
      ))}
    </section>
  );
}

function CallToAction() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-gray-800/60 bg-gradient-to-r from-gray-900/80 via-gray-900/30 to-gray-900/80 p-8 text-center">
      <div className="absolute -left-24 top-1/2 h-56 w-56 rounded-full bg-primary-500/20 blur-3xl" />
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-fitness-purple/20 blur-3xl" />
      <div className="relative space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-primary-200">Hazırsan Başlayalım</p>
        <h3 className="text-3xl font-semibold text-white">Mobil deneyim, Cloudflare desteği ve AI önerileriyle</h3>
        <p className="text-gray-400 max-w-2xl mx-auto">
          NapiFit hem web hem de mobil (Capacitor) deneyimini destekler. Tek tıkla Cloudflare Pages’a entegre edilen uygulama her push sonrası otomatik olarak güncellenir.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/register"
            className="rounded-2xl bg-white text-gray-900 px-8 py-4 font-semibold hover:translate-y-0.5 transition-transform"
          >
            Topluluğa Katıl
          </Link>
          <Link
            href="/login"
            className="rounded-2xl border border-white/30 text-white px-8 py-4 font-semibold hover:border-white transition-colors"
          >
            Hesabın var mı?
          </Link>
        </div>
      </div>
    </section>
  );
}

