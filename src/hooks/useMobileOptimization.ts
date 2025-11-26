"use client";

import { useEffect, useState } from "react";
import { getDeviceCapabilities, shouldDisableAnimations, shouldDisableBackdropBlur, prefersReducedMotion } from "@/lib/performance/mobile-utils";

export interface MobileOptimizationState {
  capabilities: ReturnType<typeof getDeviceCapabilities>;
  disableAnimations: boolean;
  disableBackdropBlur: boolean;
  reducedMotion: boolean;
}

/**
 * Hook for mobile performance optimization
 * Automatically detects device capabilities and applies optimizations
 */
export function useMobileOptimization(): MobileOptimizationState {
  const [state, setState] = useState<MobileOptimizationState>(() => {
    if (typeof window === "undefined") {
      return {
        capabilities: {
          isLowPower: false,
          isAndroid: false,
          hasSlowConnection: false,
          deviceMemory: 8,
          hardwareConcurrency: 8,
          supportsScheduledNotifications: false,
        },
        disableAnimations: false,
        disableBackdropBlur: false,
        reducedMotion: false,
      };
    }
    
    const capabilities = getDeviceCapabilities();
    return {
      capabilities,
      disableAnimations: shouldDisableAnimations(),
      disableBackdropBlur: shouldDisableBackdropBlur(),
      reducedMotion: prefersReducedMotion(),
    };
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateState = () => {
      const capabilities = getDeviceCapabilities();
      setState({
        capabilities,
        disableAnimations: shouldDisableAnimations(),
        disableBackdropBlur: shouldDisableBackdropBlur(),
        reducedMotion: prefersReducedMotion(),
      });
    };

    // Initial update
    updateState();

    // Listen for connection changes
    const connection = (navigator as unknown as { connection?: { addEventListener?: (event: string, handler: () => void) => void } }).connection;
    if (connection?.addEventListener) {
      connection.addEventListener("change", updateState);
    }

    // Listen for reduced motion preference changes
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleReducedMotion = () => {
      setState((prev) => ({
        ...prev,
        reducedMotion: mediaQuery.matches,
      }));
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleReducedMotion);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleReducedMotion);
    }

    return () => {
      if (connection?.removeEventListener) {
        connection.removeEventListener("change", updateState);
      }
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleReducedMotion);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleReducedMotion);
      }
    };
  }, []);

  return state;
}

