import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export const dynamic = "force-dynamic";

// Tüm bildirimleri okundu olarak işaretle
export async function POST() {
  try {
    const supabase = createSupabaseRouteClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: notifications tablosu oluşturulduğunda gerçek okunma durumunu kaydet
    // Şimdilik sadece başarılı response döndür
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

