import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export const dynamic = "force-dynamic";

// Bildirimi okundu olarak işaretle
export async function POST(_request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createSupabaseRouteClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (params.id) {
      await supabase
        .from("assistant_notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("id", params.id)
        .eq("user_id", user.id);
    }

    return NextResponse.json({ success: true, notificationId: params.id });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

