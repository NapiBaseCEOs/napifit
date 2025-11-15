import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import { compare } from "bcryptjs";

// Cloudflare Pages için NEXTAUTH_URL - production'da otomatik olarak ayarlanır
const getNextAuthUrl = (): string => {
  // Cloudflare Pages'de environment variable'dan al
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // Development'ta localhost
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  
  // Fallback: Production URL
  return "https://napibase.com";
};

const NEXTAUTH_URL = getNextAuthUrl();

// Environment variables kontrolü
if (typeof window === "undefined") {
  // Sadece server-side'da kontrol et
  const requiredVars = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXTAUTH_URL,
  };
  
  if (process.env.NODE_ENV === "development") {
    Object.entries(requiredVars).forEach(([key, value]) => {
      if (!value) {
        console.warn(`⚠️ ${key} is missing. OAuth may not work properly.`);
      }
    });
  }
}

export const authOptions: NextAuthOptions = {
  // JWT-only mode (Cloudflare Pages için optimize edildi)
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
      // Cloudflare Pages için callback URL
      checks: ["pkce", "state"],
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          // D1 Database'i dene önce
          if (typeof globalThis !== 'undefined' && (globalThis as any).DB) {
            const { queryOne } = await import("./d1");
            const user = await queryOne<{ 
              id: string; 
              email: string; 
              password: string; 
              name: string | null; 
              image: string | null 
            }>(
              'SELECT id, email, password, name, image FROM User WHERE email = ?',
              [credentials.email]
            ).catch(() => null);
            
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
          
          // Fallback: Prisma kullan (development için)
          await prisma.$connect();
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
      // Her zaman girişe izin ver (database hatası olsa bile JWT ile çalışır)
      if (account?.provider === "google" && user?.email) {
        // Database'e kaydet (opsiyonel - hata olsa bile giriş yapsın)
        try {
          // D1 Database'i dene önce
          if (typeof globalThis !== 'undefined' && (globalThis as any).DB) {
            const { queryOne, execute } = await import("./d1");
            
            const existingUser = await queryOne<{ id: string }>(
              'SELECT id FROM User WHERE email = ?',
              [user.email]
            ).catch(() => null);
            
            if (!existingUser) {
              const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
              await execute(
                `INSERT INTO User (id, email, name, image, emailVerified, createdAt, updatedAt, onboardingCompleted) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  userId,
                  user.email,
                  user.name || "",
                  user.image || null,
                  new Date().toISOString(),
                  new Date().toISOString(),
                  new Date().toISOString(),
                  0 // false
                ]
              ).catch((err) => {
                console.log("⚠️ D1 kayıt hatası (devam ediliyor):", err);
              });
            }
          } else {
            // Fallback: Prisma kullan (development için)
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
                console.log("⚠️ DB kayıt hatası (devam ediliyor):", err);
              });
            }
          }
        } catch (error) {
          // Sessizce devam et - JWT session yeterli
          console.log("⚠️ DB kullanılamadı, JWT-only mode");
        }
      }
      
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
          // D1 Database'i dene önce
          if (typeof globalThis !== 'undefined' && (globalThis as any).DB) {
            const { queryOne } = await import("./d1");
            const dbUser = await queryOne<{ 
              id: string; 
              name: string | null; 
              image: string | null 
            }>(
              'SELECT id, name, image FROM User WHERE email = ?',
              [token.email as string]
            ).catch(() => null);
            
            if (dbUser) {
              token.id = dbUser.id;
              token.name = dbUser.name || "";
              token.image = dbUser.image || undefined;
            }
          } else {
            // Fallback: Prisma kullan (development için)
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
      // OAuth error varsa login sayfasına yönlendir
      if (url.includes("error=")) {
        try {
          const urlObj = new URL(url, baseUrl);
          const error = urlObj.searchParams.get("error");
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
        if (urlObj.origin === baseUrl || urlObj.origin === baseUrl.replace(/^https?:/, '')) {
          return url;
        }
      } catch {
        // Invalid URL, baseUrl'e yönlendir
      }
      
      // Diğer durumlarda baseUrl'e yönlendir
      return baseUrl;
    },
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  // Cloudflare Pages için optimize edilmiş ayarlar
  useSecureCookies: NEXTAUTH_URL.startsWith("https://"),
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: NEXTAUTH_URL.startsWith("https://"),
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: NEXTAUTH_URL.startsWith("https://"),
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: NEXTAUTH_URL.startsWith("https://"),
      },
    },
  },
};
