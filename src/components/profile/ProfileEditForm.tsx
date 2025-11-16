"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

type EditableProfile = {
  name: string | null;
  height: number | null;
  weight: number | null;
  age: number | null;
  gender: "male" | "female" | "other" | null;
  targetWeight: number | null;
  dailySteps: number | null;
};

type Props = {
  profile: EditableProfile;
};

const genderOptions = [
  { value: "male", label: "Erkek" },
  { value: "female", label: "Kadın" },
  { value: "other", label: "Diğer" },
];

export default function ProfileEditForm({ profile }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: profile.name ?? "",
    height: profile.height?.toString() ?? "",
    weight: profile.weight?.toString() ?? "",
    age: profile.age?.toString() ?? "",
    gender: profile.gender ?? "",
    targetWeight: profile.targetWeight?.toString() ?? "",
    dailySteps: profile.dailySteps?.toString() ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isDirty = useMemo(() => {
    return (
      formData.name !== (profile.name ?? "") ||
      formData.height !== (profile.height?.toString() ?? "") ||
      formData.weight !== (profile.weight?.toString() ?? "") ||
      formData.age !== (profile.age?.toString() ?? "") ||
      formData.gender !== (profile.gender ?? "") ||
      formData.targetWeight !== (profile.targetWeight?.toString() ?? "") ||
      formData.dailySteps !== (profile.dailySteps?.toString() ?? "")
    );
  }, [formData, profile]);

  const handleChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    setError(null);
    setMessage(null);
  };

  const parseNumber = (value: string) => {
    if (!value.trim()) return null;
    const num = Number(value);
    return Number.isNaN(num) ? null : num;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isDirty) {
      setMessage("Değişiklik bulunmuyor.");
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    const payload = {
      name: formData.name.trim() || undefined,
      height: parseNumber(formData.height),
      weight: parseNumber(formData.weight),
      age: parseNumber(formData.age),
      gender: formData.gender ? (formData.gender as "male" | "female" | "other") : null,
      targetWeight: parseNumber(formData.targetWeight),
      dailySteps: parseNumber(formData.dailySteps),
    };

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message ?? "Profil güncellenemedi.");
      }

      setMessage("Profil bilgilerin güncellendi.");
      router.refresh();
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err instanceof Error ? err.message : "Profil güncellenirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Profilini Güncelle</p>
          <h3 className="text-xl font-semibold text-white">Kişisel Bilgiler</h3>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-gray-400">Ad Soyad</label>
            <input
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              className="w-full rounded-xl border border-white/10 bg-[#0b1325]/70 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40"
              placeholder="Adını güncelle"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-gray-400">Boy (cm)</label>
            <input
              type="number"
              min={50}
              max={260}
              value={formData.height}
              onChange={handleChange("height")}
              className="w-full rounded-xl border border-white/10 bg-[#0b1325]/70 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40"
              placeholder="180"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-gray-400">Kilo (kg)</label>
            <input
              type="number"
              min={20}
              max={300}
              value={formData.weight}
              onChange={handleChange("weight")}
              className="w-full rounded-xl border border-white/10 bg-[#0b1325]/70 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40"
              placeholder="75"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-gray-400">Yaş</label>
            <input
              type="number"
              min={13}
              max={120}
              value={formData.age}
              onChange={handleChange("age")}
              className="w-full rounded-xl border border-white/10 bg-[#0b1325]/70 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40"
              placeholder="27"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-gray-400">Cinsiyet</label>
            <select
              value={formData.gender}
              onChange={handleChange("gender")}
              className="w-full rounded-xl border border-white/10 bg-[#0b1325]/70 px-4 py-3 text-sm text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40"
            >
              <option value="">Seçilmedi</option>
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-gray-400">Hedef Kilo (kg)</label>
            <input
              type="number"
              min={20}
              max={300}
              value={formData.targetWeight}
              onChange={handleChange("targetWeight")}
              className="w-full rounded-xl border border-white/10 bg-[#0b1325]/70 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40"
              placeholder="68"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs uppercase tracking-wide text-gray-400">Günlük Adım Hedefi</label>
            <input
              type="number"
              min={0}
              max={200000}
              value={formData.dailySteps}
              onChange={handleChange("dailySteps")}
              className="w-full rounded-xl border border-white/10 bg-[#0b1325]/70 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40"
              placeholder="8000"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>
        )}
        {message && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            {message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={saving || !isDirty}
            className="flex-1 rounded-2xl bg-[linear-gradient(120deg,#7c3aed,#f97316,#06b6d4)] animate-gradient px-4 py-3 text-sm font-semibold text-white shadow-[0_15px_45px_rgba(15,23,42,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => {
              setFormData({
                name: profile.name ?? "",
                height: profile.height?.toString() ?? "",
                weight: profile.weight?.toString() ?? "",
                age: profile.age?.toString() ?? "",
                gender: profile.gender ?? "",
                targetWeight: profile.targetWeight?.toString() ?? "",
                dailySteps: profile.dailySteps?.toString() ?? "",
              });
              setError(null);
              setMessage(null);
            }}
            className="rounded-2xl border border-white/20 px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            Sıfırla
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Güncellemeler Supabase üzerinde güvenli olarak saklanır. Sağlık verilerini paylaşmadan önce kişisel sınırlarınızı göz önünde bulundurun.
        </p>
      </form>
    </div>
  );
}

