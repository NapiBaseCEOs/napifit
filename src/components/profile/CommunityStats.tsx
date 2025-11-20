"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type FeatureRequest = {
  id: string;
  title: string;
  likeCount: number;
  isImplemented: boolean;
  createdAt: string;
};

interface CommunityStatsProps {
  userId: string;
}

export default function CommunityStats({ userId }: CommunityStatsProps) {
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [implementedCount, setImplementedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/feature-requests/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setRequests(data.requests || []);
          setImplementedCount(data.implementedCount || 0);
        }
      } catch (error) {
        console.error("Failed to fetch community stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6">
        <p className="text-gray-400 text-sm">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Topluluk İstatistikleri</h3>
        <Link
          href="/community"
          className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
        >
          Topluluğa Git →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-800/60 bg-gray-900/50 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">Toplam Öneri</p>
          <p className="mt-2 text-2xl font-semibold text-white">{requests.length}</p>
        </div>
        <div className="rounded-lg border border-gray-800/60 bg-gray-900/50 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">Uygulanan</p>
          <p className="mt-2 text-2xl font-semibold text-green-400">{implementedCount}</p>
        </div>
      </div>

      {requests.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Son Öneriler</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {requests.slice(0, 5).map((request) => (
              <Link
                key={request.id}
                href="/community"
                className="block rounded-lg border border-gray-800/60 bg-gray-800/30 p-3 hover:border-primary-500/30 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-white line-clamp-1">{request.title}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {request.isImplemented && (
                      <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                        ✓
                      </span>
                    )}
                    <span className="text-xs text-gray-400">{request.likeCount} beğeni</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

