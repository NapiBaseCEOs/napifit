import { NextResponse } from "next/server";
import { getProviders } from "next-auth/react";

export async function GET() {
  try {
    // NextAuth providers'ı almak için authOptions'ı import et
    const { authOptions } = await import("@/lib/auth");
    
    // getProviders server-side'da çalışmaz, manuel olarak provider bilgilerini döndür
    const baseUrl = process.env.NEXTAUTH_URL || "https://napibase.com";
    
    return NextResponse.json({
      providers: {
        google: {
          id: "google",
          name: "Google",
          type: "oauth",
          signinUrl: `${baseUrl}/api/auth/signin/google`,
          callbackUrl: `${baseUrl}/api/auth/callback/google`,
        },
        credentials: {
          id: "credentials",
          name: "Credentials",
          type: "credentials",
        },
      },
      config: {
        nextAuthUrl: baseUrl,
        googleClientId: process.env.GOOGLE_CLIENT_ID ? "SET" : "NOT_SET",
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? "SET" : "NOT_SET",
        authSecret: process.env.AUTH_SECRET ? "SET" : "NOT_SET",
      },
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}

