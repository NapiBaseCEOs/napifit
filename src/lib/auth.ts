import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import { compare } from "bcryptjs";

// Environment variables kontrolü (sadece runtime'da, build sırasında değil)
// Cloudflare Pages build sırasında env vars yok, runtime'da olacak
if (typeof window === "undefined" && process.env.NODE_ENV !== "production") {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn("⚠️ Google OAuth credentials missing. Google login will not work.");
  }

  if (!process.env.AUTH_SECRET) {
    console.warn("⚠️ AUTH_SECRET missing. Authentication may not work properly.");
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
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
          await prisma.$connect();
        } catch (dbError) {
          console.error("Database connection error in authorize:", dbError);
          return null;
        }
        
        try {
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
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      
      // Google OAuth sonrası kullanıcı bilgilerini database'den al
      if (account?.provider === "google" && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
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
      // Relative URL'leri baseUrl ile birleştir
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Aynı origin'den geliyorsa olduğu gibi döndür
      if (new URL(url).origin === baseUrl) return url;
      // Diğer durumlarda baseUrl'e yönlendir
      return baseUrl;
    },
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

