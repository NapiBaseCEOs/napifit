import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Providers from "../components/Providers";
import CursorGlow from "../components/CursorGlow";
import GoogleOAuthHandler from "../components/GoogleOAuthHandler";
import UpdateCheckerProvider from "../components/UpdateCheckerProvider";
import VersionUpdateBanner from "../components/VersionUpdateBanner";
import { Plus_Jakarta_Sans } from "next/font/google";
import ThemeProvider from "../components/ThemeProvider";

export const metadata: Metadata = {
  title: "NapiFit",
  description: "NapiFit - NapiBase tarafından geliştirilmiş fitness ve sağlık takip uygulaması",
};

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={fontSans.variable}>
      <body className="font-sans">
        <ThemeProvider>
          <CursorGlow />
          <Providers>
            <GoogleOAuthHandler />
            <UpdateCheckerProvider>
              <VersionUpdateBanner />
              <Header />
              {children}
            </UpdateCheckerProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

