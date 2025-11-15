import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware - OAuth callback'leri için özel işlem yapmıyoruz
 * NextAuth kendi callback handling'ini yapıyor
 */
export function middleware(request: NextRequest) {
  // Normal akışa devam et
  return NextResponse.next();
}

export const config = {
  matcher: [],
};

