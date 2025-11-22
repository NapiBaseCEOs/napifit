"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getLocaleFromBrowser, defaultLocale, type Locale } from "@/lib/i18n/locales";
import { getTranslation, type TranslationKey } from "@/lib/i18n/translations";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children, initialLocale }: { children: ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || defaultLocale);

  useEffect(() => {
    // İlk yüklemede IP'den dil algılama
    const detectLocale = async () => {
      try {
        const response = await fetch("/api/detect-locale");
        if (response.ok) {
          const data = await response.json();
          if (data.locale) {
            setLocaleState(data.locale);
            localStorage.setItem("locale", data.locale);
          }
        }
      } catch (error) {
        console.warn("Locale detection error:", error);
        // Fallback: localStorage'dan al veya browser dilinden al
        const savedLocale = localStorage.getItem("locale") as Locale | null;
        if (savedLocale) {
          setLocaleState(savedLocale);
        } else {
          const browserLocale = getLocaleFromBrowser();
          setLocaleState(browserLocale);
        }
      }
    };

    detectLocale();
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const t = (key: TranslationKey) => getTranslation(locale, key);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}

