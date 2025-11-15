"use client";

import { useEffect } from "react";
import { getStoredTheme, applyTheme, saveTheme } from "@/lib/theme";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const theme = getStoredTheme();
    applyTheme(theme);
    
    // İlk ziyarette tema kaydet
    saveTheme(theme);
  }, []);

  return <>{children}</>;
}

