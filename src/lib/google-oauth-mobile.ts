import { Browser } from "@capacitor/browser";
import { App } from "@capacitor/app";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function isMobilePlatform(): boolean {
  if (typeof window === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

export async function signInWithGoogleMobile(redirectTo?: string): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  const callbackUrl =
    redirectTo ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback?next=${encodeURIComponent("/dashboard")}`
      : undefined);

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
        skipBrowserRedirect: true,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      throw error;
    }

    if (!data?.url) {
      throw new Error("Supabase Google OAuth URL alınamadı.");
    }

    await Browser.open({
      url: data.url,
      windowName: "_self",
    });

    App.addListener("appUrlOpen", (event) => {
      if (event.url) {
        Browser.close();
      }
    });
  } catch (error) {
    console.error("Mobile OAuth error:", error);
    throw error;
  }
}

