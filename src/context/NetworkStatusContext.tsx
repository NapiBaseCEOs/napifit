"use client";

import { createContext, useContext } from "react";
import useNetworkMonitor, { type NetworkState } from "@/hooks/useNetworkMonitor";

const NetworkStatusContext = createContext<NetworkState>({
  online: true,
  checking: false,
  latencyMs: null,
  speedMbps: null,
  lastChecked: null,
});

export function NetworkStatusProvider({ children }: { children: React.ReactNode }) {
  const state = useNetworkMonitor();
  return <NetworkStatusContext.Provider value={state}>{children}</NetworkStatusContext.Provider>;
}

export function useNetworkStatus() {
  return useContext(NetworkStatusContext);
}








