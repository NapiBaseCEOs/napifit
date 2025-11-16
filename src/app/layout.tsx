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
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="tr" className={fontSans.variable}>
      <body className="font-sans">
        <ThemeProvider>
          <CursorGlow />
          <SupabaseProvider initialSession={session}>
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

