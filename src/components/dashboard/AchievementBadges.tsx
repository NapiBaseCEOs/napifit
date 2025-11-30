"use client";

import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    points: number;
    unlocked: boolean;
    unlockedAt?: string;
}

export default function AchievementBadges() {
    const supabase = useSupabaseClient();
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            // Fetch all achievements
            const { data: allAchievements } = await supabase
                .from('achievements')
                .select('*')
                .limit(8);

            // Fetch user's unlocked achievements
            const { data: userAchievements } = await supabase
                .from('user_achievements')
                .select('achievement_id, unlocked_at');

            const unlockedIds = new Set(userAchievements?.map(ua => ua.achievement_id) || []);

            const achievementsWithStatus = allAchievements?.map(ach => ({
                id: ach.id,
                name: ach.name,
                description: ach.description,
                icon: ach.icon,
                points: ach.points,
                unlocked: unlockedIds.has(ach.id),
                unlockedAt: userAchievements?.find(ua => ua.achievement_id === ach.id)?.unlocked_at,
            })) || [];

            setAchievements(achievementsWithStatus);
        } catch (error) {
            console.error('Error fetching achievements:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6">
                <div className="h-6 w-32 bg-gray-800 rounded mb-4"></div>
                <div className="grid grid-cols-4 gap-3">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-20 bg-gray-800 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6 shadow-xl backdrop-blur">
            <h3 className="text-lg font-semibold text-white mb-4">🏆 Başarılar</h3>

            <div className="grid grid-cols-4 gap-3">
                {achievements.map((achievement) => (
                    <div
                        key={achievement.id}
                        className={`relative group rounded-xl border p-3 transition-all duration-300 hover:scale-105 ${achievement.unlocked
                                ? 'border-primary-500/50 bg-primary-500/10'
                                : 'border-gray-700 bg-gray-800/50 opacity-50'
                            }`}
                        title={achievement.description}
                    >
                        <div className="text-center">
                            <div className="text-3xl mb-1">{achievement.icon}</div>
                            <div className="text-xs font-semibold text-white truncate">
                                {achievement.name}
                            </div>
                            {achievement.unlocked && (
                                <div className="text-xs text-primary-400 mt-1">
                                    +{achievement.points} XP
                                </div>
                            )}
                        </div>

                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs text-gray-300 whitespace-nowrap shadow-xl">
                                {achievement.description}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
