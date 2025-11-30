"use client";

import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface WeekData {
    day: string;
    calories: number;
    weight: number;
}

export default function WeeklyProgressChart() {
    const supabase = useSupabaseClient();
    const [data, setData] = useState<WeekData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWeeklyData();
    }, []);

    const fetchWeeklyData = async () => {
        try {
            const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
            const weekData: WeekData[] = [];

            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];

                const { data: meals } = await supabase
                    .from('meals')
                    .select('calories')
                    .gte('created_at', `${dateStr}T00:00:00`)
                    .lte('created_at', `${dateStr}T23:59:59`);

                const calories = meals?.reduce((sum, m) => sum + (m.calories || 0), 0) || 0;

                weekData.push({
                    day: days[date.getDay()],
                    calories,
                    weight: 0, // Would come from health metrics
                });
            }

            setData(weekData);
        } catch (error) {
            console.error('Error fetching weekly data:', error);
        } finally {
            setLoading(false);
        }
    };

    const maxCalories = Math.max(...data.map(d => d.calories), 2000);

    if (loading) {
        return (
            <div className="animate-pulse rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6">
                <div className="h-6 w-40 bg-gray-800 rounded mb-4"></div>
                <div className="h-48 bg-gray-800 rounded"></div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6 shadow-xl backdrop-blur">
            <h3 className="text-lg font-semibold text-white mb-4">📈 Haftalık İlerleme</h3>

            <div className="space-y-4">
                {/* Simple bar chart */}
                <div className="flex items-end justify-between gap-2 h-48">
                    {data.map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-gray-800 rounded-t-lg relative overflow-hidden" style={{ height: '100%' }}>
                                <div
                                    className="absolute bottom-0 w-full bg-gradient-to-t from-primary-500 to-primary-400 transition-all duration-500 rounded-t-lg"
                                    style={{ height: `${(item.calories / maxCalories) * 100}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-400">{item.day}</span>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 bg-primary-500 rounded-full"></div>
                        <span className="text-sm text-gray-400">Kalori</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
