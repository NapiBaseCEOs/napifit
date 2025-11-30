"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import GoogleIcon from "../../../components/icons/GoogleIcon";
import Spinner from "../../../components/icons/Spinner";
// import { isMobilePlatform, signInWithGoogleMobile } from "../../../lib/google-oauth-mobile";
import type { Database } from "@/lib/supabase/types";
import { useLocale } from "@/components/i18n/LocaleProvider";
import CountrySelector from "@/components/i18n/CountrySelector";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = useSupabaseClient<Database>();
  const { t } = useLocale();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendFeedback, setResendFeedback] = useState<string | null>(null);
  const [hasConsented, setHasConsented] = useState(false);

  // Detect country on mount
  useEffect(() => {
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
      .catch(() => { });
  }, []);

  const passwordPolicy = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  const completedFields = useMemo(() => {
    return [firstName, lastName, dateOfBirth, email, password, height, weight, gender].filter(Boolean).length;
  }, [firstName, lastName, dateOfBirth, email, password, height, weight, gender]);

  const formProgress = Math.min(100, Math.round((completedFields / 8) * 100));

  const passwordHint = useMemo(() => {
    if (!password) return "En az 8 karakter, içinde büyük harf ve rakam bulunmalı.";
    if (password.length < 8) return "Daha güçlü bir şifre için minimum 8 karakter girin.";
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return "Bir büyük harf ve rakam eklediğinde güvenlik artacak.";
    }
    return "Harika! Şifreniz güçlü görünüyor.";
  }, [password]);

  const isFormDisabled = loading || googleLoading || Boolean(successMessage) || !hasConsented;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendFeedback(null);

    // Validasyon
    if (!firstName.trim()) {
      setError(t("auth.register.errors.required").replace("{}", t("auth.register.firstName")));
      return;
    }
    if (!lastName.trim()) {
      setError(t("auth.register.errors.required").replace("{}", t("auth.register.lastName")));
      return;
    }
    if (!dateOfBirth) {
      setError(t("auth.register.errors.required").replace("{}", t("auth.register.dateOfBirth")));
      return;
    }

    if (!countryCode) {
      setError(t("country.required"));
      return;
    }

    // Doğum tarihi kontrolü ve yaş hesaplama (18 yaşından küçük olmamalı)
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      // Henüz doğum günü gelmemiş
      calculatedAge = calculatedAge - 1;
    }

    // 18 yaş kontrolü
    if (calculatedAge < 18) {
      setError("18 yaşından küçükler kayıt olamaz");
      return;
    }

    if (!hasConsented) {
      setError("Devam edebilmek için şartları kabul etmelisin.");
      return;
    }

    if (!passwordPolicy.test(password)) {
      setError("Şifren 8+ karakter olmalı ve en az bir büyük harf ile rakam içermeli.");
      return;
    }

    // BMR hesaplama için gerekli bilgileri kontrol et
    if (!height || parseFloat(height) < 100 || parseFloat(height) > 250) {
      setError("Lütfen geçerli bir boy girin (100-250 cm)");
      return;
    }
    if (!weight || parseFloat(weight) < 30 || parseFloat(weight) > 300) {
      setError("Lütfen geçerli bir kilo girin (30-300 kg)");
      return;
    }
    if (!gender) {
      setError("Lütfen cinsiyet seçin");
      return;
    }

    setLoading(true);
    setSuccessMessage(null);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/auth/callback?next=${encodeURIComponent("/dashboard")}`
              : undefined,
          data: {
            full_name: fullName,
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            date_of_birth: dateOfBirth,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          email: data.user.email ?? email,
          full_name: fullName,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          date_of_birth: dateOfBirth,
          height_cm: parseFloat(height),
          weight_kg: parseFloat(weight),
          age: calculatedAge,
          gender: gender as "male" | "female" | "other",
          country_code: countryCode,
        });
      }

      setSuccessMessage(
        `Doğrulama bağlantısı ${email} adresine gönderildi. E-postanı onayladıktan sonra "Giriş Yap" butonuna tıklayabilirsin.`
      );
    } catch (err) {
      console.error("Register error:", err);
      if (err instanceof Error) {
        const message = err.message.toLowerCase();
        if (message.includes("password")) {
          setError("Şifreniz 8+ karakter olmalı ve en az bir büyük harf ile rakam içermeli.");
          return;
        }
        if (message.includes("registered")) {
          setError("Bu email adresi zaten kullanılıyor. Lütfen giriş yapmayı deneyin.");
          return;
        }
        if (message.includes("invalid email")) {
          setError("Lütfen geçerli bir email adresi girin.");
          return;
        }
      }
      setError("Kayıt sırasında bir hata oluştu. Lütfen bilgilerinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setResendFeedback("Önce e-posta alanını doldurmalısın.");
      return;
    }
    setResendLoading(true);
    setResendFeedback(null);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
      });
      if (resendError) {
        throw resendError;
      }
      setResendFeedback(`${email} adresine yeni doğrulama bağlantısı gönderildi.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Doğrulama maili gönderilemedi. Daha sonra tekrar deneyin.";
      setResendFeedback(message);
    } finally {
      setResendLoading(false);
    }
  };

  const onGoogle = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    setError(null);

    try {
      // Mobil platform kontrolü kaldırıldı (PWA excluded)
      // const isMobile = isMobilePlatform();
      // Google OAuth için: Login sayfasında onboarding kontrolü yapılacak, bu yüzden dashboard'a yönlendir
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback?next=${encodeURIComponent("/dashboard")}`
          : undefined;

      // if (isMobile && redirectTo) {
      //   await signInWithGoogleMobile(redirectTo);
      //   return;
      // }

      const { error: oauthError, data } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (oauthError) {
        throw oauthError;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Google OAuth error:", err);
      setError("Google ile giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.");
      return;
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-16 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#01040d] via-[#040a1a] to-[#02010a]" />
      <div className="absolute top-0 left-1/3 -z-10 h-[420px] w-[420px] rounded-full bg-primary-500/20 blur-[140px] animate-float" />
      <div
        className="absolute bottom-[-10%] right-[5%] -z-10 h-[420px] w-[420px] rounded-full bg-fitness-orange/20 blur-[140px]"
        style={{ animationDelay: "1s" }}
      />
      <div className="absolute inset-0 -z-10 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.12),transparent_65%)]" />

      <div className="relative w-full max-w-md">
        <div className="absolute -top-12 left-0 hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          24/7 destek ve Supabase koruması
        </div>
        <div className="relative z-10 space-y-6 rounded-3xl border border-white/10 bg-[#0f1424]/90 backdrop-blur-2xl p-8 shadow-[0_25px_90px_rgba(3,5,20,0.7)] sm:p-10 animate-fade-up">
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-fitness-orange/40 bg-fitness-orange/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-fitness-orange">
              NapiFit Topluluğuna Katıl
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-fitness-orange to-primary-400 bg-clip-text text-transparent">
              Hesap Oluştur
            </h1>
            <p className="text-sm text-gray-400">
              Sağlıklı yaşam yolculuğuna başlamak için hesabını oluştur veya Google ile devam et.
            </p>
          </div>
          <div className="space-y-3">
            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/10">
              <div
                className="h-full bg-[linear-gradient(90deg,#f97316,#7c3aed,#06b6d4)] animate-gradient transition-all duration-300"
                style={{ width: `${formProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 text-center">
              Formun %{formProgress}’ini tamamladın. Birkaç alan kaldı!
            </p>
          </div>

          {error && (
            <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-center text-sm text-red-200">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-center text-sm text-emerald-200">
              {successMessage}
            </div>
          )}
          <form className="space-y-4" onSubmit={onSubmit} autoComplete="on">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wide text-gray-400">
                  Ad <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                  autoCapitalize="words"
                  enterKeyHint="next"
                  className="w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-fitness-orange focus:outline-none focus:ring-2 focus:ring-fitness-orange/40 transition-all duration-300"
                  placeholder="Adınız"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wide text-gray-400">
                  Soyad <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                  autoCapitalize="words"
                  className="w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-fitness-orange focus:outline-none focus:ring-2 focus:ring-fitness-orange/40 transition-all duration-300"
                  placeholder="Soyadınız"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wide text-gray-400">
                Doğum Tarihi <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                autoComplete="bday"
                className="w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-fitness-orange focus:outline-none focus:ring-2 focus:ring-fitness-orange/40 transition-all duration-300"
                required
              />
              <p className="text-xs text-gray-500">18 yaşından küçükler kayıt olamaz</p>
            </div>
            <div className="rounded-2xl border border-primary-500/20 bg-primary-500/5 p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="h-5 w-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-primary-300 mb-1">BMR (Bazal Metabolizma Hızı) Hesaplaması</p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Durarken yaktığın kaloriyi hesaplamak için boy, kilo, yaş ve cinsiyet bilgilerine ihtiyacımız var. Bu bilgiler dashboard'da günlük kalori dengesini görmek için kullanılacak.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wide text-gray-400">
                    Boy (cm) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min={100}
                    max={250}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-fitness-orange focus:outline-none focus:ring-2 focus:ring-fitness-orange/40 transition-all duration-300"
                    placeholder="175"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wide text-gray-400">
                    Kilo (kg) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min={30}
                    max={300}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-fitness-orange focus:outline-none focus:ring-2 focus:ring-fitness-orange/40 transition-all duration-300"
                    placeholder="75"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wide text-gray-400">
                  Cinsiyet <span className="text-red-400">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3 text-sm text-gray-100 focus:border-fitness-orange focus:outline-none focus:ring-2 focus:ring-fitness-orange/40 transition-all duration-300"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="male">Erkek</option>
                  <option value="female">Kadın</option>
                  <option value="other">Diğer</option>
                </select>
                <p className="text-xs text-gray-500">Yaş bilgisi doğum tarihinden otomatik hesaplanacak</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wide text-gray-400">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                className="w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-fitness-orange focus:outline-none focus:ring-2 focus:ring-fitness-orange/40 transition-all duration-300"
                placeholder="ornek@mail.com"
                required
              />
            </div>
            <CountrySelector
              value={countryCode}
              onChange={setCountryCode}
              detectedCountry={detectedCountry}
              required
            />
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wide text-gray-400">
                Şifre <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                value={password}
                minLength={8}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                enterKeyHint="done"
                className="w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-fitness-orange focus:outline-none focus:ring-2 focus:ring-fitness-orange/40 transition-all duration-300"
                placeholder="En az 8 karakter, büyük harf ve rakam içerir"
                required
              />
              <p className="text-xs text-gray-500">{passwordHint}</p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <input
                id="consent"
                type="checkbox"
                checked={hasConsented}
                onChange={(event) => setHasConsented(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-white/30 bg-transparent text-primary-400 focus:ring-primary-400/40"
              />
              <label htmlFor="consent" className="text-xs text-gray-300 leading-relaxed">
                Kaydol butonuna basarak{" "}
                <Link href="/terms" className="text-primary-200 underline">
                  Kullanım Şartları
                </Link>{" "}
                ve{" "}
                <Link href="/privacy" className="text-primary-200 underline">
                  Gizlilik Politikasını
                </Link>{" "}
                okuduğunu ve Supabase üzerinde veri saklanmasını kabul ettiğini onaylıyorsun.
              </label>
            </div>
            <button
              type="submit"
              disabled={isFormDisabled}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(120deg,#f97316,#7c3aed,#06b6d4,#f97316)] animate-gradient px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(9,9,18,0.6)] hover:shadow-[0_30px_80px_rgba(249,115,22,0.35)] hover:translate-y-0.5 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Spinner className="h-4 w-4 text-white" />
                  Kaydediliyor...
                </>
              ) : (
                "Kayıt Ol"
              )}
            </button>
          </form>
          <button
            type="button"
            onClick={onGoogle}
            disabled={googleLoading || loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/90 px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_15px_45px_rgba(255,255,255,0.15)]"
          >
            {googleLoading ? (
              <>
                <Spinner className="h-5 w-5 text-pink-200" />
                Yönlendiriliyor...
              </>
            ) : (
              <>
                <GoogleIcon />
                Google ile devam et
              </>
            )}
          </button>
          <p className="text-center text-xs text-gray-400">
            Google ile devam ederek Google&apos;ın sizinle paylaştığı temel profil verilerini Supabase üzerinde saklamamıza izin veriyorsunuz.
          </p>
          {successMessage && (
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/20 transition"
            >
              E-postamı Onayladım, Giriş Yap
            </button>
          )}
          {successMessage && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendLoading}
                className="w-full rounded-xl border border-primary-500/40 bg-primary-500/10 px-4 py-3 text-sm font-semibold text-primary-200 hover:bg-primary-500/20 transition disabled:opacity-50"
              >
                {resendLoading ? "Doğrulama maili gönderiliyor..." : "Doğrulama E-postasını Yeniden Gönder"}
              </button>
              {resendFeedback && <p className="text-xs text-gray-400 text-center">{resendFeedback}</p>}
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
            <h2 className="text-sm text-gray-200 font-semibold">Neden NapiFit?</h2>
            <ul className="text-xs text-gray-400 space-y-1.5">
              <li>• AI destekli sağlık hedefleri ve kişisel öneriler</li>
              <li>• Haftalık ilerleme raporları ve motivasyon ipuçları</li>
              <li>• Tek tuşla Google ile giriş ve senkronizasyon</li>
            </ul>
          </div>

          <p className="text-center text-sm text-gray-400">
            Zaten hesabın var mı? {" "}
            <Link className="font-semibold text-primary-400 hover:text-primary-300 transition-colors" href="/login">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

