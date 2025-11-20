"use client";

import { useNetworkStatus } from "@/context/NetworkStatusContext";

export default function NetworkStatusIndicator() {
  const { online, speedMbps, checking } = useNetworkStatus();
  const statusColor = online ? "bg-emerald-400" : "bg-red-500";
  const textColor = online ? "text-emerald-200" : "text-red-300";
  const label = online
    ? checking
      ? "Ölçülüyor..."
      : `${speedMbps !== null ? speedMbps.toFixed(2) : "--"} Mbps`
    : "Bağlantı yok";

  return (
    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
      <span className={`h-2 w-2 rounded-full ${statusColor} ${online ? "animate-pulse" : ""}`} />
      <span className={textColor}>{label}</span>
    </div>
  );
}



