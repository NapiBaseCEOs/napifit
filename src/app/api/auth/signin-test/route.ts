import { NextResponse } from "next/server";
import { getProviders } from "next-auth/react";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // NextAuth providers'ı kontrol et
    const providers = await getProviders();
    
    return NextResponse.json({
      providers: providers || {},
      hasGoogle: !!providers?.google,
      googleProvider: providers?.google || null,
      config: {
        nextAuthUrl: process.env.NEXTAUTH_URL || "NOT_SET",
        googleClientId: process.env.GOOGLE_CLIENT_ID ? "SET" : "NOT_SET",
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? "SET" : "NOT_SET",
      },
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      config: {
        nextAuthUrl: process.env.NEXTAUTH_URL || "NOT_SET",
        googleClientId: process.env.GOOGLE_CLIENT_ID ? "SET" : "NOT_SET",
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? "SET" : "NOT_SET",
      },
    }, { status: 500 });
  }
}

