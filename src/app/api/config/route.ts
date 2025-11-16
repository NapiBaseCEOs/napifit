import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      config: {
        nextAuthUrl: process.env.NEXTAUTH_URL || "NOT_SET",
        googleClientId: process.env.GOOGLE_CLIENT_ID ? "SET" : "NOT_SET",
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? "SET" : "NOT_SET",
        authSecret: process.env.AUTH_SECRET ? "SET" : "NOT_SET",
        expectedCallbackUrl: `${process.env.NEXTAUTH_URL || "https://napibase.com"}/api/auth/callback/google`,
      },
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}

