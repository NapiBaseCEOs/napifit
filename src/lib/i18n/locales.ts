export type Locale = "tr" | "en" | "de" | "fr" | "es" | "it" | "ru" | "ar";

export const supportedLocales: Locale[] = ["tr", "en", "de", "fr", "es", "it", "ru", "ar"];

export const defaultLocale: Locale = "tr";

// IP'den ülkeye göre dil eşleştirmesi
export function getLocaleFromCountry(countryCode: string): Locale {
  const countryToLocale: Record<string, Locale> = {
    TR: "tr",
    US: "en",
    GB: "en",
    CA: "en",
    AU: "en",
    NZ: "en",
    DE: "de",
    AT: "de",
    CH: "de",
    FR: "fr",
    BE: "fr",
    ES: "es",
    MX: "es",
    AR: "es",
    IT: "it",
    RU: "ru",
    SA: "ar",
    AE: "ar",
    EG: "ar",
    IQ: "ar",
  };

  return countryToLocale[countryCode.toUpperCase()] || defaultLocale;
}

// Browser dilinden locale'e çevir
export function getLocaleFromBrowser(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  
  const browserLang = navigator.language || (navigator as any).userLanguage || "";
  const langCode = browserLang.split("-")[0].toLowerCase();
  
  if (supportedLocales.includes(langCode as Locale)) {
    return langCode as Locale;
  }
  
  return defaultLocale;
}

