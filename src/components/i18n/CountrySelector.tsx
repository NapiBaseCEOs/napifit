"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "./LocaleProvider";

// ISO 3166-1 alpha-2 country codes with flags
const countries: Array<{ code: string; name: string; flag: string }> = [
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  // Add more countries as needed
];

interface CountrySelectorProps {
  value?: string | null;
  onChange: (countryCode: string) => void;
  detectedCountry?: string | null;
  required?: boolean;
  className?: string;
}

export default function CountrySelector({
  value,
  onChange,
  detectedCountry,
  required = false,
  className = "",
}: CountrySelectorProps) {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCountry = countries.find((c) => c.code === value);
  const detectedCountryName = countries.find((c) => c.code === detectedCountry);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <label className="block text-sm font-semibold text-gray-300 mb-2">
        {t("country.select")} {required && <span className="text-red-400">*</span>}
      </label>
      
      {detectedCountryName && !value && (
        <div className="mb-2 p-2 bg-primary-500/10 border border-primary-500/30 rounded-lg text-xs text-primary-200">
          {t("country.detected")}: {detectedCountryName.flag} {detectedCountryName.name}
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white hover:bg-white/10 hover:border-white/20 transition-all"
      >
        <div className="flex items-center gap-3">
          {selectedCountry ? (
            <>
              <span className="text-2xl">{selectedCountry.flag}</span>
              <span>{selectedCountry.name}</span>
            </>
          ) : (
            <span className="text-gray-400">{t("country.select")}...</span>
          )}
        </div>
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full max-h-64 overflow-y-auto rounded-xl border border-white/10 bg-[#0f1424]/95 backdrop-blur-xl shadow-2xl">
          <div className="p-1">
            {countries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onChange(country.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all ${
                  value === country.code
                    ? "bg-primary-500/20 text-primary-200 font-semibold"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-xl">{country.flag}</span>
                <span>{country.name}</span>
                {value === country.code && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-primary-400 animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

