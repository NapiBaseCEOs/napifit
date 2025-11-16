import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { prisma } from "./db";

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
          // Prisma ile kullanıcıyı bul
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.trim().toLowerCase() },
            select: {
              id: true,
              email: true,
              password: true,
              name: true,
              image: true,
            },
          });

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
            email: user.email || "",
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
          // Mevcut kullanıcıyı kontrol et
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email.toLowerCase() },
          });

          if (!existingUser) {
            // Yeni kullanıcı oluştur
            await prisma.user.create({
              data: {
                email: user.email.toLowerCase(),
                name: user.name || "",
                image: user.image || null,
                emailVerified: new Date(),
              },
            });
            console.log("✅ Google user created in Supabase");
          } else {
            console.log("✅ Google user already exists in Supabase");
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
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email.toLowerCase() },
            select: {
              id: true,
              name: true,
              image: true,
            },
          });

          if (dbUser) {
            token.id = dbUser.id;
            token.name = dbUser.name || "";
            token.image = dbUser.image || undefined;
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
