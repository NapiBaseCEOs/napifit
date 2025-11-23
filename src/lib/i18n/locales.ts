export type Locale = "tr" | "en" | "de" | "fr" | "es" | "it" | "ru" | "ar" | "pt" | "zh" | "ja" | "ko" | "hi" | "nl" | "sv" | "pl";

export const supportedLocales: Locale[] = ["tr", "en", "de", "fr", "es", "it", "ru", "ar", "pt", "zh", "ja", "ko", "hi", "nl", "sv", "pl"];

// Default locale: English (global reach)
export const defaultLocale: Locale = "en";

// IP'den ülkeye göre dil eşleştirmesi (150+ ülke)
export function getLocaleFromCountry(countryCode: string): Locale {
  const countryToLocale: Record<string, Locale> = {
    // Türkçe
    TR: "tr",
    // İngilizce (en yaygın)
    US: "en", GB: "en", CA: "en", AU: "en", NZ: "en", IE: "en", ZA: "en",
    IN: "en", PK: "en", NG: "en", KE: "en", GH: "en", PH: "en", SG: "en",
    MY: "en", HK: "en", MT: "en", CY: "en", JM: "en", TT: "en", BB: "en",
    // Almanca
    DE: "de", AT: "de", CH: "de", LI: "de",
    // Fransızca (Belgium FR priority, Luxembourg FR priority)
    FR: "fr", BE: "fr", LU: "fr", MC: "fr", CI: "fr", SN: "fr", ML: "fr",
    CM: "fr", CD: "fr", MG: "fr", BF: "fr", NE: "fr", TG: "fr", BJ: "fr",
    // İspanyolca
    ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", VE: "es",
    EC: "es", GT: "es", CU: "es", BO: "es", DO: "es", HN: "es", PY: "es",
    SV: "es", NI: "es", CR: "es", PA: "es", UY: "es", PR: "es", GQ: "es",
    // İtalyanca
    IT: "it", SM: "it", VA: "it",
    // Rusça
    RU: "ru", BY: "ru", KZ: "ru", KG: "ru", UZ: "ru", TM: "ru", TJ: "ru",
    // Arapça
    SA: "ar", AE: "ar", EG: "ar", IQ: "ar", JO: "ar", KW: "ar", LB: "ar",
    LY: "ar", MA: "ar", OM: "ar", PS: "ar", QA: "ar", SD: "ar", SY: "ar",
    TN: "ar", YE: "ar", BH: "ar", DZ: "ar", MR: "ar", SO: "ar", DJ: "ar",
    // Portekizce
    PT: "pt", BR: "pt", AO: "pt", MZ: "pt", GW: "pt", TL: "pt", CV: "pt",
    // Çince
    CN: "zh", TW: "zh", MO: "zh",
    // Japonca
    JP: "ja",
    // Korece
    KR: "ko", KP: "ko",
    // Hintçe - IN already mapped to EN (browser language will be used as fallback for Hindi speakers)
    // Hollandaca
    NL: "nl", SR: "nl",
    // İsveççe
    SE: "sv", FI: "sv",
    // Lehçe
    PL: "pl",
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

