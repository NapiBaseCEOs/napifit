"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { CalorieAIResponse } from "@/types/ai-calories";

interface HealthFormsProps {
  onSuccess?: () => void;
}

export default function HealthForms({ onSuccess }: HealthFormsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"metric" | "workout" | "meal">("metric");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Health Metric Form
  const [metricData, setMetricData] = useState({
    weight: "",
    bodyFat: "",
    muscleMass: "",
    water: "",
    bmi: "",
    notes: "",
  });

  // Workout Form
  const [workoutData, setWorkoutData] = useState({
    name: "",
    type: "cardio" as "cardio" | "strength" | "flexibility" | "sports" | "other",
    duration: "",
    calories: "",
    distance: "",
    notes: "",
  });

  // Meal Form
  const [mealData, setMealData] = useState({
    mealType: "breakfast" as "breakfast" | "lunch" | "dinner" | "snack",
    foods: [{ name: "", calories: "", quantity: "", quantityCalories: {} as Record<string, number> }],
    notes: "",
  });

  const [workoutAiLoading, setWorkoutAiLoading] = useState(false);
  const [mealAiLoading, setMealAiLoading] = useState(false);
  const [foodAiLoading, setFoodAiLoading] = useState<Record<number, boolean>>({});
  const foodNameTimeouts = useRef<Record<number, NodeJS.Timeout>>({});
  const [aiFeedback, setAiFeedback] = useState<{
    variant: "workout" | "meal" | null;
    message: string | null;
    error: string | null;
  }>({
    variant: null,
    message: null,
    error: null,
  });

  const handleMetricSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: any = {};
      if (metricData.weight) payload.weight = parseFloat(metricData.weight);
      if (metricData.bodyFat) payload.bodyFat = parseFloat(metricData.bodyFat);
      if (metricData.muscleMass) payload.muscleMass = parseFloat(metricData.muscleMass);
      if (metricData.water) payload.water = parseFloat(metricData.water);
      if (metricData.bmi) payload.bmi = parseFloat(metricData.bmi);
      if (metricData.notes) payload.notes = metricData.notes;

      const response = await fetch("/api/health-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Bir hata oluştu");
      }

      setSuccess("Sağlık metrik başarıyla eklendi!");
      setMetricData({
        weight: "",
        bodyFat: "",
        muscleMass: "",
        water: "",
        bmi: "",
        notes: "",
      });
      setTimeout(() => {
        setSuccess(null);
        router.refresh();
        onSuccess?.();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: any = {
        name: workoutData.name,
        type: workoutData.type,
      };
      if (workoutData.duration) payload.duration = parseInt(workoutData.duration);
      if (workoutData.calories) payload.calories = parseFloat(workoutData.calories);
      if (workoutData.distance) payload.distance = parseFloat(workoutData.distance);
      if (workoutData.notes) payload.notes = workoutData.notes;

      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Bir hata oluştu");
      }

      setSuccess("Egzersiz başarıyla eklendi!");
      setWorkoutData({
        name: "",
        type: "cardio",
        duration: "",
        calories: "",
        distance: "",
        notes: "",
      });
      setTimeout(() => {
        setSuccess(null);
        router.refresh();
        onSuccess?.();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleMealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const foods = mealData.foods
        .filter((f) => f.name.trim() && f.calories)
        .map((f) => ({
          name: f.name.trim(),
          calories: parseFloat(f.calories),
          quantity: f.quantity.trim() || undefined,
        }));

      if (foods.length === 0) {
        throw new Error("Yiyecek isimlerini ve kalorilerini girin veya 'AI ile kalorileri doldur' butonunu kullanın.");
      }

      const totalCalories = foods.reduce((sum, f) => sum + f.calories, 0);

      const payload = {
        mealType: mealData.mealType,
        foods,
        totalCalories,
        notes: mealData.notes || undefined,
      };

      const response = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Bir hata oluştu");
      }

      setSuccess("Öğün başarıyla eklendi!");
      setMealData({
        mealType: "breakfast",
        foods: [{ name: "", calories: "", quantity: "", quantityCalories: {} }],
        notes: "",
      });
      setTimeout(() => {
        setSuccess(null);
        router.refresh();
        onSuccess?.();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const addFoodField = () => {
    setMealData({
      ...mealData,
      foods: [...mealData.foods, { name: "", calories: "", quantity: "", quantityCalories: {} }],
    });
  };

  const removeFoodField = (index: number) => {
    setMealData({
      ...mealData,
      foods: mealData.foods.filter((_, i) => i !== index),
    });
  };

  const calculateFoodCaloriesForAllQuantities = async (index: number, foodName: string) => {
    if (!foodName || foodName.length < 2) return;

    setFoodAiLoading((prev) => ({ ...prev, [index]: true }));

    // Optimize edilmiş miktar seçenekleri
    const quantities = [
      "1 kaşık",
      "2 kaşık",
      "1 yemek kaşığı",
      "2 yemek kaşığı",
      "1 kepçe",
      "1 tabak (orta)",
      "1 tabak (büyük)",
      "1 porsiyon",
      "100g",
      "150g",
      "200g",
      "250g",
      "300g",
      "1 kase",
      "1 bardak",
    ];

    try {
      // Her miktar için kalori hesapla
      const quantityCalories: Record<string, number> = {};

      for (const quantity of quantities) {
        try {
          const response = await fetch("/api/ai/calories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              mode: "meal",
              meal: {
                mealType: mealData.mealType,
                foods: [{ index: 0, name: foodName, quantity }],
              },
            }),
          });

          const data = await response.json();
          if (response.ok && data.mode === "meal" && data.result?.breakdown?.[0]?.calories) {
            quantityCalories[quantity] = Math.round(data.result.breakdown[0].calories);
          }
        } catch {
          // Tek bir miktar için hata olursa devam et
          continue;
        }
      }

      // Hesaplanan kalorileri state'e kaydet
      setMealData((prev) => {
        const newFoods = [...prev.foods];
        const currentFood = newFoods[index];
        newFoods[index] = {
          ...currentFood,
          quantityCalories,
          // Eğer miktar seçiliyse, o miktarın kalorisini kullan
          calories:
            currentFood.quantity && quantityCalories[currentFood.quantity]
              ? String(quantityCalories[currentFood.quantity])
              : currentFood.calories,
        };
        return { ...prev, foods: newFoods };
      });
    } catch (error) {
      console.error("Food calories calculation error:", error);
    } finally {
      setFoodAiLoading((prev) => {
        const newState = { ...prev };
        delete newState[index];
        return newState;
      });
    }
  };

  const updateFoodField = (index: number, field: string, value: string) => {
    const newFoods = [...mealData.foods];
    const currentFood = newFoods[index];

    // Önceki timeout'u temizle
    if (foodNameTimeouts.current[index]) {
      clearTimeout(foodNameTimeouts.current[index]);
      delete foodNameTimeouts.current[index];
    }

    // Field'ı güncelle
    newFoods[index] = { ...currentFood, [field]: value };
    setMealData({ ...mealData, foods: newFoods });

    // Yiyecek adı yazıldığında otomatik kalori hesapla (debounce)
    if (field === "name" && value.trim().length >= 2) {
      foodNameTimeouts.current[index] = setTimeout(() => {
        calculateFoodCaloriesForAllQuantities(index, value.trim());
      }, 1000);
    }

    // Miktar seçildiğinde ilgili kaloriyi kullan
    if (field === "quantity" && value && currentFood.quantityCalories?.[value]) {
      newFoods[index] = {
        ...newFoods[index],
        calories: String(currentFood.quantityCalories[value]),
      };
      setMealData({ ...mealData, foods: newFoods });
    }
  };

  const handleWorkoutAiEstimate = async () => {
    if (!workoutData.name.trim()) {
      setError("Önce egzersiz adını gir veya AI için gerekli alanları doldur.");
      return;
    }
    setWorkoutAiLoading(true);
    setAiFeedback({ variant: "workout", message: null, error: null });
    try {
      const response = await fetch("/api/ai/calories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "workout",
          workout: {
            name: workoutData.name.trim(),
            type: workoutData.type,
            duration: workoutData.duration ? Number(workoutData.duration) : undefined,
            distance: workoutData.distance ? Number(workoutData.distance) : undefined,
            notes: workoutData.notes || undefined,
          },
        }),
      });
      const data: CalorieAIResponse = await response.json();
      if (!response.ok) {
        throw new Error((data as any)?.message || "AI tahmini başarısız oldu");
      }
      if (data.mode !== "workout") {
        throw new Error("Beklenmeyen AI yanıtı");
      }
      setWorkoutData((prev) => ({
        ...prev,
        calories: data.result.calories ? String(Math.round(data.result.calories)) : "",
      }));
      setAiFeedback({
        variant: "workout",
        message: `${Math.round(data.result.calories)} kcal tahmini eklendi. ${data.result.explanation}`,
        error: null,
      });
    } catch (err: any) {
      setAiFeedback({
        variant: "workout",
        message: null,
        error: err.message || "AI tahmini yapılamadı",
      });
    } finally {
      setWorkoutAiLoading(false);
    }
  };

  const handleMealAiEstimate = async () => {
    const foodsToSend = mealData.foods
      .map((food, index) => ({
        index,
        name: food.name.trim(),
        quantity: food.quantity?.trim() || undefined,
      }))
      .filter((food) => food.name);

    if (foodsToSend.length === 0) {
      setError("Önce en az bir yemek adı giriniz.");
      return;
    }

    setMealAiLoading(true);
    setAiFeedback({ variant: "meal", message: null, error: null });

    try {
      const response = await fetch("/api/ai/calories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "meal",
          meal: {
            mealType: mealData.mealType,
            notes: mealData.notes || undefined,
            foods: foodsToSend,
          },
        }),
      });
      const data: CalorieAIResponse = await response.json();
      if (!response.ok) {
        throw new Error((data as any)?.message || "AI tahmini başarısız oldu");
      }
      if (data.mode !== "meal") {
        throw new Error("Beklenmeyen AI yanıtı");
      }

      const breakdownMap = new Map(
        data.result.breakdown.map((item) => [item.index, item] as const)
      );

      setMealData((prev) => ({
        ...prev,
        foods: prev.foods.map((food, idx) => {
          const aiFood = breakdownMap.get(idx);
          if (!aiFood) return food;
          return {
            ...food,
            calories: String(Math.round(aiFood.calories)),
            quantity: aiFood.quantity ?? food.quantity,
          };
        }),
      }));

      setAiFeedback({
        variant: "meal",
        message: `${Math.round(data.result.totalCalories)} kcal tahmin edildi. ${data.result.explanation}`,
        error: null,
      });
    } catch (err: any) {
      setAiFeedback({
        variant: "meal",
        message: null,
        error: err.message || "AI tahmini yapılamadı",
      });
    } finally {
      setMealAiLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-800/70 bg-gray-900/80 p-6 shadow-lg">
      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-800">
        <button
          onClick={() => setActiveTab("metric")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "metric"
              ? "border-b-2 border-primary-500 text-primary-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Sağlık Metrik
        </button>
        <button
          onClick={() => setActiveTab("workout")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "workout"
              ? "border-b-2 border-primary-500 text-primary-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Egzersiz
        </button>
        <button
          onClick={() => setActiveTab("meal")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "meal"
              ? "border-b-2 border-primary-500 text-primary-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Öğün
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-400">
          {success}
        </div>
      )}
      {aiFeedback.variant === activeTab && aiFeedback.message && (
        <div className="mb-4 rounded-lg border border-primary-500/40 bg-primary-500/10 p-3 text-sm text-primary-100">
          {aiFeedback.message}
        </div>
      )}
      {aiFeedback.variant === activeTab && aiFeedback.error && (
        <div className="mb-4 rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-3 text-sm text-yellow-100">
          {aiFeedback.error}
        </div>
      )}

      {/* Health Metric Form */}
      {activeTab === "metric" && (
        <form onSubmit={handleMetricSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-400">Kilo (kg)</label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="300"
                value={metricData.weight}
                onChange={(e) => setMetricData({ ...metricData, weight: e.target.value })}
                className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                placeholder="Örn: 70"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">BMI</label>
              <input
                type="number"
                step="0.1"
                min="10"
                max="60"
                value={metricData.bmi}
                onChange={(e) => setMetricData({ ...metricData, bmi: e.target.value })}
                className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                placeholder="Örn: 22.5"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Vücut Yağı (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={metricData.bodyFat}
                onChange={(e) => setMetricData({ ...metricData, bodyFat: e.target.value })}
                className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                placeholder="Örn: 15"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Kas Kütlesi (kg)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="200"
                value={metricData.muscleMass}
                onChange={(e) => setMetricData({ ...metricData, muscleMass: e.target.value })}
                className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                placeholder="Örn: 50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Su (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={metricData.water}
                onChange={(e) => setMetricData({ ...metricData, water: e.target.value })}
                className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                placeholder="Örn: 60"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Notlar</label>
            <textarea
              value={metricData.notes}
              onChange={(e) => setMetricData({ ...metricData, notes: e.target.value })}
              className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
              placeholder="İsteğe bağlı notlar..."
              rows={3}
            />
          </div>
          <button
            type="submit"
            disabled={loading || (!metricData.weight && !metricData.bmi && !metricData.bodyFat && !metricData.muscleMass && !metricData.water)}
            className="w-full rounded-lg bg-primary-500 px-4 py-2 font-medium text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </form>
      )}

      {/* Workout Form */}
      {activeTab === "workout" && (
        <form onSubmit={handleWorkoutSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-400">Egzersiz Adı *</label>
            <input
              type="text"
              required
              value={workoutData.name}
              onChange={(e) => setWorkoutData({ ...workoutData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
              placeholder="Örn: Koşu, Ağırlık Antrenmanı"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-400">Tip *</label>
              <select
                required
                value={workoutData.type}
                onChange={(e) => setWorkoutData({ ...workoutData, type: e.target.value as any })}
                className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white focus:border-primary-500 focus:outline-none"
              >
                <option value="cardio">Kardiyovasküler</option>
                <option value="strength">Güç</option>
                <option value="flexibility">Esneklik</option>
                <option value="sports">Spor</option>
                <option value="other">Diğer</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Süre (dakika)</label>
              <input
                type="number"
                min="1"
                max="1440"
                value={workoutData.duration}
                onChange={(e) => setWorkoutData({ ...workoutData, duration: e.target.value })}
                className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                placeholder="Örn: 30"
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm text-gray-400">Yakılan Kalori</label>
                <button
                  type="button"
                  onClick={handleWorkoutAiEstimate}
                  disabled={workoutAiLoading}
                  className="text-xs text-primary-400 hover:text-primary-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {workoutAiLoading ? "Hesaplanıyor..." : "AI ile hesapla"}
                </button>
              </div>
              <input
                type="number"
                min="0"
                max="10000"
                step="0.1"
                value={workoutData.calories}
                onChange={(e) => setWorkoutData({ ...workoutData, calories: e.target.value })}
                disabled
                readOnly
                className="w-full rounded-lg border border-gray-800 bg-gray-900/40 px-4 py-2 text-gray-400 placeholder-gray-500 cursor-not-allowed focus:border-gray-700 focus:outline-none"
                placeholder="AI ile hesaplanacak"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Mesafe (km)</label>
              <input
                type="number"
                min="0"
                max="1000"
                step="0.1"
                value={workoutData.distance}
                onChange={(e) => setWorkoutData({ ...workoutData, distance: e.target.value })}
                className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                placeholder="Örn: 5"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Notlar</label>
            <textarea
              value={workoutData.notes}
              onChange={(e) => setWorkoutData({ ...workoutData, notes: e.target.value })}
              className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
              placeholder="İsteğe bağlı notlar..."
              rows={3}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !workoutData.name}
            className="w-full rounded-lg bg-primary-500 px-4 py-2 font-medium text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </form>
      )}

      {/* Meal Form */}
      {activeTab === "meal" && (
        <form onSubmit={handleMealSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-400">Öğün Tipi *</label>
            <select
              required
              value={mealData.mealType}
              onChange={(e) => setMealData({ ...mealData, mealType: e.target.value as any })}
              className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white focus:border-primary-500 focus:outline-none"
            >
              <option value="breakfast">Kahvaltı</option>
              <option value="lunch">Öğle Yemeği</option>
              <option value="dinner">Akşam Yemeği</option>
              <option value="snack">Atıştırmalık</option>
            </select>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm text-gray-400">Yiyecekler *</label>
              <button
                type="button"
                onClick={addFoodField}
                className="text-sm text-primary-400 hover:text-primary-300"
              >
                + Ekle
              </button>
            </div>
            <div className="space-y-2">
              {mealData.foods.map((food, index) => (
                <div key={index} className="grid gap-2 sm:grid-cols-12">
                  <div className="sm:col-span-5 relative">
                    <input
                      type="text"
                      value={food.name}
                      onChange={(e) => updateFoodField(index, "name", e.target.value)}
                      onBlur={() => {
                        if (food.name.trim().length >= 2) {
                          calculateFoodCaloriesForAllQuantities(index, food.name.trim());
                        }
                      }}
                      className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                      placeholder="Yemek adı"
                    />
                    {foodAiLoading[index] && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={food.calories}
                    onChange={(e) => updateFoodField(index, "calories", e.target.value)}
                    disabled
                    readOnly
                    className="sm:col-span-3 rounded-lg border border-gray-800 bg-gray-900/40 px-4 py-2 text-gray-400 placeholder-gray-500 cursor-not-allowed focus:border-gray-700 focus:outline-none"
                    placeholder="AI ile hesaplanacak"
                  />
                  <select
                    value={food.quantity || ""}
                    onChange={(e) => updateFoodField(index, "quantity", e.target.value)}
                    disabled={!food.name.trim() || foodAiLoading[index]}
                    className="sm:col-span-3 rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white focus:border-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Miktar seçin</option>
                    <option value="1 kaşık">
                      1 kaşık {food.quantityCalories?.["1 kaşık"] ? `(${food.quantityCalories["1 kaşık"]} kcal)` : ""}
                    </option>
                    <option value="2 kaşık">
                      2 kaşık {food.quantityCalories?.["2 kaşık"] ? `(${food.quantityCalories["2 kaşık"]} kcal)` : ""}
                    </option>
                    <option value="1 yemek kaşığı">
                      1 yemek kaşığı {food.quantityCalories?.["1 yemek kaşığı"] ? `(${food.quantityCalories["1 yemek kaşığı"]} kcal)` : ""}
                    </option>
                    <option value="2 yemek kaşığı">
                      2 yemek kaşığı {food.quantityCalories?.["2 yemek kaşığı"] ? `(${food.quantityCalories["2 yemek kaşığı"]} kcal)` : ""}
                    </option>
                    <option value="1 kepçe">
                      1 kepçe {food.quantityCalories?.["1 kepçe"] ? `(${food.quantityCalories["1 kepçe"]} kcal)` : ""}
                    </option>
                    <option value="1 tabak (orta)">
                      1 tabak (orta) {food.quantityCalories?.["1 tabak (orta)"] ? `(${food.quantityCalories["1 tabak (orta)"]} kcal)` : ""}
                    </option>
                    <option value="1 tabak (büyük)">
                      1 tabak (büyük) {food.quantityCalories?.["1 tabak (büyük)"] ? `(${food.quantityCalories["1 tabak (büyük)"]} kcal)` : ""}
                    </option>
                    <option value="1 porsiyon">
                      1 porsiyon {food.quantityCalories?.["1 porsiyon"] ? `(${food.quantityCalories["1 porsiyon"]} kcal)` : ""}
                    </option>
                    <option value="100g">
                      100g {food.quantityCalories?.["100g"] ? `(${food.quantityCalories["100g"]} kcal)` : ""}
                    </option>
                    <option value="150g">
                      150g {food.quantityCalories?.["150g"] ? `(${food.quantityCalories["150g"]} kcal)` : ""}
                    </option>
                    <option value="200g">
                      200g {food.quantityCalories?.["200g"] ? `(${food.quantityCalories["200g"]} kcal)` : ""}
                    </option>
                    <option value="250g">
                      250g {food.quantityCalories?.["250g"] ? `(${food.quantityCalories["250g"]} kcal)` : ""}
                    </option>
                    <option value="300g">
                      300g {food.quantityCalories?.["300g"] ? `(${food.quantityCalories["300g"]} kcal)` : ""}
                    </option>
                    <option value="1 kase">
                      1 kase {food.quantityCalories?.["1 kase"] ? `(${food.quantityCalories["1 kase"]} kcal)` : ""}
                    </option>
                    <option value="1 bardak">
                      1 bardak {food.quantityCalories?.["1 bardak"] ? `(${food.quantityCalories["1 bardak"]} kcal)` : ""}
                    </option>
                  </select>
                  {mealData.foods.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFoodField(index)}
                      className="sm:col-span-1 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-400 hover:bg-red-500/20"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Toplam Kalori:{" "}
                {mealData.foods.reduce((sum, f) => sum + (parseFloat(f.calories) || 0), 0).toFixed(0)} kcal
              </span>
              <button
                type="button"
                onClick={handleMealAiEstimate}
                disabled={mealAiLoading}
                className="text-primary-400 hover:text-primary-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {mealAiLoading ? "Hesaplanıyor..." : "AI ile kalorileri doldur"}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Notlar</label>
            <textarea
              value={mealData.notes}
              onChange={(e) => setMealData({ ...mealData, notes: e.target.value })}
              className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
              placeholder="İsteğe bağlı notlar..."
              rows={3}
            />
          </div>
          <button
            type="submit"
            disabled={loading || mealData.foods.filter((f) => f.name.trim() && f.calories).length === 0}
            className="w-full rounded-lg bg-primary-500 px-4 py-2 font-medium text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </form>
      )}
    </div>
  );
}

