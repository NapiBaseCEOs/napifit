import { NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get("callbackUrl") || "/onboarding";
  
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const AUTH_SECRET = process.env.AUTH_SECRET || "";
  const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "https://napibase.com";
  const redirectUri = `${NEXTAUTH_URL}/api/auth/callback/google`;
  
  if (!GOOGLE_CLIENT_ID) {
    return NextResponse.json(
      { error: "GOOGLE_CLIENT_ID not configured" },
      { status: 500 }
    );
  }
  
  // NextAuth formatında state oluştur (CSRF koruması için)
  // NextAuth state format: base64url(JSON.stringify({ callbackUrl, csrfToken }))
  const csrfToken = randomBytes(32).toString("base64url");
  const state = Buffer.from(JSON.stringify({ 
    callbackUrl: callbackUrl.startsWith("/") ? `${NEXTAUTH_URL}${callbackUrl}` : callbackUrl,
    csrfToken 
  })).toString("base64url");
  
  // Google OAuth URL'ini manuel olarak oluştur
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    state: state,
  });
  
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  
  console.log("🔐 Google OAuth Direct URL created:", {
    clientId: GOOGLE_CLIENT_ID.substring(0, 10) + "...",
    redirectUri,
    hasState: !!state,
  });
  
  // Direkt Google'a yönlendir
  return NextResponse.redirect(googleAuthUrl);
}

