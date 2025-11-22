"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type FeatureRequest = {
  id: string;
  title: string;
  likeCount: number;
  isImplemented: boolean;
  createdAt: string;
  deletedAt?: string | null;
  deletedReason?: string | null;
};

interface CommunityStatsProps {
  userId: string;
  currentUserId?: string; // Mevcut kullanıcı ID'si (sahiplik kontrolü için)
  isAdmin?: boolean; // Admin kontrolü için
}

export default function CommunityStats({ userId, currentUserId, isAdmin = false }: CommunityStatsProps) {
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/feature-requests/user/${userId}?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Failed to fetch community stats:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sayfa görünür olduğunda (örneğin başka bir tab'dan dönüldüğünde) refresh et
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData();
      }
    };

    const handleFocus = () => {
      fetchData();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    // Custom event dinle (aynı tab'da öneri oluşturulduğunda)
    const handleFeatureRequestCreated = () => {
      console.log('[CommunityStats] Feature request created event received, refreshing...');
      fetchData();
    };

    window.addEventListener('feature-request-created', handleFeatureRequestCreated);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('feature-request-created', handleFeatureRequestCreated);
    };
  }, [fetchData]);

  // Aynı başlığa sahip tekrar eden kayıtları filtrele (örn: su hatırlatıcısı migrasyonları)
  const dedupeByTitle = (items: FeatureRequest[]) => {
    const map = new Map<string, FeatureRequest>();
    for (const item of items) {
      const key = item.title.trim().toLowerCase();
      if (!map.has(key)) {
        map.set(key, item);
      }
    }
    return Array.from(map.values());
  };

  const uniqueRequests = dedupeByTitle(requests);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6">
        <p className="text-gray-400 text-sm">Yükleniyor...</p>
      </div>
    );
  }

  const activeRequests = uniqueRequests.filter((req) => !req.deletedAt);
  const implementedCount = activeRequests.filter((req) => req.isImplemented).length;

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
          <p className="mt-2 text-2xl font-semibold text-white">{activeRequests.length}</p>
        </div>
        <div className="rounded-lg border border-gray-800/60 bg-gray-900/50 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">Uygulanan</p>
          <p className="mt-2 text-2xl font-semibold text-green-400">{implementedCount}</p>
        </div>
      </div>

      {uniqueRequests.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Son Öneriler</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {uniqueRequests.slice(0, 5).map((request) => {
              const content = (
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-white line-clamp-1">
                    {request.deletedAt ? "Öneri silindi" : request.title}
                  </p>
                  {!request.deletedAt && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {request.isImplemented && (
                        <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                          ✓
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{request.likeCount} beğeni</span>
                    </div>
                  )}
                </div>
              );

              if (request.deletedAt) {
                return (
                  <div
                    key={request.id}
                    className="block rounded-lg border border-gray-800/60 bg-gray-800/30 p-3 text-gray-400 text-sm"
                  >
                    {content}
                    <p className="mt-1 text-xs text-gray-500">
                      {request.deletedReason || "Bu öneri moderasyon tarafından kaldırıldı."}
                    </p>
                  </div>
                );
              }

              const isOwner = currentUserId && currentUserId === userId;
              const canDeleteOwn = isOwner && request.likeCount === 0;
              const canDelete = isAdmin || canDeleteOwn;
              
              return (
                <div
                  key={request.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-gray-800/60 bg-gray-800/30 p-3 hover:border-primary-500/30 transition-all"
                >
                  <Link href="/community" className="flex-1">
                    {content}
                  </Link>
                  {canDelete && (
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const message = isAdmin
                          ? "Bu öneriyi silmek istediğine emin misin?"
                          : "Bu öneri hiç beğeni almadığı için silebilirsin. Silmek istediğine emin misin?";
                        const confirmed = window.confirm(message);
                        if (!confirmed) return;
                        
                        try {
                          const response = await fetch(`/api/feature-requests/${request.id}`, {
                            method: "DELETE",
                          });
                          if (response.ok) {
                            // Öneriyi listeden kaldır
                            setRequests((prev) => prev.filter((r) => r.id !== request.id));
                            // Event gönder (diğer component'ler güncellensin)
                            window.dispatchEvent(new CustomEvent('feature-request-created'));
                          } else {
                            const data = await response.json().catch(() => ({}));
                            alert(data.error || "Silme işlemi başarısız");
                          }
                        } catch (error) {
                          console.error("Delete request failed:", error);
                          alert("Silme işlemi sırasında hata oluştu");
                        }
                      }}
                      className="flex-shrink-0 rounded-lg border border-red-500/40 bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-300 hover:bg-red-500/20 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      title="Öneriyi sil"
                    >
                      Sil
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

