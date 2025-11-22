"use client";

import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import type { Database } from "@/lib/supabase/types";
import FeatureRequestCard from "@/components/community/FeatureRequestCard";
import LeaderboardCard from "@/components/community/LeaderboardCard";
import { isAdminEmail } from "@/config/admins";
import {
  getWaterPlaceholderFeatureResponse,
  getWaterPlaceholderLeaderboardEntry,
} from "@/lib/community/water-reminder";

type FeatureRequest = {
  id: string;
  title: string;
  description: string;
  likeCount: number;
  dislikeCount: number;
  isLiked: boolean;
  isDisliked: boolean;
  isImplemented: boolean;
  implementedAt: string | null;
  implementedVersion: string | null;
  createdAt: string;
  deletedAt?: string | null;
  deletedReason?: string | null;
  likedByFounder?: boolean;
  likedByAdmin?: boolean;
  user: {
    id: string;
    name: string;
    avatar: string | null;
    joinedAt: string;
    showStats: boolean;
    showPublicProfile: boolean;
  };
};

type LeaderboardEntry = {
  userId: string;
  name: string;
  avatar: string | null;
  implementedCount: number;
  joinedAt: string;
  showStats: boolean;
  showPublicProfile: boolean;
};

const defaultWaterRequest = getWaterPlaceholderFeatureResponse() as FeatureRequest;
const defaultLeaderboardEntry = getWaterPlaceholderLeaderboardEntry() as LeaderboardEntry;

const withFallbackRequests = (items: FeatureRequest[]) =>
  items.length > 0 ? items : [defaultWaterRequest];

const withFallbackLeaderboard = (items: LeaderboardEntry[]) =>
  items.length > 0 ? items : [defaultLeaderboardEntry];

export default function CommunityPage() {
  const supabase = useSupabaseClient<Database>();
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"likes" | "newest" | "implemented">("likes");
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
      setCurrentUserEmail(user?.email ?? null);
    };
    fetchUser();
  }, [supabase]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchRequests(), fetchLeaderboard()]);
      } catch (error) {
        console.error("Failed to load community data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const isAdmin = isAdminEmail(currentUserEmail ?? undefined);
  const sortOptions: { id: typeof sortBy; label: string; emoji: string }[] = [
    { id: "likes", label: "En Beğenilenler", emoji: "💚" },
    { id: "newest", label: "En Yeni", emoji: "🆕" },
    { id: "implemented", label: "Uygulananlar", emoji: "🚀" },
  ];

  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/feature-requests?sort=${sortBy}&limit=50`, {
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        const incoming = (data.requests as FeatureRequest[] | undefined) ?? [];
        setRequests(withFallbackRequests(incoming));
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch requests:", {
          status: response.status,
          error: errorData.error || response.statusText,
        });
        setRequests([defaultWaterRequest]);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      setRequests([defaultWaterRequest]);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    try {
      const response = await fetch(`/api/feature-requests/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Silme işlemi başarısız");
      }
      await fetchRequests();
    } catch (error) {
      console.error("Failed to delete feature request:", error);
      alert(error instanceof Error ? error.message : "Silme işlemi başarısız");
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/feature-requests/leaderboard", {
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        const incoming = (data.leaderboard as LeaderboardEntry[] | undefined) ?? [];
        setLeaderboard(withFallbackLeaderboard(incoming));
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch leaderboard:", {
          status: response.status,
          error: errorData.error || response.statusText,
        });
        setLeaderboard([defaultLeaderboardEntry]);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      setLeaderboard([defaultLeaderboardEntry]);
    }
  };

  const handleLike = async (id: string) => {
    try {
      const response = await fetch(`/api/feature-requests/${id}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to like");
      }

      const data = await response.json();
      
      // Admin/kurucu beğendiğinde bildirim göster (eğer öneri sahibi isek)
      if (data.liked && (data.isAdmin || data.isFounder)) {
        const request = requests.find(r => r.id === id);
        if (request && currentUserId === request.user.id) {
          // Browser notification göster
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(
              data.isFounder ? "👑 Kurucu Önerinizi Beğendi!" : "⭐ Admin Önerinizi Beğendi!",
              {
                body: data.isFounder
                  ? "🎉 Kurucu önerinizi beğendi! Harika bir fikir, tebrikler!"
                  : "⭐ Admin önerinizi beğendi! Güzel bir öneri, tebrikler!",
                icon: "/icon-192.png",
                badge: "/icon-192.png",
                tag: `admin-like-${id}`,
              }
            );
          }
        }
      }

      // Refresh requests
      await fetchRequests();
    } catch (error) {
      console.error("Failed to like request:", error);
      throw error; // Re-throw so FeatureRequestCard can handle it
    }
  };

  const handleDislike = async (id: string) => {
    try {
      const response = await fetch(`/api/feature-requests/${id}/dislike`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to dislike");
      }

      // Refresh requests
      await fetchRequests();
    } catch (error) {
      console.error("Failed to dislike request:", error);
      throw error; // Re-throw so FeatureRequestCard can handle it
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Frontend validasyonu
    const title = formTitle.trim();
    const description = formDescription.trim();

    if (!title || !description) {
      setError("Başlık ve açıklama zorunludur");
      return;
    }

    if (title.length < 3) {
      setError("Başlık en az 3 karakter olmalıdır");
      return;
    }

    if (title.length > 200) {
      setError("Başlık en fazla 200 karakter olabilir");
      return;
    }

    if (description.length < 10) {
      setError("Açıklama en az 10 karakter olmalıdır");
      return;
    }

    if (description.length > 2000) {
      setError("Açıklama en fazla 2000 karakter olabilir");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/feature-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (response.ok) {
        setFormTitle("");
        setFormDescription("");
        setShowForm(false);
        setError(null);
        await fetchRequests();
        // Profil sayfasını refresh etmek için custom event gönder
        // Kısa bir delay ekle (API'nin commit olması için)
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            console.log('[CommunityPage] Dispatching feature-request-created event');
            window.dispatchEvent(new CustomEvent('feature-request-created', { 
              bubbles: true,
              cancelable: true 
            }));
          }
        }, 500);
      } else {
        const data = await response.json().catch(() => ({}));
        // API'den gelen hata mesajını kullan, yoksa genel mesaj
        let errorMessage = "Öneri oluşturulamadı";
        if (data.error) {
          errorMessage = data.error;
        } else if (data.details && Array.isArray(data.details) && data.details.length > 0) {
          errorMessage = data.details[0].message || data.details[0].path?.[0] + " " + (data.details[0].message || "");
        }
        setError(errorMessage);
        console.error("Feature request creation failed:", data);
      }
    } catch (error) {
      console.error("Failed to create request:", error);
      setError("Öneri oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 bg-[#03060f]">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-primary-500/20 bg-gradient-to-br from-gray-900/90 via-primary-900/10 to-fitness-orange/10 p-6 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary-200">Topluluk Ateş Hattı</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Fikrini paylaş, ürünü şekillendir ✨</h1>
              <p className="mt-2 text-sm text-gray-300 max-w-2xl">
                En çok oylanan önerileri ürün yol haritasına taşıyoruz. Bir espri, bir emoji, bir fikir… hepsi burada değerli.
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              disabled={!currentUserId}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/50 hover:shadow-primary-500/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showForm ? "Formu Kapat ✖" : "Yeni Öneri Yaz 💡"}
            </button>
          </div>
        </div>

        {/* Submit Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6 backdrop-blur-lg">
            <h3 className="mb-4 text-lg font-semibold text-white">Yeni Özellik Öner</h3>
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Başlık</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => {
                    setFormTitle(e.target.value);
                    setError(null);
                  }}
                  placeholder="Örnek: Karanlık tema desteği"
                  maxLength={200}
                  required
                  minLength={3}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formTitle.length}/200 {formTitle.length < 3 && formTitle.length > 0 && "(En az 3 karakter)"}
                </p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Açıklama</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => {
                    setFormDescription(e.target.value);
                    setError(null);
                  }}
                  placeholder="Özelliğin detaylarını açıklayın..."
                  rows={5}
                  maxLength={2000}
                  required
                  minLength={10}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formDescription.length}/2000 {formDescription.length < 10 && formDescription.length > 0 && "(En az 10 karakter)"}
                </p>
              </div>
              <button
                type="submit"
                disabled={submitting || !formTitle.trim() || !formDescription.trim()}
                className="w-full rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/50 hover:shadow-primary-500/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Gönderiliyor..." : "Öner"}
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Requests List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Sort Buttons */}
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-all ${
                    sortBy === option.id
                      ? "bg-primary-500/20 text-primary-300 border border-primary-500/40 shadow-inner shadow-primary-500/20"
                      : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-primary-500/30"
                  }`}
                >
                  <span>{option.emoji}</span>
                  {option.label}
                </button>
              ))}
            </div>

            {/* Requests */}
            {loading ? (
              <div className="rounded-2xl border border-gray-800/60 bg-gray-900/80 p-8 text-center text-gray-400">
                Yükleniyor...
              </div>
            ) : requests.length === 0 ? (
              <div className="rounded-2xl border border-primary-500/20 bg-primary-500/5 p-8 text-center space-y-3">
                <p className="text-lg text-white">İlk fikir senden gelsin! 🚀</p>
                <p className="text-sm text-primary-100">
                  “Su hatırlatıcısı” gibi harika bir özellik bile tek bir topluluk üyesinin fikriydi.
                </p>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-500/40 bg-primary-500/20 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-500/30"
                  >
                    Fikrimi Paylaşayım 💬
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <FeatureRequestCard
                    key={request.id}
                    request={request}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    currentUserId={currentUserId || undefined}
                    isAdmin={isAdmin}
                    onDelete={handleDeleteRequest}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <LeaderboardCard leaderboard={leaderboard} />
          </div>
        </div>
      </div>
    </main>
  );
}

