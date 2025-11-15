"use client";

import { useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

function GoogleOAuthHandlerInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  useEffect(() => {
    // OAuth callback sayfasında mıyız?
    if (pathname?.includes("/api/auth/callback")) {
      // Session yüklendiğinde yönlendir
      if (status === "authenticated" && session) {
      const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
      router.push(callbackUrl as any);
      router.refresh();
      }
    }
  }, [pathname, searchParams, router, status, session]);

  // Mobil deep link handling (sadece mobilde)
  useEffect(() => {
    if (typeof window === "undefined") return;

      const handleAppUrl = async () => {
        try {
          const { App } = await import("@capacitor/app");
          
        const listener = await App.addListener("appUrlOpen", (data: { url: string }) => {
          console.log("[GoogleOAuthHandler] App URL opened:", data.url);
              
          try {
            // Custom URL scheme (napibase://oauth)
            if (data.url.startsWith("napibase://")) {
                const url = new URL(data.url.replace("napibase://", "https://"));
              const callbackPath = `/api/auth/callback/google${url.search}`;
              console.log("[GoogleOAuthHandler] Redirecting to:", callbackPath);
                window.location.href = callbackPath;
                return;
              }
              
            // HTTPS deep link
            if (data.url.includes("/api/auth/callback")) {
              const url = new URL(data.url);
              const callbackPath = url.pathname + url.search;
              console.log("[GoogleOAuthHandler] Redirecting to:", callbackPath);
              window.location.href = callbackPath;
              }
            } catch (err) {
            console.error("[GoogleOAuthHandler] Error handling URL:", err);
            }
          });

        // Cleanup function
        return () => {
          listener.remove();
        };
        } catch (err) {
        // Capacitor yoksa (web'de) sessizce devam et
        }
      };

      handleAppUrl();
  }, []);

  return null;
}

export default function GoogleOAuthHandler() {
  return (
    <Suspense fallback={null}>
      <GoogleOAuthHandlerInner />
    </Suspense>
  );
}

