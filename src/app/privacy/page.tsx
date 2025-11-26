"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function PrivacyPage() {
  const { t } = useLocale();

  const sections = [
    {
      title: t("privacy.sections.data.title"),
      body: [
        t("privacy.sections.data.items.0"),
        t("privacy.sections.data.items.1"),
        t("privacy.sections.data.items.2"),
      ],
    },
    {
      title: t("privacy.sections.usage.title"),
      body: [
        t("privacy.sections.usage.items.0"),
        t("privacy.sections.usage.items.1"),
        t("privacy.sections.usage.items.2"),
      ],
    },
    {
      title: t("privacy.sections.storage.title"),
      body: [
        t("privacy.sections.storage.items.0"),
        t("privacy.sections.storage.items.1"),
        t("privacy.sections.storage.items.2"),
      ],
    },
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-primary-300">{t("privacy.title")}</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">{t("privacy.subtitle")}</h1>
        <p className="mt-4 text-gray-300">
          {t("privacy.description")}
        </p>
      </div>

      {sections.map((section, index) => (
        <section
          key={index}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3 backdrop-blur-xl shadow-[0_20px_60px_rgba(3,4,12,0.45)]"
        >
          <h2 className="text-xl font-semibold text-white">{section.title}</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            {section.body.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        </section>
      ))}

      <section className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-6 space-y-3">
        <h3 className="text-lg font-semibold text-white">{t("privacy.rights.title")}</h3>
        <p className="text-gray-200">
          {t("privacy.rights.content")}{" "}
          <a className="text-primary-200 underline" href={`mailto:${t("privacy.rights.email")}`}>
            {t("privacy.rights.email")}
          </a>{" "}
          {t("privacy.rights.responseTime")}
        </p>
        <p className="text-sm text-gray-400">
          {t("privacy.rights.moreInfo")}{" "}
          <Link href="/terms" className="text-primary-200 underline">
            {t("privacy.rights.termsLink")}
          </Link>{" "}
          {t("privacy.rights.moreInfoAction")}
        </p>
      </section>
    </main>
  );
}

