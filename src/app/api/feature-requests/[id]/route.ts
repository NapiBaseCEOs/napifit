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

    if (!isAdminEmail(user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let deleteReason: string | undefined;
    try {
      const body = await request.json();
      if (body?.reason && typeof body.reason === "string") {
        deleteReason = body.reason;
      }
    } catch {
      // no body
    }

    const now = new Date().toISOString();

    const { error: updateError } = await (supabaseAdmin.from("feature_requests") as any)
      .update({
        deleted_at: now,
        deleted_reason: deleteReason || "Moderasyon tarafından kaldırıldı.",
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

