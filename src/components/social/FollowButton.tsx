"use client";

import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function FollowButton({ userId, initialFollowing = false }: { userId: string; initialFollowing?: boolean }) {
    const supabase = useSupabaseClient();
    const [isFollowing, setIsFollowing] = useState(initialFollowing);
    const [loading, setLoading] = useState(false);

    const handleFollow = async () => {
        setLoading(true);
        try {
            if (isFollowing) {
                await supabase
                    .from('follows')
                    .delete()
                    .eq('follower_id', (await supabase.auth.getUser()).data.user?.id)
                    .eq('following_id', userId);
                setIsFollowing(false);
            } else {
                await supabase
                    .from('follows')
                    .insert({
                        follower_id: (await supabase.auth.getUser()).data.user?.id,
                        following_id: userId,
                    });
                setIsFollowing(true);
            }
        } catch (error) {
            console.error('Follow error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleFollow}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${isFollowing
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
        >
            {loading ? '...' : isFollowing ? 'Takipten Çık' : 'Takip Et'}
        </button>
    );
}
