"use client";

import { useState, useEffect } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import type { Database } from "@/lib/supabase/types";
import CountrySelectionModal from "./CountrySelectionModal";

export default function CountrySelectionWrapper() {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();
  const [showModal, setShowModal] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!session?.user?.id || checked) return;

    const checkCountry = async () => {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("country_code")
          .eq("id", session.user.id)
          .maybeSingle();

        // Eğer country_code null ise modal göster
        if (profile && !profile.country_code) {
          // LocalStorage'da daha önce gösterilmiş mi kontrol et
          const hasSeenModal = localStorage.getItem(`country-modal-${session.user.id}`);
          if (!hasSeenModal) {
            setShowModal(true);
          }
        }
      } catch (error) {
        console.error("Country check error:", error);
      } finally {
        setChecked(true);
      }
    };

    checkCountry();
  }, [session, supabase, checked]);

  const handleComplete = () => {
    if (session?.user?.id) {
      localStorage.setItem(`country-modal-${session.user.id}`, "true");
    }
    setShowModal(false);
  };

  if (!showModal || !session?.user?.id) return null;

  return <CountrySelectionModal userId={session.user.id} onComplete={handleComplete} />;
}

