import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "../components/Header";
import GoogleOAuthHandler from "../components/GoogleOAuthHandler";
import SupabaseProvider from "../components/SupabaseProvider";
import UpdateCheckerProvider from "../components/UpdateCheckerProvider";
import VersionUpdateBanner from "../components/VersionUpdateBanner";
import ThemeProvider from "../components/ThemeProvider";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Plus_Jakarta_Sans } from "next/font/google";
import { hasSupabaseClientEnv } from "@/lib/supabase/config";
import MobileInstallPrompt from "@/components/MobileInstallPrompt";
import MobilePerformanceTuner from "@/components/MobilePerformanceTuner";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://napifit.vercel.app";
const metadataBase = new URL(appUrl.startsWith("http") ? appUrl : `https://${appUrl}`);

export const metadata: Metadata = {
  metadataBase,
  applicationName: "NapiFit",
  title: {
    default: "NapiFit",
    template: "%s | NapiFit",
  },
  description: "NapiFit - NapiBase tarafından geliştirilmiş Supabase destekli fitness ve sağlık takip uygulaması",
  category: "health_and_fitness",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.png", sizes: "256x256", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NapiFit",
  },
  formatDetection: { telephone: false },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050b1f" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
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
          <LocaleProvider>
          <SupabaseProvider initialSession={session} enabled={hasSupabaseClientEnv}>
            <GoogleOAuthHandler />
            <UpdateCheckerProvider>
                <MobilePerformanceTuner />
              <VersionUpdateBanner />
              <Header />
              {children}
              <MobileInstallPrompt />
            </UpdateCheckerProvider>
          </SupabaseProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

