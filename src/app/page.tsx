import { redirect } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseClientEnv } from "@/lib/supabase/config";
import { APP_VERSION, RELEASE_NOTES } from "@/config/version";
import VersionBadge from "@/components/VersionBadge";
import StatsSection from "@/components/homepage/StatsSection";
import UserReviewsSection from "@/components/homepage/UserReviewsSection";

type LandingStats = {
  members: number;
  workouts: number;
  meals: number;
  avgDailySteps: number;
  streaks: number;
};

const fallbackStats: LandingStats = {
  members: 1280,
  workouts: 9421,
  meals: 18654,
  avgDailySteps: 9340,
  streaks: 214,
};


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

// Build sırasında database'e erişmeyi önlemek için dynamic export
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  // Eğer kullanıcı giriş yapmışsa dashboard'a yönlendir
  if (hasSupabaseClientEnv) {
    try {
      const supabase = createSupabaseServerClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Kullanıcı profilini kontrol et
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          if (profile.onboarding_completed) {
            // Onboarding tamamlanmışsa dashboard'a yönlendir
            redirect("/dashboard");
          } else {
            // Onboarding tamamlanmamışsa onboarding'e yönlendir
            redirect("/onboarding");
          }
        }
      }
    } catch (error) {
      // Hata durumunda ana sayfayı göster (non-critical)
      console.warn("Ana sayfa session kontrolü hatası:", error);
    }
  }

  const stats = await getLandingStats();

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
        <StatsSection initialStats={stats} />
        <SocialProof />
        <UserReviewsSection />
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
          <span className="bg-gradient-to-r from-primary-400 via-fitness-orange via-fitness-purple to-primary-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Yeni Başlangıcı
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-200 max-w-2xl leading-relaxed mx-auto lg:mx-0">
          Kişisel antrenman planları, beslenme hatırlatmaları ve sağlık metrikleri tek panelde.
          <span className="text-primary-200 font-medium"> Veriye dayalı kararlar</span> ve motivasyon artıran bildirimlerle hedeflerini sürekli canlı tut.
        </p>

        <ul className="grid gap-3 sm:grid-cols-2 text-sm text-gray-300 max-w-2xl mx-auto lg:mx-0">
          {perks.map((perk) => (
            <li key={perk} className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 transition-all hover:border-primary-500/30 hover:bg-primary-500/10 hover:scale-[1.02]">
              <span className="h-2 w-2 rounded-full bg-primary-300 group-hover:bg-primary-400 group-hover:scale-125 transition-transform" />
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
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white/80 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all duration-300"
          >
            Giriş Yap
          </Link>
        </div>

      </div>
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

