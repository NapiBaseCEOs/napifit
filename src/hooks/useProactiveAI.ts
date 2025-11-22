"use client";

import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";

interface ProactiveSuggestion {
  id: string;
  message: string;
  action: string;
  priority: "low" | "medium" | "high";
}

export function useProactiveAI() {
  const session = useSession();
  const [suggestions, setSuggestions] = useState<ProactiveSuggestion[]>([]);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    if (!session?.user) return;

    // Her 30 dakikada bir kontrol et
    const checkInterval = setInterval(async () => {
      try {
        const response = await fetch("/api/ai/proactive-suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.id }),
        });

        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions || []);
          setLastCheck(new Date());
        }
      } catch (error) {
        console.error("Proactive AI suggestions error:", error);
      }
    }, 30 * 60 * 1000); // 30 dakika

    // İlk kontrol
    checkInterval;

    return () => clearInterval(checkInterval);
  }, [session]);

  return { suggestions, lastCheck };
}

