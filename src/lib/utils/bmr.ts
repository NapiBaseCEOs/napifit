/**
 * BMR (Bazal Metabolizma Hızı) hesaplama fonksiyonları
 * Mifflin-St Jeor Equation (daha güncel ve doğru)
 */

export type BMRParams = {
  weight: number; // kg
  height: number; // cm
  age: number; // years
  gender: "male" | "female" | "other";
};

/**
 * Mifflin-St Jeor Equation ile BMR hesapla
 * Erkek: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + 5
 * Kadın: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) - 161
 */
export function calculateBMR(params: BMRParams): number {
  const { weight, height, age, gender } = params;
  
  // Diğer cinsiyet için ortalama kullan
  const baseBMR = 10 * weight + 6.25 * height - 5 * age;
  
  let bmr: number;
  if (gender === "male") {
    bmr = baseBMR + 5;
  } else if (gender === "female") {
    bmr = baseBMR - 161;
  } else {
    // Diğer için ortalama
    bmr = baseBMR - 78; // (5 - 161) / 2
  }
  
  return Math.max(800, Math.round(bmr)); // Minimum 800 kcal
}

/**
 * Harris-Benedict Equation (alternatif, daha eski)
 */
export function calculateBMRHarrisBenedict(params: BMRParams): number {
  const { weight, height, age, gender } = params;
  
  let bmr: number;
  if (gender === "male") {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else if (gender === "female") {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  } else {
    // Diğer için ortalama
    bmr = 267.978 + (11.322 * weight) + (3.949 * height) - (5.004 * age);
  }
  
  return Math.max(800, Math.round(bmr));
}

/**
 * Aktivite seviyesine göre günlük kalori ihtiyacı (TDEE)
 */
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,      // Hareketsiz
  light: 1.375,        // Hafif aktivite (haftada 1-3 gün)
  moderate: 1.55,      // Orta aktivite (haftada 3-5 gün)
  active: 1.725,       // Aktif (haftada 6-7 gün)
  very_active: 1.9,    // Çok aktif (günde 2+ kez egzersiz)
};

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel = "sedentary"): number {
  return Math.round(bmr * activityMultipliers[activityLevel]);
}

/**
 * Kilo hedefi için günlük kalori ihtiyacı
 * -500 kcal = haftada ~0.5 kg verme
 * +500 kcal = haftada ~0.5 kg alma
 */
export function calculateDailyCalorieNeed(
  bmr: number,
  activityLevel: ActivityLevel,
  targetWeightDifference: number // Hedef kilo - mevcut kilo
): number {
  const tdee = calculateTDEE(bmr, activityLevel);
  
  // Hedef kilo farkına göre kalori ayarla
  // 1 kg = 7700 kcal
  // Haftada 0.5 kg için günlük ~500 kcal fark
  const weeklyGoal = targetWeightDifference > 0 ? 500 : -500;
  const dailyAdjustment = weeklyGoal / 7;
  
  return Math.round(tdee + dailyAdjustment);
}

