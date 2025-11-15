import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const googleProvider = authOptions.providers.find((p: any) => p.id === "google") as any;
  
  const info = {
    hasGoogleProvider: !!googleProvider,
    clientId: process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 15)}...` : "NOT_SET",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ? "SET" : "NOT_SET",
    nextAuthUrl: process.env.NEXTAUTH_URL || "NOT_SET",
    authSecret: process.env.AUTH_SECRET ? "SET" : "NOT_SET",
    callbackUrl: `${process.env.NEXTAUTH_URL || "https://napibase.com"}/api/auth/callback/google`,
    signinUrl: `${process.env.NEXTAUTH_URL || "https://napibase.com"}/api/auth/signin/google`,
    providerConfig: {
      id: googleProvider?.id || null,
      name: googleProvider?.name || null,
      type: googleProvider?.type || null,
      authorizationUrl: googleProvider?.authorization?.url || null,
    },
    // Test: Signin endpoint'e GET request at
    testSigninEndpoint: null as any,
  };
  
  // Signin endpoint'i test et
  try {
    const signinUrl = `${process.env.NEXTAUTH_URL || "https://napibase.com"}/api/auth/signin/google`;
    const testResponse = await fetch(signinUrl, {
      method: "GET",
      redirect: "manual", // Redirect'leri takip etme
    });
    
    info.testSigninEndpoint = {
      status: testResponse.status,
      statusText: testResponse.statusText,
      location: testResponse.headers.get("location") || null,
      hasRedirect: testResponse.status === 302 || testResponse.status === 307,
    };
  } catch (err: any) {
    info.testSigninEndpoint = {
      error: err.message,
    };
  }
  
  return NextResponse.json(info, { status: 200 });
}

