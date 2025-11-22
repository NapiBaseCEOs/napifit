"use client";

import Link from "next/link";
import LogoMark from "./LogoMark";
import Spinner from "./icons/Spinner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { APP_VERSION } from "@/config/version";
import { useUpdateChecker } from "./UpdateCheckerProvider";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import type { Database } from "@/lib/supabase/types";
import NetworkStatusIndicator from "./NetworkStatusIndicator";
import NotificationBell from "./NotificationBell";

export default function Header() {
  const router = useRouter();
  const supabase = useSupabaseClient<Database>();
  const session = useSession();
  const isAuth = !!session;
  const [signingOut, setSigningOut] = useState(false);
  const [navigatingLogin, setNavigatingLogin] = useState(false);
  const { checkForUpdate } = useUpdateChecker();

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  const handleGoLogin = async () => {
    if (navigatingLogin) return;
    setNavigatingLogin(true);
    try {
      await router.push("/login");
    } finally {
      setNavigatingLogin(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800/80 bg-gray-950/95 backdrop-blur-xl safe-area-top shadow-lg shadow-primary-500/5">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 pt-safe sm:pt-3">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 text-gray-100 hover:text-white transition-colors group">
          <LogoMark className="h-7 w-7 sm:h-8 sm:w-8 drop-shadow-[0_4px_12px_rgba(34,197,94,0.4)] group-hover:drop-shadow-[0_4px_16px_rgba(34,197,94,0.6)] transition-all duration-300" />
          <div className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-sm font-bold tracking-tight sm:text-lg bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent group-hover:from-primary-300 group-hover:to-primary-400 transition-all duration-300">
                NapiFit
              </span>
              <button
                onClick={checkForUpdate}
                className="text-[10px] sm:text-xs text-gray-500 font-medium hover:text-primary-400 transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-primary-500/10"
                title="Güncelleme kontrolü yap"
              >
                v.{APP_VERSION}
              </button>
            </div>
            <span className="text-[9px] sm:text-[10px] text-gray-500 font-normal">by <span className="text-primary-500/70 font-medium">NapiBase</span></span>
          </div>
        </Link>
        <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
          {isAuth && <NotificationBell />}
          <NetworkStatusIndicator />
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:gap-3 sm:text-sm">
            {isAuth && (
              <>
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-gray-300 hover:text-white rounded-xl hover:bg-primary-500/10 hover:border-primary-500/30 border border-transparent text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105"
                >
                  Kontrol Paneli
                </Link>
                <Link
                  href="/community"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-gray-300 hover:text-white rounded-xl hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-transparent text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105"
                >
                  Topluluk
                </Link>
                <Link
                  href="/health"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-gray-300 hover:text-white rounded-xl hover:bg-fitness-orange/10 hover:border-fitness-orange/30 border border-transparent text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105"
                >
                  Sağlık
                </Link>
                <Link
                  href="/water"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-gray-300 hover:text-white rounded-xl hover:bg-blue-500/10 hover:border-blue-500/30 border border-transparent text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105"
                >
                  💧 Su
                </Link>
                <Link
                  href="/profile"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-gray-300 hover:text-white rounded-xl hover:bg-fitness-purple/10 hover:border-fitness-purple/30 border border-transparent text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105"
                >
                  Profil
                </Link>
              </>
            )}
            {isAuth ? (
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-primary-500/50 hover:shadow-primary-500/70 hover:scale-105 transition-all duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 min-h-[36px] sm:min-h-0"
              >
                {signingOut ? <Spinner className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : "Çıkış"}
              </button>
            ) : (
              <div className="flex items-center gap-2 sm:gap-2.5">
                <button
                  onClick={handleGoLogin}
                  disabled={navigatingLogin}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-primary-500/50 hover:shadow-primary-500/70 hover:scale-105 transition-all duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 min-h-[36px] sm:min-h-0"
                >
                  {navigatingLogin ? <Spinner className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : "Giriş"}
                </button>
                <Link
                  href="/register"
                  className="rounded-xl border-2 border-gray-700 bg-gray-900/50 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-200 hover:text-white hover:border-primary-500/50 hover:bg-gray-900/70 transition-all duration-300 hover:scale-105 active:scale-95 min-h-[36px] sm:min-h-0 flex items-center justify-center"
                >
                  Kayıt
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

