"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

type RecentWorkout = {
  id: string;
  name: string;
  type: string;
  createdAt: Date;
  userName: string;
  calories?: number | null;
  duration?: number | null;
};

export default function ExperienceGrid({ initialWorkouts }: { initialWorkouts: RecentWorkout[] }) {
  const [workouts, setWorkouts] = useState<RecentWorkout[]>(initialWorkouts);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch("/api/stats");
        if (response.ok) {
          const data = await response.json();
          setWorkouts(
            data.recentWorkouts.map((w: any) => ({
              ...w,
              createdAt: new Date(w.createdAt),
            }))
          );
        }
      } catch (error) {
        console.error("Workouts fetch error:", error);
      }
    };

    // Her 20 saniyede bir güncelle
    const interval = setInterval(fetchWorkouts, 20000);
    
    // İlk yüklemeden 3 saniye sonra güncelle
    const timeout = setTimeout(fetchWorkouts, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

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
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
            </span>
            <span className="text-xs text-primary-300 font-medium">Gerçek Zamanlı</span>
          </div>
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

