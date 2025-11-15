"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import GoogleIcon from "../../../components/icons/GoogleIcon";
import Spinner from "../../../components/icons/Spinner";
import { signInWithGoogleMobile } from "../../../lib/google-oauth-mobile";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
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
    
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, dateOfBirth, email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.message || "Kayıt başarısız");
      console.error("Register error:", data);
      return;
    }
    // Kayıt başarılı, otomatik giriş yap
    const signInRes = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (signInRes?.ok) {
      router.push("/onboarding");
    } else {
      router.push("/login");
    }
    router.refresh();
  };

  const onGoogle = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    setError(null);

    try {
      // Mobil platform kontrolü
      try {
        const { isMobilePlatform, signInWithGoogleMobile } = await import("../../../lib/google-oauth-mobile");
        const isMobile = isMobilePlatform();
        
        if (isMobile) {
          // Mobil'de Capacitor Browser kullan
          await signInWithGoogleMobile("/onboarding");
          return; // Browser açıldı, callback geldiğinde GoogleOAuthHandler işleyecek
        }
      } catch (mobileError) {
        // Mobil değilse veya hata varsa web'e devam et
        console.log("Mobile OAuth skipped, using web");
      }
      
      // Web'de NextAuth signin endpoint'ine direkt yönlendir
      // Cloudflare Pages için optimize edilmiş yöntem
      const callbackUrl = encodeURIComponent(`${window.location.origin}/onboarding`);
      const signInUrl = `/api/auth/signin/google?callbackUrl=${callbackUrl}`;
      
      // Direkt redirect - en güvenilir yöntem
      window.location.href = signInUrl;
      
      // Loading state'i koru (redirect olacak)
      // setGoogleLoading(false); // Redirect olacak, bunu yapmaya gerek yok
    } catch (err) {
      console.error("Google OAuth error:", err);
      setGoogleLoading(false);
      setError("Google ile giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.");
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
          {error && (
            <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-center text-sm text-red-200">
              {error}
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
                minLength={6}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-fitness-orange focus:outline-none focus:ring-2 focus:ring-fitness-orange/40 transition-all duration-300"
                placeholder="En az 6 karakter"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || googleLoading}
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

