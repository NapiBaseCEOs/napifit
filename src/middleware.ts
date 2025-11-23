import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/supabase/types";
import { getLocaleFromCountry, defaultLocale, type Locale } from "@/lib/i18n/locales";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Supabase auth session
  const supabase = createMiddlewareClient<Database>({ req: request, res: response });
  await supabase.auth.getSession();

  // Locale detection from geo-location headers
  const detectedLocale = detectLocaleFromRequest(request);
  response.headers.set("x-detected-locale", detectedLocale);
  
  return response;
}

function detectLocaleFromRequest(request: NextRequest): Locale {
  // Priority 1: Cookie (user preference)
  const cookieLocale = request.cookies.get("locale")?.value as Locale | undefined;
  if (cookieLocale) {
    return cookieLocale;
  }

  // Priority 2: Vercel/Cloudflare geo headers
  const countryCode = 
    request.headers.get("x-vercel-ip-country") || 
    request.headers.get("cf-ipcountry") ||
    request.geo?.country ||
    "";
  
  if (countryCode && countryCode !== "XX") {
    return getLocaleFromCountry(countryCode);
  }

  // Priority 3: Accept-Language header
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const browserLang = acceptLanguage.split(",")[0]?.split("-")[0]?.toLowerCase() || "";
    if (["tr", "en", "de", "fr", "es", "it", "ru", "ar", "pt", "zh", "ja", "ko", "hi", "nl", "sv", "pl"].includes(browserLang)) {
      return browserLang as Locale;
    }
  }

  return defaultLocale;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

