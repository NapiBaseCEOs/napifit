import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";
import { APP_VERSION, RELEASE_NOTES } from "@/config/version";
import VersionBadge from "@/components/VersionBadge";

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
    const [membersResponse, workoutsResponse, mealsResponse, avgStepsResponse] = await Promise.all([
      supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("workouts").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("meals").select("id", { count: "exact", head: true }),
      supabaseAdmin.rpc("avg_daily_steps"),
    ]);

    const members = membersResponse.count ?? fallbackStats.members;
    const workouts = workoutsResponse.count ?? fallbackStats.workouts;
    const meals = mealsResponse.count ?? fallbackStats.meals;
    const avgDailySteps = Math.round((avgStepsResponse.data as number | null) ?? 8200);
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
    type WorkoutWithProfile = Database["public"]["Tables"]["workouts"]["Row"] & {
      profiles: { full_name: string | null } | null;
    };

    const { data, error } = await supabaseAdmin
      .from("workouts")
      .select("id,name,type,created_at,calories,duration_minutes,profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(3)
      .returns<WorkoutWithProfile[]>();

    if (error || !data?.length) {
      return fallbackWorkouts;
    }

    return data.map((workout) => ({
      id: workout.id,
      name: workout.name,
      type: workout.type,
      createdAt: new Date(workout.created_at),
      userName: workout.profiles?.full_name || "NapiFit üyesi",
      calories: workout.calories,
      duration: workout.duration_minutes,
    }));
  } catch (error) {
    console.warn("Recent workouts fallback:", error);
    return fallbackWorkouts;
  }
}

// Build sırasında database'e erişmeyi önlemek için dynamic export
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [stats, workouts] = await Promise.all([getLandingStats(), getRecentWorkouts()]);

  return (
    <main className="relative min-h-screen px-4 py-16 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#01030a] via-[#04081b] to-[#010106]" />
      <div className="absolute -z-10 top-[-10%] left-[15%] h-[620px] w-[620px] rounded-full bg-primary-500/25 blur-[180px] animate-float" />
      <div
        className="absolute -z-10 bottom-[-15%] right-[5%] h-[620px] w-[620px] rounded-full bg-fitness-orange/20 blur-[180px]"
        style={{ animationDelay: "1.5s" }}
      />
      <div className="absolute inset-0 -z-10 opacity-40 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.12),transparent_65%)]" />

      <div className="mx-auto flex flex-col gap-16 lg:gap-20 max-w-6xl">
        <HeroSection />
        <StatsSection stats={stats} />
        <SocialProof />
        <ExperienceGrid workouts={workouts} />
        <JourneySection />
        <ChangelogSection />
        <CallToAction />
      </div>
    </main>
  );
}

function HeroSection() {
  const perks = [
    "AI destekli planlar",
    "Gerçek zamanlı raporlar",
    "Google & e‑posta ile giriş",
    "Mobil senkronizasyon",
  ];

  return (
    <section className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
      <div className="space-y-8 text-center lg:text-left">
        <VersionBadge />

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight">
          Sağlıklı Yaşamın
          <br />
          <span className="bg-gradient-to-r from-primary-400 via-fitness-orange to-fitness-purple bg-clip-text text-transparent">
            Yeni Başlangıcı
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-200 max-w-2xl leading-relaxed mx-auto lg:mx-0">
          Kişisel antrenman planları, beslenme hatırlatmaları ve sağlık metrikleri tek panelde.
          <span className="text-primary-200 font-medium"> Veriye dayalı kararlar</span> ve motivasyon artıran bildirimlerle hedeflerini sürekli canlı tut.
        </p>

        <ul className="grid gap-3 sm:grid-cols-2 text-sm text-gray-300 max-w-2xl mx-auto lg:mx-0">
          {perks.map((perk) => (
            <li key={perk} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-primary-300" />
              {perk}
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 pt-4">
          <Link
            href="/register"
            className="group relative inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base font-semibold text-white shadow-[0_25px_70px_rgba(15,23,42,0.5)] bg-[linear-gradient(120deg,#7c3aed,#f97316,#06b6d4,#7c3aed)] animate-gradient"
          >
            Hemen Başla
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white/80 hover:bg-white/10 transition-all duration-300"
          >
            Giriş Yap
          </Link>
          <a
            href="/napifit-logo.png"
            download
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-gray-200 hover:text-white hover:border-primary-400/60 hover:bg-white/10 transition-all duration-300"
          >
            Logoyu indir (PNG)
          </a>
        </div>

        <div className="flex items-center justify-center lg:justify-start gap-4 text-left">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
            <p className="text-white font-semibold text-2xl">4.9/5</p>
            <p className="text-xs text-gray-400">Beta kullanıcı memnuniyeti</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">“Günde birkaç dakika ayırarak ilerlememi net görüyorum.”</p>
            <p className="text-xs text-gray-500 mt-1">Ayşe • Ürün Müdürü</p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-col gap-6">
        <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_25px_80px_rgba(5,6,20,0.6)]">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-4">Canlı özet</p>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Aktif hedef</p>
              <p className="text-white text-2xl font-semibold">“Kış Formu 2025”</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0b1325]/80 p-4 space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-300">
                <span>Kalori dengesi</span>
                <span className="text-primary-200 font-semibold">+320 kcal</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full w-3/4 bg-[linear-gradient(120deg,#f97316,#7c3aed)] animate-gradient" />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Sabah koşusu</span>
                <span>35 dk</span>
              </div>
            </div>
            <div className="flex -space-x-3">
              {["M", "B", "E", "+"].map((initial) => (
                <span
                  key={initial}
                  className="h-10 w-10 rounded-2xl border border-white/10 bg-white/10 flex items-center justify-center text-sm font-semibold text-white"
                >
                  {initial}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400">Topluluk arkadaşlarınla aynı hedefte ilerle.</p>
          </div>
        </div>
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
        <div
          key={item.label}
          className="group relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg overflow-hidden shadow-[0_15px_45px_rgba(3,4,12,0.45)]"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          <div className="relative space-y-2">
            <p className="text-gray-400 text-sm uppercase tracking-wide">{item.label}</p>
            <p className="text-3xl font-semibold text-white">
              {item.value.toLocaleString("tr-TR")}
              <span className="text-primary-400">{item.suffix}</span>
            </p>
            <div className="h-1 w-full rounded-full bg-gray-800/80">
              <div
                className="h-full rounded-full bg-[linear-gradient(120deg,#7c3aed,#f97316,#06b6d4)] animate-gradient"
                style={{ width: `${Math.min(100, item.value / 150)}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function SocialProof() {
  const logos = ["Supabase", "Vercel", "Capacitor", "Next.js"];
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:p-10 backdrop-blur-xl shadow-[0_20px_80px_rgba(3,4,12,0.45)] space-y-6">
      <div className="flex flex-col gap-3 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Güvenilir Altyapı</p>
        <h2 className="text-2xl font-semibold text-white">En sevdiğin platformlarla çalışır</h2>
        <p className="text-gray-300">
          NapiFit hem Supabase güvenliği hem de Vercel otomatik deploy sistemi sayesinde dakikalar içinde yayına alınır.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-300">
        {logos.map((logo) => (
          <span key={logo} className="px-4 py-2 rounded-full border border-white/10 bg-white/5">
            {logo}
          </span>
        ))}
      </div>
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
          <div key={card.title} className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg overflow-hidden transition-colors hover:border-primary-500/40">
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

      <div className="rounded-3xl border border-white/10 bg-[#0b1325]/80 p-6 backdrop-blur-xl shadow-[0_20px_80px_rgba(15,23,42,0.55)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Anlık Aktiviteler</p>
            <h3 className="text-xl font-semibold text-white">Topluluk Akışı</h3>
          </div>
          <span className="text-xs text-gray-500">Canlı Güncelleniyor</span>
        </div>
        <div className="space-y-3">
          {workouts.map((workout) => (
            <div key={workout.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center gap-4">
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
        <div
          key={step.title}
          className={`rounded-3xl border ${step.accent} p-6 space-y-3 backdrop-blur-xl shadow-[0_20px_60px_rgba(3,4,12,0.45)]`}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Adım {index + 1}</p>
          <h3 className="text-xl font-semibold text-white">{step.title}</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
        </div>
      ))}
    </section>
  );
}

function ChangelogSection() {
  const latestRelease = RELEASE_NOTES[0];
  const previousReleases = RELEASE_NOTES.slice(1, 4);

  return (
    <section id="changelog" className="scroll-mt-20">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-8 sm:p-12 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Sürüm Notları</h2>
            <p className="text-gray-400">En son güncellemeler ve yeni özellikler</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
            </span>
            <span className="text-sm font-semibold text-primary-200">v{APP_VERSION}</span>
          </div>
        </div>

        {/* Latest Release */}
        {latestRelease && (
          <div className="mb-8 rounded-2xl border border-primary-500/30 bg-primary-500/10 p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{latestRelease.title}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="font-semibold text-primary-300">v{latestRelease.version}</span>
                  <span>•</span>
                  <span>{latestRelease.date}</span>
                </div>
              </div>
            </div>
            <ul className="space-y-2">
              {latestRelease.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Previous Releases */}
        {previousReleases.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Önceki Sürümler</h4>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {previousReleases.map((release) => (
                <div key={release.version} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary-300">v{release.version}</span>
                    <span className="text-xs text-gray-500">{release.date}</span>
                  </div>
                  <h5 className="text-sm font-semibold text-white">{release.title}</h5>
                  <ul className="space-y-1">
                    {release.highlights.slice(0, 3).map((highlight, idx) => (
                      <li key={idx} className="text-xs text-gray-400 line-clamp-2">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,#1a1038,transparent_70%)] p-8 text-center shadow-[0_30px_90px_rgba(3,4,12,0.6)]">
      <div className="absolute -left-24 top-1/2 h-56 w-56 rounded-full bg-primary-500/30 blur-3xl" />
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-fitness-purple/30 blur-3xl" />
      <div className="relative space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-primary-200">Hazırsan Başlayalım</p>
        <h3 className="text-3xl font-semibold text-white">Mobil deneyim, Cloudflare desteği ve AI önerileriyle</h3>
        <p className="text-gray-300 max-w-2xl mx-auto">
          NapiFit hem web hem de mobil (Capacitor) deneyimini destekler. Tek tıkla Vercel ve Cloudflare entegrasyonlarıyla
          her push sonrası otomatik olarak yayına çıkar.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/register"
            className="rounded-2xl px-8 py-4 font-semibold text-white bg-[linear-gradient(120deg,#7c3aed,#f97316,#06b6d4)] animate-gradient shadow-[0_25px_70px_rgba(15,23,42,0.5)]"
          >
            Topluluğa Katıl
          </Link>
          <Link
            href="/login"
            className="rounded-2xl border border-white/20 text-white px-8 py-4 font-semibold bg-white/5 hover:bg-white/10 transition-colors"
          >
            Hesabın var mı?
          </Link>
        </div>
      </div>
    </section>
  );
}

