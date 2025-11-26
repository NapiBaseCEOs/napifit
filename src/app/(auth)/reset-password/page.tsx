"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "../../../components/icons/Spinner";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function ResetPasswordPage() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if we have a valid session (from email link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Geçersiz veya süresi dolmuş link. Lütfen yeni bir şifre sıfırlama isteği gönderin.");
      }
    };
    checkSession();
  }, [supabase]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError(err.message || "Şifre güncellenemedi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-16 sm:px-6 flex items-center justify-center">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#01040d] via-[#050b1f] to-[#02010b]" />
      <div className="absolute -left-12 top-16 -z-10 h-72 w-72 rounded-full bg-primary-500/25 blur-[120px] animate-float" />
      <div className="absolute right-0 bottom-0 -z-10 h-80 w-80 rounded-full bg-fitness-orange/15 blur-[140px]" />
      <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),transparent_60%)]" />

      <div className="w-full max-w-md relative">
        <div className="bg-[#0f1424]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_80px_rgba(2,6,23,0.6)]">
          <div className="text-center mb-8 space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.4em] text-primary-200">
              NapiFit
            </p>
            <div>
              <h1 className="text-3xl font-bold text-white">Yeni Şifre Belirle</h1>
              <p className="text-gray-400">Yeni şifrenizi girin</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {success ? (
            <div className="space-y-6">
              <div className="p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl text-primary-200 text-sm">
                <p className="font-semibold mb-2">✅ Şifre başarıyla güncellendi!</p>
                <p>Giriş sayfasına yönlendiriliyorsunuz...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6" autoComplete="on">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                  Yeni Şifre
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={6}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="En az 6 karakter"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-300 mb-2">
                  Şifre Tekrar
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={6}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Şifreyi tekrar girin"
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
                    <span>Güncelleniyor...</span>
                  </>
                ) : (
                  "Şifreyi Güncelle"
                )}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-400">
            <Link href="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
              ← Giriş Sayfasına Dön
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}


