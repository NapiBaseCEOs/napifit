import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { hasSupabaseServiceRole, supabaseAdmin } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

const onboardingSchema = z.object({
  height: z.number().min(100).max(250), // cm
  weight: z.number().min(30).max(300), // kg
  age: z.number().min(13).max(120), // yaş
  gender: z.enum(["male", "female", "other"]),
  targetWeight: z.number().min(30).max(300), // kg
  dailySteps: z.number().min(0).max(100000), // adım
});

export async function POST(request: Request) {
  const supabase = createSupabaseRouteClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = onboardingSchema.parse(body);

    const updatePayload = {
      height_cm: validatedData.height,
      weight_kg: validatedData.weight,
      age: validatedData.age,
      gender: validatedData.gender,
      target_weight_kg: validatedData.targetWeight,
      daily_steps: validatedData.dailySteps,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", user.id)
      .select("id,onboarding_completed")
      .single();

    if (error?.code === "PGRST116" && hasSupabaseServiceRole) {
      const adminPayload: Database["public"]["Tables"]["profiles"]["Insert"] = {
        id: user.id,
        email: user.email ?? "",
        full_name: (user.user_metadata as Record<string, any>)?.full_name ?? user.email ?? "",
        ...updatePayload,
      };

      const adminClient = supabaseAdmin as any;
      const { data: adminData, error: adminError } = await adminClient
        .from("profiles")
        .upsert(adminPayload, { onConflict: "id" })
        .select("id,onboarding_completed")
        .single();

      if (adminError || !adminData) {
        return NextResponse.json(
          { message: "Profil oluşturulamadı", details: adminError?.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: "Profil bilgileri kaydedildi",
        user: adminData,
      });
    }

    if (error || !data) {
      return NextResponse.json(
        { message: "Bilgiler kaydedilirken bir hata oluştu", details: error?.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Profil bilgileri kaydedildi",
      user: data,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Geçersiz veri",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Onboarding error:", error);
    return NextResponse.json(
      {
        message: "Bilgiler kaydedilirken hata oluştu",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

