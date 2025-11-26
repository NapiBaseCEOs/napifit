import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail, isFounderEmail } from "@/config/admins";

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
    const isAdmin = isAdminEmail(user.email);
    const isFounder = isFounderEmail(user.email);

    // Öneri bilgilerini al (bildirim için)
    const { data: targetRequest } = await supabaseAdmin
      .from("feature_requests")
      .select("deleted_at, user_id, title")
      .eq("id", featureRequestId)
      .maybeSingle();

    if (!targetRequest || (targetRequest as { deleted_at: string | null }).deleted_at) {
      return NextResponse.json({ error: "Feature request not available" }, { status: 410 });
    }

    const requestData = targetRequest as { user_id: string; title: string | null; deleted_at: string | null };

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
      return NextResponse.json({ liked: false, isAdmin, isFounder });
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

      // Admin veya kurucu beğendiğinde bildirim gönder
      if ((isAdmin || isFounder) && requestData.user_id !== user.id) {
        await sendNotificationToOwner(
          requestData.user_id,
          featureRequestId,
          requestData.title || "Öneriniz",
          isFounder
        );
      }

      return NextResponse.json({ liked: true, isAdmin, isFounder });
    }
  } catch (error) {
    console.error("Like feature request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Öneri sahibine bildirim gönder
async function sendNotificationToOwner(
  ownerUserId: string,
  featureRequestId: string,
  featureTitle: string,
  isFounder: boolean
) {
  try {
    // Kullanıcının e-posta adresini al
    const { data: ownerProfile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", ownerUserId)
      .maybeSingle();

    if (!ownerProfile) return;

    // Bildirim kaydı oluştur (gelecekte bildirimler sayfası için)
    // Şimdilik sadece logluyoruz, gerçek bildirim sistemi için notifications tablosu oluşturulabilir
    console.log("Notification sent:", {
      ownerUserId,
      featureRequestId,
      featureTitle,
      isFounder,
      message: isFounder
        ? "🎉 Kurucu önerinizi beğendi! Tebrikler!"
        : "⭐ Admin önerinizi beğendi! Tebrikler!",
    });

    // TODO: Gerçek bildirim sistemi için:
    // - notifications tablosu oluştur
    // - Browser notification gönder (eğer izin varsa)
    // - E-posta gönder (opsiyonel)
  } catch (error) {
    console.error("Failed to send notification:", error);
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


