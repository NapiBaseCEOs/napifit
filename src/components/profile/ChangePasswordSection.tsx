"use client";

import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Spinner from "../icons/Spinner";

export default function ChangePasswordSection() {
    const supabase = useSupabaseClient();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validation
        if (newPassword.length < 6) {
            setError("Şifre en az 6 karakter olmalıdır");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Şifreler eşleşmiyor");
            return;
        }

        setLoading(true);

        try {
            // Supabase automatically sends email verification for password change
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (updateError) throw updateError;

            setSuccess(true);
            setNewPassword("");
            setConfirmPassword("");

            // Auto-hide success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);
        } catch (err: any) {
            console.error("Password change error:", err);
            setError(err.message || "Şifre değiştirilemedi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6 space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-white">Şifre Değiştir</h3>
                <p className="text-sm text-gray-400 mt-1">
                    Şifrenizi değiştirmek için email adresinize onay kodu gönderilecektir
                </p>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl text-primary-200 text-sm">
                    <p className="font-semibold mb-1">✅ Şifre başarıyla değiştirildi!</p>
                    <p>Email adresinize onay kodu gönderildi. Lütfen kontrol edin.</p>
                </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                        Yeni Şifre
                    </label>
                    <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="En az 6 karakter"
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                        Şifre Tekrar
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="Şifreyi tekrar girin"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/50 hover:shadow-primary-500/70 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Spinner className="h-5 w-5" />
                            <span>Değiştiriliyor...</span>
                        </>
                    ) : (
                        "Şifreyi Değiştir"
                    )}
                </button>
            </form>

            <div className="text-xs text-gray-500 bg-gray-800/30 p-3 rounded-lg">
                <p className="font-semibold text-gray-400 mb-1">ℹ️ Bilgi:</p>
                <p>Şifre değişikliği için email adresinize bir onay kodu gönderilecektir. Değişikliği onaylamak için email'inizdeki linke tıklayın.</p>
            </div>
        </div>
    );
}
