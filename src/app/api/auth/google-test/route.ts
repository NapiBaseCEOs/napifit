import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const googleProvider = authOptions.providers.find(p => p.id === "google");
  
  const info: {
    hasGoogleProvider: boolean;
    googleProviderId: string | null;
    googleProviderName: string | null;
    clientId: string;
    clientSecret: string;
    nextAuthUrl: string;
    callbackUrl: string;
    signInUrl: string;
    authSecret: string;
    googleAuthorization?: {
      url: string | null;
      params: any;
    };
  } = {
    hasGoogleProvider: !!googleProvider,
    googleProviderId: googleProvider?.id || null,
    googleProviderName: googleProvider?.name || null,
    clientId: process.env.GOOGLE_CLIENT_ID ? "SET (hidden)" : "NOT_SET",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ? "SET (hidden)" : "NOT_SET",
    nextAuthUrl: process.env.NEXTAUTH_URL || "NOT_SET",
    callbackUrl: `${process.env.NEXTAUTH_URL || "https://napibase.com"}/api/auth/callback/google`,
    signInUrl: `${process.env.NEXTAUTH_URL || "https://napibase.com"}/api/auth/signin/google`,
    authSecret: process.env.AUTH_SECRET ? "SET (hidden)" : "NOT_SET",
  };
  
  // Google Provider detayları
  if (googleProvider && "authorization" in googleProvider) {
    info.googleAuthorization = {
      url: (googleProvider as any).authorization?.url || null,
      params: (googleProvider as any).authorization?.params || null,
    };
  }
  
  return NextResponse.json(info);
}

