"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, useSessionContext } from "@supabase/auth-helpers-react";
import Spinner from "../../components/icons/Spinner";

export default function OnboardingPage() {
  const router = useRouter();
  const session = useSession();
  const { isLoading } = useSessionContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    age: "",
    gender: "",
    targetWeight: "",
    dailySteps: "",
  });

  useEffect(() => {
    const checkOnboarding = async () => {
      if (session) {
        try {
          const res = await fetch("/api/profile");
          if (res.ok) {
            const profile = await res.json();
            if (profile.onboardingCompleted) {
              router.push("/dashboard");
              return;
            }
          }
        } catch (error) {
          console.error("Onboarding check error:", error);
        }
      }
      setCheckingOnboarding(false);
    };

    if (isLoading) {
      return;
    }

    if (!session) {
      setCheckingOnboarding(false);
      router.push("/login");
      return;
    }
    
    checkOnboarding();
  }, [session, router, isLoading]);

  if (isLoading || checkingOnboarding) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8 text-blue-400" />
      </main>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.height || parseFloat(formData.height) < 100 || parseFloat(formData.height) > 250) {
          setError("Lütfen geçerli bir boy girin (100-250 cm)");
          return false;
        }
        return true;
      case 2:
        if (!formData.weight || parseFloat(formData.weight) < 30 || parseFloat(formData.weight) > 300) {
          setError("Lütfen geçerli bir kilo girin (30-300 kg)");
          return false;
        }
        return true;
      case 3:
        if (!formData.age || parseInt(formData.age) < 13 || parseInt(formData.age) > 120) {
          setError("Lütfen geçerli bir yaş girin (13-120)");
          return false;
        }
        return true;
      case 4:
        if (!formData.gender) {
          setError("Lütfen cinsiyet seçin");
          return false;
        }
        return true;
      case 5:
        if (!formData.targetWeight || parseFloat(formData.targetWeight) < 30 || parseFloat(formData.targetWeight) > 300) {
          setError("Lütfen geçerli bir hedef kilo girin (30-300 kg)");
          return false;
        }
        return true;
      case 6:
        if (!formData.dailySteps || parseInt(formData.dailySteps) < 0 || parseInt(formData.dailySteps) > 100000) {
          setError("Lütfen geçerli bir adım sayısı girin (0-100000)");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!validateStep(6)) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/profile/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          age: parseInt(formData.age),
          gender: formData.gender,
          targetWeight: parseFloat(formData.targetWeight),
          dailySteps: parseInt(formData.dailySteps),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        let errorMessage = data.message || "Bir hata oluştu";
        
        // Validation hatalarını göster
        if (data.errors && Array.isArray(data.errors)) {
          const validationErrors = data.errors.map((err: any) => `${err.path.join(".")}: ${err.message}`).join(", ");
          errorMessage = `Geçersiz veri: ${validationErrors}`;
        }
        
        setError(errorMessage);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Onboarding submit error:", err);
      setError("Bilgiler kaydedilirken bir hata oluştu. Lütfen migration'ın uygulandığından emin olun.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Boy", field: "height", unit: "cm", placeholder: "Örn: 175", min: 100, max: 250 },
    { number: 2, title: "Kilo", field: "weight", unit: "kg", placeholder: "Örn: 70", min: 30, max: 300 },
    { number: 3, title: "Yaş", field: "age", unit: "", placeholder: "Örn: 25", min: 13, max: 120 },
    { number: 4, title: "Cinsiyet", field: "gender", unit: "", placeholder: "", min: 0, max: 0 },
    { number: 5, title: "Hedef Kilo", field: "targetWeight", unit: "kg", placeholder: "Örn: 65", min: 30, max: 300 },
    { number: 6, title: "Günlük Ortalama Adım", field: "dailySteps", unit: "adım", placeholder: "Örn: 8000", min: 0, max: 100000 },
  ];

  const currentStepData = steps[currentStep - 1];

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-20 sm:px-6 bg-[#0a0a0a]">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-primary-500/15 via-fitness-orange/15 to-transparent blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-fitness-purple/15 via-fitness-blue/15 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>
      <div className="max-w-2xl w-full space-y-6 rounded-3xl border border-gray-800/60 bg-gray-900/80 p-8 shadow-2xl shadow-cyan-500/20 backdrop-blur animate-fade-up sm:p-12">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Adım {currentStep} / 6</span>
            <span>%{Math.round((currentStep / 6) * 100)}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="space-y-3 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-cyan-300">
            Profil Oluşturma
          </p>
          <h1 className="text-3xl font-semibold text-white">
            {currentStepData.title}
          </h1>
          <p className="text-gray-300 leading-relaxed text-sm">
            {currentStep === 1 && "Boyunuzu girin (santimetre cinsinden)"}
            {currentStep === 2 && "Mevcut kilonuzu girin (kilogram cinsinden)"}
            {currentStep === 3 && "Yaşınızı girin"}
            {currentStep === 4 && "Cinsiyetinizi seçin"}
            {currentStep === 5 && "Hedef kilonuzu girin (kilogram cinsinden)"}
            {currentStep === 6 && "Günlük ortalama adım sayınızı girin"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-center text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Form Input */}
        <div className="space-y-4">
          {currentStep === 4 ? (
            // Cinsiyet seçimi
            <div className="grid grid-cols-3 gap-3">
              {["male", "female", "other"].map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => handleInputChange("gender", gender)}
                  className={`rounded-xl border-2 p-4 text-sm font-medium transition-all ${
                    formData.gender === gender
                      ? "border-cyan-500 bg-cyan-500/20 text-cyan-300"
                      : "border-gray-800 bg-gray-900/60 text-gray-300 hover:border-gray-700 hover:text-white"
                  }`}
                >
                  {gender === "male" ? "Erkek" : gender === "female" ? "Kadın" : "Diğer"}
                </button>
              ))}
            </div>
          ) : (
            // Sayısal input
            <div className="relative">
              <input
                type="number"
                value={formData[currentStepData.field as keyof typeof formData]}
                onChange={(e) => handleInputChange(currentStepData.field, e.target.value)}
                placeholder={currentStepData.placeholder}
                min={currentStepData.min}
                max={currentStepData.max}
                step={currentStepData.field === "age" || currentStepData.field === "dailySteps" ? "1" : "0.1"}
                className="w-full rounded-xl border border-gray-800 bg-gray-900/70 px-6 py-4 text-lg text-gray-100 placeholder:text-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-center"
                autoFocus
              />
              {currentStepData.unit && (
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  {currentStepData.unit}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              disabled={loading}
              className="flex-1 rounded-xl border border-gray-700 bg-gray-900/60 px-6 py-3 text-sm font-medium text-gray-200 hover:border-gray-500 hover:text-white transition-colors disabled:opacity-50"
            >
              Geri
            </button>
          )}
          {currentStep < 6 ? (
            <button
              onClick={handleNext}
              disabled={loading}
              className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 hover:-translate-y-0.5 transition-transform disabled:cursor-not-allowed disabled:opacity-60"
            >
              İleri
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 hover:-translate-y-0.5 transition-transform disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Spinner className="h-4 w-4 text-white" />
                  Kaydediliyor...
                </>
              ) : (
                "Tamamla"
              )}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

