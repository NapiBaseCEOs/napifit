import { NextResponse } from "next/server";

// Cloudflare Pages için Web Crypto API kullan
async function generateRandomBytes(length: number): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // Web Crypto API kullan (Cloudflare Pages)
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    // base64url encoding (Web API ile)
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
  
  // Node.js fallback
  try {
    const { randomBytes } = await import('crypto');
    return randomBytes(length).toString('base64url');
  } catch {
    // Fallback: timestamp + random (simple)
    const randomStr = `${Date.now()}-${Math.random()}-${Math.random()}`;
    return btoa(randomStr)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
      .substring(0, length);
  }
}

// Cloudflare Pages için base64url encoding
function base64UrlEncode(str: string): string {
  try {
    // Web API ile encode
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  } catch {
    // Fallback: Node.js Buffer
    try {
      return Buffer.from(str).toString('base64url');
    } catch {
      // Son fallback: basit encoding
      return encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
        return '%' + c.charCodeAt(0).toString(16);
      });
    }
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
    const state = base64UrlEncode(JSON.stringify(stateData));
    
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

