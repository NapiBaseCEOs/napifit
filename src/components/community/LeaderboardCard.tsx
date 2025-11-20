"use client";

import Image from "next/image";
import Link from "next/link";

type LeaderboardEntry = {
  userId: string;
  name: string;
  avatar: string | null;
  implementedCount: number;
  joinedAt: string;
  showStats: boolean;
};

interface LeaderboardCardProps {
  leaderboard: LeaderboardEntry[];
}

export default function LeaderboardCard({ leaderboard }: LeaderboardCardProps) {
  if (leaderboard.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6 backdrop-blur-lg">
        <h3 className="mb-4 text-lg font-semibold text-white">Yılın Adamı 🏆</h3>
        <p className="text-sm text-gray-400">Henüz uygulanmış öneri yok</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6 backdrop-blur-lg">
      <h3 className="mb-4 text-lg font-semibold text-white">Yılın Adamı 🏆</h3>
      <div className="space-y-3">
        {leaderboard.slice(0, 10).map((entry, index) => (
          <Link
            key={entry.userId}
            href={`/profile?userId=${entry.userId}`}
            className="flex items-center gap-3 rounded-lg border border-gray-800/60 bg-gray-800/30 p-3 transition-all hover:border-primary-500/30 hover:bg-gray-800/50"
          >
            {/* Rank */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-fitness-orange text-sm font-bold text-white">
              {index === 0 ? "👑" : index + 1}
            </div>

            {/* Avatar */}
            {entry.avatar ? (
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image src={entry.avatar} alt={entry.name} fill className="object-cover" unoptimized />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-sm font-semibold text-white">
                {entry.name[0].toUpperCase()}
              </div>
            )}

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{entry.name}</span>
                {index === 0 && <span className="text-lg">👑</span>}
              </div>
              {entry.showStats && (
                <p className="text-xs text-gray-400">
                  {entry.implementedCount} öneri uygulandı • {new Date(entry.joinedAt).toLocaleDateString("tr-TR", { year: "numeric", month: "short" })}
                </p>
              )}
            </div>

            {/* Count */}
            <div className="rounded-lg bg-primary-500/20 px-3 py-1 text-sm font-semibold text-primary-400">
              {entry.implementedCount}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

