"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <main className="relative min-h-screen px-4 py-16 sm:px-6 lg:px-8 overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-red-500/15 via-orange-500/15 to-transparent blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-red-500/15 via-orange-500/15 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <div className="rounded-3xl border border-red-500/30 bg-gray-900/90 backdrop-blur-xl p-8 shadow-2xl">
          <div className="mb-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
              <svg
                className="h-8 w-8 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          <h1 className="mb-4 text-3xl font-bold text-white">
            Bir hata oluştu
          </h1>

          <p className="mb-6 text-lg text-gray-400">
            Dashboard yüklenirken beklenmeyen bir hata oluştu.
            {error.digest && (
              <span className="mt-2 block text-sm text-gray-500">
                Hata ID: {error.digest}
              </span>
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 transition-colors"
            >
              Tekrar Dene
            </button>
            <Link
              href="/"
              className="rounded-xl border border-gray-700 bg-gray-800/50 px-6 py-3 font-semibold text-white hover:bg-gray-800 transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-gray-700 bg-gray-800/50 px-6 py-3 font-semibold text-white hover:bg-gray-800 transition-colors"
            >
              Giriş Yap
            </Link>
          </div>

          {process.env.NODE_ENV === "development" && (
            <details className="mt-8 text-left">
              <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300">
                Hata Detayları (Sadece Geliştirme)
              </summary>
              <pre className="mt-4 overflow-auto rounded-lg bg-gray-900/50 p-4 text-xs text-red-400">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
        </div>
      </div>
    </main>
  );
}

