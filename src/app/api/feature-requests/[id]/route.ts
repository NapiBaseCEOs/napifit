import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/config/admins";

type RouteContext = {
  params: {
    id: string;
  };
};

export const dynamic = "force-dynamic";

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const supabase = createSupabaseRouteClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // İlgili öneriyi getir (sahiplik ve beğeni sayısı kontrolü için)
    const { data: target, error: fetchError } = await supabaseAdmin
      .from("feature_requests")
      .select("user_id, like_count, deleted_at")
      .eq("id", params.id)
      .maybeSingle();

    if (fetchError) {
      console.error("Feature request fetch error before delete:", fetchError);
      return NextResponse.json({ error: "Feature request not found" }, { status: 404 });
    }

    if (!target) {
      return NextResponse.json({ error: "Feature request not found" }, { status: 404 });
    }

    if ((target as { deleted_at: string | null }).deleted_at) {
      return NextResponse.json({ error: "Feature request already deleted" }, { status: 410 });
    }

    const likeCount = Math.max(0, (target as { like_count: number | null }).like_count ?? 0);
    const isOwner = (target as { user_id: string }).user_id === user.id;
    const isAdmin = isAdminEmail(user.email);

    // Kural:
    // - Admin: her isteği silebilir
    // - Kullanıcı: sadece kendi isteğini ve like sayısı 0 ise silebilir
    if (!isAdmin && !(isOwner && likeCount === 0)) {
      return NextResponse.json(
        { error: "Only moderators or the owner of a suggestion with no likes can delete it." },
        { status: 403 }
      );
    }

    let deleteReason: string | undefined;
    // Moderasyon silmelerinde isteğe bağlı reason al
    if (isAdmin) {
      try {
        const body = await request.json();
        if (body?.reason && typeof body.reason === "string") {
          deleteReason = body.reason;
        }
      } catch {
        // no body
      }
    }

    const now = new Date().toISOString();

    const { error: updateError } = await (supabaseAdmin.from("feature_requests") as any)
      .update({
        deleted_at: now,
        deleted_reason:
          deleteReason ||
          (isAdmin
            ? "Deleted by moderator"
            : "Deleted by user before receiving any likes"),
      })
      .eq("id", params.id)
      .is("deleted_at", null);

    if (updateError) {
      console.error("Feature request delete error:", updateError);
      return NextResponse.json({ error: "Silme işlemi başarısız" }, { status: 500 });
    }

    return NextResponse.json({ success: true, revalidate: ["/community", "/profile"] });
  } catch (err) {
    console.error("Feature request delete exception:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

