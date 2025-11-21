"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { CalorieAIResponse } from "@/types/ai-calories";
import { evaluateMealHealth, type MealHealthEvaluation } from "@/lib/ai/meal-health-evaluator";

interface HealthFormsProps {
  onSuccess?: () => void;
}

export default function HealthForms({ onSuccess }: HealthFormsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"metric" | "workout" | "meal">("metric");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Health Metric Form - Sadeleştirilmiş (sadece kullanıcının bilebileceği bilgiler)
  const [metricData, setMetricData] = useState({
    weight: "",
    bowelMovementDays: "", // Kaç günde bir tuvalete çıktığı
    notes: "",
  });

  // Workout Form
  const [workoutData, setWorkoutData] = useState({
    name: "",
    type: "cardio" as "cardio" | "strength" | "flexibility" | "sports" | "other",
    duration: "",
    calories: "",
    distance: "",
    sets: "",
    reps: "",
    notes: "",
    preparationMethod: "" as string | undefined,
    preparationMethods: [] as string[],
    loadingMethods: false,
  });

  // Meal Form
  const [mealData, setMealData] = useState({
    mealType: "breakfast" as "breakfast" | "lunch" | "dinner" | "snack",
    foods: [{ 
      name: "", 
      calories: "", 
      quantity: "", 
      customQuantity: "", 
      quantityCalories: {} as Record<string, number>, 
      caloriesPerGram: 0,
      preparationMethod: "", // Yapılış yöntemi
      preparationMethods: [] as string[], // Olası yapılış yöntemleri
      loadingMethods: false, // Yapılış yöntemleri yükleniyor mu?
    }],
    notes: "",
  });

  const [workoutAiLoading, setWorkoutAiLoading] = useState(false);
  const [mealAiLoading, setMealAiLoading] = useState(false);
  const [foodAiLoading, setFoodAiLoading] = useState<Record<number, boolean>>({});
  const foodNameTimeouts = useRef<Record<number, NodeJS.Timeout>>({});
  const workoutNameTimeout = useRef<NodeJS.Timeout | null>(null);
  const mealHealthTimeout = useRef<NodeJS.Timeout | null>(null);
  const [mealHealthEvaluation, setMealHealthEvaluation] = useState<MealHealthEvaluation | null>(null);
  const [mealHealthLoading, setMealHealthLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    height?: number | null;
    weight?: number | null;
    age?: number | null;
    gender?: string | null;
    currentWeight?: number | null;
    targetWeight?: number | null;
  } | null>(null);
  const [aiFeedback, setAiFeedback] = useState<{
    variant: "workout" | "meal" | null;
    message: string | null;
    error: string | null;
  }>({
    variant: null,
    message: null,
    error: null,
  });

  // Kullanıcı profilini yükle (BMR ve sağlık değerlendirmesi için)
  useEffect(() => {
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => {
        setUserProfile({
          height: data.height,
          weight: data.weight,
          age: data.age,
          gender: data.gender,
          currentWeight: data.weight,
          targetWeight: data.targetWeight,
        });
      })
      .catch(() => {});
  }, []);

  const handleMetricSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: any = {};
      if (metricData.weight) payload.weight = parseFloat(metricData.weight);
      if (metricData.bowelMovementDays) payload.bowelMovementDays = parseFloat(metricData.bowelMovementDays);
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
        bowelMovementDays: "",
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
        sets: "",
        reps: "",
        notes: "",
        preparationMethod: "",
        preparationMethods: [],
        loadingMethods: false,
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
        foods: [{ 
          name: "", 
          calories: "", 
          quantity: "", 
          customQuantity: "", 
          quantityCalories: {}, 
          caloriesPerGram: 0,
          preparationMethod: "",
          preparationMethods: [],
          loadingMethods: false,
        }],
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
      foods: [
        ...mealData.foods,
        { 
          name: "", 
          calories: "", 
          quantity: "", 
          customQuantity: "", 
          quantityCalories: {} as Record<string, number>, 
          caloriesPerGram: 0,
          preparationMethod: "",
          preparationMethods: [],
          loadingMethods: false,
        },
      ],
    });
    setMealData({
      ...mealData,
      foods: [...mealData.foods, { 
        name: "", 
        calories: "", 
        quantity: "", 
        customQuantity: "", 
        quantityCalories: {}, 
        caloriesPerGram: 0,
        preparationMethod: "",
        preparationMethods: [],
        loadingMethods: false,
      }],
    });
  };

  const removeFoodField = (index: number) => {
    setMealData({
      ...mealData,
      foods: mealData.foods.filter((_, i) => i !== index),
    });
  };

  // Miktar seçeneklerinin gram karşılıkları (yaklaşık)
  const quantityToGrams: Record<string, number> = {
    "1 kaşık": 15,
    "2 kaşık": 30,
    "1 yemek kaşığı": 20,
    "2 yemek kaşığı": 40,
    "1 kepçe": 200,
    "1 tabak (orta)": 250,
    "1 tabak (büyük)": 350,
    "1 porsiyon": 250,
    "100g": 100,
    "150g": 150,
    "200g": 200,
    "250g": 250,
    "300g": 300,
    "1 kase": 200,
    "1 bardak": 240,
  };

  // Yiyecek tipine göre mantıklı miktar seçeneklerini belirle
  const getRelevantQuantities = (foodName: string): string[] => {
    // Et, tavuk, balık gibi katı yiyecekler için
    const solidFoods = ["tavuk", "et", "kıyma", "köfte", "balık", "tavuk göğsü", "biftek", "pirzola", "hindi", "dana"];
    // Sıvı/çorba gibi yiyecekler için
    const liquidFoods = ["çorba", "su", "ayran", "meyve suyu", "komposto", "çay", "kahve", "süt"];
    // Salata, sebze gibi hafif yiyecekler için
    const lightFoods = ["salata", "roka", "marul", "maydanoz", "yeşillik"];
    // Çorbalar, yemekler için
    const cookedFoods = ["pilav", "makarna", "bulgur", "kuskus", "erişte"];
    // Soslar, baharatlar için
    const condiments = ["sos", "salça", "yağ", "tereyağı", "zeytinyağı", "bal"];

    // Tam eşleşme veya içerik kontrolü
    const isSolid = solidFoods.some(f => foodName.includes(f));
    const isLiquid = liquidFoods.some(f => foodName.includes(f));
    const isLight = lightFoods.some(f => foodName.includes(f));
    const isCooked = cookedFoods.some(f => foodName.includes(f));
    const isCondiment = condiments.some(f => foodName.includes(f));

    // Et/tavuk/balık gibi katı yiyecekler: gram ve porsiyon
    if (isSolid) {
      return ["100g", "150g", "200g", "250g", "300g", "1 porsiyon"];
    }
    
    // Çorba, su gibi sıvılar: bardak, kase, kepçe
    if (isLiquid) {
      return ["1 bardak", "1 kase", "1 kepçe", "200g", "250g", "300g"];
    }
    
    // Salata gibi hafif yiyecekler: tabak, kase, gram
    if (isLight) {
      return ["1 tabak (orta)", "1 tabak (büyük)", "1 kase", "100g", "150g", "200g"];
    }
    
    // Pilav, makarna gibi pişmiş yemekler: tabak, porsiyon, gram
    if (isCooked) {
      return ["1 tabak (orta)", "1 tabak (büyük)", "1 porsiyon", "150g", "200g", "250g", "300g"];
    }
    
    // Sos, baharat gibi küçük miktarlı: kaşık, yemek kaşığı
    if (isCondiment) {
      return ["1 kaşık", "2 kaşık", "1 yemek kaşığı", "2 yemek kaşığı", "100g"];
    }
    
    // Varsayılan: tüm seçenekleri göster
    return Object.keys(quantityToGrams);
  };

  // Yapılış yöntemlerini al
  const fetchFoodPreparationMethods = async (index: number, foodName: string) => {
    if (!foodName || foodName.length < 2) return;

    const newFoods = [...mealData.foods];
    newFoods[index] = { ...newFoods[index], loadingMethods: true };
    setMealData({ ...mealData, foods: newFoods });

    try {
      const response = await fetch("/api/ai/preparation-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "food",
          name: foodName,
        }),
      });

      const data = await response.json();
      
      if (response.ok && Array.isArray(data.methods)) {
        const updatedFoods = [...mealData.foods];
        updatedFoods[index] = {
          ...updatedFoods[index],
          preparationMethods: data.methods,
          loadingMethods: false,
        };
        setMealData({ ...mealData, foods: updatedFoods });
      } else {
        const updatedFoods = [...mealData.foods];
        updatedFoods[index] = { ...updatedFoods[index], loadingMethods: false };
        setMealData({ ...mealData, foods: updatedFoods });
      }
    } catch (error) {
      console.error("Food preparation methods fetch error:", error);
      const updatedFoods = [...mealData.foods];
      updatedFoods[index] = { ...updatedFoods[index], loadingMethods: false };
      setMealData({ ...mealData, foods: updatedFoods });
    }
  };

  const calculateFoodCaloriesForAllQuantities = async (index: number, foodName: string, preparationMethod?: string) => {
    if (!foodName || foodName.length < 2) return;

    setFoodAiLoading((prev) => ({ ...prev, [index]: true }));

    try {
      // Yapılış yöntemini yiyecek adına ekle
      const foodNameWithMethod = preparationMethod 
        ? `${foodName} (${preparationMethod})`
        : foodName;

      // Sadece 100g için AI'dan kalori hesapla (referans değer)
      const response = await fetch("/api/ai/calories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "meal",
          meal: {
            mealType: mealData.mealType,
            foods: [{ index: 0, name: foodNameWithMethod, quantity: "100g" }],
          },
        }),
      });

      const data = await response.json();
      
      if (!response.ok || data.mode !== "meal" || !data.result?.breakdown?.[0]?.calories) {
        throw new Error("Kalori hesaplanamadı");
      }

      // 100g için kalori (referans değer)
      const caloriesPer100g = data.result.breakdown[0].calories;
      const caloriesPerGram = caloriesPer100g / 100;

      // Yiyecek adını analiz ederek mantıklı miktar seçeneklerini belirle
      const foodNameLower = foodName.toLowerCase();
      const relevantQuantities = getRelevantQuantities(foodNameLower);

      // Tüm miktarlar için kalori hesapla (matematiksel olarak)
      const quantityCalories: Record<string, number> = {};
      
      // Sadece mantıklı miktarlar için hesapla
      relevantQuantities.forEach((quantity) => {
        if (quantityToGrams[quantity]) {
          quantityCalories[quantity] = Math.round(caloriesPerGram * quantityToGrams[quantity]);
        }
      });

      // Hesaplanan kalorileri state'e kaydet
      setMealData((prev) => {
        const newFoods = [...prev.foods];
        const currentFood = newFoods[index];
        newFoods[index] = {
          ...currentFood,
          quantityCalories,
          caloriesPerGram,
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
      // Hata durumunda kullanıcıyı bilgilendir
      setAiFeedback({
        variant: "meal",
        message: null,
        error: error instanceof Error ? error.message : "Kalori hesaplanamadı",
      });
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

    // Yiyecek adı yazıldığında sadece yapılış yöntemlerini al (kalori hesaplama butonla yapılacak)
    if (field === "name" && value.trim().length >= 2) {
      foodNameTimeouts.current[index] = setTimeout(() => {
        fetchFoodPreparationMethods(index, value.trim());
        // Kalori hesaplama artık butonla yapılıyor, otomatik değil
      }, 1000);
    }

    // Miktar seçildiğinde ilgili kaloriyi kullan
    if (field === "quantity" && value && currentFood.quantityCalories?.[value]) {
      newFoods[index] = {
        ...newFoods[index],
        calories: String(currentFood.quantityCalories[value]),
        customQuantity: "", // Dropdown seçilince custom temizle
      };
      setMealData({ ...mealData, foods: newFoods });
    }

    // Özel gram girişi yapıldığında kalori hesapla
    if (field === "customQuantity" && value && currentFood.caloriesPerGram > 0) {
      const grams = parseFloat(value);
      if (!isNaN(grams) && grams > 0) {
        const calculatedCalories = Math.round(currentFood.caloriesPerGram * grams);
        newFoods[index] = {
          ...newFoods[index],
          calories: String(calculatedCalories),
          quantity: "", // Custom seçilince dropdown temizle
        };
        setMealData({ ...mealData, foods: newFoods });
      }
    }
  };

  // Egzersiz hazırlık yöntemlerini al
  const fetchWorkoutPreparationMethods = async (workoutName: string) => {
    if (!workoutName || workoutName.length < 2) return;

    setWorkoutData({ ...workoutData, loadingMethods: true });

    try {
      const response = await fetch("/api/ai/preparation-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "workout",
          name: workoutName,
        }),
      });

      const data = await response.json();
      
      if (response.ok && Array.isArray(data.methods)) {
        setWorkoutData({ ...workoutData, preparationMethods: data.methods, loadingMethods: false });
      } else {
        setWorkoutData({ ...workoutData, loadingMethods: false });
      }
    } catch (error) {
      console.error("Workout preparation methods fetch error:", error);
      setWorkoutData({ ...workoutData, loadingMethods: false });
    }
  };

  // Egzersiz türüne göre mesafe gerektirip gerektirmediğini kontrol et
  const requiresDistance = (workoutName: string): boolean => {
    const distanceKeywords = ["koşu", "yürüyüş", "yürüme", "bisiklet", "koş", "jogging", "maraton", "yüzme", "triatlon"];
    const lowerName = workoutName.toLowerCase();
    return distanceKeywords.some(keyword => lowerName.includes(keyword));
  };

  const requiresSetsReps = (workoutName: string): boolean => {
    const setsRepsKeywords = ["şınav", "mekik", "ağırlık", "press", "squat", "deadlift", "bench", "pull", "push", "curl", "extension", "row"];
    const lowerName = workoutName.toLowerCase();
    return setsRepsKeywords.some(keyword => lowerName.includes(keyword));
  };

  const handleWorkoutAiEstimate = async () => {
    if (!workoutData.name || workoutData.name.trim().length < 2) {
      setAiFeedback({ variant: "workout", message: null, error: "Lütfen egzersiz adını girin" });
      return;
    }

    if (!workoutData.duration || Number(workoutData.duration) <= 0) {
      setAiFeedback({ variant: "workout", message: null, error: "Lütfen süreyi girin" });
      return;
    }

    const needsDistance = requiresDistance(workoutData.name);
    const needsSetsReps = requiresSetsReps(workoutData.name);

    // Mesafe gerektiren egzersizler için mesafe kontrolü
    if (needsDistance && (!workoutData.distance || Number(workoutData.distance) <= 0)) {
      setAiFeedback({ variant: "workout", message: null, error: "Bu egzersiz için mesafe bilgisi gereklidir" });
      return;
    }

    // Set/tekrar gerektiren egzersizler için kontrol
    if (needsSetsReps && (!workoutData.sets || Number(workoutData.sets) <= 0)) {
      setAiFeedback({ variant: "workout", message: null, error: "Bu egzersiz için set/tekrar bilgisi gereklidir" });
      return;
    }

    setWorkoutAiLoading(true);
    setAiFeedback({ variant: "workout", message: null, error: null });

    try {
      // Hazırlık yöntemini egzersiz adına ekle
      const workoutNameWithMethod = workoutData.preparationMethod 
        ? `${workoutData.name.trim()} (${workoutData.preparationMethod})`
        : workoutData.name.trim();

      const response = await fetch("/api/ai/calories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "workout",
          workout: {
            name: workoutNameWithMethod,
            type: workoutData.type,
            duration: Number(workoutData.duration),
            distance: workoutData.distance ? Number(workoutData.distance) : undefined,
            sets: workoutData.sets ? Number(workoutData.sets) : undefined,
            reps: workoutData.reps ? Number(workoutData.reps) : undefined,
            notes: workoutData.notes || undefined,
          },
          userProfile: userProfile ? {
            height: userProfile.height,
            weight: userProfile.weight,
            age: userProfile.age,
            gender: userProfile.gender,
          } : undefined,
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
        message: `${Math.round(data.result.calories)} kcal tahmini eklendi (${workoutData.duration} dk). ${data.result.explanation}`,
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
          userProfile: userProfile ? {
            height: userProfile.height,
            weight: userProfile.weight,
            age: userProfile.age,
            gender: userProfile.gender,
          } : undefined,
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
    <div className="rounded-3xl border border-primary-500/30 bg-gradient-to-br from-gray-900/90 via-primary-900/10 to-transparent backdrop-blur-xl p-6 shadow-2xl shadow-primary-500/20 sm:p-8">
      {/* Modern Tabs */}
      <div className="mb-6 flex gap-2 rounded-xl bg-gray-800/40 p-1 backdrop-blur-sm">
        <button
          onClick={() => setActiveTab("metric")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
            activeTab === "metric"
              ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30"
              : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
          }`}
        >
          ⚖️ Kilo Takibi
        </button>
        <button
          onClick={() => setActiveTab("workout")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
            activeTab === "workout"
              ? "bg-gradient-to-r from-fitness-orange to-red-500 text-white shadow-lg shadow-fitness-orange/30"
              : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
          }`}
        >
          💪 Egzersiz
        </button>
        <button
          onClick={() => setActiveTab("meal")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
            activeTab === "meal"
              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30"
              : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
          }`}
        >
          🍽️ Öğün
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
              <label className="mb-1 block text-sm text-gray-400">
                Bağırsak Sağlığı (Kaç günde bir tuvalete çıkıyorsunuz?)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="7"
                value={metricData.bowelMovementDays}
                onChange={(e) => setMetricData({ ...metricData, bowelMovementDays: e.target.value })}
                className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                placeholder="Örn: 1 (her gün), 2 (2 günde bir)"
              />
              <p className="mt-1 text-xs text-gray-500">
                Sağlıklı: Her gün veya gün aşırı (1-2 gün)
              </p>
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
            <div className="relative">
              <input
                type="text"
                required
                value={workoutData.name}
                onChange={(e) => {
                  const value = e.target.value;
                  setWorkoutData({ ...workoutData, name: value });
                  
                  // Sadece hazırlık yöntemlerini yükle, kalori hesaplama yapma
                  if (workoutNameTimeout.current) {
                    clearTimeout(workoutNameTimeout.current);
                  }
                  
                  if (value.trim().length >= 2) {
                    workoutNameTimeout.current = setTimeout(() => {
                      fetchWorkoutPreparationMethods(value.trim());
                    }, 1000);
                  }
                }}
                className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                placeholder="Örn: Koşu, Ağırlık Antrenmanı"
              />
              {workoutAiLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
                </div>
              )}
            </div>
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
              <label className="mb-1 block text-sm text-gray-400">Yakılan Kalori</label>
              <div className="relative">
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
                <button
                  type="button"
                  onClick={handleWorkoutAiEstimate}
                  disabled={workoutAiLoading || !workoutData.name.trim() || !workoutData.duration || (requiresDistance(workoutData.name) && !workoutData.distance) || (requiresSetsReps(workoutData.name) && !workoutData.sets)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary-500 px-4 py-1.5 text-sm font-semibold text-white transition-all hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-primary-500"
                >
                  {workoutAiLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Hesaplanıyor...
                    </span>
                  ) : (
                    "AI ile Hesapla"
                  )}
                </button>
              </div>
            </div>
            {/* Dinamik alanlar - Mesafe gerektiren egzersizler için */}
            {requiresDistance(workoutData.name) && (
              <div>
                <label className="mb-1 block text-sm text-gray-400">Mesafe (km) *</label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  step="0.1"
                  required
                  value={workoutData.distance}
                  onChange={(e) => setWorkoutData({ ...workoutData, distance: e.target.value })}
                  className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                  placeholder="Örn: 5"
                />
              </div>
            )}
            {/* Dinamik alanlar - Set/Tekrar gerektiren egzersizler için */}
            {requiresSetsReps(workoutData.name) && (
              <>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Set Sayısı *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={workoutData.sets}
                    onChange={(e) => setWorkoutData({ ...workoutData, sets: e.target.value })}
                    className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                    placeholder="Örn: 3"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Tekrar Sayısı (set başına)</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={workoutData.reps}
                    onChange={(e) => setWorkoutData({ ...workoutData, reps: e.target.value })}
                    className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                    placeholder="Örn: 10"
                  />
                </div>
              </>
            )}
            {/* Mesafe gerektirmeyen ve set gerektirmeyen egzersizler için mesafe alanı (opsiyonel) */}
            {!requiresDistance(workoutData.name) && !requiresSetsReps(workoutData.name) && workoutData.name.trim().length >= 2 && (
              <div>
                <label className="mb-1 block text-sm text-gray-400">Mesafe (km) - Opsiyonel</label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  step="0.1"
                  value={workoutData.distance}
                  onChange={(e) => setWorkoutData({ ...workoutData, distance: e.target.value })}
                  className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                  placeholder="Örn: 5 (varsa)"
                />
              </div>
            )}
          </div>
          
          {/* Hazırlık Yöntemi Seçimi */}
          {workoutData.name.trim().length >= 2 && (
            <div>
              <label className="mb-1 block text-xs text-gray-400">Hazırlık/Koşul Yöntemi (Daha doğru kalori için)</label>
              <select
                value={workoutData.preparationMethod || ""}
                onChange={(e) => {
                  const newPreparationMethod = e.target.value;
                  setWorkoutData({ ...workoutData, preparationMethod: newPreparationMethod });
                }}
                disabled={workoutData.loadingMethods || workoutAiLoading}
                className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-sm text-white focus:border-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Hazırlık yöntemi seçin (opsiyonel)</option>
                {workoutData.loadingMethods && (
                  <option value="" disabled>Yükleniyor...</option>
                )}
                {workoutData.preparationMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
              {workoutData.preparationMethod && (
                <p className="mt-1 text-xs text-gray-500">
                  Seçilen: <span className="text-primary-300">{workoutData.preparationMethod}</span>
                </p>
              )}
            </div>
          )}
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
                <div key={index}>
                  <div className="grid gap-2 sm:grid-cols-12">
                  <div className="sm:col-span-5 relative">
                    <input
                      type="text"
                      value={food.name}
                      onChange={(e) => updateFoodField(index, "name", e.target.value)}
                      className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 pr-24 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                      placeholder="Yemek adı"
                      spellCheck="false"
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (food.name.trim().length >= 2) {
                          calculateFoodCaloriesForAllQuantities(index, food.name.trim(), food.preparationMethod);
                        }
                      }}
                      disabled={foodAiLoading[index] || !food.name.trim() || food.name.trim().length < 2}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-primary-500"
                    >
                      {foodAiLoading[index] ? (
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      ) : (
                        "AI ile Hesapla"
                      )}
                    </button>
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
                  <div className="sm:col-span-4 flex gap-2">
                    <select
                      value={food.quantity || ""}
                      onChange={(e) => updateFoodField(index, "quantity", e.target.value)}
                      disabled={!food.name.trim() || foodAiLoading[index]}
                      className="flex-1 rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-white focus:border-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Miktar seçin</option>
                      {food.name.trim() && food.quantityCalories && (() => {
                        const foodNameLower = food.name.toLowerCase();
                        const relevantQuantities = getRelevantQuantities(foodNameLower);
                        return relevantQuantities.map((quantity) => (
                          <option key={quantity} value={quantity}>
                            {quantity} {food.quantityCalories[quantity] ? `(${food.quantityCalories[quantity]} kcal)` : ""}
                          </option>
                        ));
                      })()}
                    </select>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={food.customQuantity || ""}
                      onChange={(e) => updateFoodField(index, "customQuantity", e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value && food.caloriesPerGram > 0) {
                          const grams = parseFloat(e.target.value);
                          if (!isNaN(grams) && grams > 0) {
                            const calculatedCalories = Math.round(food.caloriesPerGram * grams);
                            const newFoods = [...mealData.foods];
                            newFoods[index] = {
                              ...newFoods[index],
                              calories: String(calculatedCalories),
                              quantity: "",
                            };
                            setMealData({ ...mealData, foods: newFoods });
                          }
                        }
                      }}
                      disabled={!food.name.trim() || foodAiLoading[index] || !food.caloriesPerGram}
                      placeholder="Özel (g)"
                      className="w-24 rounded-lg border border-gray-800 bg-gray-900/60 px-2 py-2 text-sm text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
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
                  
                  {/* Yapılış Yöntemi Seçimi */}
                  {food.name.trim().length >= 2 && (
                    <div className="mt-2">
                      <label className="mb-1 block text-xs text-gray-400">Yapılış Yöntemi (Daha doğru kalori için)</label>
                      <div className="flex gap-2">
                        <select
                          value={food.preparationMethod || ""}
                          onChange={(e) => {
                            const newFoods = [...mealData.foods];
                            newFoods[index] = { ...newFoods[index], preparationMethod: e.target.value };
                            setMealData({ ...mealData, foods: newFoods });
                            // Yapılış yöntemi değiştiğinde kaloriyi yeniden hesapla
                            if (food.name.trim().length >= 2) {
                              calculateFoodCaloriesForAllQuantities(index, food.name.trim(), e.target.value);
                            }
                          }}
                          disabled={food.loadingMethods || foodAiLoading[index]}
                          className="flex-1 rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2 text-sm text-white focus:border-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Yapılış yöntemi seçin (opsiyonel)</option>
                          {food.loadingMethods && (
                            <option value="" disabled>Yükleniyor...</option>
                          )}
                          {food.preparationMethods.map((method) => (
                            <option key={method} value={method}>
                              {method}
                            </option>
                          ))}
                        </select>
                      </div>
                      {food.preparationMethod && (
                        <p className="mt-1 text-xs text-gray-500">
                          Seçilen: <span className="text-primary-300">{food.preparationMethod}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 space-y-3">
              <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
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
              
              {/* Öğün Sağlık Göstergesi */}
              {(() => {
                const totalCalories = mealData.foods.reduce((sum, f) => sum + (parseFloat(f.calories) || 0), 0);
                const hasAllCalories = mealData.foods.length > 0 && mealData.foods.every(f => f.name.trim() && f.calories && parseFloat(f.calories) > 0);
                
                if (hasAllCalories && totalCalories > 0) {
                  return (
                    <MealHealthIndicator
                      totalCalories={totalCalories}
                      foods={mealData.foods}
                      mealType={mealData.mealType}
                      currentWeight={userProfile?.weight || null}
                      targetWeight={userProfile?.targetWeight || null}
                      evaluation={mealHealthEvaluation}
                      loading={mealHealthLoading}
                      onEvaluationNeeded={async () => {
                        if (mealHealthTimeout.current) {
                          clearTimeout(mealHealthTimeout.current);
                        }
                        mealHealthTimeout.current = setTimeout(async () => {
                          setMealHealthLoading(true);
                          try {
                            const evaluation = await evaluateMealHealth({
                              foods: mealData.foods
                                .filter(f => f.name.trim() && f.calories)
                                .map(f => ({
                                  name: f.name.trim(),
                                  calories: parseFloat(f.calories || "0"),
                                  quantity: f.quantity || null,
                                })),
                              totalCalories,
                              mealType: mealData.mealType,
                              targetWeight: userProfile?.targetWeight || null,
                              currentWeight: userProfile?.currentWeight || null,
                            });
                            setMealHealthEvaluation(evaluation);
                          } catch (err) {
                            console.error("Meal health evaluation error:", err);
                          } finally {
                            setMealHealthLoading(false);
                          }
                        }, 1000);
                      }}
                    />
                  );
                }
                return null;
              })()}
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

// Öğün Sağlık Göstergesi Komponenti
function MealHealthIndicator({
  totalCalories,
  foods,
  mealType,
  currentWeight,
  targetWeight,
  evaluation,
  loading,
  onEvaluationNeeded,
}: {
  totalCalories: number;
  foods: any[];
  mealType: string;
  currentWeight?: number | null;
  targetWeight?: number | null;
  evaluation: MealHealthEvaluation | null;
  loading: boolean;
  onEvaluationNeeded: () => void;
}) {
  useEffect(() => {
    if (totalCalories > 0 && foods.length > 0) {
      onEvaluationNeeded();
    }
  }, [totalCalories, foods.length, mealType, currentWeight, targetWeight, onEvaluationNeeded]);

  if (loading && !evaluation) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-3">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
          <span>Sağlık değerlendirmesi yapılıyor...</span>
        </div>
      </div>
    );
  }

  if (!evaluation) return null;

  const healthScore = evaluation.healthScore;
  const getScoreColor = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getRecommendationColor = (rec: string) => {
    if (rec === "recommended") return "text-green-400 border-green-500/40 bg-green-500/10";
    if (rec === "caution") return "text-yellow-400 border-yellow-500/40 bg-yellow-500/10";
    return "text-red-400 border-red-500/40 bg-red-500/10";
  };

  const getRecommendationText = (rec: string) => {
    if (rec === "recommended") return "Tavsiye Edilir ✓";
    if (rec === "caution") return "Dikkatli Olun";
    return "Tavsiye Edilmez ✗";
  };

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-300">Öğün Sağlık Değerlendirmesi</span>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getRecommendationColor(evaluation.recommendation)}`}>
          {getRecommendationText(evaluation.recommendation)}
        </span>
      </div>
      
      <div>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-gray-400">Sağlık Skoru</span>
          <span className="font-medium text-white">{healthScore}/100</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-800">
          <div
            className={`h-full transition-all duration-500 ${getScoreColor(healthScore)}`}
            style={{ width: `${healthScore}%` }}
          />
        </div>
      </div>

      {evaluation.messages && evaluation.messages.length > 0 && (
        <div className="space-y-1">
          {evaluation.messages.map((message, idx) => (
            <div key={idx} className="text-sm text-gray-300">
              • {message}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className={`rounded border px-2 py-1 ${evaluation.isHealthy ? "border-green-500/40 bg-green-500/10 text-green-400" : "border-red-500/40 bg-red-500/10 text-red-400"}`}>
          {evaluation.isHealthy ? "Sağlıklı ✓" : "Sağlıksız ✗"}
        </div>
        <div className={`rounded border px-2 py-1 ${evaluation.isMealAdequate ? "border-green-500/40 bg-green-500/10 text-green-400" : "border-yellow-500/40 bg-yellow-500/10 text-yellow-400"}`}>
          {evaluation.isMealAdequate ? "Öğün için Yeterli" : "Öğün için Yetersiz"}
        </div>
        <div className="col-span-2 rounded border border-gray-700/40 bg-gray-800/40 px-2 py-1 text-gray-400">
          Yağ Seviyesi: {evaluation.fatLevel === "low" ? "Düşük" : evaluation.fatLevel === "medium" ? "Orta" : "Yüksek"}
        </div>
      </div>

      {evaluation.explanation && (
        <p className="text-xs text-gray-500">{evaluation.explanation}</p>
      )}
    </div>
  );
}
