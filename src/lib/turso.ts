/**
 * Turso Database Client
 * Turso (libSQL) database bağlantısı için
 * Dynamic import kullanarak build-time bundle sorunlarını önler
 */

let tursoClient: any = null;
let tursoClientPromise: Promise<any> | null = null;

async function getTursoClient() {
  if (tursoClient) {
    return tursoClient;
  }

  // Dynamic import - build sırasında bundle edilmez
  if (!tursoClientPromise) {
    tursoClientPromise = (async () => {
      try {
        const { createClient } = await import('@libsql/client');
        
        const databaseUrl = process.env.TURSO_DATABASE_URL;
        const authToken = process.env.TURSO_AUTH_TOKEN;

        if (!databaseUrl) {
          console.warn('⚠️ TURSO_DATABASE_URL environment variable not set');
          return null;
        }

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
    })();
  }

  return await tursoClientPromise;
}

// Helper: Query one row
export async function queryOne<T = any>(
  query: string,
  params: any[] = []
): Promise<T | null> {
  const client = await getTursoClient();
  if (!client) {
    return null;
  }

  try {
    const result = await client.execute({
      sql: query,
      args: params,
    });

    return (result.rows[0] as T) || null;
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
  const client = await getTursoClient();
  if (!client) {
    return [];
  }

  try {
    const result = await client.execute({
      sql: query,
      args: params,
    });

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
  const client = await getTursoClient();
  if (!client) {
    return false;
  }

  try {
    await client.execute({
      sql: query,
      args: params,
    });

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

