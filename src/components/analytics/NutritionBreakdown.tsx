"use client";

import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface NutritionData {
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
}

export default function NutritionBreakdown() {
    const supabase = useSupabaseClient();
    const [data, setData] = useState<NutritionData>({ protein: 0, carbs: 0, fat: 0, calories: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNutritionData();
    }, []);

    const fetchNutritionData = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const { data: meals } = await supabase
                .from('meals')
                .select('protein, carbs, fat, calories')
                .gte('created_at', `${today}T00:00:00`)
                .lte('created_at', `${today}T23:59:59`);

            const totals = meals?.reduce(
                (acc, meal) => ({
                    protein: acc.protein + (meal.protein || 0),
                    carbs: acc.carbs + (meal.carbs || 0),
                    fat: acc.fat + (meal.fat || 0),
                    calories: acc.calories + (meal.calories || 0),
                }),
                { protein: 0, carbs: 0, fat: 0, calories: 0 }
            ) || { protein: 0, carbs: 0, fat: 0, calories: 0 };

            setData(totals);
        } catch (error) {
            console.error('Error fetching nutrition:', error);
        } finally {
            setLoading(false);
        }
    };

    const macros = [
        { name: 'Protein', value: data.protein, color: 'from-blue-500 to-cyan-500', percentage: (data.protein * 4 / data.calories * 100) || 0 },
        { name: 'Karbonhidrat', value: data.carbs, color: 'from-green-500 to-emerald-500', percentage: (data.carbs * 4 / data.calories * 100) || 0 },
        { name: 'Yağ', value: data.fat, color: 'from-orange-500 to-red-500', percentage: (data.fat * 9 / data.calories * 100) || 0 },
    ];

    if (loading) {
        return <div className="animate-pulse h-64 bg-gray-800 rounded-2xl"></div>;
    }

    return (
        <div className="rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">🥗 Beslenme Analizi</h3>

            <div className="space-y-4">
                {macros.map((macro) => (
                    <div key={macro.name}>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">{macro.name}</span>
                            <span className="text-white font-semibold">{macro.value}g ({Math.round(macro.percentage)}%)</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${macro.color} transition-all duration-500`}
                                style={{ width: `${macro.percentage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
