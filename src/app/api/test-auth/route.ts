import { NextResponse } from "next/server";
import { getDB } from "@/lib/d1";

/**
 * Authentication ve Database Test Endpoint
 * Cloudflare Pages'de D1 binding ve environment variables kontrolü
 */
export async function GET(request: Request) {
  const results: any = {
    timestamp: new Date().toISOString(),
    environment: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "❌ MISSING",
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "✅ SET" : "❌ MISSING",
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "✅ SET" : "❌ MISSING",
      AUTH_SECRET: process.env.AUTH_SECRET ? "✅ SET" : "❌ MISSING",
    },
    d1Database: {
      available: false,
      binding: null,
      testQuery: null,
      error: null,
    },
  };

  // D1 Database kontrolü
  try {
    const db = getDB(request);
    
    if (db) {
      results.d1Database.available = true;
      results.d1Database.binding = "✅ Found";
      
      // Test query
      try {
        const stmt = db.prepare("SELECT 1 as test");
        const result = await stmt.first();
        results.d1Database.testQuery = result ? "✅ Success" : "❌ No result";
      } catch (queryError: any) {
        results.d1Database.testQuery = "❌ Failed";
        results.d1Database.error = queryError.message;
      }
    } else {
      results.d1Database.binding = "❌ Not found";
      results.d1Database.error = "D1 binding not available in request";
    }
  } catch (error: any) {
    results.d1Database.error = error.message;
  }

  // GlobalThis kontrolü (fallback)
  if (typeof globalThis !== "undefined") {
    const globalDB = (globalThis as any).DB || (globalThis as any).env?.DB;
    if (globalDB) {
      results.d1Database.globalThis = "✅ Available";
    } else {
      results.d1Database.globalThis = "❌ Not available";
    }
  }

  // Request object analizi
  const req = request as any;
  results.requestAnalysis = {
    hasEnv: !!req.env,
    hasContext: !!req.context,
    hasRuntime: !!req.runtime,
    envKeys: req.env ? Object.keys(req.env) : [],
  };

  return NextResponse.json(results, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

