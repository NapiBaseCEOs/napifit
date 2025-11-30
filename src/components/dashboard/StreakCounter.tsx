"use client";

import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface StreakData {
    currentStreak: number;
    longestStreak: number;
    lastLogDate: string | null;
}

export default function StreakCounter() {
    const supabase = useSupabaseClient();
    const [streak, setStreak] = useState<StreakData>({
        currentStreak: 0,
        longestStreak: 0,
        lastLogDate: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        calculateStreak();
    }, []);

    const calculateStreak = async () => {
        try {
            // Get all meal dates
            const { data: meals } = await supabase
                .from('meals')
                .select('created_at')
                .order('created_at', { ascending: false });

            if (!meals || meals.length === 0) {
                setLoading(false);
                return;
            }

            // Extract unique dates
            const dates = [...new Set(meals.map(m => m.created_at.split('T')[0]))].sort().reverse();

            let currentStreak = 0;
            let longestStreak = 0;
            let tempStreak = 0;
            const today = new Date().toISOString().split('T')[0];

            // Calculate current streak
            for (let i = 0; i < dates.length; i++) {
                const date = new Date(dates[i]);
                const expectedDate = new Date();
                expectedDate.setDate(expectedDate.getDate() - i);
                const expected = expectedDate.toISOString().split('T')[0];

                if (dates[i] === expected) {
                    currentStreak++;
                } else {
                    break;
                }
            }

            // Calculate longest streak
            for (let i = 0; i < dates.length; i++) {
                if (i === 0) {
                    tempStreak = 1;
                } else {
                    const prevDate = new Date(dates[i - 1]);
                    const currDate = new Date(dates[i]);
                    const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));

                    if (diffDays === 1) {
                        tempStreak++;
                    } else {
                        longestStreak = Math.max(longestStreak, tempStreak);
                        tempStreak = 1;
                    }
                }
            }
            longestStreak = Math.max(longestStreak, tempStreak);

            setStreak({
                currentStreak,
                longestStreak,
                lastLogDate: dates[0] || null,
            });
        } catch (error) {
            console.error('Error calculating streak:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6">
                <div className="h-6 w-32 bg-gray-800 rounded mb-4"></div>
                <div className="h-20 bg-gray-800 rounded"></div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-primary-500/30 bg-gradient-to-br from-primary-500/10 to-transparent p-6 shadow-xl backdrop-blur">
            <h3 className="text-lg font-semibold text-white mb-4">🔥 Seri</h3>

            <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                    <div className="text-4xl font-bold text-primary-400 mb-1">
                        {streak.currentStreak}
                    </div>
                    <div className="text-sm text-gray-400">Güncel Seri</div>
                </div>

                <div className="text-center">
                    <div className="text-4xl font-bold text-fitness-orange mb-1">
                        {streak.longestStreak}
                    </div>
                    <div className="text-sm text-gray-400">En Uzun Seri</div>
                </div>
            </div>

            {streak.currentStreak > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-xs text-gray-500 text-center">
                        🎉 {streak.currentStreak} gündür düzenli kayıt yapıyorsun!
                    </p>
                </div>
            )}
        </div>
    );
}
