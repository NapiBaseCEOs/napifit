"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleIcon from "../../../components/icons/GoogleIcon";
import Spinner from "../../../components/icons/Spinner";
import { useSession, useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import type { Database } from "@/lib/supabase/types";
import { isMobilePlatform, signInWithGoogleMobile } from "../../../lib/google-oauth-mobile";
import { AuthError } from "@supabase/supabase-js";

function ErrorHandler() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // URL'den error parametresini al
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError("Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }, [searchParams]);

  return error ? (
    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
      {error}
    </div>
  ) : null;
}

export default function LoginPage() {
  const router = useRouter();
  const supabase = useSupabaseClient<Database>();
  const session = useSession();
  const { isLoading } = useSessionContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendFeedback, setResendFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (session) {
      router.prefetch("/dashboard");
      router.prefetch("/onboarding");
    }
  }, [session, router, isLoading]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setResendFeedback(null);
    setLoading(true);
    
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      const {
        data: { session: activeSession },
      } = await supabase.auth.getSession();

      if (!activeSession) {
        setError("Oturum oluşturulamadı. Lütfen tekrar deneyin.");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", activeSession.user.id)
        .single();

      if (!profile?.onboarding_completed) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof AuthError) {
        const normalized = err.message.toLowerCase();
        if (normalized.includes("email not confirmed")) {
          setError("E-posta adresin doğrulanmamış görünüyor.");
          setInfoMessage("Doğrulama mailini teslim almadıysan aşağıdan yeniden gönderebilirsin.");
        } else if (normalized.includes("invalid login credentials")) {
          setError("Email veya şifre hatalı. Lütfen kontrol edip tekrar deneyin.");
        } else {
          setError(err.message || "Geçersiz email veya şifre.");
        }
      } else {
        setError("Geçersiz email veya şifre ya da Supabase bağlantı hatası.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setResendFeedback("Lütfen önce e-posta alanını doldur.");
      return;
    }
    try {
      setResendLoading(true);
      setResendFeedback(null);
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
      });
      if (resendError) {
        throw resendError;
      }
      setResendFeedback(`${email} adresine yeni doğrulama bağlantısı gönderildi.`);
    } catch (err) {
      const message =
        err instanceof AuthError ? err.message : "Doğrulama maili gönderilemedi. Bir süre sonra tekrar deneyin.";
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
      const isMobile = isMobilePlatform();
      const nextParam = "/onboarding";
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextParam)}`
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
    <main className="relative min-h-screen overflow-hidden px-4 py-16 sm:px-6 flex items-center justify-center">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#01040d] via-[#050b1f] to-[#02010b]" />
      <div className="absolute -left-12 top-16 -z-10 h-72 w-72 rounded-full bg-primary-500/25 blur-[120px] animate-float" />
      <div className="absolute right-0 bottom-0 -z-10 h-80 w-80 rounded-full bg-fitness-orange/15 blur-[140px]" />
      <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),transparent_60%)]" />

      <div className="w-full max-w-md relative">
        <div className="absolute -top-12 right-0 hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Supabase ile güvenli giriş
        </div>
        <div className="bg-[#0f1424]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_80px_rgba(2,6,23,0.6)]">
          <div className="text-center mb-8 space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.4em] text-primary-200">
              NapiFit
            </p>
            <div>
              <h1 className="text-3xl font-bold text-white">Tekrar Hoş Geldin</h1>
              <p className="text-gray-400">Hesabına erişmek için giriş yap veya Google ile devam et.</p>
            </div>
          </div>

          <Suspense fallback={null}>
            <ErrorHandler />
          </Suspense>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
          {infoMessage && (
            <div className="mb-4 p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl text-primary-200 text-sm">
              {infoMessage}
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
              className="w-full bg-[linear-gradient(120deg,#7c3aed,#f97316,#06b6d4,#7c3aed)] animate-gradient text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-[0_20px_45px_rgba(17,15,45,0.5)] hover:shadow-[0_30px_70px_rgba(124,58,237,0.35)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

          {infoMessage && (
            <div className="mt-4 space-y-2">
              <button
                type="button"
                disabled={resendLoading}
                onClick={handleResendVerification}
                className="w-full rounded-xl border border-primary-500/40 bg-primary-500/10 px-4 py-3 text-sm font-semibold text-primary-200 hover:bg-primary-500/20 transition disabled:opacity-50"
              >
                {resendLoading ? "Gönderiliyor..." : "Doğrulama E-postasını Yeniden Gönder"}
              </button>
              {resendFeedback && (
                <p className="text-xs text-gray-400 text-center">{resendFeedback}</p>
              )}
            </div>
          )}

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
              className="mt-6 w-full border border-white/20 bg-white/95 text-gray-900 font-semibold py-3 rounded-2xl hover:bg-white transition-all duration-300 shadow-[0_15px_40px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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

          <div className="mt-6 rounded-2xl border border-gray-800/60 bg-gray-900/60 p-4 space-y-2 text-sm text-gray-400">
            <p className="text-gray-200 font-semibold">İpucu</p>
            <ul className="space-y-1">
              <li>• Doğrulama maili spam klasörüne düşmüş olabilir.</li>
              <li>• E-postan doğrulandıktan sonra giriş otomatik tamamlanır.</li>
              <li>• Google ile girişte doğrulama gerekmez.</li>
            </ul>
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
