"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import GoogleIcon from "../../../components/icons/GoogleIcon";
import Spinner from "../../../components/icons/Spinner";
import { isMobilePlatform, signInWithGoogleMobile } from "../../../lib/google-oauth-mobile";
import type { Database } from "@/lib/supabase/types";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = useSupabaseClient<Database>();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendFeedback, setResendFeedback] = useState<string | null>(null);

  const passwordPolicy = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  const completedFields = useMemo(() => {
    return [firstName, lastName, dateOfBirth, email, password].filter(Boolean).length;
  }, [firstName, lastName, dateOfBirth, email, password]);

  const formProgress = Math.min(100, Math.round((completedFields / 5) * 100));

  const passwordHint = useMemo(() => {
    if (!password) return "En az 8 karakter, içinde büyük harf ve rakam bulunmalı.";
    if (password.length < 8) return "Daha güçlü bir şifre için minimum 8 karakter girin.";
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return "Bir büyük harf ve rakam eklediğinde güvenlik artacak.";
    }
    return "Harika! Şifreniz güçlü görünüyor.";
  }, [password]);

  const isFormDisabled = loading || googleLoading || Boolean(successMessage);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendFeedback(null);
    
    // Validasyon
    if (!firstName.trim()) {
      setError("Ad zorunludur");
      return;
    }
    if (!lastName.trim()) {
      setError("Soyad zorunludur");
      return;
    }
    if (!dateOfBirth) {
      setError("Doğum tarihi zorunludur");
      return;
    }
    
    // Doğum tarihi kontrolü (18 yaşından küçük olmamalı)
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      // Henüz doğum günü gelmemiş
      const actualAge = age - 1;
      if (actualAge < 18) {
        setError("18 yaşından küçükler kayıt olamaz");
        return;
      }
    } else if (age < 18) {
      setError("18 yaşından küçükler kayıt olamaz");
      return;
    }

    if (!passwordPolicy.test(password)) {
      setError("Şifren 8+ karakter olmalı ve en az bir büyük harf ile rakam içermeli.");
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
              ? `${window.location.origin}/auth/callback?next=${encodeURIComponent("/onboarding")}`
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
      // Mobil platform kontrolü
      const isMobile = isMobilePlatform();
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback?next=${encodeURIComponent("/onboarding")}`
          : undefined;

      if (isMobile && redirectTo) {
        await signInWithGoogleMobile(redirectTo);
        return;
      }

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
    <main className="min-h-screen flex items-center justify-center px-4 py-16 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden bg-[#0a0a0a]">
        <div className="absolute top-0 left-0 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-fitness-orange/15 via-primary-500/15 to-transparent blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-fitness-purple/15 via-fitness-blue/15 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative w-full max-w-md">
        <div className="relative z-10 space-y-6 rounded-3xl border border-gray-800/70 bg-gray-900/90 backdrop-blur-xl p-8 shadow-2xl shadow-fitness-orange/10 sm:p-10 animate-fade-up">
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
            <div className="w-full h-2 rounded-full bg-gray-800/60 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-fitness-orange via-primary-500 to-primary-400 transition-all duration-300"
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
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wide text-gray-400">
                  Ad <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
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
                className="w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-fitness-orange focus:outline-none focus:ring-2 focus:ring-fitness-orange/40 transition-all duration-300"
                required
              />
              <p className="text-xs text-gray-500">18 yaşından küçükler kayıt olamaz</p>
            </div>
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wide text-gray-400">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-fitness-orange focus:outline-none focus:ring-2 focus:ring-fitness-orange/40 transition-all duration-300"
                placeholder="ornek@mail.com"
                required
              />
            </div>
            <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wide text-gray-400">
                Şifre <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                value={password}
                minLength={8}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-fitness-orange focus:outline-none focus:ring-2 focus:ring-fitness-orange/40 transition-all duration-300"
                placeholder="En az 8 karakter, büyük harf ve rakam içerir"
                required
              />
              <p className="text-xs text-gray-500">{passwordHint}</p>
            </div>
            <button
              type="submit"
              disabled={isFormDisabled}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fitness-orange to-primary-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-fitness-orange/50 hover:shadow-fitness-orange/70 hover:scale-[1.02] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
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
            className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-700 bg-gray-900/60 px-4 py-3 text-sm font-semibold text-gray-200 hover:border-fitness-orange/50 hover:text-fitness-orange hover:bg-gray-900/80 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
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

          <div className="mt-6 rounded-2xl border border-gray-800/60 bg-gray-900/70 p-4 space-y-3">
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

