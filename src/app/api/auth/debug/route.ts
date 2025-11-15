import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "NOT SET",
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "SET (hidden)" : "NOT SET",
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "SET (hidden)" : "NOT SET",
      AUTH_SECRET: process.env.AUTH_SECRET ? "SET (hidden)" : "NOT SET",
    },
    expectedCallbackUrl: `${process.env.NEXTAUTH_URL || "https://napibase.com"}/api/auth/callback/google`,
    nodeEnv: process.env.NODE_ENV,
  });
}

