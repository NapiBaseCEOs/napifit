"use client";

import { useState, useEffect } from "react";
import { Theme, getStoredTheme, saveTheme, getThemeColors } from "@/lib/theme";

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<Theme>("dark");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const theme = getStoredTheme();
    setCurrentTheme(theme);
    // Temayı hemen uygula
    import("@/lib/theme").then((mod) => mod.applyTheme(theme));
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    saveTheme(theme);
    setIsOpen(false);
  };

  const themes: Theme[] = ["dark", "darker", "light"];
  const currentThemeData = getThemeColors(currentTheme);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border-2 border-gray-700 bg-gray-900/50 px-3 py-2 text-sm font-semibold text-gray-200 hover:border-primary-500/50 hover:text-primary-400 hover:bg-gray-900/70 transition-all duration-300"
        title="Tema Değiştir"
      >
        <span className="text-lg">{currentThemeData.icon}</span>
        <span className="hidden sm:inline">{currentThemeData.name}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-xl border border-gray-800 bg-gray-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden animate-slide-down">
            <div className="p-2 space-y-1">
              {themes.map((theme) => {
                const themeData = getThemeColors(theme);
                const isActive = theme === currentTheme;
                
                return (
                  <button
                    key={theme}
                    onClick={() => handleThemeChange(theme)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive
                        ? "bg-primary-500/20 text-primary-400 ring-1 ring-primary-500/50"
                        : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                      }
                    `}
                  >
                    <span className="text-xl">{themeData.icon}</span>
                    <span className="flex-1 text-left">{themeData.name}</span>
                    {isActive && (
                      <svg className="h-4 w-4 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="border-t border-gray-800 p-2">
              <p className="text-xs text-gray-500 text-center">
                Tema tercihiniz kaydedilir
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

