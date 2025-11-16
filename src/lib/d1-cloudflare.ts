// Cloudflare D1 Database Helper - OpenNext Cloudflare adapter için optimize edildi
// Bu dosya, OpenNext Cloudflare adapter'ın D1 binding erişimini sağlar

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  exec(query: string): Promise<D1ExecResult>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = unknown>(): Promise<{ results: T[]; success: boolean; meta: D1Meta }>;
}

export interface D1Result<T = unknown> {
  success: boolean;
  error?: string;
  meta: D1Meta;
  results?: T[];
}

export interface D1Meta {
  duration: number;
  rows_read: number;
  rows_written: number;
  last_row_id: number;
  changed_db: boolean;
  changes: number;
  size_after: number;
}

export interface D1ExecResult {
  count: number;
  duration: number;
}

/**
 * OpenNext Cloudflare adapter'ın D1 binding'ini alır
 * Cloudflare Pages'de API routes için D1 binding'e erişim
 */
export function getD1FromRequest(request: Request): D1Database | null {
  // OpenNext Cloudflare adapter, D1 binding'i request'e ekler
  // Worker runtime'da env object'i request üzerinden erişilebilir
  const req = request as any;
  
  // 1. En yaygın: request.env.DB (OpenNext Cloudflare adapter)
  // OpenNext Cloudflare adapter, D1 binding'i request.env'e ekler
  if (req.env?.DB) {
    console.log('✅ D1 binding found at request.env.DB');
    return req.env.DB as D1Database;
  }
  
  // 2. Request.context.env.DB (alternatif)
  if (req.context?.env?.DB) {
    console.log('✅ D1 binding found at request.context.env.DB');
    return req.context.env.DB as D1Database;
  }
  
  // 3. Request.runtime.env.DB (alternatif)
  if (req.runtime?.env?.DB) {
    console.log('✅ D1 binding found at request.runtime.env.DB');
    return req.runtime.env.DB as D1Database;
  }
  
  // 4. Cloudflare Workers runtime - globalThis.DB
  if (typeof globalThis !== 'undefined') {
    // OpenNext Cloudflare adapter, D1 binding'i globalThis'e de ekleyebilir
    if ((globalThis as any).DB) {
      console.log('✅ D1 binding found at globalThis.DB');
      return (globalThis as any).DB as D1Database;
    }
    
    // globalThis.env.DB
    if ((globalThis as any).env?.DB) {
      console.log('✅ D1 binding found at globalThis.env.DB');
      return (globalThis as any).env.DB as D1Database;
    }
    
    // globalThis.__env.DB (Cloudflare Workers runtime)
    if ((globalThis as any).__env?.DB) {
      console.log('✅ D1 binding found at globalThis.__env.DB');
      return (globalThis as any).__env.DB as D1Database;
    }
  }
  
  console.warn('⚠️ D1 binding not found in any location');
  return null;
}

/**
 * D1 Database binding'i al (request parametresi zorunlu)
 */
export function getDB(request: Request): D1Database | null {
  if (!request) {
    console.error('❌ Request object is required for D1 binding');
    return null;
  }
  
  return getD1FromRequest(request);
}

/**
 * Helper function: Query one row
 */
export async function queryOne<T = any>(
  query: string,
  params: any[] = [],
  request: Request
): Promise<T | null> {
  const db = getDB(request);
  if (!db) {
    console.error('❌ D1 database not available');
    return null;
  }
  
  try {
    let stmt = db.prepare(query);
    if (params.length > 0) {
      stmt = stmt.bind(...params);
    }
    return await stmt.first<T>();
  } catch (error) {
    console.error('❌ D1 query error:', error);
    return null;
  }
}

/**
 * Helper function: Query all rows
 */
export async function queryAll<T = any>(
  query: string,
  params: any[] = [],
  request: Request
): Promise<T[]> {
  const db = getDB(request);
  if (!db) {
    console.error('❌ D1 database not available');
    return [];
  }
  
  try {
    let stmt = db.prepare(query);
    if (params.length > 0) {
      stmt = stmt.bind(...params);
    }
    const result = await stmt.all<T>();
    return result.results || [];
  } catch (error) {
    console.error('❌ D1 query error:', error);
    return [];
  }
}

/**
 * Helper function: Execute query (INSERT, UPDATE, DELETE)
 */
export async function execute(
  query: string,
  params: any[] = [],
  request: Request
): Promise<boolean> {
  const db = getDB(request);
  if (!db) {
    console.error('❌ D1 database not available');
    return false;
  }
  
  try {
    let stmt = db.prepare(query);
    if (params.length > 0) {
      stmt = stmt.bind(...params);
    }
    const result = await stmt.run();
    return result.success;
  } catch (error) {
    console.error('❌ D1 execute error:', error);
    return false;
  }
}

/**
 * Test database connection
 */
export async function testConnection(request: Request): Promise<boolean> {
  try {
    const result = await queryOne<{ test: number }>('SELECT 1 as test', [], request);
    return result !== null && result.test === 1;
  } catch {
    return false;
  }
}
