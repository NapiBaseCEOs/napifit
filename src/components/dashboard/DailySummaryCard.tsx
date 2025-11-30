"use client";

import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface DailySummary {
    caloriesConsumed: number;
    caloriesTarget: number;
    waterIntake: number;
    waterTarget: number;
    steps: number;
    stepsTarget: number;
    workoutMinutes: number;
}

export default function DailySummaryCard() {
    const supabase = useSupabaseClient();
    const [summary, setSummary] = useState<DailySummary>({
        caloriesConsumed: 0,
        caloriesTarget: 2000,
        waterIntake: 0,
        waterTarget: 8,
        steps: 0,
        stepsTarget: 10000,
        workoutMinutes: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDailySummary();
    }, []);

    const fetchDailySummary = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];

            // Fetch meals
            const { data: meals } = await supabase
                .from('meals')
                .select('calories')
                .gte('created_at', `${today}T00:00:00`)
                .lte('created_at', `${today}T23:59:59`);

            const caloriesConsumed = meals?.reduce((sum, m) => sum + (m.calories || 0), 0) || 0;

            // Fetch water
            const { data: water } = await supabase
                .from('water_intake')
                .select('glasses')
                .eq('date', today)
                .single();

            // Fetch profile for targets
            const { data: profile } = await supabase
                .from('profiles')
                .select('daily_steps')
                .single();

            setSummary({
                caloriesConsumed,
                caloriesTarget: 2000,
                waterIntake: water?.glasses || 0,
                waterTarget: 8,
                steps: 0, // Would come from health API
                stepsTarget: profile?.daily_steps || 10000,
                workoutMinutes: 0, // Would come from workouts
            });
        } catch (error) {
            console.error('Error fetching daily summary:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPercentage = (current: number, target: number) => {
        return Math.min(Math.round((current / target) * 100), 100);
    };

    if (loading) {
        return (
            <div className="animate-pulse rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6">
                <div className="h-6 w-40 bg-gray-800 rounded mb-4"></div>
                <div className="space-y-3">
                    <div className="h-16 bg-gray-800 rounded"></div>
                    <div className="h-16 bg-gray-800 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6 shadow-xl backdrop-blur">
            <h3 className="text-lg font-semibold text-white mb-4">📊 Günlük Özet</h3>

            <div className="grid grid-cols-2 gap-4">
                {/* Calories */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">🔥 Kalori</span>
                        <span className="text-white font-semibold">
                            {summary.caloriesConsumed}/{summary.caloriesTarget}
                        </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-fitness-orange to-primary-500 transition-all duration-500"
                            style={{ width: `${getPercentage(summary.caloriesConsumed, summary.caloriesTarget)}%` }}
                        />
                    </div>
                </div>

                {/* Water */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">💧 Su</span>
                        <span className="text-white font-semibold">
                            {summary.waterIntake}/{summary.waterTarget}
                        </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                            style={{ width: `${getPercentage(summary.waterIntake, summary.waterTarget)}%` }}
                        />
                    </div>
                </div>

                {/* Steps */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">👟 Adım</span>
                        <span className="text-white font-semibold">
                            {summary.steps.toLocaleString()}/{summary.stepsTarget.toLocaleString()}
                        </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary-500 to-green-500 transition-all duration-500"
                            style={{ width: `${getPercentage(summary.steps, summary.stepsTarget)}%` }}
                        />
                    </div>
                </div>

                {/* Workout */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">💪 Egzersiz</span>
                        <span className="text-white font-semibold">{summary.workoutMinutes} dk</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-fitness-purple to-pink-500 transition-all duration-500"
                            style={{ width: `${getPercentage(summary.workoutMinutes, 30)}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
