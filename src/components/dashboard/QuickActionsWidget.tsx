"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const quickActions = [
    {
        icon: "🍽️",
        label: "Öğün Ekle",
        href: "/meals",
        color: "from-fitness-orange to-red-500",
    },
    {
        icon: "💪",
        label: "Egzersiz Ekle",
        href: "/workouts",
        color: "from-fitness-purple to-pink-500",
    },
    {
        icon: "💧",
        label: "Su İç",
        href: "/water",
        color: "from-blue-500 to-cyan-500",
    },
    {
        icon: "🤖",
        label: "AI Koç",
        href: "/ai-assistant",
        color: "from-primary-500 to-green-500",
    },
];

export default function QuickActionsWidget() {
    const router = useRouter();

    return (
        <div className="rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6 shadow-xl backdrop-blur">
            <h3 className="text-lg font-semibold text-white mb-4">⚡ Hızlı İşlemler</h3>

            <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                    <Link
                        key={action.href}
                        href={action.href}
                        className="group relative overflow-hidden rounded-xl border border-gray-700 bg-gray-800/50 p-4 transition-all duration-300 hover:scale-105 hover:border-gray-600 hover:shadow-lg"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                        <div className="relative flex flex-col items-center gap-2 text-center">
                            <span className="text-3xl">{action.icon}</span>
                            <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                                {action.label}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
