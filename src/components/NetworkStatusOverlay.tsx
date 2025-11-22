"use client";

import { useNetworkStatus } from "@/context/NetworkStatusContext";
import AiLoadingScreen from "@/components/ui/AiLoadingScreen";

export default function NetworkStatusOverlay() {
  const { online } = useNetworkStatus();

  if (online) {
    return null;
  }

  return (
    <AiLoadingScreen
      title="Bağlantı kesildi"
      message="İnternet bağlantısı yok. Ağ yeniden geldiğinde sayfa otomatik yenilenecek."
      variant="fullscreen"
      showBackdrop
    />
  );
}








