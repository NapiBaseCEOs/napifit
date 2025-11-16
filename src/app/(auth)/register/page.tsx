"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import GoogleIcon from "../../../components/icons/GoogleIcon";
import Spinner from "../../../components/icons/Spinner";

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
    if (!email.trim()) {
      setError("Email zorunludur");
      return;
    }
    if (!password || password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      return;
    }

    setLoading(true);

    try {
      // Kayıt API'sine istek gönder
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, dateOfBirth, email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || "Kayıt başarısız");
        setLoading(false);
        return;
      }

      // Kayıt başarılı, otomatik giriş yap
      const signInRes = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (signInRes?.ok) {
        router.push("/onboarding");
        router.refresh();
      } else {
        // Giriş başarısız, login sayfasına yönlendir
        router.push("/login?registered=true");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    setError(null);

    try {
      const callbackUrl = encodeURIComponent(`${window.location.origin}/onboarding`);
      window.location.href = `/api/auth/signin/google?callbackUrl=${callbackUrl}`;
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
        <div className="relative z-10 space-y-6 rounded-3xl border border-gray-800/70 bg-gray-900/90 backdrop-blur-xl p-8 shadow-2xl shadow-fitness-orange/10 sm:p-10">
          <div className="space-y-3 text-center">
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
                  className="w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-fitness-orange focus:outline-none focus:ring-2 focus:ring-fitness-orange/40 transition-all"
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
                  className="w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-fitness-orange focus:outline-none focus:ring-2 focus:ring-fitness-orange/40 transition-all"
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
                className="w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-fitness-orange focus:outline-none focus:ring-2 focus:ring-fitness-orange/40 transition-all"
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
                className="w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-fitness-orange focus:outline-none focus:ring-2 focus:ring-fitness-orange/40 transition-all"
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
                className="w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-fitness-orange focus:outline-none focus:ring-2 focus:ring-fitness-orange/40 transition-all"
                placeholder="En az 6 karakter"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fitness-orange to-primary-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-fitness-orange/50 hover:shadow-fitness-orange/70 hover:scale-[1.02] transition-all disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
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

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900/90 text-gray-400">veya</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onGoogle}
            disabled={googleLoading || loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-700 bg-gray-900/60 px-4 py-3 text-sm font-semibold text-gray-200 hover:border-fitness-orange/50 hover:text-fitness-orange hover:bg-gray-900/80 transition-all disabled:cursor-not-allowed disabled:opacity-60"
          >
            {googleLoading ? (
              <>
                <Spinner className="h-5 w-5" />
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
            Zaten hesabın var mı?{" "}
            <Link className="font-semibold text-primary-400 hover:text-primary-300 transition-colors" href="/login">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
