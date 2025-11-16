import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      authenticated: !!session,
      user: session?.user || null,
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

