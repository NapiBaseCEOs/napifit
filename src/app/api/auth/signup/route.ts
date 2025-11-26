import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = signUpSchema.parse(body);
    const supabase = createSupabaseRouteClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name || email.split("@")[0],
        },
      },
    });

    if (error) {
      return NextResponse.json(
        {
          message: "Kayıt başarısız",
          error: error.message,
        },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        {
          message: "Kayıt başarısız",
          error: "Kullanıcı oluşturulamadı",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Kayıt başarılı",
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      requiresEmailVerification: !data.session, // Email doğrulama gerekiyorsa session olmaz
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
    console.error("Sign up error:", error);
    return NextResponse.json(
      {
        message: "Kayıt sırasında hata oluştu",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


