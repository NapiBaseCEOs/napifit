import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      authenticated: false,
      user: null,
      config: {
        nextAuthUrl: process.env.NEXTAUTH_URL || "NOT_SET",
        googleClientId: process.env.GOOGLE_CLIENT_ID ? "SET" : "NOT_SET",
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? "SET" : "NOT_SET",
        authSecret: process.env.AUTH_SECRET ? "SET" : "NOT_SET",
      },
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
      config: {
        nextAuthUrl: process.env.NEXTAUTH_URL || "NOT_SET",
        googleClientId: process.env.GOOGLE_CLIENT_ID ? "SET" : "NOT_SET",
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? "SET" : "NOT_SET",
        authSecret: process.env.AUTH_SECRET ? "SET" : "NOT_SET",
      },
    }, { status: 500 });
  }
}

