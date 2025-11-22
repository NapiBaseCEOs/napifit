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

    // TODO: notifications tablosu oluşturulduğunda gerçek okunma durumunu kaydet
    // params.id kullanılacak: await markNotificationAsRead(params.id, user.id);
    // Şimdilik sadece başarılı response döndür
    return NextResponse.json({ success: true, notificationId: params.id });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

