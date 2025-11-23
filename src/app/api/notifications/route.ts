import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail, isFounderEmail } from "@/config/admins";

export const dynamic = "force-dynamic";

// Bildirimleri getir
export async function GET() {
  try {
    const supabase = createSupabaseRouteClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ notifications: [], unreadCount: 0 });
    }

    const userId = user.id;

    const assistantNotifications = await fetchAssistantNotifications(supabase, userId);

    // 1. Admin/Kurucu beğenisi bildirimleri (feature_request_likes tablosundan)
    const { data: userRequests } = await supabaseAdmin
      .from("feature_requests")
      .select("id, title, created_at")
      .eq("user_id", userId)
      .is("deleted_at", null);

    const adminLikeNotifications: any[] = [];
    
    if (userRequests && userRequests.length > 0) {
      const requestsData = userRequests as Array<{ id: string; title: string; created_at: string }>;
      const requestIds = requestsData.map((r) => r.id);
      
      // Son 7 gün içindeki beğenileri kontrol et
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: recentLikes } = await supabaseAdmin
        .from("feature_request_likes")
        .select("feature_request_id, user_id, created_at")
        .in("feature_request_id", requestIds)
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("created_at", { ascending: false })
        .limit(20);

      if (recentLikes && recentLikes.length > 0) {
        // Admin/kurucu beğenilerini filtrele
        const likesData = recentLikes as Array<{ feature_request_id: string; user_id: string; created_at: string }>;
        for (const like of likesData) {
          try {
            const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(like.user_id);
            if (authUser?.user?.email) {
              const isFounder = isFounderEmail(authUser.user.email);
              const isAdmin = isAdminEmail(authUser.user.email);
              
              if (isFounder || isAdmin) {
                const request = requestsData.find((r) => r.id === like.feature_request_id);
                if (request) {
                  adminLikeNotifications.push({
                    id: `admin-like-${like.feature_request_id}-${like.user_id}`,
                    type: isFounder ? "founder_like" : "admin_like",
                    title: isFounder
                      ? "👑 Kurucu Önerinizi Beğendi!"
                      : "⭐ Admin Önerinizi Beğendi!",
                    message: isFounder
                      ? `"${request.title}" öneriniz kurucu tarafından beğenildi! Harika bir fikir, tebrikler! 🎉`
                      : `"${request.title}" öneriniz admin tarafından beğenildi! Güzel bir öneri, tebrikler! ✨`,
                    icon: isFounder ? "👑" : "⭐",
                    color: isFounder
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-blue-500/20 text-blue-400",
                    link: `/community`,
                    read: true,
                    createdAt: like.created_at,
                  });
                }
              }
            }
          } catch {
            // Kullanıcı bulunamadı, devam et
          }
        }
      }
    }

    // 2. Uygulanan özellikler bildirimleri
    const { data: implementedRequests } = await supabaseAdmin
      .from("feature_requests")
      .select("id, title, implemented_at, implemented_version")
      .eq("user_id", userId)
      .eq("is_implemented", true)
      .not("implemented_at", "is", null)
      .gte("implemented_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order("implemented_at", { ascending: false })
      .limit(5);

    const implementedNotifications: any[] = [];
    if (implementedRequests) {
      const requestsData = implementedRequests as Array<{
        id: string;
        title: string;
        implemented_at: string;
        implemented_version: string | null;
      }>;
      for (const request of requestsData) {
        implementedNotifications.push({
          id: `implemented-${request.id}`,
          type: "feature_implemented",
          title: "🚀 Öneriniz Uygulandı!",
          message: `"${request.title}" öneriniz v${request.implemented_version} sürümünde uygulandı! Teşekkürler! 🎊`,
          icon: "🚀",
          color: "bg-green-500/20 text-green-400",
          link: `/community`,
          read: true,
          createdAt: request.implemented_at || new Date().toISOString(),
        });
      }
    }

    // Tüm bildirimleri birleştir ve sırala
    const staticNotifications = [...adminLikeNotifications, ...implementedNotifications];
    const allNotifications = [...assistantNotifications, ...staticNotifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const unreadCount = assistantNotifications.filter((n) => !n.read).length;

    return NextResponse.json({
      notifications: allNotifications.slice(0, 20), // Son 20 bildirim
      unreadCount,
    });
  } catch (error) {
    console.error("Notifications API error:", error);
    return NextResponse.json({ notifications: [], unreadCount: 0 }, { status: 500 });
  }
}

async function fetchAssistantNotifications(supabase: ReturnType<typeof createSupabaseRouteClient>, userId: string) {
  const { data, error } = await supabase
    .from("assistant_notifications")
    .select("id, title, message, type, link, metadata, read_at, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Assistant notifications fetch error:", error);
    return [];
  }

  return (data || []).map((row) => {
    const isProactive = row.type === "assistant_proactive";
    return {
      id: row.id,
      type: row.type,
      title: row.title || (isProactive ? "💡 AI Hatırlatıcısı" : "🤖 AI Asistanı"),
      message: row.message,
      icon: isProactive ? "💡" : "🤖",
      color: isProactive ? "bg-blue-500/20 text-blue-300" : "bg-purple-500/20 text-purple-300",
      link: row.link || "/health",
      read: Boolean(row.read_at),
      createdAt: row.created_at,
    };
  });
}

