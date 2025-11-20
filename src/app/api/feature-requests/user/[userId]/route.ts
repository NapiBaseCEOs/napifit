import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = 'force-dynamic';

// Kullanıcının önerilerini getir
export async function GET(_request: Request, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId;

    const { data: requests, error } = await supabaseAdmin
      .from("feature_requests")
      .select(`
        id,
        title,
        description,
        like_count,
        is_implemented,
        implemented_at,
        implemented_version,
        created_at
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("User feature requests fetch error:", error);
      return NextResponse.json({ requests: [] });
    }

    type FeatureRequestRow = {
      id: string;
      title: string;
      description: string;
      like_count: number;
      is_implemented: boolean;
      implemented_at: string | null;
      implemented_version: string | null;
      created_at: string;
    };

    const formattedRequests = (requests as FeatureRequestRow[] | null)?.map((req) => ({
      id: req.id,
      title: req.title,
      description: req.description,
      likeCount: req.like_count,
      isImplemented: req.is_implemented,
      implementedAt: req.implemented_at,
      implementedVersion: req.implemented_version,
      createdAt: req.created_at,
    })) || [];

    // Uygulanan öneri sayısını hesapla
    const implementedCount = formattedRequests.filter((r) => r.isImplemented).length;

    return NextResponse.json({ requests: formattedRequests, implementedCount });
  } catch (error) {
    console.error("User feature requests API error:", error);
    return NextResponse.json({ requests: [], implementedCount: 0 });
  }
}

