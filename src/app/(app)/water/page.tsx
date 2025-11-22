import { redirect } from "next/navigation";
import WaterReminder from "../../../components/water/WaterReminder";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function WaterPage() {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User fetch error:", userError);
      redirect("/login");
    }

    const userId = user.id;

    // Kullanıcı profilini al (günlük hedef ve bildirim ayarları)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("daily_water_goal_ml, water_reminder_enabled, water_reminder_interval_minutes, weight_kg")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
    }

    // Bugünkü su tüketimini al
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: waterIntake } = await supabase
      .from("water_intake")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", today.toISOString())
      .lt("created_at", tomorrow.toISOString())
      .order("created_at", { ascending: false });

    const totalAmount = waterIntake?.reduce((sum, intake) => sum + Number(intake.amount_ml), 0) || 0;
    const dailyGoal = profile?.daily_water_goal_ml || 2000;

    return (
      <WaterReminder
        initialTotalAmount={totalAmount}
        initialDailyGoal={Number(dailyGoal)}
        initialReminderEnabled={profile?.water_reminder_enabled ?? true}
        initialReminderInterval={profile?.water_reminder_interval_minutes || 120}
        userWeight={profile?.weight_kg}
      />
    );
  } catch (error) {
    console.error("Water page error:", error);
    redirect("/login");
  }
}

