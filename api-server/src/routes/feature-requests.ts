import { Router } from "express";
import { z } from "zod";
import { supabase, supabaseAdmin } from "../config/supabase";
import { authenticateRequest, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

const createFeatureRequestSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
});

// GET /api/feature-requests - List feature requests
router.get("/", async (req, res, next) => {
  try {
    const sortBy = (req.query.sort as string) || "likes";
    const limit = parseInt(req.query.limit as string || "50", 10);
    const offset = parseInt(req.query.offset as string || "0", 10);

    // Use admin client if available, otherwise use regular client
    const client = supabaseAdmin || supabase;

    let query = client
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
          country_code,
          created_at
        )
      `)
      .is("deleted_at", null);

    if (sortBy === "likes") {
      query = query.order("like_count", { ascending: false }).order("created_at", { ascending: false });
    } else if (sortBy === "newest") {
      query = query.order("created_at", { ascending: false });
    } else if (sortBy === "implemented") {
      query = query.eq("is_implemented", true).order("implemented_at", { ascending: false });
    }

    query = query.range(offset, offset + limit - 1);

    const { data: requests, error } = await query;

    if (error) {
      throw error;
    }

    // Get user likes/dislikes if authenticated
    let userLikes: string[] = [];
    let userDislikes: string[] = [];
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const { data: { user } } = await supabase.auth.getUser(token);
      
      if (user) {
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
    }

    const formattedRequests =
      requests?.map((req: any) => {
        const sanitizedLikeCount = Math.max(0, req.like_count ?? 0);
        const sanitizedDislikeCount = Math.max(0, req.dislike_count ?? 0);
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
          likeCount: sanitizedLikeCount,
          dislikeCount: sanitizedDislikeCount,
          isLiked: userLikes.includes(req.id),
          isDisliked: userDislikes.includes(req.id),
          isImplemented: req.is_implemented,
          implementedAt: req.implemented_at,
          implementedVersion: req.implemented_version,
          createdAt: req.created_at,
          deletedAt: req.deleted_at,
          deletedReason: req.deleted_reason,
          user: {
            id: profile.id,
            name: profile.show_public_profile ? (profile.full_name || "Kullanıcı") : "Gizli Kullanıcı",
            avatar: profile.show_public_profile ? profile.avatar_url : null,
            joinedAt: profile.created_at,
            showStats: profile.show_community_stats ?? true,
            showPublicProfile: profile.show_public_profile ?? true,
            countryCode: profile.country_code,
          },
        };
      }) || [];

    return res.json({ requests: formattedRequests });
  } catch (error) {
    next(error);
  }
});

// POST /api/feature-requests - Create feature request
router.post("/", authenticateRequest, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Yetkisiz erişim" });
    }

    const validatedData = createFeatureRequestSchema.parse(req.body);

    // Use admin client if available, otherwise use regular client
    const client = supabaseAdmin || supabase;

    const { data, error } = await (client as any)
      .from("feature_requests")
      .insert({
        user_id: req.user.id,
        title: validatedData.title,
        description: validatedData.description,
        like_count: 0,
        dislike_count: 0,
        is_implemented: false,
      })
      .select()
      .single();

    if (error || !data) {
      throw error;
    }

    return res.status(201).json({
      message: "Öneri başarıyla eklendi",
      request: data,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

