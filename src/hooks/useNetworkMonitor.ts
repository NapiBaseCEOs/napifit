"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type NetworkState = {
  online: boolean;
  checking: boolean;
  latencyMs: number | null;
  speedMbps: number | null;
  lastChecked: number | null;
};

const TEST_ICON = "/icon.png";
const POLL_INTERVAL = 10000;

async function measureConnection(): Promise<{ latency: number; speedMbps: number }> {
  const url = `${TEST_ICON}?ts=${Date.now()}`;
  const start = performance.now();
  const response = await fetch(url, {
    cache: "no-store",
  });
  const bytes = (await response.arrayBuffer()).byteLength || 1;
  const latency = performance.now() - start;
  const seconds = latency / 1000 || 1;
  const megabits = (bytes * 8) / 1_000_000;
  const speedMbps = megabits / seconds;
  return { latency, speedMbps };
}

export default function useNetworkMonitor(): NetworkState {
  const [state, setState] = useState<NetworkState>({
    online: typeof window === "undefined" ? true : navigator.onLine,
    checking: false,
    latencyMs: null,
    speedMbps: null,
    lastChecked: null,
  });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const runCheck = useCallback(async () => {
    setState((prev) => ({ ...prev, checking: true }));
    try {
      const controller = new AbortController();
      const abortTimeout = setTimeout(() => controller.abort(), 5000);
      const start = performance.now();
      await fetch(`/api/ping?ts=${Date.now()}`, {
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(abortTimeout);
      const pingLatency = performance.now() - start;
      const { latency, speedMbps } = await measureConnection();
      setState({
        online: true,
        checking: false,
        latencyMs: Math.round((latency + pingLatency) / 2),
        speedMbps: Number(speedMbps.toFixed(2)),
        lastChecked: Date.now(),
      });
    } catch {
      setState((prev) => ({
        ...prev,
        online: false,
        checking: false,
        latencyMs: null,
        speedMbps: null,
        lastChecked: Date.now(),
      }));
    }
  }, []);

  useEffect(() => {
    runCheck();
    const handleOnline = () => {
      setState((prev) => ({ ...prev, online: true }));
      runCheck();
    };
    const handleOffline = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setState((prev) => ({ ...prev, online: false }));
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    timeoutRef.current = setInterval(runCheck, POLL_INTERVAL) as unknown as NodeJS.Timeout;

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, [runCheck]);

  return state;
}



