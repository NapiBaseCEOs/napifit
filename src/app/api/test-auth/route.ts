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
      TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL ? "✅ SET" : "❌ MISSING",
      TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN ? "✅ SET" : "❌ MISSING",
      DATABASE_URL: process.env.DATABASE_URL ? "✅ SET" : "❌ MISSING",
    },
    tursoDatabase: {
      available: false,
      testQuery: null,
      error: null,
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

  // Turso Database kontrolü
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    try {
      const { testConnection } = await import("@/lib/turso");
      const connected = await testConnection();
      results.tursoDatabase.available = connected;
      
      if (connected) {
        const { queryOne } = await import("@/lib/turso");
        const testResult = await queryOne('SELECT 1 as test');
        results.tursoDatabase.testQuery = testResult ? "✅ Success" : "❌ No result";
      }
    } catch (error: any) {
      results.tursoDatabase.error = error.message;
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

