"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleIcon from "../../../components/icons/GoogleIcon";
import Spinner from "../../../components/icons/Spinner";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // URL'den error parametresini al
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "OAuthSignin") {
        setError("Google ile giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.");
      } else if (errorParam === "OAuthCallback") {
        setError("Google OAuth callback hatası. Lütfen tekrar deneyin.");
      } else if (errorParam === "OAuthCreateAccount") {
        setError("Hesap oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
      } else {
        setError("Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  }, [searchParams]);

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
        if (res.error.includes("database") || res.error.includes("connection") || res.error.includes("CredentialsSignin")) {
          setError("Veritabanı bağlantı hatası veya geçersiz bilgiler. Lütfen kontrol edin.");
        } else {
          setError("Geçersiz email veya şifre");
        }
        return;
      }
      
      if (res?.ok) {
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
            setError("Veritabanı bağlantı hatası. Bazı özellikler çalışmayabilir.");
            setTimeout(() => {
              router.push("/dashboard");
            }, 2000);
          } else {
            router.push("/dashboard");
          }
        } catch (err) {
          console.error("Profile fetch error:", err);
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
          await signInWithGoogleMobile("/onboarding");
          return;
        }
      } catch (mobileError) {
        console.log("Mobile OAuth skipped, using web");
      }
      
      // Web'de NextAuth'un standart signin endpoint'ini kullan
      // Bu en güvenilir yöntem - NextAuth otomatik olarak Google'a yönlendirir
      const callbackUrl = encodeURIComponent(`${window.location.origin}/onboarding`);
      const signInUrl = `/api/auth/signin/google?callbackUrl=${callbackUrl}`;
      
      // Direkt redirect - NextAuth endpoint'i Google'a yönlendirecek
      window.location.href = signInUrl;
      
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
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-fitness-purple/15 via-primary-500/15 to-transparent blur-3xl animate-pulse-slow" />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Giriş Yap</h1>
            <p className="text-gray-400">Hesabına erişmek için giriş yap veya Google ile devam et.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                EMAİL
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="ornek@mail.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                ŞİFRE
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg shadow-primary-500/50 hover:shadow-primary-500/70 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner className="h-5 w-5" />
                  <span>Giriş yapılıyor...</span>
                </>
              ) : (
                "Giriş Yap"
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900/90 text-gray-400">veya</span>
              </div>
            </div>

            <button
              onClick={onGoogle}
              disabled={googleLoading}
              className="mt-6 w-full bg-white text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-black/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {googleLoading ? (
                <>
                  <Spinner className="h-5 w-5" />
                  <span>Yönlendiriliyor...</span>
                </>
              ) : (
                <>
                  <GoogleIcon className="h-5 w-5" />
                  <span>Google ile devam et</span>
                </>
              )}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            Hesabın yok mu?{" "}
            <Link href="/register" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
