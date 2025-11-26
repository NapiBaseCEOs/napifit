import { Router } from "express";
import { supabase, supabaseAdmin } from "../config/supabase";
import { authenticateRequest, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// POST /api/feature-requests/:id/like - Like or unlike feature request
router.post("/:id/like", authenticateRequest, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user || !supabaseAdmin) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const featureRequestId = req.params.id;

    const { data: targetRequest } = await supabaseAdmin
      .from("feature_requests")
      .select("deleted_at, user_id, title")
      .eq("id", featureRequestId)
      .maybeSingle();

    if (!targetRequest || targetRequest.deleted_at) {
      return res.status(410).json({ error: "Feature request not available" });
    }

    const { data: existingLike } = await supabase
      .from("feature_request_likes")
      .select("id")
      .eq("feature_request_id", featureRequestId)
      .eq("user_id", req.user.id)
      .single();

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from("feature_request_likes")
        .delete()
        .eq("feature_request_id", featureRequestId)
        .eq("user_id", req.user.id);

      if (error) {
        throw error;
      }

      await syncLikeCount(featureRequestId);
      return res.json({ liked: false });
    } else {
      // Like
      const { error } = await supabase
        .from("feature_request_likes")
        .insert({
          feature_request_id: featureRequestId,
          user_id: req.user.id,
        });

      if (error) {
        throw error;
      }

      await syncLikeCount(featureRequestId);
      return res.json({ liked: true });
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/feature-requests/:id/dislike - Dislike or undislike feature request
router.post("/:id/dislike", authenticateRequest, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user || !supabaseAdmin) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const featureRequestId = req.params.id;

    const { data: targetRequest } = await supabaseAdmin
      .from("feature_requests")
      .select("deleted_at")
      .eq("id", featureRequestId)
      .maybeSingle();

    if (targetRequest?.deleted_at) {
      return res.status(410).json({ error: "Feature request not available" });
    }

    const { data: existingDislike } = await supabase
      .from("feature_request_dislikes")
      .select("id")
      .eq("feature_request_id", featureRequestId)
      .eq("user_id", req.user.id)
      .single();

    if (existingDislike) {
      // Undislike
      const { error } = await supabase
        .from("feature_request_dislikes")
        .delete()
        .eq("feature_request_id", featureRequestId)
        .eq("user_id", req.user.id);

      if (error) {
        throw error;
      }

      await syncDislikeCount(featureRequestId);
      return res.json({ disliked: false });
    } else {
      // Dislike
      const { error } = await supabase
        .from("feature_request_dislikes")
        .insert({
          feature_request_id: featureRequestId,
          user_id: req.user.id,
        });

      if (error) {
        throw error;
      }

      await syncDislikeCount(featureRequestId);
      return res.json({ disliked: true });
    }
  } catch (error) {
    next(error);
  }
});

async function syncLikeCount(featureRequestId: string) {
  if (!supabaseAdmin) return;
  const { count } = await supabaseAdmin
    .from("feature_request_likes")
    .select("id", { count: "exact", head: true })
    .eq("feature_request_id", featureRequestId);

  await (supabaseAdmin.from("feature_requests") as any)
    .update({ like_count: count ?? 0 })
    .eq("id", featureRequestId);
}

async function syncDislikeCount(featureRequestId: string) {
  if (!supabaseAdmin) return;
  const { count } = await supabaseAdmin
    .from("feature_request_dislikes")
    .select("id", { count: "exact", head: true })
    .eq("feature_request_id", featureRequestId);

  await (supabaseAdmin.from("feature_requests") as any)
    .update({ dislike_count: count ?? 0 })
    .eq("id", featureRequestId);
}

export default router;

