/**
 * Turso Database Client
 * Turso (libSQL) database bağlantısı için
 */

import { createClient } from '@libsql/client';

let tursoClient: ReturnType<typeof createClient> | null = null;

export function getTursoClient() {
  if (tursoClient) {
    return tursoClient;
  }

  const databaseUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!databaseUrl) {
    console.warn('⚠️ TURSO_DATABASE_URL environment variable not set');
    return null;
  }

  try {
    // Turso client oluştur
    tursoClient = createClient({
      url: databaseUrl,
      authToken: authToken || undefined,
    });

    console.log('✅ Turso client created');
    return tursoClient;
  } catch (error) {
    console.error('❌ Turso client creation error:', error);
    return null;
  }
}

// Helper: Query one row
export async function queryOne<T = any>(
  query: string,
  params: any[] = []
): Promise<T | null> {
  const client = getTursoClient();
  if (!client) {
    return null;
  }

  try {
    const stmt = client.prepare(query);
    const result = await stmt.get(params);
    return (result as T) || null;
  } catch (error) {
    console.error('Turso query error:', error);
    return null;
  }
}

// Helper: Query all rows
export async function queryAll<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  const client = getTursoClient();
  if (!client) {
    return [];
  }

  try {
    const stmt = client.prepare(query);
    const result = await stmt.all(params);
    return result.rows as T[];
  } catch (error) {
    console.error('Turso query error:', error);
    return [];
  }
}

// Helper: Execute (INSERT, UPDATE, DELETE)
export async function execute(
  query: string,
  params: any[] = []
): Promise<boolean> {
  const client = getTursoClient();
  if (!client) {
    return false;
  }

  try {
    const stmt = client.prepare(query);
    await stmt.run(params);
    return true;
  } catch (error) {
    console.error('Turso execute error:', error);
    return false;
  }
}

// Test connection
export async function testConnection(): Promise<boolean> {
  try {
    const result = await queryOne('SELECT 1 as test');
    return result !== null;
  } catch {
    return false;
  }
}
