import { NextResponse } from "next/server";

// Cloudflare Pages için Web Crypto API kullan
async function generateRandomBytes(length: number): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // Web Crypto API kullan
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Buffer.from(array).toString('base64url');
  }
  
  // Node.js fallback
  try {
    const { randomBytes } = await import('crypto');
    return randomBytes(length).toString('base64url');
  } catch {
    // Fallback: timestamp + random
    return Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64url').substring(0, length);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get("callbackUrl") || "/onboarding";
  
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "https://napibase.com";
  const redirectUri = `${NEXTAUTH_URL}/api/auth/callback/google`;
  
  if (!GOOGLE_CLIENT_ID) {
    return NextResponse.json(
      { error: "GOOGLE_CLIENT_ID not configured" },
      { status: 500 }
    );
  }
  
  try {
    // NextAuth formatında state oluştur (CSRF koruması için)
    // NextAuth state format: base64url(JSON.stringify({ callbackUrl, csrfToken }))
    const csrfToken = await generateRandomBytes(32);
    const stateData = { 
      callbackUrl: callbackUrl.startsWith("/") ? `${NEXTAUTH_URL}${callbackUrl}` : callbackUrl,
      csrfToken 
    };
    const state = Buffer.from(JSON.stringify(stateData)).toString('base64url');
    
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
  } catch (error: any) {
    console.error("❌ Google OAuth Direct URL error:", error);
    return NextResponse.json(
      { error: "Failed to create Google OAuth URL", details: error.message },
      { status: 500 }
    );
  }
}

