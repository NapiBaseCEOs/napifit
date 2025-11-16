// Cloudflare D1 Database Helper
// Prisma yerine doğrudan D1 binding kullanır

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

// Global D1 binding'i al
// Cloudflare Pages'de runtime'da inject edilir
// OpenNext Cloudflare adapter D1 binding'i çeşitli yollarla sağlayabilir
function getD1Database(request?: Request): D1Database | null {
  if (!request) {
    // Request yoksa, globalThis'ten dene (fallback)
    if (typeof globalThis !== 'undefined') {
      if ((globalThis as any).DB) {
        return (globalThis as any).DB as D1Database;
      }
      if ((globalThis as any).env?.DB) {
        return (globalThis as any).env.DB as D1Database;
      }
    }
    return null;
  }
  
  const req = request as any;
  
  // 1. En yaygın: request.env.DB (OpenNext Cloudflare adapter)
  // OpenNext Cloudflare adapter, D1 binding'i request.env'e ekler
  if (req.env?.DB) {
    return req.env.DB as D1Database;
  }
  
  // 2. Request.context.env.DB (alternatif)
  if (req.context?.env?.DB) {
    return req.context.env.DB as D1Database;
  }
  
  // 3. Request.runtime.env.DB (alternatif)
  if (req.runtime?.env?.DB) {
    return req.runtime.env.DB as D1Database;
  }
  
  // 4. Request.cf.DB (Cloudflare context)
  if (req.cf?.DB) {
    return req.cf.DB as D1Database;
  }
  
  // 5. Cloudflare Workers runtime - globalThis.DB (fallback)
  if (typeof globalThis !== 'undefined') {
    if ((globalThis as any).DB) {
      return (globalThis as any).DB as D1Database;
    }
    if ((globalThis as any).env?.DB) {
      return (globalThis as any).env.DB as D1Database;
    }
    if ((globalThis as any).__env?.DB) {
      return (globalThis as any).__env.DB as D1Database;
    }
    if ((globalThis as any).cloudflare?.env?.DB) {
      return (globalThis as any).cloudflare.env.DB as D1Database;
    }
  }
  
  // 6. Node.js environment (development - fallback)
  if (typeof process !== 'undefined') {
    if ((process as any).env?.DB) {
      return (process as any).env.DB as D1Database;
    }
  }
  
  return null;
}

// Helper functions
export async function queryOne<T = any>(query: string, params: any[] = [], request?: Request): Promise<T | null> {
  const database = getD1Database(request);
  if (!database) {
    console.error('D1 database not available');
    return null;
  }
  
  try {
    let stmt = database.prepare(query);
    if (params.length > 0) {
      stmt = stmt.bind(...params);
    }
    return await stmt.first<T>();
  } catch (error) {
    console.error('D1 query error:', error);
    return null;
  }
}

export async function queryAll<T = any>(query: string, params: any[] = [], request?: Request): Promise<T[]> {
  const database = getD1Database(request);
  if (!database) {
    console.error('D1 database not available');
    return [];
  }
  
  try {
    let stmt = database.prepare(query);
    if (params.length > 0) {
      stmt = stmt.bind(...params);
    }
    const result = await stmt.all<T>();
    return result.results || [];
  } catch (error) {
    console.error('D1 query error:', error);
    return [];
  }
}

export async function execute(query: string, params: any[] = [], request?: Request): Promise<boolean> {
  const database = getD1Database(request);
  if (!database) {
    console.error('D1 database not available');
    return false;
  }
  
  try {
    let stmt = database.prepare(query);
    if (params.length > 0) {
      stmt = stmt.bind(...params);
    }
    const result = await stmt.run();
    return result.success;
  } catch (error) {
    console.error('D1 execute error:', error);
    return false;
  }
}

// Test database connection
export async function testConnection(request?: Request): Promise<boolean> {
  try {
    const result = await queryOne('SELECT 1 as test', [], request);
    return result !== null;
  } catch {
    return false;
  }
}

// Get D1 database from request (for API routes)
export function getDB(request?: Request): D1Database | null {
  return getD1Database(request);
}

