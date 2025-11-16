"use client";

import { useMemo } from "react";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import type { Session } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface SupabaseProviderProps {
  children: React.ReactNode;
  initialSession: Session | null;
  enabled?: boolean;
}

export default function SupabaseProvider({
  children,
  initialSession,
  enabled = true,
}: SupabaseProviderProps) {
  const supabaseClient = useMemo(() => {
    if (!enabled) return null;
    return createSupabaseBrowserClient();
  }, [enabled]);

  if (!enabled || !supabaseClient) {
    return <>{children}</>;
  }

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      {children}
    </SessionContextProvider>
  );
}

