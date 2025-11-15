export type Theme = "dark" | "darker" | "light";

const THEME_KEY = "napifit_theme";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  
  try {
    const stored = localStorage.getItem(THEME_KEY) as Theme;
    if (stored && ["dark", "darker", "light"].includes(stored)) {
      return stored;
    }
  } catch {
    // localStorage erişim hatası
  }
  
  return "dark";
}

export function saveTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  } catch {
    // localStorage erişim hatası
  }
}

export function applyTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  
  const root = document.documentElement;
  
  // Önceki tema class'larını temizle
  root.classList.remove("theme-dark", "theme-darker", "theme-light");
  
  // Yeni temayı uygula
  root.classList.add(`theme-${theme}`);
}

export function getThemeColors(theme: Theme) {
  const themes = {
    dark: {
      name: "Dark",
      icon: "🌙",
      bg: "from-gray-950 via-slate-950 to-black",
      card: "bg-gray-900/90",
      border: "border-gray-800",
      text: "text-gray-100",
    },
    darker: {
      name: "Midnight",
      icon: "🌑",
      bg: "from-black via-gray-950 to-slate-950",
      card: "bg-black/95",
      border: "border-gray-900",
      text: "text-gray-50",
    },
    light: {
      name: "Light",
      icon: "☀️",
      bg: "from-gray-50 via-white to-gray-100",
      card: "bg-white/95",
      border: "border-gray-200",
      text: "text-gray-900",
    },
  };
  
  return themes[theme];
}

