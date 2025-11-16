"use client";

import { Suspense, useEffect } from "react";

function GoogleOAuthHandlerInner() {
  useEffect(() => {
    let removeListener: (() => void) | undefined;

    const registerDeepLinkListener = async () => {
      try {
        const { App } = await import("@capacitor/app");
        const listener = await App.addListener("appUrlOpen", (data: { url: string }) => {
          if (!data.url) return;

          try {
            if (data.url.startsWith("napibase://")) {
              const normalizedUrl = data.url.replace("napibase://", "https://");
              window.location.href = normalizedUrl;
              return;
            }

            if (data.url.startsWith("https://") || data.url.startsWith("http://")) {
              window.location.href = data.url;
            }
          } catch (error) {
            console.error("[OAuthHandler] Failed to handle deep link:", error);
          }
        });

        removeListener = () => {
          listener.remove();
        };
      } catch {
        // Capacitor yok, sessizce devam et
      }
    };

    registerDeepLinkListener();

    return () => {
      removeListener?.();
    };
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

