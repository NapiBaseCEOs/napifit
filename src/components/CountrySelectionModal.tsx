"use client";

import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import type { Database } from "@/lib/supabase/types";
import CountrySelector from "./i18n/CountrySelector";
import { useLocale } from "./i18n/LocaleProvider";
import { X } from "lucide-react";

interface CountrySelectionModalProps {
  userId: string;
  onComplete: () => void;
}

export default function CountrySelectionModal({ userId, onComplete }: CountrySelectionModalProps) {
  const supabase = useSupabaseClient<Database>();
  const { t } = useLocale();
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Detect country on mount
    fetch("/api/detect-locale")
      .then((res) => res.json())
      .then((data) => {
        if (data.countryCode) {
          setDetectedCountry(data.countryCode);
          if (!countryCode) {
            setCountryCode(data.countryCode);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    if (!countryCode) {
      setError(t("country.required"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ country_code: countryCode })
        .eq("id", userId);

      if (updateError) throw updateError;

      onComplete();
    } catch (err) {
      console.error("Country update error:", err);
      setError(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0f1424]/95 backdrop-blur-xl p-6 shadow-2xl animate-fade-up">
        <button
          onClick={onComplete}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{t("country.selectTitle")}</h2>
            <p className="text-sm text-gray-400">{t("country.selectDescription")}</p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <CountrySelector
            value={countryCode}
            onChange={setCountryCode}
            detectedCountry={detectedCountry}
            required
          />

          <button
            onClick={handleSave}
            disabled={loading || !countryCode}
            className="w-full rounded-xl bg-gradient-to-r from-primary-500 to-fitness-orange px-6 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? t("common.loading") : t("country.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

