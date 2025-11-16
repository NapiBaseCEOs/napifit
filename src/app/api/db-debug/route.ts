import { NextResponse } from "next/server";
import { getDB } from "@/lib/d1";

/**
 * D1 Database Debug Endpoint
 * OpenNext Cloudflare adapter'ın D1 binding'ini nasıl sağladığını test eder
 */
export async function GET(request: Request) {
  const req = request as any;
  
  // Request object'in tüm özelliklerini kontrol et
  const requestProperties: any = {};
  if (request) {
    try {
      // Request object'in tüm özelliklerini al
      for (const key in req) {
        if (!['headers', 'body', 'url', 'method'].includes(key)) {
          try {
            requestProperties[key] = {
              exists: key in req,
              type: typeof req[key],
              hasDB: req[key]?.DB ? 'YES' : 'NO',
            };
          } catch {
            requestProperties[key] = { exists: true, type: 'unknown', error: 'cannot access' };
          }
        }
      }
    } catch (e) {
      requestProperties.error = String(e);
    }
  }
  
  const debug: any = {
    timestamp: new Date().toISOString(),
    requestInfo: {
      hasRequest: !!request,
      requestType: typeof request,
      requestConstructor: request?.constructor?.name,
    },
    bindingLocations: {
      // Request context (OpenNext Cloudflare adapter)
      requestEnvDB: req.env?.DB ? 'FOUND' : 'NOT_FOUND',
      requestEnvType: typeof req.env,
      requestContextEnvDB: req.context?.env?.DB ? 'FOUND' : 'NOT_FOUND',
      requestRuntimeEnvDB: req.runtime?.env?.DB ? 'FOUND' : 'NOT_FOUND',
      requestCfDB: req.cf?.DB ? 'FOUND' : 'NOT_FOUND',
      
      // Global context
      globalThisDB: typeof globalThis !== 'undefined' && (globalThis as any).DB ? 'FOUND' : 'NOT_FOUND',
      globalThisEnvDB: typeof globalThis !== 'undefined' && (globalThis as any).env?.DB ? 'FOUND' : 'NOT_FOUND',
      globalThisCloudflare: typeof globalThis !== 'undefined' && (globalThis as any).cloudflare?.env?.DB ? 'FOUND' : 'NOT_FOUND',
      globalThisNextRuntime: typeof globalThis !== 'undefined' && (globalThis as any).__NEXT_RUNTIME__?.env?.DB ? 'FOUND' : 'NOT_FOUND',
      
      // Process context
      processEnvDB: typeof process !== 'undefined' && (process as any).env?.DB ? 'FOUND' : 'NOT_FOUND',
    },
    requestProperties,
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
    debug.dbConstructor = db?.constructor?.name;
    debug.dbMethods = Object.keys(db).filter(k => typeof (db as any)[k] === 'function');
    
    // Test query
    try {
      const stmt = db.prepare('SELECT 1 as test');
      const result = await stmt.first();
      debug.testQuery = result;
      debug.testQuerySuccess = true;
    } catch (error: any) {
      debug.error = error?.message || String(error);
      debug.testQuery = null;
      debug.testQuerySuccess = false;
    }
  } else {
    debug.error = 'D1 database binding not found in any location';
    debug.recommendation = 'Check Cloudflare Pages Settings > Bindings > D1 Database binding is configured with name "DB"';
  }
  
  return NextResponse.json(debug, { status: 200 });
}
