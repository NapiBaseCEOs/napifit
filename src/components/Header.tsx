"use client";

import Link from "next/link";
import LogoMark from "./LogoMark";
import Spinner from "./icons/Spinner";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import { APP_VERSION } from "@/config/version";
import { useUpdateChecker } from "./UpdateCheckerProvider";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import type { Database } from "@/lib/supabase/types";
import NetworkStatusIndicator from "./NetworkStatusIndicator";
import LanguageSwitcher from "./i18n/LanguageSwitcher";
import { useLocale } from "./i18n/LocaleProvider";
import ThemeToggle from "./ThemeToggle";

// Lazy load NotificationBell (only loads when user is authenticated)
const NotificationBell = dynamic(() => import("./NotificationBell"), {
  ssr: false,
  loading: () => null,
});

export default function Header() {
  const router = useRouter();
  const supabase = useSupabaseClient<Database>();
  const session = useSession();
  const isAuth = !!session;
  const [signingOut, setSigningOut] = useState(false);
  const [navigatingLogin, setNavigatingLogin] = useState(false);
  const { checkForUpdate } = useUpdateChecker();
  const { t } = useLocale();

  const handleSignOut = useCallback(async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
      // Session state'inin güncellenmesi için kısa bir delay
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push("/");
      router.refresh();
      // Force reload to ensure all components update
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
      // Hata olsa bile sayfayı yenile
      window.location.href = "/";
    } finally {
      setSigningOut(false);
    }
  }, [signingOut, supabase, router]);

  const handleGoLogin = useCallback(async () => {
    if (navigatingLogin) return;
    setNavigatingLogin(true);
    try {
      await router.push("/login");
    } finally {
      setNavigatingLogin(false);
    }
  }, [navigatingLogin, router]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800/80 bg-gray-950/95 backdrop-blur-xl safe-area-top shadow-lg shadow-primary-500/5">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-2 py-2 sm:px-4 sm:py-3 lg:px-6 pt-safe sm:pt-3 overflow-x-auto">
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 text-gray-100 hover:text-white transition-colors group flex-shrink-0">
          <LogoMark className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 drop-shadow-[0_4px_12px_rgba(34,197,94,0.4)] group-hover:drop-shadow-[0_4px_16px_rgba(34,197,94,0.6)] transition-all duration-300" />
          <div className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-1 sm:gap-1.5 lg:gap-2">
              <span className="text-xs sm:text-sm lg:text-lg font-bold tracking-tight bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent group-hover:from-primary-300 group-hover:to-primary-400 transition-all duration-300">
                NapiFit
              </span>
              <button
                onClick={checkForUpdate}
                className="text-[9px] sm:text-[10px] text-gray-500 font-medium hover:text-primary-400 transition-colors cursor-pointer px-1 py-0.5 rounded hover:bg-primary-500/10 min-h-[44px] sm:min-h-0"
                title="Güncelleme kontrolü yap"
              >
                v.{APP_VERSION}
              </button>
            </div>
            <span className="text-[8px] sm:text-[9px] lg:text-[10px] text-gray-500 font-normal">by <span className="text-primary-500/70 font-medium">NapiBase</span></span>
          </div>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Network Status - Sadece desktop'ta, küçük */}
          <div className="hidden lg:block">
            <NetworkStatusIndicator />
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 text-[11px] sm:text-xs lg:text-sm">
            {isAuth && (
              <>
                {/* Mobilde sadece önemli linkler, desktop'ta hepsi */}
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex px-2 py-1.5 sm:px-2.5 sm:py-1.5 lg:px-3 lg:py-2 text-gray-300 hover:text-white rounded-lg hover:bg-primary-500/10 hover:border-primary-500/30 border border-transparent text-[11px] sm:text-xs lg:text-sm font-semibold transition-all duration-300 hover:scale-105 min-h-[44px] sm:min-h-0 items-center justify-center"
                >
                  {t("nav.dashboard")}
                </Link>
                <Link
                  href="/community"
                  className="hidden sm:inline-flex px-2 py-1.5 sm:px-2.5 sm:py-1.5 lg:px-3 lg:py-2 text-gray-300 hover:text-white rounded-lg hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-transparent text-[11px] sm:text-xs lg:text-sm font-semibold transition-all duration-300 hover:scale-105 min-h-[44px] sm:min-h-0 items-center justify-center"
                >
                  {t("nav.community")}
                </Link>
                <Link
                  href="/health"
                  className="hidden md:inline-flex px-2 py-1.5 sm:px-2.5 sm:py-1.5 lg:px-3 lg:py-2 text-gray-300 hover:text-white rounded-lg hover:bg-fitness-orange/10 hover:border-fitness-orange/30 border border-transparent text-[11px] sm:text-xs lg:text-sm font-semibold transition-all duration-300 hover:scale-105 min-h-[44px] sm:min-h-0 items-center justify-center"
                >
                  {t("nav.health")}
                </Link>
                <Link
                  href="/water"
                  className="px-2 py-1.5 sm:px-2.5 sm:py-1.5 lg:px-3 lg:py-2 text-gray-300 hover:text-white rounded-lg hover:bg-blue-500/10 hover:border-blue-500/30 border border-transparent text-[11px] sm:text-xs lg:text-sm font-semibold transition-all duration-300 hover:scale-105 min-h-[44px] sm:min-h-0 items-center justify-center"
                >
                  <span className="hidden sm:inline">💧 Su</span>
                  <span className="sm:hidden">💧</span>
                </Link>
                <Link
                  href="/profile"
                  className="hidden lg:inline-flex px-2 py-1.5 sm:px-2.5 sm:py-1.5 lg:px-3 lg:py-2 text-gray-300 hover:text-white rounded-lg hover:bg-fitness-purple/10 hover:border-fitness-purple/30 border border-transparent text-[11px] sm:text-xs lg:text-sm font-semibold transition-all duration-300 hover:scale-105 min-h-[44px] sm:min-h-0 items-center justify-center"
                >
                  {t("nav.profile")}
                </Link>
              </>
            )}

            {/* Bildirim Butonu - Nav'ın içinde, en sağda */}
            {isAuth && (
              <div className="ml-0.5 sm:ml-1 lg:ml-2">
                <NotificationBell />
              </div>
            )}

            {/* Auth Butonları */}
            {isAuth ? (
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="ml-1 sm:ml-2 flex items-center justify-center gap-1 sm:gap-1.5 lg:gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-2 py-1.5 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-[11px] sm:text-xs lg:text-sm font-semibold text-white shadow-lg shadow-primary-500/50 hover:shadow-primary-500/70 hover:scale-105 transition-all duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 min-h-[44px] sm:min-h-0"
              >
                {signingOut ? <Spinner className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <span className="hidden sm:inline">{t("nav.logout")}</span>}
                {!signingOut && <span className="sm:hidden">✕</span>}
              </button>
            ) : (
              <div className="ml-1 sm:ml-2 flex items-center gap-1 sm:gap-1.5 lg:gap-2">
                <button
                  onClick={handleGoLogin}
                  disabled={navigatingLogin}
                  className="flex items-center justify-center gap-1 sm:gap-1.5 lg:gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-2 py-1.5 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-[11px] sm:text-xs lg:text-sm font-semibold text-white shadow-lg shadow-primary-500/50 hover:shadow-primary-500/70 hover:scale-105 transition-all duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 min-h-[44px] sm:min-h-0"
                >
                  {navigatingLogin ? <Spinner className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <span className="hidden sm:inline">Giriş</span>}
                  {!navigatingLogin && <span className="sm:hidden">→</span>}
                </button>
                <Link
                  href="/register"
                  className="rounded-xl border-2 border-gray-700 bg-gray-900/50 px-2 py-1.5 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-[11px] sm:text-xs lg:text-sm font-semibold text-gray-200 hover:text-white hover:border-primary-500/50 hover:bg-gray-900/70 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center min-h-[44px] sm:min-h-0"
                >
                  <span className="hidden sm:inline">Kayıt</span>
                  <span className="sm:hidden">+</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

