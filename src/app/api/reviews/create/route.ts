import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { analyzeReviewSentiment } from "@/lib/ai/sentiment-analyzer";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseRouteClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { rating, comment } = body;

    if (!rating || !comment || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // AI ile sentiment analizi yap
    let sentimentScore: number | null = null;
    try {
      const sentimentResult = await analyzeReviewSentiment(comment, rating);
      sentimentScore = sentimentResult.score;
    } catch (error) {
      console.error("Sentiment analysis error:", error);
      // Sentiment analizi başarısız olsa bile yorumu kaydet
    }

    // Yorumu kaydet
    const { data: review, error: reviewError } = await supabase
      .from("user_reviews")
      .insert({
        user_id: user.id,
        rating,
        comment: comment.trim(),
        ai_sentiment_score: sentimentScore,
        is_featured: false, // Admin tarafından manuel olarak featured yapılabilir
      })
      .select()
      .single();

    if (reviewError) {
      console.error("Review creation error:", reviewError);
      return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
    }

    // Eğer sentiment score yüksekse (0.7+) ve featured değilse, otomatik olarak featured yap
    if (sentimentScore && sentimentScore >= 0.7 && !review.is_featured) {
      try {
        await (supabaseAdmin as any)
          .from("user_reviews")
          .update({ is_featured: true })
          .eq("id", review.id);
      } catch (updateError) {
        console.error("Failed to update review as featured:", updateError);
      }
    }

    return NextResponse.json({ review: { ...review, ai_sentiment_score: sentimentScore } });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

