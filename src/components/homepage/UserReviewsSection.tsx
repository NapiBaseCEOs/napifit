"use client";

import { useState, useEffect } from "react";

type UserReview = {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export default function UserReviewsSection() {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews/featured");
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
        }
      } catch (error) {
        console.error("Reviews fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
    
    // Her 30 saniyede bir güncelle
    const interval = setInterval(fetchReviews, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="text-center text-gray-400">Yorumlar yükleniyor...</div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null; // Yorum yoksa bölümü gösterme
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-[0_20px_80px_rgba(3,4,12,0.45)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2">Kullanıcı Yorumları</h2>
          <p className="text-gray-400">Gerçek kullanıcılarımızın deneyimleri</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
          </span>
          <span className="text-xs text-primary-300 font-medium">Gerçek Zamanlı</span>
        </div>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.slice(0, 6).map((review) => (
          <div
            key={review.id}
            className="rounded-2xl border border-white/10 bg-[#0b1325]/80 p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500/20 to-transparent flex items-center justify-center text-primary-300 font-semibold">
                  {review.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{review.userName}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < review.rating ? "text-yellow-400" : "text-gray-600"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">"{review.comment}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}

