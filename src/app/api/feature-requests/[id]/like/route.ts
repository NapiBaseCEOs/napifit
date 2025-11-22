import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = 'force-dynamic';

// Beğen veya beğeniyi kaldır
export async function POST(_request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createSupabaseRouteClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const featureRequestId = params.id;

    const { data: targetRequest } = await supabaseAdmin
      .from("feature_requests")
      .select("deleted_at")
      .eq("id", featureRequestId)
      .maybeSingle();

    if ((targetRequest as { deleted_at: string | null } | null)?.deleted_at) {
      return NextResponse.json({ error: "Feature request not available" }, { status: 410 });
    }

    // Önce beğenme var mı kontrol et
    const { data: existingLike } = await supabase
      .from("feature_request_likes")
      .select("id")
      .eq("feature_request_id", featureRequestId)
      .eq("user_id", user.id)
      .single();

    if (existingLike) {
      // Beğeniyi kaldır
      const { error } = await supabase
        .from("feature_request_likes")
        .delete()
        .eq("feature_request_id", featureRequestId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Unlike error:", error);
        return NextResponse.json({ error: "Failed to unlike" }, { status: 500 });
      }

      await syncLikeCount(featureRequestId);
      return NextResponse.json({ liked: false });
    } else {
      // Beğen
      const { error } = await supabase
        .from("feature_request_likes")
        .insert({
          feature_request_id: featureRequestId,
          user_id: user.id,
        });

      if (error) {
        console.error("Like error:", error);
        return NextResponse.json({ error: "Failed to like" }, { status: 500 });
      }

      await syncLikeCount(featureRequestId);
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Like feature request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function syncLikeCount(featureRequestId: string) {
  const { count } = await supabaseAdmin
    .from("feature_request_likes")
    .select("id", { count: "exact", head: true })
    .eq("feature_request_id", featureRequestId);

  await (supabaseAdmin.from("feature_requests") as any)
    .update({ like_count: count ?? 0 })
    .eq("id", featureRequestId);
}


