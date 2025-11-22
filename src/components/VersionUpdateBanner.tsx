"use client";

import { useEffect, useState } from "react";
import { checkForNewVersion, updateToNewVersion, dismissVersionUpdate } from "@/lib/version-manager";
import { APP_VERSION } from "@/config/version";

export default function VersionUpdateBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    checkForNewVersion().then((hasUpdate) => {
      setShowBanner(hasUpdate);
    });
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);
    await updateToNewVersion();
  };

  const handleDismiss = () => {
    dismissVersionUpdate();
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] animate-slide-down">
      <div className="relative rounded-2xl border border-primary-500/50 bg-gradient-to-r from-primary-500/20 via-fitness-orange/20 to-primary-500/20 backdrop-blur-xl px-6 py-4 shadow-2xl shadow-primary-500/30 max-w-md mx-auto">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/20 ring-2 ring-primary-500/50">
              <svg className="h-5 w-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">
              Yeni Versiyon Mevcut!
            </p>
            <p className="text-xs text-gray-300">
              v{APP_VERSION} - Yeni özellikler ve iyileştirmeler
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-primary-500/50 hover:shadow-primary-500/70 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isUpdating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Güncelleniyor...
                </span>
              ) : (
                "Güncelle"
              )}
            </button>
            <button
              onClick={handleDismiss}
              className="rounded-lg border border-gray-600 bg-gray-800/50 px-3 py-2 text-xs font-medium text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200"
            >
              Daha Sonra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

