"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "./LocaleProvider";
import { supportedLocales, type Locale } from "@/lib/i18n/locales";
import { Globe } from "lucide-react";

const localeNames: Record<Locale, { name: string; nativeName: string; flag: string }> = {
  en: { name: "English", nativeName: "English", flag: "🇬🇧" },
  tr: { name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  de: { name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  fr: { name: "French", nativeName: "Français", flag: "🇫🇷" },
  es: { name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  it: { name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  ru: { name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  ar: { name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  pt: { name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  zh: { name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  ja: { name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  ko: { name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  hi: { name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  nl: { name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  sv: { name: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
  pl: { name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
};

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    // Set cookie for persistence
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    setIsOpen(false);
  };

  const currentLocaleInfo = localeNames[locale];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10 hover:border-white/20 transition-all"
        aria-label="Change language"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLocaleInfo.flag}</span>
        <span className="hidden md:inline">{currentLocaleInfo.nativeName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-white/10 bg-[#0a0f1f]/95 backdrop-blur-xl shadow-2xl z-50 max-h-[400px] overflow-y-auto">
          <div className="p-1">
            {supportedLocales.map((loc) => {
              const locInfo = localeNames[loc];
              const isActive = loc === locale;
              return (
                <button
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all ${
                    isActive
                      ? "bg-primary-500/20 text-primary-200 font-semibold"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="text-xl">{locInfo.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium">{locInfo.nativeName}</div>
                    <div className="text-xs opacity-60">{locInfo.name}</div>
                  </div>
                  {isActive && (
                    <div className="h-2 w-2 rounded-full bg-primary-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

