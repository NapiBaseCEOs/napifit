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
// OpenNext Cloudflare adapter D1 binding'i globalThis'e ekler
function getD1Database(request?: Request): D1Database | null {
  // Cloudflare Workers/Pages runtime - globalThis.DB (OpenNext Cloudflare adapter bunu inject eder)
  if (typeof globalThis !== 'undefined') {
    // En yaygın: globalThis.DB
    if ((globalThis as any).DB) {
      return (globalThis as any).DB as D1Database;
    }
    
    // Alternatif: globalThis.env?.DB
    if ((globalThis as any).env?.DB) {
      return (globalThis as any).env.DB as D1Database;
    }
    
    // Alternatif: process.env.DB
    if ((globalThis as any).process?.env?.DB) {
      return (globalThis as any).process.env.DB as D1Database;
    }
  }
  
  // Node.js environment (development)
  if (typeof process !== 'undefined') {
    if ((process as any).env?.DB) {
      return (process as any).env.DB as D1Database;
    }
  }
  
  // Request context (OpenNext Cloudflare adapter bazı durumlarda bunu kullanır)
  if (request) {
    const dbHeader = request.headers.get('x-d1-db');
    if (dbHeader && typeof globalThis !== 'undefined') {
      try {
        const db = (globalThis as any)[dbHeader];
        if (db) return db as D1Database;
      } catch {}
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

