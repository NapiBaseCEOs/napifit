import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const googleProvider = authOptions.providers.find(p => p.id === "google") as any;
  
  // Google Provider detaylarını al
  const providerInfo: any = {
    id: googleProvider?.id || null,
    name: googleProvider?.name || null,
    type: googleProvider?.type || null,
    clientId: process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...` : "NOT_SET",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ? "SET" : "NOT_SET",
  };
  
  // Authorization endpoint bilgileri
  if (googleProvider?.authorization) {
    providerInfo.authorization = {
      url: googleProvider.authorization.url || null,
      params: googleProvider.authorization.params || null,
    };
  }
  
  // Callback URL
  const callbackUrl = `${process.env.NEXTAUTH_URL || "https://napibase.com"}/api/auth/callback/google`;
  
  // Signin URL
  const signInUrl = `${process.env.NEXTAUTH_URL || "https://napibase.com"}/api/auth/signin/google`;
  
  // Google OAuth authorization URL oluştur (test için)
  let authorizationUrl = null;
  if (googleProvider?.authorization?.url && process.env.GOOGLE_CLIENT_ID) {
    try {
      const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: callbackUrl,
        response_type: "code",
        scope: "openid email profile",
        prompt: "consent",
        access_type: "offline",
      });
      authorizationUrl = `${googleProvider.authorization.url}?${params.toString()}`;
    } catch (err) {
      // Hata varsa null bırak
    }
  }
  
  return NextResponse.json({
    nextAuthUrl: process.env.NEXTAUTH_URL || "NOT_SET",
    callbackUrl,
    signInUrl,
    googleProvider: providerInfo,
    authorizationUrl: authorizationUrl ? `${authorizationUrl.substring(0, 100)}...` : null,
    environment: {
      googleClientId: process.env.GOOGLE_CLIENT_ID ? "SET" : "NOT_SET",
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? "SET" : "NOT_SET",
      authSecret: process.env.AUTH_SECRET ? "SET" : "NOT_SET",
    },
  });
}

