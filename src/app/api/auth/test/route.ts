import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const info = {
    nextAuthUrl: process.env.NEXTAUTH_URL || "NOT_SET",
    googleClientId: process.env.GOOGLE_CLIENT_ID ? "SET (hidden)" : "NOT_SET",
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? "SET (hidden)" : "NOT_SET",
    authSecret: process.env.AUTH_SECRET ? "SET (hidden)" : "NOT_SET",
    expectedCallbackUrl: `${process.env.NEXTAUTH_URL || "https://napibase.com"}/api/auth/callback/google`,
    providers: {
      google: {
        id: "google",
        name: "Google",
        type: "oauth",
        signinUrl: `${process.env.NEXTAUTH_URL || "https://napibase.com"}/api/auth/signin/google`,
        callbackUrl: `${process.env.NEXTAUTH_URL || "https://napibase.com"}/api/auth/callback/google`,
      },
    },
  };
  
  return NextResponse.json(info);
}

