import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { z } from "zod";

const waterIntakeSchema = z.object({
  amount_ml: z.number().min(1).max(10000), // 1ml - 10 litre arası
});

export const dynamic = 'force-dynamic';

// GET - Bugünkü su tüketimini getir
export async function GET(request: Request) {
  try {
    const supabase = createSupabaseRouteClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const today = dateParam ? new Date(dateParam) : new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Bugünkü su tüketimini getir
    const { data: waterIntake, error } = await supabase
      .from("water_intake")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString())
      .lt("created_at", tomorrow.toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Water intake fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch water intake" }, { status: 500 });
    }

    // Toplam su tüketimi
    const totalAmount = waterIntake?.reduce((sum, intake) => sum + Number(intake.amount_ml), 0) || 0;

    // Kullanıcı profilinden günlük hedefi al
    const { data: profile } = await supabase
      .from("profiles")
      .select("daily_water_goal_ml, water_reminder_enabled, water_reminder_interval_minutes")
      .eq("id", user.id)
      .single();

    const dailyGoal = profile?.daily_water_goal_ml || 2000;
    const reminderEnabled = profile?.water_reminder_enabled ?? true;
    const reminderInterval = profile?.water_reminder_interval_minutes || 120;

    return NextResponse.json({
      intakes: waterIntake || [],
      totalAmount,
      dailyGoal: Number(dailyGoal),
      progress: Math.min(100, (totalAmount / Number(dailyGoal)) * 100),
      reminderEnabled,
      reminderInterval,
    });
  } catch (error) {
    console.error("Water intake API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Su tüketimi ekle
export async function POST(request: Request) {
  try {
    const supabase = createSupabaseRouteClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = waterIntakeSchema.parse(body);

    const { data, error } = await supabase
      .from("water_intake")
      .insert({
        user_id: user.id,
        amount_ml: validated.amount_ml,
      })
      .select()
      .single();

    if (error) {
      console.error("Water intake insert error:", error);
      return NextResponse.json({ error: "Failed to save water intake" }, { status: 500 });
    }

    return NextResponse.json({ message: "Su tüketimi kaydedildi", intake: data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Geçersiz veri", errors: error.errors }, { status: 400 });
    }
    console.error("Water intake API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Su tüketimi sil
export async function DELETE(request: Request) {
  try {
    const supabase = createSupabaseRouteClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("water_intake")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Water intake delete error:", error);
      return NextResponse.json({ error: "Failed to delete water intake" }, { status: 500 });
    }

    return NextResponse.json({ message: "Su tüketimi silindi" });
  } catch (error) {
    console.error("Water intake API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

