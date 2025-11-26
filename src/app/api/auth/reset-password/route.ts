import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { verifyResetCode, deleteResetCode } from "@/lib/auth/reset-codes";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const resetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  newPassword: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code, newPassword } = resetPasswordSchema.parse(body);
    const platform = request.headers.get("x-platform");
    const supabase = createSupabaseRouteClient();

    // Android için code ile reset
    if (platform === "android") {
      const isValid = verifyResetCode(email, code);

      if (!isValid) {
        return NextResponse.json(
          {
            message: "Geçersiz veya süresi dolmuş kod",
            error: "Lütfen yeni bir kod isteyin",
          },
          { status: 400 }
        );
      }

      // Supabase'de şifreyi güncelle
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return NextResponse.json(
          {
            message: "Şifre güncellenemedi",
            error: error.message,
          },
          { status: 400 }
        );
      }

      // Code'u sil
      deleteResetCode(email);

      return NextResponse.json({
        message: "Şifre başarıyla güncellendi",
      });
    } else {
      // Web için token ile reset (Supabase Auth handle eder)
      return NextResponse.json(
        {
          message: "Web için token ile reset kullanılmalı",
          error: "Use Supabase Auth reset password flow",
        },
        { status: 400 }
      );
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
    console.error("Reset password error:", error);
    return NextResponse.json(
      {
        message: "Şifre sıfırlama sırasında hata oluştu",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


