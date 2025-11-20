"use client";

import { useState, useEffect } from "react";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

type LandingStats = {
  members: number;
  workouts: number;
  meals: number;
  avgDailySteps: number;
  streaks: number;
};

export default function StatsSection({ initialStats }: { initialStats: LandingStats }) {
  const [stats, setStats] = useState<LandingStats>(initialStats);
  const [isUpdating, setIsUpdating] = useState(false);

  // Her istatistik için animasyonlu sayılar
  const animatedMembers = useAnimatedNumber(stats.members, { duration: 1000 });
  const animatedWorkouts = useAnimatedNumber(stats.workouts, { duration: 1000 });
  const animatedMeals = useAnimatedNumber(stats.meals, { duration: 1000 });
  const animatedAvgSteps = useAnimatedNumber(stats.avgDailySteps, { duration: 1000 });
  const animatedStreaks = useAnimatedNumber(stats.streaks, { duration: 1000 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsUpdating(true);
        const response = await fetch("/api/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Stats fetch error:", error);
      } finally {
        setIsUpdating(false);
      }
    };

    // İlk yüklemeden sonra 30 saniyede bir güncelle
    const interval = setInterval(fetchStats, 30000);
    
    // Component mount olduğunda hemen bir kez daha güncelle (5 saniye sonra)
    const timeout = setTimeout(fetchStats, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const statItems = [
    { label: "Aktif Üye", value: animatedMembers, suffix: "+", accent: "from-primary-500/20" },
    { label: "Kaydedilen Egzersiz", value: animatedWorkouts, suffix: "", accent: "from-fitness-orange/20" },
    { label: "Takip Edilen Öğün", value: animatedMeals, suffix: "", accent: "from-fitness-purple/20" },
    { label: "Ortalama Günlük Adım", value: animatedAvgSteps, suffix: "", accent: "from-fitness-blue/20" },
    { label: "Aktif Seriler", value: animatedStreaks, suffix: "", accent: "from-primary-500/20" },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="group relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg overflow-hidden shadow-[0_15px_45px_rgba(3,4,12,0.45)]"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-105`} />
          <div className="relative space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-sm uppercase tracking-wide">{item.label}</p>
              {isUpdating && item.label === "Aktif Üye" && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
                </span>
              )}
            </div>
            <p className="text-3xl font-semibold text-white">
              {item.value.toLocaleString("tr-TR")}
              <span className="text-primary-400">{item.suffix}</span>
            </p>
            {item.label === "Aktif Üye" && (
              <p className="text-xs text-primary-300/80 font-medium">Gerçek Zamanlı</p>
            )}
            <div className="h-1 w-full rounded-full bg-gray-800/80">
              <div
                className="h-full rounded-full bg-[linear-gradient(120deg,#7c3aed,#f97316,#06b6d4)] animate-gradient transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(100, item.value / 150)}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

