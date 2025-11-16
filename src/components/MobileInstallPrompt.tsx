"use client";

import { useEffect, useState } from "react";
import LogoMark from "./LogoMark";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function MobileInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installEvent) return;
    installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
    setVisible(false);
  };

  const handleDismiss = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 px-4 sm:hidden">
      <div className="rounded-3xl border border-white/10 bg-[#0f1424]/95 backdrop-blur-md p-4 shadow-[0_18px_50px_rgba(4,6,16,0.65)] flex flex-col gap-3 safe-area-bottom">
        <div className="flex items-center gap-3">
          <LogoMark className="h-10 w-10" />
          <div>
            <p className="text-sm font-semibold text-white">NapiFit mobil</p>
            <p className="text-xs text-gray-400">APK oluşturduğunda otomatik olarak yüklenebilir.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDismiss}
            className="flex-1 rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-200 hover:bg-white/10 transition-colors"
          >
            Daha Sonra
          </button>
          <button
            onClick={handleInstall}
            className="flex-1 rounded-2xl bg-[linear-gradient(120deg,#7c3aed,#f97316,#06b6d4)] animate-gradient px-4 py-2 text-xs font-semibold text-white shadow-[0_12px_40px_rgba(9,10,24,0.55)]"
          >
            Telefona Ekle
          </button>
        </div>
      </div>
    </div>
  );
}

