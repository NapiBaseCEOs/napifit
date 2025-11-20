"use client";

import { useEffect, useState } from "react";
import { Theme, getStoredTheme, saveTheme, getThemeColors } from "@/lib/theme";

const THEMES: Theme[] = ["dark", "darker", "light"];

export default function ThemeToggleMini() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  const handleToggle = (next: Theme) => {
    setTheme(next);
    saveTheme(next);
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-1 py-1 text-[11px] font-semibold">
      {THEMES.map((item) => {
        const isActive = theme === item;
        const themeData = getThemeColors(item);
        return (
          <button
            key={item}
            onClick={() => handleToggle(item)}
            className={`rounded-full px-2 py-1 transition-all duration-200 ${
              isActive
                ? "bg-white text-slate-900 shadow-[0_8px_20px_rgba(15,23,42,0.35)]"
                : "text-slate-200 hover:text-white"
            }`}
            aria-label={themeData.name}
          >
            {themeData.icon}
          </button>
        );
      })}
    </div>
  );
}

