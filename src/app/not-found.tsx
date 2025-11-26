"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function NotFound() {
  const { t } = useLocale();
  
  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-20 sm:px-6 bg-[#0a0a0a]">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-primary-500/15 via-fitness-orange/15 to-transparent blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-fitness-purple/15 via-fitness-blue/15 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>
      <div className="max-w-xl space-y-6 rounded-3xl border border-gray-800/70 bg-gray-900/70 p-8 text-center shadow-2xl shadow-blue-500/20 backdrop-blur animate-fade-up sm:p-12">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-white">{t("errors.notFound.title")}</h1>
          <p className="text-base leading-relaxed text-gray-300">
            {t("errors.notFound.message")}
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-transform"
        >
          {t("errors.notFound.backHome")}
        </Link>
      </div>
    </main>
  );
}

