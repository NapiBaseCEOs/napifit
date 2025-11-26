"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/i18n/LocaleProvider";

type EditableProfile = {
  name: string | null;
  height: number | null;
  weight: number | null;
  age: number | null;
  gender: "male" | "female" | "other" | null;
  targetWeight: number | null;
  dailySteps: number | null;
  showPublicProfile?: boolean | null;
  showCommunityStats?: boolean | null;
};

type Props = {
  profile: EditableProfile;
};

export default function ProfileEditForm({ profile }: Props) {
  const router = useRouter();
  const { t } = useLocale();

  const FIELD_LABELS = {
    name: t("profile.edit.fieldLabels.name"),
    height: t("profile.edit.fieldLabels.height"),
    weight: t("profile.edit.fieldLabels.weight"),
    age: t("profile.edit.fieldLabels.age"),
    gender: t("profile.edit.fieldLabels.gender"),
    targetWeight: t("profile.edit.fieldLabels.targetWeight"),
    dailySteps: t("profile.edit.fieldLabels.dailySteps"),
    showPublicProfile: t("profile.edit.fieldLabels.showPublicProfile"),
    showCommunityStats: t("profile.edit.fieldLabels.showCommunityStats"),
  } as const;

  const genderOptions = [
    { value: "male", label: t("profile.edit.genderOptions.male") },
    { value: "female", label: t("profile.edit.genderOptions.female") },
    { value: "other", label: t("profile.edit.genderOptions.other") },
  ];
  const [formData, setFormData] = useState({
    name: profile.name ?? "",
    height: profile.height?.toString() ?? "",
    weight: profile.weight?.toString() ?? "",
    age: profile.age?.toString() ?? "",
    gender: profile.gender ?? "",
    targetWeight: profile.targetWeight?.toString() ?? "",
    dailySteps: profile.dailySteps?.toString() ?? "",
    showPublicProfile: profile.showPublicProfile ?? true,
    showCommunityStats: profile.showCommunityStats ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const changeSummary = useMemo(() => {
    const changes: { label: string; value: string }[] = [];
    (Object.keys(formData) as (keyof typeof formData)[]).forEach((key) => {
      // Skip privacy settings in change summary
      if (key === "showPublicProfile" || key === "showCommunityStats") {
        const previous = profile[key] ?? true;
        const current = formData[key];
        if (current !== previous) {
          changes.push({ 
            label: FIELD_LABELS[key as keyof typeof FIELD_LABELS] || key, 
            value: current ? t("profile.edit.status.open") : t("profile.edit.status.closed")
          });
        }
        return;
      }

      const previous = profile[key];
      const current = formData[key];
      const previousText = previous == null ? "" : previous.toString();
      if (current !== (previousText ?? "")) {
        const valueText =
          key === "gender" && current
            ? current === "male"
              ? t("profile.edit.genderOptions.male")
              : current === "female"
                ? t("profile.edit.genderOptions.female")
                : t("profile.edit.genderOptions.other")
            : current || "—";
        changes.push({ label: FIELD_LABELS[key as keyof typeof FIELD_LABELS] || key, value: valueText });
      }
    });
    return changes;
  }, [formData, profile]);

  const isDirty = changeSummary.length > 0;

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
      setMessage(t("profile.edit.noChanges"));
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
      showPublicProfile: formData.showPublicProfile,
      showCommunityStats: formData.showCommunityStats,
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
        throw new Error(data?.message ?? t("profile.edit.error"));
      }

      setMessage(t("profile.edit.success"));
      router.refresh();
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err instanceof Error ? err.message : t("profile.edit.errorUpdate"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{t("profile.edit.title")}</p>
          <h3 className="text-xl font-semibold text-white">{t("profile.edit.subtitle")}</h3>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-gray-400">{FIELD_LABELS.name}</label>
            <input
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              className="w-full rounded-xl border border-white/10 bg-[#0b1325]/70 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40"
              placeholder={t("form.name")}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-gray-400">{FIELD_LABELS.height} (cm)</label>
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
            <label className="text-xs uppercase tracking-wide text-gray-400">{FIELD_LABELS.weight} (kg)</label>
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
            <label className="text-xs uppercase tracking-wide text-gray-400">{FIELD_LABELS.age}</label>
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
            <label className="text-xs uppercase tracking-wide text-gray-400">{FIELD_LABELS.gender}</label>
            <select
              value={formData.gender}
              onChange={handleChange("gender")}
              className="w-full rounded-xl border border-white/10 bg-[#0b1325]/70 px-4 py-3 text-sm text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40"
            >
              <option value="">{t("profile.edit.genderOptions.notSelected")}</option>
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-gray-400">{FIELD_LABELS.targetWeight} (kg)</label>
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
            <label className="text-xs uppercase tracking-wide text-gray-400">{FIELD_LABELS.dailySteps}</label>
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

        {/* Privacy Settings */}
        <div className="rounded-xl border border-white/10 bg-[#0b1325]/50 p-4 space-y-4">
          <h4 className="text-sm font-semibold text-white">{t("profile.edit.privacy.title")}</h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium text-gray-300">{FIELD_LABELS.showPublicProfile}</span>
                <p className="text-xs text-gray-500 mt-0.5">{t("profile.edit.privacy.publicDesc")}</p>
              </div>
              <input
                type="checkbox"
                checked={formData.showPublicProfile}
                onChange={(e) => setFormData((prev) => ({ ...prev, showPublicProfile: e.target.checked }))}
                className="h-5 w-5 rounded border-gray-700 bg-gray-800 text-primary-500 focus:ring-2 focus:ring-primary-500/40"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium text-gray-300">{FIELD_LABELS.showCommunityStats}</span>
                <p className="text-xs text-gray-500 mt-0.5">{t("profile.edit.privacy.statsDesc")}</p>
              </div>
              <input
                type="checkbox"
                checked={formData.showCommunityStats}
                onChange={(e) => setFormData((prev) => ({ ...prev, showCommunityStats: e.target.checked }))}
                className="h-5 w-5 rounded border-gray-700 bg-gray-800 text-primary-500 focus:ring-2 focus:ring-primary-500/40"
              />
            </label>
          </div>
        </div>

        {changeSummary.length > 0 && (
          <div className="rounded-2xl border border-primary-500/30 bg-primary-500/10 px-4 py-3 space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-primary-200">{t("profile.edit.changes.title")}</p>
            <ul className="text-sm text-white/90 space-y-1">
              {changeSummary.map((change) => (
                <li key={change.label} className="flex justify-between gap-4">
                  <span className="text-gray-300">{change.label}</span>
                  <span className="font-semibold text-white">{change.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

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
            {saving ? t("profile.edit.saving") : t("profile.edit.save")}
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
                showPublicProfile: profile.showPublicProfile ?? true,
                showCommunityStats: profile.showCommunityStats ?? true,
              });
              setError(null);
              setMessage(null);
            }}
            className="rounded-2xl border border-white/20 px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {t("profile.edit.reset")}
          </button>
        </div>
        <p className="text-xs text-gray-500">
          {t("profile.edit.note")}
        </p>
      </form>
    </div>
  );
}

