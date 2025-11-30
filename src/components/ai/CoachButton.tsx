"use client";

import { Bot, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";

export default function CoachButton() {
    const [unreadCount, setUnreadCount] = useState(0);
    const supabase = useSupabaseClient();
    const session = useSession();

    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchUnread = async () => {
            const { count } = await supabase
                .from("coach_suggestions")
                .select("*", { count: "exact", head: true })
                .eq("user_id", session.user.id)
                .eq("is_read", false);

            setUnreadCount(count || 0);
        };

        fetchUnread();

        // Subscribe to changes
        const channel = supabase
            .channel("coach_suggestions_changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "coach_suggestions",
                    filter: `user_id=eq.${session.user.id}`,
                },
                () => {
                    fetchUnread();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, session?.user?.id]);

    return (
        <Link
            href="/health#assistant"
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/20 transition-all duration-300 group"
        >
            <Bot className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />

            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg ring-2 ring-gray-950 animate-in zoom-in">
                    {unreadCount}
                </span>
            )}

            {unreadCount === 0 && (
                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
        </Link>
    );
}
