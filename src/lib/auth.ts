import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { queryOne, execute, getTursoClient } from "./turso";

// NEXTAUTH_URL - Vercel için otomatik algılama
function getNextAuthUrl(): string {
  // Vercel production
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Manuel ayarlanmışsa
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  // Development
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  // Fallback
  return "https://napifit.vercel.app";
}

const NEXTAUTH_URL = getNextAuthUrl();

// Environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const AUTH_SECRET = process.env.AUTH_SECRET || "";

// Log configuration
if (typeof window === "undefined") {
  console.log("🔐 NextAuth Configuration:");
  console.log(`  NEXTAUTH_URL: ${NEXTAUTH_URL}`);
  console.log(`  GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID ? "SET" : "❌ MISSING"}`);
  console.log(`  GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET ? "SET" : "❌ MISSING"}`);
  console.log(`  AUTH_SECRET: ${AUTH_SECRET ? "SET" : "❌ MISSING"}`);
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    // Google Provider
    ...(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    // Credentials Provider
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const client = getTursoClient();
          if (!client) {
            console.error("❌ Turso client not available");
            return null;
          }

          // Kullanıcıyı bul
          const user = await queryOne<{
            id: string;
            email: string;
            password: string;
            name: string | null;
            image: string | null;
          }>("SELECT id, email, password, name, image FROM User WHERE email = ?", [
            credentials.email.trim().toLowerCase(),
          ]);

          if (!user || !user.password) {
            return null;
          }

          // Şifre kontrolü
          const valid = await compare(credentials.password, user.password);
          if (!valid) {
            return null;
          }

          return {
            id: user.id,
            name: user.name || "",
            email: user.email,
            image: user.image || undefined,
          };
        } catch (error) {
          console.error("❌ Authorize error:", error);
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
    async signIn({ user, account }) {
      // Google OAuth - kullanıcıyı database'e kaydet
      if (account?.provider === "google" && user?.email) {
        try {
          const client = getTursoClient();
          if (!client) {
            console.warn("⚠️ Turso not available, continuing with JWT-only");
            return true;
          }

          // Mevcut kullanıcıyı kontrol et
          const existingUser = await queryOne<{ id: string }>(
            "SELECT id FROM User WHERE email = ?",
            [user.email.toLowerCase()]
          );

          if (!existingUser) {
            // Yeni kullanıcı oluştur
            const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            const now = new Date().toISOString();

            const success = await execute(
              `INSERT INTO User (id, email, name, image, emailVerified, createdAt, updatedAt, onboardingCompleted) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                userId,
                user.email.toLowerCase(),
                user.name || "",
                user.image || null,
                now,
                now,
                now,
                0, // false
              ]
            );

            if (success) {
              console.log("✅ Google user created in Turso");
            } else {
              console.warn("⚠️ Failed to create Google user in Turso");
            }
          }
        } catch (error) {
          console.error("⚠️ Error creating Google user:", error);
          // Hata olsa bile devam et - JWT-only mode
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
          const client = getTursoClient();
          if (client) {
            const dbUser = await queryOne<{
              id: string;
              name: string | null;
              image: string | null;
            }>("SELECT id, name, image FROM User WHERE email = ?", [token.email.toLowerCase()]);

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
        return baseUrl;
      }

      return baseUrl;
    },
  },
  secret: AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  useSecureCookies: NEXTAUTH_URL.startsWith("https://"),
};
