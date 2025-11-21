"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface WaterIntake {
  id: string;
  amount_ml: number;
  created_at: string;
}

interface WaterReminderProps {
  initialTotalAmount: number;
  initialDailyGoal: number;
  initialReminderEnabled: boolean;
  initialReminderInterval: number;
  userWeight?: number | null;
}

export default function WaterReminder({
  initialTotalAmount,
  initialDailyGoal,
  initialReminderEnabled,
  initialReminderInterval,
  userWeight,
}: WaterReminderProps) {
  const router = useRouter();
  const [totalAmount, setTotalAmount] = useState(initialTotalAmount);
  const [dailyGoal, setDailyGoal] = useState(initialDailyGoal);
  const [intakes, setIntakes] = useState<WaterIntake[]>([]);
  const [loading, setLoading] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(initialReminderEnabled);
  const [reminderInterval, setReminderInterval] = useState(initialReminderInterval);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  const [animationKey, setAnimationKey] = useState(0);

  // Bildirim iznini kontrol et
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Bildirim zamanlayıcısı
  useEffect(() => {
    if (!reminderEnabled || notificationPermission !== "granted") return;

    const interval = reminderInterval * 60 * 1000; // Dakikayı milisaniyeye çevir

    const showNotification = () => {
      if (document.hidden && Notification.permission === "granted") {
        new Notification("💧 Su Hatırlatıcısı", {
          body: `Hedefinize ulaşmak için su içmeyi unutmayın! ${Math.round(totalAmount)}ml / ${dailyGoal}ml`,
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          tag: "water-reminder",
          requireInteraction: false,
        });
      }
    };

    const timer = setInterval(showNotification, interval);
    return () => clearInterval(timer);
  }, [reminderEnabled, reminderInterval, notificationPermission, totalAmount, dailyGoal]);

  // Bildirim izni iste
  const requestNotificationPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Tarayıcınız bildirimleri desteklemiyor.");
      return;
    }

    if (Notification.permission === "granted") {
      setNotificationPermission("granted");
      return;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === "granted") {
        // İlk bildirimi göster
        new Notification("💧 Su Hatırlatıcısı Aktif", {
          body: "Artık düzenli olarak su içmenizi hatırlatacağız!",
          icon: "/icon-192.png",
        });
      }
    } else {
      alert("Bildirim izni reddedilmiş. Lütfen tarayıcı ayarlarından izin verin.");
    }
  };

  // Veriyi yeniden yükle
  const refreshData = useCallback(async () => {
    try {
      const response = await fetch("/api/water-intake");
      if (response.ok) {
        const data = await response.json();
        setTotalAmount(data.totalAmount);
        setDailyGoal(data.dailyGoal);
        setIntakes(data.intakes || []);
        setReminderEnabled(data.reminderEnabled);
        setReminderInterval(data.reminderInterval);
      }
    } catch (error) {
      console.error("Failed to fetch water intake:", error);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Su ekle
  const addWater = async (amount: number) => {
    setLoading(true);
    try {
      const response = await fetch("/api/water-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount_ml: amount }),
      });

      if (response.ok) {
        setAnimationKey((prev) => prev + 1);
        await refreshData();
        router.refresh();
      } else {
        alert("Su eklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Failed to add water:", error);
      alert("Su eklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Su sil
  const deleteWater = async (id: string) => {
    if (!confirm("Bu kaydı silmek istediğinizden emin misiniz?")) return;

    try {
      const response = await fetch(`/api/water-intake?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await refreshData();
        router.refresh();
      } else {
        alert("Kayıt silinirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Failed to delete water:", error);
      alert("Kayıt silinirken bir hata oluştu.");
    }
  };

  // Günlük hedef güncelle
  const updateDailyGoal = async (goal: number) => {
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dailyWaterGoalMl: goal }),
      });

      if (response.ok) {
        setDailyGoal(goal);
      }
    } catch (error) {
      console.error("Failed to update daily goal:", error);
    }
  };

  // Bildirim ayarlarını güncelle
  const updateReminderSettings = async (enabled: boolean, interval: number) => {
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          waterReminderEnabled: enabled,
          waterReminderIntervalMinutes: interval,
        }),
      });

      if (response.ok) {
        setReminderEnabled(enabled);
        setReminderInterval(interval);
      }
    } catch (error) {
      console.error("Failed to update reminder settings:", error);
    }
  };

  const progress = Math.min(100, (totalAmount / dailyGoal) * 100);
  const remaining = Math.max(0, dailyGoal - totalAmount);

  // Önerilen günlük hedef (kilo bazlı: 30-35ml per kg)
  const recommendedGoal = userWeight ? Math.round(userWeight * 33) : 2000;

  // Hızlı ekleme butonları (ml)
  const quickAddAmounts = [200, 250, 300, 500];

  return (
    <main className="relative min-h-screen px-4 py-8 sm:px-6 overflow-hidden bg-[#0a0a0a]">
      {/* Modern Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-transparent blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-teal-500/20 via-emerald-500/20 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        {/* Modern Header */}
        <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-gray-900/90 via-blue-900/10 to-cyan-900/10 backdrop-blur-xl p-6 shadow-2xl shadow-blue-500/20 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-blue-300 shadow-lg shadow-blue-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Su Hatırlatıcısı
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-white">
            💧 Su Tüketimi Takibi
          </h1>
          <p className="mt-2 text-lg text-gray-300">
            Günlük su tüketiminizi takip edin ve sağlıklı kalın!
          </p>
        </div>

        {/* Ana Su Göstergesi */}
        <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-gray-900/90 via-blue-900/10 to-cyan-900/10 backdrop-blur-xl p-8 shadow-2xl shadow-blue-500/20">
          <div className="flex flex-col items-center justify-center">
            {/* Su Kadehi Animasyonu */}
            <div 
              key={animationKey}
              className="relative w-48 h-64 mb-8 transition-all duration-1000 ease-out"
            >
              {/* Su Dolum Göstergesi */}
              <div className="absolute bottom-0 left-0 right-0 rounded-b-3xl overflow-hidden" style={{ height: `${Math.min(100, progress)}%` }}>
                <div 
                  className="w-full h-full bg-gradient-to-t from-blue-600 via-blue-400 to-cyan-300 transition-all duration-1000 ease-out"
                  style={{
                    animation: progress >= 100 ? 'wave 2s ease-in-out infinite' : 'none',
                  }}
                />
              </div>
              
              {/* Kadeh Çerçevesi */}
              <div className="absolute inset-0 border-8 border-blue-400/50 rounded-3xl shadow-inner" />
              
              {/* Üst Kenar */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-gray-800/80 rounded-full" />
              
              {/* Su Dalgası Efekti (100% olduğunda) */}
              {progress >= 100 && (
                <div className="absolute top-0 left-0 right-0 h-4 bg-blue-400/30 animate-pulse rounded-t-3xl" />
              )}
            </div>

            {/* İlerleme Göstergesi */}
            <div className="w-full max-w-md space-y-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">
                  {Math.round(totalAmount)}ml
                </div>
                <div className="text-xl text-gray-400">
                  / {dailyGoal}ml
                </div>
              </div>

              {/* İlerleme Çubuğu */}
              <div className="relative h-6 bg-gray-800/60 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full transition-all duration-1000 ease-out rounded-full ${
                    progress < 50
                      ? "bg-gradient-to-r from-red-500 to-orange-500"
                      : progress < 80
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                      : progress < 100
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse"
                  }`}
                  style={{ width: `${progress}%` }}
                />
                {progress >= 100 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                )}
              </div>

              <div className="text-center">
                {progress < 100 ? (
                  <p className="text-gray-400">
                    Hedefe <span className="text-blue-400 font-semibold">{Math.round(remaining)}ml</span> kaldı
                  </p>
                ) : (
                  <p className="text-emerald-400 font-semibold text-lg">
                    🎉 Tebrikler! Günlük hedefinize ulaştınız!
                  </p>
                )}
              </div>
            </div>

            {/* Hızlı Ekleme Butonları */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-md">
              {quickAddAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => addWater(amount)}
                  disabled={loading}
                  className="group relative rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm p-4 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="text-2xl mb-1">💧</div>
                  <div className="text-lg font-bold text-white">{amount}ml</div>
                  <div className="text-xs text-gray-400 mt-1">Hızlı Ekle</div>
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Özel Miktar Ekle */}
            <div className="mt-6 w-full max-w-md">
              <label className="mb-2 block text-sm text-gray-400">Özel Miktar (ml)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  id="custom-amount"
                  min="1"
                  max="10000"
                  step="50"
                  placeholder="Örn: 350"
                  className="flex-1 rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={() => {
                    const input = document.getElementById("custom-amount") as HTMLInputElement;
                    const amount = parseInt(input?.value || "0");
                    if (amount > 0) {
                      addWater(amount);
                      if (input) input.value = "";
                    }
                  }}
                  disabled={loading}
                  className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-2 font-semibold text-white transition-all hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ekle
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Günlük Hedef ve Bildirim Ayarları */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Günlük Hedef */}
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-gray-900/80 via-blue-900/5 to-transparent backdrop-blur-sm p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
              🎯 Günlük Hedef
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-2 block text-sm text-gray-400">Hedef (ml)</label>
                <input
                  type="number"
                  value={dailyGoal}
                  onChange={(e) => {
                    const newGoal = parseInt(e.target.value) || 2000;
                    setDailyGoal(newGoal);
                    updateDailyGoal(newGoal);
                  }}
                  min="500"
                  max="10000"
                  step="100"
                  className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              {userWeight && recommendedGoal !== dailyGoal && (
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
                  <p className="text-xs text-blue-300">
                    💡 Önerilen hedef (kilonuza göre): <span className="font-semibold">{recommendedGoal}ml</span>
                  </p>
                  <button
                    onClick={() => {
                      setDailyGoal(recommendedGoal);
                      updateDailyGoal(recommendedGoal);
                    }}
                    className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
                  >
                    Önerilen hedefi kullan
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bildirim Ayarları */}
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-gray-900/80 via-blue-900/5 to-transparent backdrop-blur-sm p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
              🔔 Bildirimler
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300">Su hatırlatıcısı</label>
                <button
                  onClick={() => {
                    const newEnabled = !reminderEnabled;
                    setReminderEnabled(newEnabled);
                    updateReminderSettings(newEnabled, reminderInterval);
                    if (newEnabled && notificationPermission !== "granted") {
                      requestNotificationPermission();
                    }
                  }}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    reminderEnabled ? "bg-blue-500" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      reminderEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              
              {reminderEnabled && (
                <>
                  <div>
                    <label className="mb-2 block text-sm text-gray-400">
                      Bildirim Aralığı (dakika)
                    </label>
                    <input
                      type="number"
                      value={reminderInterval}
                      onChange={(e) => {
                        const newInterval = parseInt(e.target.value) || 120;
                        setReminderInterval(newInterval);
                        updateReminderSettings(reminderEnabled, newInterval);
                      }}
                      min="30"
                      max="480"
                      step="30"
                      className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  {notificationPermission !== "granted" && (
                    <button
                      onClick={requestNotificationPermission}
                      className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-blue-600 hover:to-cyan-600"
                    >
                      {notificationPermission === "denied"
                        ? "🔒 Bildirim İzni Reddedilmiş"
                        : "🔔 Bildirim İzni Ver"}
                    </button>
                  )}
                  
                  {notificationPermission === "granted" && (
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                      <p className="text-xs text-emerald-300">
                        ✅ Bildirimler aktif - Her {reminderInterval} dakikada bir hatırlatılacaksınız
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bugünkü Kayıtlar */}
        <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-gray-900/80 via-blue-900/5 to-transparent backdrop-blur-sm p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
            📋 Bugünkü Kayıtlar
          </h3>
          {intakes.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Henüz su tüketimi kaydı yok</p>
          ) : (
            <div className="space-y-2">
              {intakes.map((intake) => (
                <div
                  key={intake.id}
                  className="flex items-center justify-between rounded-lg border border-gray-800/70 bg-gray-900/60 p-4 hover:border-blue-500/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💧</span>
                    <div>
                      <div className="font-semibold text-white">{intake.amount_ml}ml</div>
                      <div className="text-xs text-gray-400">
                        {new Date(intake.created_at).toLocaleTimeString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteWater(intake.id)}
                    className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    Sil
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%, 100% {
            transform: translateY(0) scaleY(1);
          }
          50% {
            transform: translateY(-5px) scaleY(1.05);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </main>
  );
}

