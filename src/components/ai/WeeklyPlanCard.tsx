"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Calendar, Dumbbell, Utensils } from "lucide-react";

type WeeklyPlan = {
    startDate: string;
    endDate: string;
    summary: string;
    days: Array<{
        day: string;
        meals: Array<{ type: string; suggestion: string; calories: number }>;
        workout: { activity: string; duration: string; calories: number };
    }>;
};

export default function WeeklyPlanCard({ plan }: { plan: WeeklyPlan }) {
    const [expandedDay, setExpandedDay] = useState<string | null>(plan.days[0]?.day || null);

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-400" />
                    Haftalık Plan
                </h3>
                <span className="text-xs text-white/50">{plan.startDate} - {plan.endDate}</span>
            </div>

            <p className="text-sm text-white/70 italic">{plan.summary}</p>

            <div className="space-y-2">
                {plan.days.map((day) => (
                    <div key={day.day} className="border border-white/5 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                            className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <span className="font-medium text-white">{day.day}</span>
                            {expandedDay === day.day ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {expandedDay === day.day && (
                            <div className="p-3 bg-black/20 space-y-3 text-sm">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                        <Utensils className="w-3 h-3" /> Öğünler
                                    </div>
                                    {day.meals.map((meal, idx) => (
                                        <div key={idx} className="flex justify-between text-white/80">
                                            <span>{meal.suggestion}</span>
                                            <span className="text-white/40 text-xs">{meal.calories} kcal</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-2 border-t border-white/10 space-y-2">
                                    <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                                        <Dumbbell className="w-3 h-3" /> Egzersiz
                                    </div>
                                    <div className="flex justify-between text-white/80">
                                        <span>{day.workout.activity}</span>
                                        <span className="text-white/40 text-xs">{day.workout.duration} • {day.workout.calories} kcal</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
