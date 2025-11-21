import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { z } from "zod";

export const dynamic = 'force-dynamic';

const createFeatureRequestSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
});

// Özellik önerilerini listele (beğeni sayısına göre sıralı)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sort") || "likes"; // "likes" | "newest" | "implemented"
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabaseAdmin
      .from("feature_requests")
      .select(`
        id,
        title,
        description,
        like_count,
        dislike_count,
        is_implemented,
        implemented_at,
        implemented_version,
        created_at,
        updated_at,
        profiles(
          id,
          full_name,
          avatar_url,
          show_public_profile,
          show_community_stats,
          created_at
        )
      `);

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

    const formattedRequests = requests?.map((req: any) => {
      // Profil yoksa default değerler kullan
      const profile = req.profiles || {
        id: req.user_id,
        full_name: null,
        avatar_url: null,
        show_public_profile: true,
        show_community_stats: true,
        created_at: req.created_at,
      };

      return {
        id: req.id,
        title: req.title,
        description: req.description,
        likeCount: req.like_count || 0,
        dislikeCount: req.dislike_count || 0,
        isLiked: user ? userLikes.includes(req.id) : false,
        isDisliked: user ? userDislikes.includes(req.id) : false,
        isImplemented: req.is_implemented,
        implementedAt: req.implemented_at,
        implementedVersion: req.implemented_version,
        createdAt: req.created_at,
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

