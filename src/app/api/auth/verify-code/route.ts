import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyResetCode } from "@/lib/auth/reset-codes";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = verifyCodeSchema.parse(body);

    const isValid = verifyResetCode(email, code);

    if (!isValid) {
      return NextResponse.json(
        {
          message: "Geçersiz kod",
          error: "Kod bulunamadı, süresi dolmuş veya yanlış",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Kod doğrulandı",
      verified: true,
    });
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
    console.error("Verify code error:", error);
    return NextResponse.json(
      {
        message: "Kod doğrulama sırasında hata oluştu",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


