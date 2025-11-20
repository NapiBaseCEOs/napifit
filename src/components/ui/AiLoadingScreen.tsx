"use client";

import { useEffect, useMemo, useState } from "react";

type LoadingScreenVariant = "fullscreen" | "overlay";

interface AiLoadingScreenProps {
  title?: string;
  message?: string;
  variant?: LoadingScreenVariant;
  showBackdrop?: boolean;
}

const STATUS_STEPS = [
  "Edge önbellekleri kontrol ediliyor",
  "Supabase oturumu hydrate ediliyor",
  "Inference gateway bağlantısı kuruluyor",
  "Beslenme analiz motoru tetikleniyor",
  "Öneri motoru parametreleri hesaplanıyor",
];

const INSIGHTS = [
  "Supabase Realtime stream'i izleniyor, gecikme < 120ms hedefleniyor.",
  "Inference sonuçları, yerel besin heuristikleriyle birleşik toplam üretiyor.",
  "Gateway'den gelen JSON çıktı, tip güvenliği için Zod ile doğrulanıyor.",
  "Edge node'lar karar mekanizmasını CDN üzerinde önbellekliyor.",
];

export default function AiLoadingScreen({
  title = "Sistem pipeline çalışıyor",
  message = "Telemetri, Supabase session ve inference servisleri senkronize ediliyor...",
  variant = "fullscreen",
  showBackdrop = true,
}: AiLoadingScreenProps) {
  const [progress, setProgress] = useState(18);
  const [statusIndex, setStatusIndex] = useState(0);
  const [insightIndex, setInsightIndex] = useState(0);

  useEffect(() => {
    const progressTimer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 96) {
          return 96;
        }
        const nextChunk = Math.random() * 8;
        return Math.min(prev + nextChunk, 96);
      });
    }, 900);

    const statusTimer = window.setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_STEPS.length);
    }, 2200);

    const insightTimer = window.setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % INSIGHTS.length);
    }, 3600);

    return () => {
      window.clearInterval(progressTimer);
      window.clearInterval(statusTimer);
      window.clearInterval(insightTimer);
    };
  }, []);

  const computedClasses = useMemo(() => {
    if (variant === "fullscreen") {
      return "fixed inset-0 z-[60]";
    }
    return "fixed inset-0 z-[70]";
  }, [variant]);

  const containerBg = showBackdrop ? "bg-slate-950/90 backdrop-blur-2xl" : "";

  return (
    <div className={`${computedClasses} flex min-h-screen w-full items-center justify-center ${containerBg}`}>
      <div className="loading-scanlines absolute inset-0 opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.35),_transparent_55%)] blur-3xl opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(6,182,212,0.35),_transparent_55%)] blur-3xl opacity-70" />
      <div className="loading-grid absolute inset-0 opacity-60" />

      <div className="relative z-10 w-full max-w-lg rounded-[32px] border border-white/10 bg-white/5 p-8 text-center shadow-[0_25px_80px_rgba(5,6,20,0.65)] backdrop-blur-xl">
        <div className="absolute inset-0 rounded-[32px] border border-white/5 opacity-40" />
        <div className="relative flex flex-col items-center gap-6">
          <div className="relative h-28 w-28">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500/15 via-fitness-orange/10 to-cyan-400/15 blur-2xl" />
            <div className="relative z-10 flex h-full w-full items-center justify-center rounded-full border border-white/15 bg-slate-950/70 shadow-inner shadow-black/20">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-400/40 via-fitness-orange/60 to-cyan-400/40 text-2xl">
                🍽️
              </div>
            </div>
            <span className="loading-orbit" />
          </div>

          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.35em] text-primary-200/80">Roboflow Inference</p>
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            <p className="text-sm text-gray-300">{message}</p>
          </div>

          <div className="w-full space-y-3 text-left">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{STATUS_STEPS[statusIndex]}</span>
              <span>%{progress.toFixed(0)}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 via-fitness-orange to-cyan-400 loading-shimmer"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-3 text-left text-sm text-gray-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-gray-400">Supabase Region</p>
              <p className="font-semibold text-white">eu-central-1</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-gray-400">Inference Gateway</p>
              <p className="font-semibold text-white">edge-router-02</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0f1424]/70 p-4 text-left text-sm text-gray-300">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Teknik not</p>
            <p key={insightIndex} className="mt-1 text-sm text-white transition-opacity duration-500">
              {INSIGHTS[insightIndex]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

