import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

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

      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Like feature request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

