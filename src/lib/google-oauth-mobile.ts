import { Browser } from "@capacitor/browser";
import { App } from "@capacitor/app";

export function isMobilePlatform(): boolean {
  if (typeof window === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

export async function signInWithGoogleMobile(callbackUrl: string = "/dashboard"): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  
  const authUrl = `${baseUrl}/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  
  try {
    // Capacitor Browser ile aç
    await Browser.open({
      url: authUrl,
      windowName: "_self",
    });

    // Deep link dinleyicisi ekle
    App.addListener("appUrlOpen", (data: { url: string }) => {
      if (data.url.includes("/api/auth/callback")) {
        Browser.close();
      }
    });
  } catch (error) {
    console.error("Mobile OAuth error:", error);
    throw error;
  }
}

