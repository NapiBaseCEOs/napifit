import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const [membersResponse, workoutsResponse, mealsResponse, avgStepsResponse, recentWorkoutsResponse] = await Promise.all([
      supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("workouts").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("meals").select("id", { count: "exact", head: true }),
      supabaseAdmin.rpc("avg_daily_steps"),
      supabaseAdmin
        .from("workouts")
        .select("id,name,type,created_at,calories,duration_minutes,profiles(full_name)")
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

    const members = membersResponse.count ?? 0;
    const workouts = workoutsResponse.count ?? 0;
    const meals = mealsResponse.count ?? 0;
    const avgDailySteps = Math.round((avgStepsResponse.data as number | null) ?? 0);
    const streaks = Math.max(0, Math.round(workouts * 0.12));

    const recentWorkouts = recentWorkoutsResponse.data?.map((workout: any) => ({
      id: workout.id,
      name: workout.name,
      type: workout.type,
      createdAt: workout.created_at,
      userName: workout.profiles?.full_name || "NapiFit üyesi",
      calories: workout.calories,
      duration: workout.duration_minutes,
    })) ?? [];

    return NextResponse.json({
      stats: {
        members: Math.max(members, 0),
        workouts,
        meals,
        avgDailySteps,
        streaks,
      },
      recentWorkouts,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { error: "İstatistikler alınamadı" },
      { status: 500 }
    );
  }
}

