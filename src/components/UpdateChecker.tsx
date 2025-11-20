"use client";

import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { APP_VERSION, RELEASE_NOTES } from "@/config/version";

const VERSION_STORAGE_KEY = "napifit_version";

export interface UpdateCheckerRef {
  checkForUpdate: () => void;
}

const UpdateChecker = forwardRef<UpdateCheckerRef>((_props, ref) => {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showCurrentVersionDialog, setShowCurrentVersionDialog] = useState(false);
  const [newVersion, setNewVersion] = useState<string | null>(null);

  const checkForUpdate = () => {
    // LocalStorage'dan mevcut versiyonu al
    const storedVersion = localStorage.getItem(VERSION_STORAGE_KEY);
    
    // Eğer versiyon yoksa veya farklıysa güncelleme bildirimi göster
    if (storedVersion !== APP_VERSION) {
      setNewVersion(APP_VERSION);
      setShowUpdateDialog(true);
    } else {
      // Versiyon aynıysa güzel tasarımlı dialog göster
      setShowCurrentVersionDialog(true);
    }
  };

  // Ref ile dışarıdan erişilebilir hale getir
  useImperativeHandle(ref, () => ({
    checkForUpdate,
  }));

  useEffect(() => {
    // Sayfa yüklendiğinde otomatik kontrol (sadece ilk yüklemede)
    if (typeof window !== "undefined") {
      const storedVersion = localStorage.getItem(VERSION_STORAGE_KEY);
      
      // Eğer versiyon yoksa veya farklıysa güncelleme bildirimi göster
      if (storedVersion !== APP_VERSION) {
        setNewVersion(APP_VERSION);
        setShowUpdateDialog(true);
      }
    }
  }, []);

  const handleUpdate = () => {
    // Versiyonu localStorage'a kaydet
    localStorage.setItem(VERSION_STORAGE_KEY, APP_VERSION);
    setShowUpdateDialog(false);
    // Sayfayı yenile
    window.location.reload();
  };

  const handleDismiss = () => {
    // Versiyonu kaydetme, sadece dialog'u kapat
    // Böylece kullanıcı versiyon numarasına tıkladığında tekrar sorulabilir
    setShowUpdateDialog(false);
  };

  const handleCloseCurrentVersion = () => {
    setShowCurrentVersionDialog(false);
  };

  const currentRelease = RELEASE_NOTES.find((note) => note.version === APP_VERSION);
  const previousReleases = RELEASE_NOTES.filter((note) => note.version !== APP_VERSION).slice(0, 2);

  // Güncel versiyon dialog'u
  if (showCurrentVersionDialog) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="max-w-md w-full rounded-2xl border border-gray-800/60 bg-gray-900/95 p-6 shadow-2xl backdrop-blur animate-fade-up">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Uygulama Güncel!</h3>
                <p className="text-sm text-gray-400">Mevcut versiyon: {APP_VERSION}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-300 leading-relaxed">
              Harika! Uygulamanın en güncel versiyonunu kullanıyorsun. Tüm özellikler ve iyileştirmeler seninle!
            </p>

            {currentRelease && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 space-y-2">
                <div className="flex items-center justify-between text-sm text-emerald-100">
                  <span>{currentRelease.title}</span>
                  <span className="text-xs text-emerald-200">{currentRelease.date}</span>
                </div>
                <ul className="list-disc list-inside text-xs text-gray-100 space-y-1">
                  {currentRelease.highlights.slice(0, 3).map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={handleCloseCurrentVersion}
              className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 hover:shadow-emerald-500/40"
            >
              Tamam
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Yeni versiyon dialog'u
  if (!showUpdateDialog) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="max-w-md w-full rounded-2xl border border-gray-800/60 bg-gray-900/95 p-6 shadow-2xl backdrop-blur">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Yeni Güncelleme Mevcut</h3>
              <p className="text-sm text-gray-400">Versiyon {newVersion}</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-300 leading-relaxed">
            Uygulamanın yeni bir versiyonu mevcut. Güncellemeyi yüklemeden önce bu sürümde seni nelerin beklediğine göz at.
          </p>

          {currentRelease && (
            <div className="rounded-2xl border border-primary-500/30 bg-primary-500/10 px-4 py-3 space-y-2">
              <div className="flex items-center justify-between text-sm text-primary-100">
                <span>{currentRelease.title}</span>
                <span className="text-xs text-primary-200">{currentRelease.date}</span>
              </div>
              <ul className="list-disc list-inside text-xs text-gray-100 space-y-1">
                {currentRelease.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          )}

          {previousReleases.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Önceki sürümler</p>
              <ul className="text-xs text-gray-300 space-y-1">
                {previousReleases.map((release) => (
                  <li key={release.version} className="flex flex-col">
                    <span className="font-semibold text-white">
                      {release.version} · {release.title}
                    </span>
                    <span className="text-gray-400">{release.highlights[0]}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              className="flex-1 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
            >
              Daha Sonra
            </button>
            <button
              onClick={handleUpdate}
              className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-purple-500/30 transition-transform active:scale-95"
            >
              Güncelle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

UpdateChecker.displayName = "UpdateChecker";

export default UpdateChecker;

