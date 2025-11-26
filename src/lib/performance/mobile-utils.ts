/**
 * Mobile performance utilities
 * Helper functions for detecting device capabilities and optimizing performance
 */

export interface DeviceCapabilities {
  isLowPower: boolean;
  isAndroid: boolean;
  hasSlowConnection: boolean;
  deviceMemory: number;
  hardwareConcurrency: number;
  supportsScheduledNotifications: boolean;
}

/**
 * Detect if device is low power
 */
export function isLowPowerDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  
  const hardwareConcurrency = navigator.hardwareConcurrency ?? 8;
  const deviceMemory = (navigator as unknown as { deviceMemory?: number })?.deviceMemory ?? 8;
  const connection = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  
  const saveDataEnabled = Boolean(connection?.saveData);
  const slowConnection = ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "");
  
  return hardwareConcurrency <= 4 || deviceMemory <= 2 || saveDataEnabled || slowConnection;
}

/**
 * Detect if device is Android low power
 */
export function isAndroidLowPower(): boolean {
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

/**
 * Get device capabilities
 */
export function getDeviceCapabilities(): DeviceCapabilities {
  if (typeof navigator === "undefined") {
    return {
      isLowPower: false,
      isAndroid: false,
      hasSlowConnection: false,
      deviceMemory: 8,
      hardwareConcurrency: 8,
      supportsScheduledNotifications: false,
    };
  }
  
  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);
  const hardwareConcurrency = navigator.hardwareConcurrency ?? 8;
  const deviceMemory = (navigator as unknown as { deviceMemory?: number })?.deviceMemory ?? 8;
  const connection = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  
  const saveDataEnabled = Boolean(connection?.saveData);
  const slowConnection = ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "");
  
  const supportsScheduledNotifications =
    "serviceWorker" in navigator &&
    "Notification" in window &&
    "showTrigger" in (Notification.prototype as any) &&
    "TimestampTrigger" in window;
  
  return {
    isLowPower: isLowPowerDevice(),
    isAndroid,
    hasSlowConnection: slowConnection || saveDataEnabled,
    deviceMemory,
    hardwareConcurrency,
    supportsScheduledNotifications,
  };
}

/**
 * Should disable animations
 */
export function shouldDisableAnimations(): boolean {
  return isLowPowerDevice() || isAndroidLowPower();
}

/**
 * Should disable backdrop blur
 */
export function shouldDisableBackdropBlur(): boolean {
  return isLowPowerDevice() || isAndroidLowPower();
}

/**
 * Should use reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

