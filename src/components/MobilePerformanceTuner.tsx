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

function isLowPowerDevice() {
  if (typeof navigator === "undefined") return false;
  const hardwareConcurrency = navigator.hardwareConcurrency ?? 8;
  const deviceMemory = (navigator as unknown as { deviceMemory?: number })?.deviceMemory ?? 8;
  const connection = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const saveDataEnabled = Boolean(connection?.saveData);
  const slowConnection = ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "");

  return hardwareConcurrency <= 4 || deviceMemory <= 2 || saveDataEnabled || slowConnection;
}

export default function MobilePerformanceTuner() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const shouldOptimize = isAndroidLowPower();
    const isLowPower = isLowPowerDevice();

    if (!shouldOptimize && !isLowPower) {
      return;
    }

    const root = document.documentElement;
    const body = document.body;
    
    // Android low power optimizations
    if (shouldOptimize) {
      root.classList.add("android-performance");
      body.classList.add("android-performance");
    }
    
    // General low power optimizations
    if (isLowPower) {
      root.classList.add("low-power-device");
      body.classList.add("low-power-device");
      
      // Disable animations globally
      const style = document.createElement("style");
      style.id = "performance-overrides";
      style.textContent = `
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-delay: 0.01ms !important;
          transition-duration: 0.01ms !important;
          transition-delay: 0.01ms !important;
          scroll-behavior: auto !important;
        }
        
        [class*="animate-"],
        [class*="backdrop-blur"] {
          animation: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
        
        img {
          loading: lazy !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      root.classList.remove("android-performance", "low-power-device");
      body.classList.remove("android-performance", "low-power-device");
      const style = document.getElementById("performance-overrides");
      if (style) {
        style.remove();
      }
    };
  }, []);

  return null;
}








