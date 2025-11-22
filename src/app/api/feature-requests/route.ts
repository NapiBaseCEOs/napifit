import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ensureWaterSuggestionExists, getWaterPlaceholderFeatureResponse } from "@/lib/community/water-reminder";
import { isAdminEmail, isFounderEmail } from "@/config/admins";

export const dynamic = "force-dynamic";

const createFeatureRequestSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
});

// Özellik önerilerini listele (beğeni sayısına göre sıralı)
export async function GET(request: Request) {
  try {
    await ensureWaterSuggestionExists();
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sort") || "likes"; // "likes" | "newest" | "implemented"
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabaseAdmin
      .from("feature_requests")
      .select(`
        id,
        user_id,
        title,
        description,
        like_count,
        dislike_count,
        is_implemented,
        implemented_at,
        implemented_version,
        created_at,
        updated_at,
        deleted_at,
        deleted_reason,
        profiles(
          id,
          full_name,
          avatar_url,
          show_public_profile,
          show_community_stats,
          created_at
        )
      `)
      .is("deleted_at", null);

    // Sıralama (range'den ÖNCE yapılmalı)
    if (sortBy === "likes") {
      query = query.order("like_count", { ascending: false }).order("created_at", { ascending: false });
    } else if (sortBy === "newest") {
      query = query.order("created_at", { ascending: false });
    } else if (sortBy === "implemented") {
      query = query.eq("is_implemented", true).order("implemented_at", { ascending: false });
    }

    // Range'i sıralamadan SONRA uygula
    query = query.range(offset, offset + limit - 1);

    const { data: requests, error } = await query;

    if (error) {
      console.error("Feature requests fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch feature requests" }, { status: 500 });
    }

    // Kullanıcı beğenilerini ve beğenmemelerini kontrol et
    const supabase = createSupabaseRouteClient();
    const { data: { user } } = await supabase.auth.getUser();
    let userLikes: string[] = [];
    let userDislikes: string[] = [];

    if (user && user.id) {
      const [{ data: likes }, { data: dislikes }] = await Promise.all([
        supabase
          .from("feature_request_likes")
          .select("feature_request_id")
          .eq("user_id", user.id),
        supabase
          .from("feature_request_dislikes")
          .select("feature_request_id")
          .eq("user_id", user.id),
      ]);

      userLikes = likes?.map((l) => l.feature_request_id) || [];
      userDislikes = dislikes?.map((d) => d.feature_request_id) || [];
    }

    // Admin/kurucu beğenilerini kontrol et (OPTİMİZE EDİLDİ - ÇOK DAHA HIZLI)
    // Performans optimizasyonu: Admin/kurucu kontrolünü sadece gerekli durumlarda yap
    const adminLikeMap = new Map<string, { isFounder: boolean; isAdmin: boolean }>();
    
    // Sadece beğeni sayısı > 0 olan öneriler için kontrol yap (performans için)
    const requestsWithLikes = (requests || []).filter((r: any) => (r.like_count ?? 0) > 0);
    
    if (requestsWithLikes.length > 0) {
      const requestIds = requestsWithLikes.map((r: any) => r.id);
      
      // Tüm beğenileri tek sorguda al (daha hızlı)
      const { data: allLikes } = await supabaseAdmin
        .from("feature_request_likes")
        .select("feature_request_id, user_id")
        .in("feature_request_id", requestIds)
        .limit(200); // İlk 200 beğeniyi kontrol et (yeterli)
      
      if (allLikes && allLikes.length > 0) {
        // Tüm beğenen kullanıcı ID'lerini topla
        const userIds = [...new Set((allLikes as Array<{ user_id: string }>).map(l => l.user_id))];
        
        // Admin/kurucu kullanıcı ID'lerini bul (sadece ilk 20 kullanıcıyı kontrol et - performans)
        const adminUserIds = new Set<string>();
        const checkPromises = userIds.slice(0, 20).map(async (userId) => {
          try {
            const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);
            if (authUser?.user?.email) {
              const isFounder = isFounderEmail(authUser.user.email);
              const isAdmin = isAdminEmail(authUser.user.email);
              if (isFounder || isAdmin) {
                adminUserIds.add(userId);
                return { userId, isFounder, isAdmin };
              }
            }
          } catch {
            // Kullanıcı bulunamadı, devam et
          }
          return null;
        });
        
        const results = await Promise.all(checkPromises);
        const adminInfo = new Map<string, { isFounder: boolean; isAdmin: boolean }>();
        for (const result of results) {
          if (result) {
            adminInfo.set(result.userId, { isFounder: result.isFounder, isAdmin: result.isAdmin });
          }
        }
        
        // Admin/kurucu beğenilerini map'e ekle
        for (const like of allLikes as Array<{ feature_request_id: string; user_id: string }>) {
          if (adminInfo.has(like.user_id) && !adminLikeMap.has(like.feature_request_id)) {
            const info = adminInfo.get(like.user_id)!;
            adminLikeMap.set(like.feature_request_id, info);
          }
        }
      }
    }

    let formattedRequests =
      requests?.map((req: any) => {
        const sanitizedLikeCount = Math.max(0, req.like_count ?? 0);
        const sanitizedDislikeCount = Math.max(0, req.dislike_count ?? 0);
        // Profil yoksa default değerler kullan
        const profile = req.profiles || {
          id: req.user_id,
          full_name: null,
          avatar_url: null,
          show_public_profile: true,
          show_community_stats: true,
          created_at: req.created_at,
        };

        const adminLike = adminLikeMap.get(req.id);
        
        return {
          id: req.id,
          title: req.title,
          description: req.description,
          likeCount: sanitizedLikeCount,
          dislikeCount: sanitizedDislikeCount,
          isLiked: user ? userLikes.includes(req.id) : false,
          isDisliked: user ? userDislikes.includes(req.id) : false,
          isImplemented: req.is_implemented,
          implementedAt: req.implemented_at,
          implementedVersion: req.implemented_version,
          createdAt: req.created_at,
          deletedAt: req.deleted_at,
          deletedReason: req.deleted_reason,
          likedByFounder: adminLike?.isFounder ?? false,
          likedByAdmin: adminLike?.isAdmin ?? false,
          user: {
            id: profile.id,
            name: profile.show_public_profile ? (profile.full_name || "Kullanıcı") : "Gizli Kullanıcı",
            avatar: profile.show_public_profile ? profile.avatar_url : null,
            joinedAt: profile.created_at,
            showStats: profile.show_community_stats ?? true,
            showPublicProfile: profile.show_public_profile ?? true,
          },
        };
      }) || [];

    if (formattedRequests.length === 0) {
      formattedRequests = [getWaterPlaceholderFeatureResponse()];
    }

    return NextResponse.json({ requests: formattedRequests });
  } catch (error) {
    console.error("Feature requests API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Yeni özellik önerisi oluştur
export async function POST(request: Request) {
  // request kullanılıyor - request.json() ile
  try {
    const supabase = createSupabaseRouteClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createFeatureRequestSchema.parse(body);

    const { data: featureRequest, error } = await supabase
      .from("feature_requests")
      .insert({
        user_id: user.id,
        title: parsed.title.trim(),
        description: parsed.description.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error("Feature request creation error:", error);
      // Daha detaylı hata mesajı
      const errorMessage = error.message || "Failed to create feature request";
      return NextResponse.json({ 
        error: errorMessage,
        code: error.code,
        details: error.details 
      }, { status: 500 });
    }

    if (!featureRequest) {
      return NextResponse.json({ error: "Feature request created but not returned" }, { status: 500 });
    }

    return NextResponse.json({ request: featureRequest });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      const errorMessage = firstError?.message || "Invalid input";
      return NextResponse.json({ 
        error: errorMessage,
        details: error.errors 
      }, { status: 400 });
    }
    console.error("Create feature request error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

