import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// SQLite (D1) için Prisma client oluştur
export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

// Database bağlantısını test et (sadece development'ta)
if (process.env.NODE_ENV === "development") {
  prisma.$connect().catch((error) => {
    console.error("⚠️ Prisma connection error:", error);
    console.warn("⚠️ Database bağlantısı yok. Bazı özellikler çalışmayabilir.");
    console.warn("💡 .env dosyasındaki DATABASE_URL'i kontrol edin.");
    console.warn("💡 Local development için: DATABASE_URL='file:./dev.db'");
    console.warn("💡 D1 migration yapmayı unutmayın: npm run d1:init");
  });
}

// Production'da da global kullan (Cloudflare Pages'de D1 binding kullanılacak)
if (!global.prisma) global.prisma = prisma;

