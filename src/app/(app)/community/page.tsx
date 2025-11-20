"use client";

import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import type { Database } from "@/lib/supabase/types";
import FeatureRequestCard from "@/components/community/FeatureRequestCard";
import LeaderboardCard from "@/components/community/LeaderboardCard";

type FeatureRequest = {
  id: string;
  title: string;
  description: string;
  likeCount: number;
  isLiked: boolean;
  isImplemented: boolean;
  implementedAt: string | null;
  implementedVersion: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
    joinedAt: string;
    showStats: boolean;
  };
};

type LeaderboardEntry = {
  userId: string;
  name: string;
  avatar: string | null;
  implementedCount: number;
  joinedAt: string;
  showStats: boolean;
};

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

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    fetchUser();
  }, [supabase]);

  useEffect(() => {
    fetchRequests();
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/feature-requests?sort=${sortBy}&limit=50`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/feature-requests/leaderboard");
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    }
  };

  const handleLike = async (id: string) => {
    const response = await fetch(`/api/feature-requests/${id}/like`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to like");
    }

    // Refresh requests
    fetchRequests();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim() || !formDescription.trim()) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/feature-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle.trim(),
          description: formDescription.trim(),
        }),
      });

      if (response.ok) {
        setFormTitle("");
        setFormDescription("");
        setShowForm(false);
        fetchRequests();
      } else {
        const data = await response.json();
        alert(data.error || "Öneri oluşturulamadı");
      }
    } catch (error) {
      console.error("Failed to create request:", error);
      alert("Öneri oluşturulamadı");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 bg-[#03060f]">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Topluluk</h1>
            <p className="mt-1 text-sm text-gray-400">Özellik önerileri ve topluluk liderlik tablosu</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={!currentUserId}
            className="rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/50 hover:shadow-primary-500/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {showForm ? "İptal" : "+ Öner"}
          </button>
        </div>

        {/* Submit Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6 backdrop-blur-lg">
            <h3 className="mb-4 text-lg font-semibold text-white">Yeni Özellik Öner</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Başlık</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Örnek: Karanlık tema desteği"
                  maxLength={200}
                  required
                  className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Açıklama</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Özelliğin detaylarını açıklayın..."
                  rows={5}
                  maxLength={2000}
                  required
                  className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">{formDescription.length}/2000</p>
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
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("likes")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  sortBy === "likes"
                    ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                    : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-primary-500/30"
                }`}
              >
                En Beğenilenler
              </button>
              <button
                onClick={() => setSortBy("newest")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  sortBy === "newest"
                    ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                    : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-primary-500/30"
                }`}
              >
                En Yeni
              </button>
              <button
                onClick={() => setSortBy("implemented")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  sortBy === "implemented"
                    ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                    : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-primary-500/30"
                }`}
              >
                Uygulananlar
              </button>
            </div>

            {/* Requests */}
            {loading ? (
              <div className="text-center text-gray-400 py-8">Yükleniyor...</div>
            ) : requests.length === 0 ? (
              <div className="rounded-2xl border border-gray-800/60 bg-gray-900/80 p-8 text-center">
                <p className="text-gray-400">Henüz öneri yok</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <FeatureRequestCard
                    key={request.id}
                    request={request}
                    onLike={handleLike}
                    currentUserId={currentUserId || undefined}
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

