"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GoogleIcon from "../../../components/icons/GoogleIcon";
import Spinner from "../../../components/icons/Spinner";
import { signInWithGoogleMobile } from "../../../lib/google-oauth-mobile";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      
      setLoading(false);
      
      if (res?.error) {
        // Daha detaylı hata mesajı
        if (res.error.includes("database") || res.error.includes("connection") || res.error.includes("CredentialsSignin")) {
          setError("Veritabanı bağlantı hatası veya geçersiz bilgiler. Lütfen kontrol edin.");
        } else {
          setError("Geçersiz email veya şifre");
        }
        return;
      }
      
      if (res?.ok) {
        // Onboarding kontrolü için kullanıcı bilgilerini al
        try {
          const profileRes = await fetch("/api/profile", {
            method: "GET",
            cache: "no-store",
          });
          
          if (profileRes.ok) {
            const profile = await profileRes.json();
            if (!profile.onboardingCompleted) {
              router.push("/onboarding");
            } else {
              router.push("/dashboard");
            }
          } else if (profileRes.status === 503) {
            // Database bağlantı hatası - yine de dashboard'a yönlendir
            setError("Veritabanı bağlantı hatası. Bazı özellikler çalışmayabilir.");
            setTimeout(() => {
              router.push("/dashboard");
            }, 2000);
          } else {
            // Diğer hatalar - direkt dashboard'a yönlendir
            router.push("/dashboard");
          }
        } catch (err) {
          console.error("Profile fetch error:", err);
          // Hata durumunda direkt dashboard'a yönlendir
          router.push("/dashboard");
        }
        router.refresh();
      }
    } catch (err) {
      setLoading(false);
      console.error("Login error:", err);
      setError("Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.");
    }
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
      
      // Web'de direkt Google OAuth URL'i oluşturan endpoint'e yönlendir
      // NextAuth'un signin endpoint'i yerine direkt Google'a gidiyoruz
      const callbackUrl = encodeURIComponent(`${window.location.origin}/onboarding`);
      const signInUrl = `/api/google-direct?callbackUrl=${callbackUrl}`;
      
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
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-primary-500/15 via-fitness-orange/15 to-transparent blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-fitness-purple/15 via-fitness-blue/15 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative w-full max-w-md">
        <div className="relative z-10 space-y-6 rounded-3xl border border-gray-800/70 bg-gray-900/90 backdrop-blur-xl p-8 shadow-2xl shadow-primary-500/10 sm:p-10 animate-fade-up">
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/40 bg-primary-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary-300">
              NapiFit'e Tekrar Hoş Geldin
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-primary-200 to-fitness-orange bg-clip-text text-transparent">
              Giriş Yap
            </h1>
            <p className="text-sm text-gray-400">
              Hesabına erişmek için giriş yap veya Google ile devam et.
            </p>
          </div>
          {error && (
            <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-center text-sm text-red-200">
              {error}
            </div>
          )}
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wide text-gray-400">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all duration-300"
                placeholder="ornek@mail.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wide text-gray-400">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all duration-300"
                placeholder="••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/50 hover:shadow-primary-500/70 hover:scale-[1.02] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Spinner className="h-4 w-4 text-white" />
                  Giriş yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </button>
          </form>
          <button
            type="button"
            onClick={onGoogle}
            disabled={googleLoading || loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-700 bg-gray-900/60 px-4 py-3 text-sm font-semibold text-gray-200 hover:border-primary-500/50 hover:text-primary-400 hover:bg-gray-900/80 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {googleLoading ? (
              <>
                <Spinner className="h-5 w-5 text-blue-200" />
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
            Hesabın yok mu? {" "}
            <Link className="font-semibold text-primary-400 hover:text-primary-300 transition-colors" href="/register">
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

