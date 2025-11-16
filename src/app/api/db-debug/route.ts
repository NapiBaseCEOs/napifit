import { NextResponse } from "next/server";
import { getDB } from "@/lib/d1";

/**
 * D1 Database Debug Endpoint
 * OpenNext Cloudflare adapter'ın D1 binding'ini nasıl sağladığını test eder
 */
export async function GET(request: Request) {
  const req = request as any;
  
  const debug: any = {
    timestamp: new Date().toISOString(),
    bindingLocations: {
      // Request context
      requestEnvDB: req.env?.DB ? 'FOUND' : 'NOT_FOUND',
      requestCfDB: req.cf?.DB ? 'FOUND' : 'NOT_FOUND',
      requestContext: req.context?.env?.DB ? 'FOUND' : 'NOT_FOUND',
      requestRuntime: req.runtime?.env?.DB ? 'FOUND' : 'NOT_FOUND',
      
      // Global context
      globalThisDB: typeof globalThis !== 'undefined' && (globalThis as any).DB ? 'FOUND' : 'NOT_FOUND',
      globalThisEnvDB: typeof globalThis !== 'undefined' && (globalThis as any).env?.DB ? 'FOUND' : 'NOT_FOUND',
      globalThisCloudflare: typeof globalThis !== 'undefined' && (globalThis as any).cloudflare?.env?.DB ? 'FOUND' : 'NOT_FOUND',
      
      // Process context
      processEnvDB: typeof process !== 'undefined' && (process as any).env?.DB ? 'FOUND' : 'NOT_FOUND',
      
      // Request keys (debugging)
      requestKeys: request ? Object.keys(req).filter(k => !['headers', 'body', 'url'].includes(k)) : [],
    },
    dbAvailable: false,
    dbType: null,
    dbMethods: [],
    testQuery: null,
    error: null,
  };
  
  // D1 binding'i al
  const db = getDB(request);
  
  if (db) {
    debug.dbAvailable = true;
    debug.dbType = typeof db;
    debug.dbMethods = Object.keys(db).filter(k => typeof (db as any)[k] === 'function');
    
    // Test query
    try {
      const stmt = db.prepare('SELECT 1 as test');
      const result = await stmt.first();
      debug.testQuery = result;
    } catch (error: any) {
      debug.error = error?.message || String(error);
      debug.testQuery = null;
    }
  } else {
    debug.error = 'D1 database binding not found in any location';
  }
  
  return NextResponse.json(debug);
}
