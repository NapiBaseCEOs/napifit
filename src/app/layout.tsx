import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import CursorGlow from "../components/CursorGlow";
import GoogleOAuthHandler from "../components/GoogleOAuthHandler";
import SupabaseProvider from "../components/SupabaseProvider";
import UpdateCheckerProvider from "../components/UpdateCheckerProvider";
import VersionUpdateBanner from "../components/VersionUpdateBanner";
import ThemeProvider from "../components/ThemeProvider";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Plus_Jakarta_Sans } from "next/font/google";
import { hasSupabaseClientEnv } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "NapiFit",
  description: "NapiFit - NapiBase tarafından geliştirilmiş fitness ve sağlık takip uygulaması",
};

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;

  if (hasSupabaseClientEnv) {
    try {
      const supabase = createSupabaseServerClient();
      const {
        data: { session: activeSession },
      } = await supabase.auth.getSession();
      session = activeSession;
    } catch (error) {
      console.warn("⚠️ Supabase session fetch skipped:", error);
    }
  }

  return (
    <html lang="tr" className={fontSans.variable}>
      <body className="font-sans">
        <ThemeProvider>
          <CursorGlow />
          <SupabaseProvider initialSession={session} enabled={hasSupabaseClientEnv}>
            <GoogleOAuthHandler />
            <UpdateCheckerProvider>
              <VersionUpdateBanner />
              <Header />
              {children}
            </UpdateCheckerProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

