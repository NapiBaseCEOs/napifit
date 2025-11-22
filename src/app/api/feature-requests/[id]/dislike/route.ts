import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = 'force-dynamic';

// Beğenme veya beğenmeyi kaldır
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

    // Önce beğenmeme var mı kontrol et
    const { data: existingDislike } = await supabase
      .from("feature_request_dislikes")
      .select("id")
      .eq("feature_request_id", featureRequestId)
      .eq("user_id", user.id)
      .single();

    if (existingDislike) {
      // Beğenmeyi kaldır
      const { error } = await supabase
        .from("feature_request_dislikes")
        .delete()
        .eq("feature_request_id", featureRequestId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Undislike error:", error);
        return NextResponse.json({ error: "Failed to undislike" }, { status: 500 });
      }

      await syncDislikeCount(featureRequestId);
      return NextResponse.json({ disliked: false });
    } else {
      // Beğenme
      const { error } = await supabase
        .from("feature_request_dislikes")
        .insert({
          feature_request_id: featureRequestId,
          user_id: user.id,
        });

      if (error) {
        console.error("Dislike error:", error);
        return NextResponse.json({ error: "Failed to dislike" }, { status: 500 });
      }

      await syncDislikeCount(featureRequestId);
      return NextResponse.json({ disliked: true });
    }
  } catch (error) {
    console.error("Dislike feature request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function syncDislikeCount(featureRequestId: string) {
  const { count } = await supabaseAdmin
    .from("feature_request_dislikes")
    .select("id", { count: "exact", head: true })
    .eq("feature_request_id", featureRequestId);

  await (supabaseAdmin.from("feature_requests") as any)
    .update({ dislike_count: count ?? 0 })
    .eq("id", featureRequestId);
}


