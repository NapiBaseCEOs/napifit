import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("next") || "/dashboard";
  const nextPath = redirectTo.startsWith("/") ? redirectTo : "/dashboard";

  if (code) {
    const supabase = createSupabaseRouteClient();
    await supabase.auth.exchangeCodeForSession(code);
    
    // Onboarding kontrolü yap
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    if (session) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", session.user.id)
        .single();
      
      // Eğer onboarding tamamlanmamışsa onboarding'e yönlendir
      if (profile && !profile.onboarding_completed) {
        return NextResponse.redirect(new URL("/onboarding", requestUrl.origin));
      }
    }
  }

  return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
}

