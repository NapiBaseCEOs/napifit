import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FALLBACK_REVIEWS = [
  {
    id: "fallback-1",
    userName: "Ayşe K.",
    rating: 5,
    comment: "NapiFit sayesinde beslenme düzenimi oturttum, AI önerileri harika.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "fallback-2",
    userName: "Mehmet D.",
    rating: 5,
    comment: "Su hatırlatmaları ve sağlık formları sayesinde disipline oldum.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "fallback-3",
    userName: "Selin A.",
    rating: 4,
    comment: "Topluluk motivasyonu müthiş, dashboard candır.",
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    // En yüksek AI sentiment score'a sahip ve featured olan yorumları al
    const { data: reviews, error } = await supabaseAdmin
      .from("user_reviews")
      .select(
        `
        id,
        rating,
        comment,
        created_at,
        profiles!inner(full_name)
      `
      )
      .eq("is_featured", true)
      .order("ai_sentiment_score", { ascending: false })
      .limit(6);

    if (error) {
      if ((error as any)?.code === "PGRST205") {
        console.warn("user_reviews table missing, serving fallback testimonials.");
        return NextResponse.json({ reviews: FALLBACK_REVIEWS });
      }
      console.error("Reviews fetch error:", error);
      return NextResponse.json({ reviews: FALLBACK_REVIEWS });
    }

    const formattedReviews =
      reviews?.map((review: any) => ({
        id: review.id,
        userName: review.profiles?.full_name || "Kullanıcı",
        rating: review.rating,
        comment: review.comment,
        createdAt: review.created_at,
      })) || [];

    if (formattedReviews.length === 0) {
      return NextResponse.json({ reviews: FALLBACK_REVIEWS });
    }

    return NextResponse.json({ reviews: formattedReviews });
  } catch (error) {
    console.error("Reviews API error:", error);
    return NextResponse.json({ reviews: FALLBACK_REVIEWS });
  }
}

