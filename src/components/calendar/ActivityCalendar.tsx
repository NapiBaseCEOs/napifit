"use client";

import { useState, useEffect } from "react";
// ChevronLeft ve ChevronRight icon'ları (lucide-react yerine inline SVG)
const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

interface DayActivity {
  meals: number;
  workouts: number;
}

interface ActivityCalendarProps {
  onDateClick?: (date: string) => void;
  className?: string;
}

export default function ActivityCalendar({ onDateClick, className = "" }: ActivityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activities, setActivities] = useState<Record<string, DayActivity>>({});
  const [todayInfo, setTodayInfo] = useState<{
    meals: number;
    workouts: number;
    isComplete: boolean;
    hasMeal: boolean;
    hasWorkout: boolean;
  } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/calendar/activity?month=${year}-${String(month).padStart(2, "0")}&year=${year}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || {});
        setTodayInfo(data.today || null);
      }
    } catch (error) {
      console.error("Failed to fetch calendar activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Ayın ilk gününün haftanın hangi günü olduğunu bul
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const firstDayWeekday = firstDayOfMonth.getDay(); // 0 = Pazar, 6 = Cumartesi
  const daysInMonth = new Date(year, month, 0).getDate();

  // Türkçe gün isimleri (Pazartesi başlangıçlı)
  const dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];

  // Gün durumunu belirle
  const getDayStatus = (day: number): "complete" | "partial" | "empty" | "today" | "today-empty" | "today-partial" => {
    const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const activity = activities[dateKey] || { meals: 0, workouts: 0 };
    
    const today = new Date();
    const isToday = year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate();

    if (isToday) {
      if (activity.meals > 0 && activity.workouts > 0) return "today";
      if (activity.meals > 0 || activity.workouts > 0) return "today-partial";
      return "today-empty";
    }

    if (activity.meals > 0 && activity.workouts > 0) return "complete";
    if (activity.meals > 0 || activity.workouts > 0) return "partial";
    return "empty";
  };

  // Gün rengi
  const getDayColor = (status: string): string => {
    switch (status) {
      case "complete":
        return "bg-gradient-to-br from-green-500/40 to-emerald-500/40 border-green-500/60";
      case "partial":
        return "bg-gradient-to-br from-yellow-500/30 to-amber-500/30 border-yellow-500/50";
      case "today":
        return "bg-gradient-to-br from-primary-500/50 to-fitness-orange/50 border-primary-400 ring-2 ring-primary-400/50";
      case "today-partial":
        return "bg-gradient-to-br from-yellow-500/40 to-amber-500/40 border-yellow-400 ring-2 ring-yellow-400/50";
      case "today-empty":
        return "bg-gradient-to-br from-red-500/30 to-rose-500/30 border-red-500/50 ring-2 ring-red-400/50";
      default:
        return "bg-gray-800/30 border-gray-700/50";
    }
  };

  // Gün tooltip metni
  const getDayTooltip = (day: number): string => {
    const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const activity = activities[dateKey] || { meals: 0, workouts: 0 };
    const today = new Date();
    const isToday = year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate();

    if (isToday) {
      if (activity.meals > 0 && activity.workouts > 0) {
        return `Bugün: ${activity.meals} öğün, ${activity.workouts} egzersiz ✓`;
      }
      if (activity.meals > 0) {
        return `Bugün: ${activity.meals} öğün var, egzersiz eksik`;
      }
      if (activity.workouts > 0) {
        return `Bugün: ${activity.workouts} egzersiz var, öğün eksik`;
      }
      return "Bugün: Henüz veri girişi yok ⚠️";
    }

    if (activity.meals > 0 && activity.workouts > 0) {
      return `${day} ${monthNames[month - 1]}: ${activity.meals} öğün, ${activity.workouts} egzersiz`;
    }
    if (activity.meals > 0) {
      return `${day} ${monthNames[month - 1]}: ${activity.meals} öğün`;
    }
    if (activity.workouts > 0) {
      return `${day} ${monthNames[month - 1]}: ${activity.workouts} egzersiz`;
    }
    return `${day} ${monthNames[month - 1]}: Veri yok`;
  };

  // Takvim günleri oluştur
  const calendarDays = [];
  
  // Boş hücreler (ayın ilk gününden önce)
  for (let i = 0; i < (firstDayWeekday === 0 ? 6 : firstDayWeekday - 1); i++) {
    calendarDays.push(null);
  }

  // Ayın günleri
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
  <div
    className={`max-w-md sm:max-w-lg lg:max-w-2xl mx-auto rounded-2xl border border-gray-800/70 bg-gray-900/80 backdrop-blur-sm p-4 sm:p-5 shadow-md ${className}`}
  >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-white">Aktivite Takvimi</h3>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-1">
            {monthNames[month - 1]} {year}
          </p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={goToPreviousMonth}
            className="rounded-lg border border-gray-700 bg-gray-800/50 p-1.5 text-gray-400 hover:border-gray-600 hover:bg-gray-800 hover:text-white transition-all"
            aria-label="Önceki ay"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goToToday}
            className="rounded-lg border border-primary-500/30 bg-primary-500/10 px-2.5 py-1.5 text-[11px] sm:text-xs font-medium text-primary-300 hover:border-primary-500/50 hover:bg-primary-500/20 transition-all"
          >
            Bugün
          </button>
          <button
            onClick={goToNextMonth}
            className="rounded-lg border border-gray-700 bg-gray-800/50 p-1.5 text-gray-400 hover:border-gray-600 hover:bg-gray-800 hover:text-white transition-all"
            aria-label="Sonraki ay"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Bugün Özeti */}
      {todayInfo && (
        <div className={`mb-4 rounded-xl border p-3 sm:p-4 ${
          todayInfo.isComplete
            ? "border-green-500/40 bg-green-500/10"
            : todayInfo.hasMeal || todayInfo.hasWorkout
            ? "border-yellow-500/40 bg-yellow-500/10"
            : "border-red-500/40 bg-red-500/10"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] sm:text-sm font-medium text-white">Bugünün Durumu</p>
              <p className="text-[11px] sm:text-xs text-gray-400 mt-1">
                {todayInfo.meals} öğün • {todayInfo.workouts} egzersiz
              </p>
            </div>
            <div className="text-right">
              {todayInfo.isComplete ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400">
                  ✓ Tamamlandı
                </span>
              ) : todayInfo.hasMeal || todayInfo.hasWorkout ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-400">
                  ⚠ Kısmi
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-400">
                  ⚠ Eksik
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Takvim Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-400 text-sm">Yükleniyor...</div>
        </div>
      ) : (
        <>
          {/* Gün isimleri */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2">
            {dayNames.map((dayName) => (
              <div
                key={dayName}
                className="text-center text-[11px] sm:text-xs font-semibold text-gray-400 py-1.5"
              >
                {dayName}
              </div>
            ))}
          </div>

          {/* Takvim günleri */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const status = getDayStatus(day);
              const activity = activities[`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`] || { meals: 0, workouts: 0 };
              const today = new Date();
              const isToday = year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate();

              const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isSelected = selectedDate === dateKey;

              return (
                <button
                  key={day}
                  onClick={() => {
                    if (onDateClick) {
                      onDateClick(dateKey);
                    } else {
                      setSelectedDate((prev) => (prev === dateKey ? null : dateKey));
                    }
                  }}
                  className={`aspect-square rounded-lg border transition-all hover:scale-[1.03] hover:shadow-md ${
                    getDayColor(status)
                  } ${isSelected ? "ring-2 ring-white/70" : ""} ${onDateClick ? "cursor-pointer" : "cursor-pointer"}`}
                  title={getDayTooltip(day)}
                >
                  <div className="flex flex-col items-center justify-center h-full p-0.5 sm:p-1">
                    <span
                      className={`text-[11px] sm:text-sm font-semibold ${
                        isToday ? "text-white" : status === "empty" ? "text-gray-500" : "text-white"
                      }`}
                    >
                      {day}
                    </span>
                    {(activity.meals > 0 || activity.workouts > 0) && (
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {activity.meals > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" title={`${activity.meals} öğün`} />
                        )}
                        {activity.workouts > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" title={`${activity.workouts} egzersiz`} />
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Açıklama */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[11px] sm:text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-green-500/40 to-emerald-500/40 border border-green-500/60" />
              <span>Tam (Öğün + Egzersiz)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-yellow-500/30 to-amber-500/30 border border-yellow-500/50" />
              <span>Kısmi (Öğün veya Egzersiz)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gray-800/30 border border-gray-700/50" />
              <span>Boş</span>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-primary-500/20 bg-gray-900/70 p-3 sm:p-4 text-[13px] sm:text-sm text-gray-200">
            {selectedDate ? (
              <>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Seçilen Gün</p>
                    <p className="text-lg font-semibold text-white">
                      {new Date(selectedDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" })}
                    </p>
                  </div>
                  <button
                    className="text-xs text-primary-300 hover:text-primary-200 underline"
                    onClick={() => setSelectedDate(null)}
                  >
                    Temizle
                  </button>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                    <p className="text-xs text-emerald-200">Öğün</p>
                    <p className="text-2xl font-semibold text-white">
                      {activities[selectedDate]?.meals ?? 0}
                    </p>
                  </div>
                  <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
                    <p className="text-xs text-blue-200">Egzersiz</p>
                    <p className="text-2xl font-semibold text-white">
                      {activities[selectedDate]?.workouts ?? 0}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-400">
                Bir günü seçerek öğün ve egzersiz özetini görüntüleyin.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

