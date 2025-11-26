import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { generateCode, storeResetCode } from "@/lib/auth/reset-codes";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);
    const platform = request.headers.get("x-platform");
    const supabase = createSupabaseRouteClient();

    // Android için in-app code gönder
    if (platform === "android") {
      const code = generateCode();
      storeResetCode(email, code, 10);

      // TODO: Email gönder (Supabase Auth email veya email service)
      console.log(`Reset code for ${email}: ${code}`);

      return NextResponse.json({
        message: "Şifre sıfırlama kodu email adresinize gönderildi",
        code: code, // Development için - production'da kaldırılmalı
      });
    } else {
      // Web için Supabase Auth password reset (email link)
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${appUrl}/reset-password`,
      });

      if (error) {
        return NextResponse.json(
          {
            message: "Şifre sıfırlama isteği gönderilemedi",
            error: error.message,
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        message: "Şifre sıfırlama linki email adresinize gönderildi",
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Geçersiz istek",
          errors: error.errors,
        },
        { status: 400 }
      );
    }
    console.error("Forgot password error:", error);
    return NextResponse.json(
      {
        message: "Şifre sıfırlama isteği sırasında hata oluştu",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


