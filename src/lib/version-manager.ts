import { APP_VERSION } from "@/config/version";

const VERSION_CHECK_KEY = "napifit_version_check";
const VERSION_DISMISSED_KEY = "napifit_version_dismissed";

interface VersionCheck {
  version: string;
  lastCheck: number;
  ip?: string;
}

// IP adresini al (client-side için yaklaşık)
async function getClientIP(): Promise<string> {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip || "unknown";
  } catch {
    return "unknown";
  }
}

// Versiyon bilgisini localStorage'dan al
export function getStoredVersionCheck(): VersionCheck | null {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = localStorage.getItem(VERSION_CHECK_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

// Versiyon bilgisini kaydet
export async function saveVersionCheck(): Promise<void> {
  if (typeof window === "undefined") return;
  
  const ip = await getClientIP();
  const versionCheck: VersionCheck = {
    version: APP_VERSION,
    lastCheck: Date.now(),
    ip,
  };
  
  localStorage.setItem(VERSION_CHECK_KEY, JSON.stringify(versionCheck));
  localStorage.removeItem(VERSION_DISMISSED_KEY);
}

// Yeni versiyon var mı kontrol et
export async function checkForNewVersion(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  
  const stored = getStoredVersionCheck();
  const currentIP = await getClientIP();
  
  // İlk ziyaret veya farklı IP
  if (!stored || stored.ip !== currentIP) {
    return false; // Yeni kullanıcı/IP, güncelleme gösterme
  }
  
  // Versiyon farklı mı?
  if (stored.version !== APP_VERSION) {
    // Kullanıcı bu versiyonu dismiss etmiş mi?
    const dismissed = localStorage.getItem(VERSION_DISMISSED_KEY);
    if (dismissed === APP_VERSION) {
      return false;
    }
    return true;
  }
  
  return false;
}

// Güncelleme bildirimini dismiss et
export function dismissVersionUpdate(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(VERSION_DISMISSED_KEY, APP_VERSION);
}

// Sayfayı yenile ve yeni versiyonu kaydet
export async function updateToNewVersion(): Promise<void> {
  await saveVersionCheck();
  window.location.reload();
}

