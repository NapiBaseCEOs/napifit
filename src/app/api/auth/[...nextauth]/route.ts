import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/auth";

// NextAuth crypto modülü kullandığı için Edge Runtime'da çalışmaz
// Cloudflare Pages'de @cloudflare/next-on-pages Node.js runtime kullanır
// export const runtime = 'edge'; // Kaldırıldı - NextAuth için gerekli değil

// Force dynamic rendering - NextAuth session ve cookies kullanıyor
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

