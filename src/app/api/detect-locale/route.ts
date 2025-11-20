import { NextResponse } from "next/server";
import { getLocaleFromCountry, defaultLocale, type Locale } from "@/lib/i18n/locales";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // IP'den ülke kodunu al
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "";
    
    let countryCode = "";
    let locale: Locale = defaultLocale;

    if (ip) {
      try {
        // IP'den ülke kodunu almak için ücretsiz bir servis kullanabiliriz
        // Örnek: ipapi.co veya ip-api.com
        const geoResponse = await fetch(`https://ipapi.co/${ip}/country_code/`, {
          headers: {
            "User-Agent": "NapiFit/1.0",
          },
        });
        
        if (geoResponse.ok) {
          countryCode = (await geoResponse.text()).trim();
          locale = getLocaleFromCountry(countryCode);
        }
      } catch (error) {
        console.warn("IP geolocation error:", error);
      }
    }

    // Accept-Language header'ını da kontrol et
    const acceptLanguage = request.headers.get("accept-language");
    if (acceptLanguage && !countryCode) {
      const browserLang = acceptLanguage.split(",")[0]?.split("-")[0]?.toLowerCase() || "";
      if (["tr", "en", "de", "fr", "es", "it", "ru", "ar"].includes(browserLang)) {
        locale = browserLang as Locale;
      }
    }

    return NextResponse.json({ locale, countryCode: countryCode || null });
  } catch (error) {
    console.error("Locale detection error:", error);
    return NextResponse.json({ locale: defaultLocale, countryCode: null });
  }
}

