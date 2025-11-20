"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type LeaderboardEntry = {
  userId: string;
  name: string;
  avatar: string | null;
  implementedCount: number;
  joinedAt: string;
  showStats: boolean;
};

type FeatureRequest = {
  id: string;
  title: string;
  likeCount: number;
  isImplemented: boolean;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
};

export default function CommunitySection() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [topRequests, setTopRequests] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Leaderboard
        const leaderboardRes = await fetch("/api/feature-requests/leaderboard");
        if (leaderboardRes.ok) {
          const leaderboardData = await leaderboardRes.json();
          setLeaderboard(leaderboardData.leaderboard || []);
        }

        // Top requests
        const requestsRes = await fetch("/api/feature-requests?sort=likes&limit=3");
        if (requestsRes.ok) {
          const requestsData = await requestsRes.json();
          setTopRequests(requestsData.requests || []);
        }
      } catch (error) {
        console.error("Community data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Her 30 saniyede bir güncelle
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="text-center text-gray-400">Topluluk verileri yükleniyor...</div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-[0_20px_80px_rgba(3,4,12,0.45)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2">Topluluk</h2>
          <p className="text-gray-400">Özellik önerileri ve topluluk liderleri</p>
        </div>
        <Link
          href="/community"
          className="rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/50 hover:shadow-primary-500/70 transition-all"
        >
          Topluluğa Git →
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Top Requests */}
        <div className="sm:col-span-2 space-y-3">
          <h3 className="text-lg font-semibold text-white">En Beğenilen Öneriler</h3>
          {topRequests.length === 0 ? (
            <p className="text-sm text-gray-400">Henüz öneri yok</p>
          ) : (
            <div className="space-y-3">
              {topRequests.map((request) => (
                <Link
                  key={request.id}
                  href="/community"
                  className="block rounded-xl border border-gray-800/60 bg-gray-900/50 p-4 hover:border-primary-500/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white mb-1">{request.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{request.likeCount} beğeni</span>
                        {request.isImplemented && (
                          <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-green-400">
                            ✓ Uygulandı
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Yılın Adamı 👑</h3>
          {leaderboard.length === 0 ? (
            <p className="text-sm text-gray-400">Henüz lider yok</p>
          ) : (
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((entry, index) => (
                <Link
                  key={entry.userId}
                  href={`/profile?userId=${entry.userId}`}
                  className="block"
                >
                  <div className="flex items-center gap-3 rounded-lg border border-gray-800/60 bg-gray-900/50 p-3 hover:border-primary-500/30 transition-all">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-fitness-orange text-xs font-bold text-white">
                    {index === 0 ? "👑" : index + 1}
                  </div>
                  {entry.avatar ? (
                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                      <Image src={entry.avatar} alt={entry.name} fill className="object-cover" unoptimized />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-xs font-semibold text-white">
                      {entry.name[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{entry.name}</p>
                    {entry.showStats && (
                      <p className="text-xs text-gray-400">{entry.implementedCount} öneri</p>
                    )}
                  </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

