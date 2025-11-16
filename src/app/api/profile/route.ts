import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { hasSupabaseServiceRole, supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createSupabaseRouteClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "id,email,full_name,avatar_url,height_cm,weight_kg,age,gender,target_weight_kg,daily_steps,onboarding_completed,created_at"
    )
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { message: "Profil alınırken hata oluştu", error: error.message },
      { status: 500 }
    );
  }

  if (!profile) {
    if (hasSupabaseServiceRole) {
      const fallbackPayload = {
        id: user.id,
        email: user.email ?? "",
        full_name: (user.user_metadata as Record<string, any>)?.full_name ?? user.email ?? "",
        onboarding_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await (supabaseAdmin as any)
        .from("profiles")
        .upsert(fallbackPayload, { onConflict: "id" })
        .select("id")
        .single()
        .catch(() => null);

      return NextResponse.json({
        id: user.id,
        name: fallbackPayload.full_name,
        email: fallbackPayload.email,
        image: null,
        height: null,
        weight: null,
        age: null,
        gender: null,
        targetWeight: null,
        dailySteps: null,
        onboardingCompleted: false,
        createdAt: fallbackPayload.created_at,
      });
    }

    return NextResponse.json({ message: "Profil bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    image: profile.avatar_url,
    height: profile.height_cm,
    weight: profile.weight_kg,
    age: profile.age,
    gender: profile.gender,
    targetWeight: profile.target_weight_kg,
    dailySteps: profile.daily_steps,
    onboardingCompleted: profile.onboarding_completed,
    createdAt: profile.created_at,
  });
}

const profileUpdateSchema = z.object({
  name: z.string().max(200).optional(),
  height: z.number().min(50).max(260).nullable().optional(),
  weight: z.number().min(20).max(300).nullable().optional(),
  age: z.number().min(13).max(120).nullable().optional(),
  gender: z.enum(["male", "female", "other"]).nullable().optional(),
  targetWeight: z.number().min(20).max(300).nullable().optional(),
  dailySteps: z.number().min(0).max(200000).nullable().optional(),
});

export async function PUT(request: Request) {
  const supabase = createSupabaseRouteClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const body = await request.json();

  let parsed;
  try {
    parsed = profileUpdateSchema.parse(body);
  } catch (validationError) {
    return NextResponse.json(
      {
        message: "Geçersiz veri",
        errors: validationError instanceof z.ZodError ? validationError.errors : undefined,
      },
      { status: 400 }
    );
  }

  if (Object.keys(parsed).length === 0) {
    return NextResponse.json({ message: "Güncellenecek veri yok" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.name,
      height_cm: parsed.height,
      weight_kg: parsed.weight,
      age: parsed.age,
      gender: parsed.gender,
      target_weight_kg: parsed.targetWeight,
      daily_steps: parsed.dailySteps,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { message: "Profil güncellenirken hata oluştu", error: error?.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Profil güncellendi",
    user: {
      id: data.id,
      name: data.full_name,
      email: data.email,
      image: data.avatar_url,
      height: data.height_cm,
      weight: data.weight_kg,
      age: data.age,
      gender: data.gender,
      targetWeight: data.target_weight_kg,
      dailySteps: data.daily_steps,
    },
  });
}

