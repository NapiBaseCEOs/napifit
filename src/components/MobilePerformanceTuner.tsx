"use client";

import { useEffect } from "react";

function isAndroidLowPower() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);
  const hardwareConcurrency = navigator.hardwareConcurrency ?? 8;
  const deviceMemory = (navigator as unknown as { deviceMemory?: number })?.deviceMemory ?? 8;
  const connection = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;

  const saveDataEnabled = Boolean(connection?.saveData);
  const slowConnection = ["slow-2g", "2g"].includes(connection?.effectiveType ?? "");

  return (
    isAndroid &&
    (hardwareConcurrency <= 6 || deviceMemory <= 4 || saveDataEnabled || slowConnection)
  );
}

export default function MobilePerformanceTuner() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const shouldOptimize = isAndroidLowPower();

    if (!shouldOptimize) {
      return;
    }

    const root = document.documentElement;
    const body = document.body;
    root.classList.add("android-performance");
    body.classList.add("android-performance");

    return () => {
      root.classList.remove("android-performance");
      body.classList.remove("android-performance");
    };
  }, []);

  return null;
}








