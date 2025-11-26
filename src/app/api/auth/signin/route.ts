import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = signInSchema.parse(body);
    const supabase = createSupabaseRouteClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        {
          message: "Giriş başarısız",
          error: error.message,
        },
        { status: 401 }
      );
    }

    if (!data.session || !data.user) {
      return NextResponse.json(
        {
          message: "Giriş başarısız",
          error: "Session oluşturulamadı",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Giriş başarılı",
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
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
    console.error("Sign in error:", error);
    return NextResponse.json(
      {
        message: "Giriş sırasında hata oluştu",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


