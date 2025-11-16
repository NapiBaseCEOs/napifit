import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import { compare } from "bcryptjs";

// Vercel ve Cloudflare Pages için NEXTAUTH_URL - production'da otomatik olarak ayarlanır
const getNextAuthUrl = (): string => {
  // Vercel otomatik olarak VERCEL_URL environment variable'ını sağlar
  // VERCEL_URL öncelikli olmalı (Vercel deployment'ında)
  // VERCEL_URL format: napifit-xxx.vercel.app veya napifit.vercel.app
  if (process.env.VERCEL_URL) {
    const vercelUrl = process.env.VERCEL_URL;
    // Eğer zaten https:// ile başlıyorsa olduğu gibi döndür
    if (vercelUrl.startsWith('https://')) {
      return vercelUrl;
    }
    // Değilse https:// ekle
    return `https://${vercelUrl}`;
  }
  // VERCEL environment variable kontrolü (alternatif)
  if (process.env.VERCEL && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Manuel olarak ayarlanmış NEXTAUTH_URL (ama napibase.com değilse)
  if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.includes('napibase.com')) {
    return process.env.NEXTAUTH_URL;
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  // Fallback - Vercel production URL
  return "https://napifit.vercel.app";
};

const NEXTAUTH_URL = getNextAuthUrl();

// Google OAuth credentials - zorunlu kontroller
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const AUTH_SECRET = process.env.AUTH_SECRET || "";

// Server-side environment variable kontrolü ve logging
if (typeof window === "undefined") {
  console.log("🔐 NextAuth Configuration:");
  console.log(`  NEXTAUTH_URL: ${NEXTAUTH_URL}`);
  console.log(`  GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID ? "SET (" + GOOGLE_CLIENT_ID.substring(0, 15) + "...)" : "❌ MISSING"}`);
  console.log(`  GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET ? "SET (length: " + GOOGLE_CLIENT_SECRET.length + ")" : "❌ MISSING"}`);
  console.log(`  AUTH_SECRET: ${AUTH_SECRET ? "SET (length: " + AUTH_SECRET.length + ")" : "❌ MISSING"}`);
  
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error("❌ Google OAuth credentials missing! Google login will NOT work.");
    console.error("   Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Cloudflare Pages environment variables.");
  }
  
  if (!AUTH_SECRET) {
    console.error("❌ AUTH_SECRET missing! Authentication may not work properly.");
  }
  
  // Google Provider validation
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    console.log("✅ Google Provider will be initialized");
  } else {
    console.error("❌ Google Provider will NOT be initialized - missing credentials");
  }
}

export const authOptions: NextAuthOptions = {
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    // Google Provider - sadece credentials varsa ekle
    ...(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
            scope: "openid email profile",
          },
        },
      })
    ] : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          // NextAuth callback'lerinde request object'e erişim yok
          // Bu yüzden globalThis'ten D1 binding'i kontrol et
          // OpenNext Cloudflare adapter, D1 binding'i globalThis'e de ekleyebilir
          if (typeof globalThis !== 'undefined') {
            const db = (globalThis as any).DB || (globalThis as any).env?.DB || (globalThis as any).__env?.DB;
            
            if (db) {
              const { queryOne } = await import("./d1");
              // queryOne request istiyor ama burada request yok
              // Bu yüzden direkt db.prepare kullan
              try {
                const stmt = db.prepare('SELECT id, email, password, name, image FROM User WHERE email = ?').bind(credentials.email);
                const user = await stmt.first() as { 
                  id: string; 
                  email: string; 
                  password: string; 
                  name: string | null; 
                  image: string | null 
                } | null;
                
                if (!user || !user.password) return null;
                
                const valid = await compare(credentials.password, user.password);
                if (!valid) return null;
                
                return { 
                  id: user.id, 
                  name: user.name || "", 
                  email: user.email || "", 
                  image: user.image || undefined 
                };
              } catch (dbError) {
                console.error("D1 query error in authorize:", dbError);
                // Fallback to Prisma
              }
            }
          }
          
          // Fallback: Prisma kullan (development için)
          try {
            const dbConnected = await prisma.$connect().then(() => true).catch(() => false);
            if (dbConnected) {
              const user = await prisma.user.findUnique({
                where: { email: credentials.email },
              });
              
              if (!user || !user.password) return null;
              const valid = await compare(credentials.password, user.password);
              if (!valid) return null;
              
              return { 
                id: user.id, 
                name: user.name || "", 
                email: user.email || "", 
                image: user.image || undefined 
              };
            }
          } catch (prismaError) {
            console.error("Prisma error in authorize:", prismaError);
          }
          
          // Database bağlantısı yoksa null döndür
          return null;
        } catch (error) {
          console.error("Error in authorize:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("🔐 SignIn callback:", {
        provider: account?.provider,
        email: user?.email,
        name: user?.name,
      });
      
      // Google OAuth - database'e kaydet (opsiyonel, hata olsa bile devam et)
      if (account?.provider === "google" && user?.email) {
        try {
          // NextAuth signIn callback'inde request object'e erişim yok
          // globalThis'ten D1 binding'i kontrol et
          const db = (globalThis as any)?.DB || (globalThis as any)?.env?.DB || (globalThis as any)?.__env?.DB;
          
          if (db) {
            try {
              // Mevcut kullanıcıyı kontrol et
              const stmt = db.prepare('SELECT id FROM User WHERE email = ?').bind(user.email);
              const existingUser = await stmt.first() as { id: string } | null;
              
              if (!existingUser) {
                // Yeni kullanıcı oluştur
                const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
                const insertStmt = db.prepare(
                  `INSERT INTO User (id, email, name, image, emailVerified, createdAt, updatedAt, onboardingCompleted) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
                ).bind(
                  userId,
                  user.email,
                  user.name || "",
                  user.image || null,
                  new Date().toISOString(),
                  new Date().toISOString(),
                  new Date().toISOString(),
                  0
                );
                
                await insertStmt.run();
                console.log("✅ Google user created in D1");
              } else {
                console.log("✅ Google user already exists in D1");
              }
            } catch (d1Error) {
              console.error("⚠️ D1 kayıt hatası (JWT-only mode devam ediyor):", d1Error);
              // Hata olsa bile devam et - JWT-only mode
            }
          } else {
            // Fallback: Prisma kullan
            try {
              const existingUser = await prisma.user.findUnique({
                where: { email: user.email },
              }).catch(() => null);
              
              if (!existingUser) {
                await prisma.user.create({
                  data: {
                    email: user.email,
                    name: user.name || "",
                    image: user.image || null,
                    emailVerified: new Date(),
                  },
                }).catch((err) => {
                  console.log("⚠️ Prisma kayıt hatası (JWT-only mode devam ediyor):", err);
                });
                
                console.log("✅ Google user created in Prisma");
              }
            } catch (prismaError) {
              console.log("⚠️ Prisma kullanılamadı (JWT-only mode devam ediyor):", prismaError);
            }
          }
        } catch (error) {
          // Tüm hataları yakala ama devam et - JWT-only mode
          console.log("⚠️ DB kullanılamadı, JWT-only mode devam ediyor:", error);
        }
      }
      
      // Her durumda true döndür - database hatası olsa bile login'e izin ver
      return true;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      
      // Google OAuth sonrası database'den kullanıcı bilgilerini güncelle
      if (account?.provider === "google" && token.email) {
        try {
          // NextAuth JWT callback'inde request object'e erişim yok
          // globalThis'ten D1 binding'i kontrol et
          const db = (globalThis as any)?.DB || (globalThis as any)?.env?.DB || (globalThis as any)?.__env?.DB;
          
          if (db) {
            try {
              const stmt = db.prepare('SELECT id, name, image FROM User WHERE email = ?').bind(token.email as string);
              const dbUser = await stmt.first() as { 
                id: string; 
                name: string | null; 
                image: string | null 
              } | null;
              
              if (dbUser) {
                token.id = dbUser.id;
                token.name = dbUser.name || "";
                token.image = dbUser.image || undefined;
              }
            } catch (d1Error) {
              console.error("D1 query error in JWT callback:", d1Error);
              // Fallback to Prisma
              throw d1Error;
            }
          } else {
            // Fallback: Prisma kullan
            const dbUser = await prisma.user.findUnique({
              where: { email: token.email as string },
            });
            
            if (dbUser) {
              token.id = dbUser.id;
              token.name = dbUser.name || "";
              token.image = dbUser.image || undefined;
            }
          }
        } catch (error) {
          console.error("Error fetching user for Google OAuth:", error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("🔀 Redirect callback:", { url, baseUrl });
      
      // OAuth error varsa login sayfasına yönlendir
      if (url.includes("error=")) {
        try {
          const urlObj = new URL(url, baseUrl);
          const error = urlObj.searchParams.get("error");
          console.error("⚠️ OAuth redirect error:", error);
          
          // callbackUrl varsa koru
          const callbackUrl = urlObj.searchParams.get("callbackUrl");
          if (callbackUrl) {
            return `${baseUrl}/login?callbackUrl=${encodeURIComponent(callbackUrl)}&error=${error || "OAuthSignin"}`;
          }
          
          return `${baseUrl}/login?error=${error || "OAuthSignin"}`;
        } catch {
          return `${baseUrl}/login?error=OAuthSignin`;
        }
      }
      
      // Relative URL'leri baseUrl ile birleştir
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      
      // Aynı origin'den geliyorsa olduğu gibi döndür
      try {
        const urlObj = new URL(url);
        if (urlObj.origin === baseUrl) {
          return url;
        }
      } catch {
        // Invalid URL - baseUrl'e yönlendir
        return baseUrl;
      }
      
      // Google OAuth callback'i ise onboarding'e yönlendir
      if (url.includes("accounts.google.com") || url.includes("google")) {
        // Bu durumda URL zaten Google'a ait, olduğu gibi döndür
        return url;
      }
      
      // Diğer durumlarda baseUrl'e yönlendir
      return baseUrl;
    },
  },
  secret: AUTH_SECRET,
  debug: true, // Her zaman debug açık - Cloudflare Pages'de log görmek için
  useSecureCookies: NEXTAUTH_URL.startsWith("https://"),
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax" as const, // Cloudflare Pages için lax daha uyumlu
        path: "/",
        secure: NEXTAUTH_URL.startsWith("https://"),
        domain: NEXTAUTH_URL.startsWith("https://") ? ".napibase.com" : undefined, // Cookie domain
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: NEXTAUTH_URL.startsWith("https://"),
        domain: NEXTAUTH_URL.startsWith("https://") ? ".napibase.com" : undefined,
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: NEXTAUTH_URL.startsWith("https://"),
        domain: NEXTAUTH_URL.startsWith("https://") ? ".napibase.com" : undefined,
      },
    },
  },
};
