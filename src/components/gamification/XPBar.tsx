"use client";

import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { calculateLevel, getXPProgress } from "@/lib/gamification/xp-system";

export default function XPBar() {
  const supabase = useSupabaseClient();
  const [xpData, setXPData] = useState({ totalXP: 0, level: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchXPData();
  }, []);

  const fetchXPData = async () => {
    try {
      const { data } = await supabase
        .from('user_gamification')
        .select('total_xp, level')
        .single();

      if (data) {
        setXPData({ totalXP: data.total_xp, level: data.level });
      }
    } catch (error) {
      console.error('Error fetching XP data:', error);
    } finally {
      setLoading(false);
    }
  };

  const progress = getXPProgress(xpData.totalXP);

  if (loading) {
    return (
      <div className="animate-pulse rounded-xl border border-gray-800 bg-gray-900/50 p-4">
        <div className="h-4 bg-gray-800 rounded"></div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary-500/30 bg-gradient-to-r from-primary-500/10 to-transparent p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary-400">Lv.{xpData.level}</span>
          <span className="text-sm text-gray-400">
            {progress.current}/{progress.needed} XP
          </span>
        </div>
        <span className="text-sm font-semibold text-primary-300">{progress.percentage}%</span>
      </div>
      
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-green-500 transition-all duration-500"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
    </div>
  );
}
