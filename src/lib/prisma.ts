import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Cloudflare D1 için DATABASE_URL oluştur
// Production'da Cloudflare Pages environment variable'dan alınır
// Development'ta local SQLite dosyası kullanılır
function getDatabaseUrl(): string {
  // Cloudflare Pages'de DATABASE_URL environment variable kullanılır
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  // Development'ta local SQLite
  if (process.env.NODE_ENV === "development") {
    return "file:./dev.db";
  }
  
  // Fallback: D1 için özel URL formatı (Cloudflare Pages otomatik sağlar)
  // Eğer environment variable yoksa, Prisma client generate için dummy URL
  return "file:./prisma/db.sqlite";
}

// SQLite (D1) için Prisma client oluştur
export const prisma = global.prisma || new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

// Database bağlantısını test et (sadece development'ta)
// Production'da Cloudflare D1 otomatik bağlanır
if (process.env.NODE_ENV === "development") {
  prisma.$connect().catch((error) => {
    console.error("⚠️ Prisma connection error:", error);
    console.warn("⚠️ Database bağlantısı yok. Bazı özellikler çalışmayabilir.");
    console.warn("💡 .env dosyasındaki DATABASE_URL'i kontrol edin.");
    console.warn("💡 Local development için: DATABASE_URL='file:./dev.db'");
  });
}

// Production'da da global kullan (Cloudflare Pages'de D1 binding kullanılacak)
if (!global.prisma) global.prisma = prisma;

// Helper: Database bağlantısını güvenli şekilde test et
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

