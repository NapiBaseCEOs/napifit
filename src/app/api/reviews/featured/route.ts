import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // En yüksek AI sentiment score'a sahip ve featured olan yorumları al
    const { data: reviews, error } = await supabaseAdmin
      .from("user_reviews")
      .select(`
        id,
        rating,
        comment,
        created_at,
        profiles!inner(full_name)
      `)
      .eq("is_featured", true)
      .order("ai_sentiment_score", { ascending: false })
      .limit(6);

    if (error) {
      console.error("Reviews fetch error:", error);
      return NextResponse.json({ reviews: [] });
    }

    const formattedReviews = reviews?.map((review: any) => ({
      id: review.id,
      userName: review.profiles?.full_name || "Kullanıcı",
      rating: review.rating,
      comment: review.comment,
      createdAt: review.created_at,
    })) || [];

    return NextResponse.json({ reviews: formattedReviews });
  } catch (error) {
    console.error("Reviews API error:", error);
    return NextResponse.json({ reviews: [] });
  }
}

