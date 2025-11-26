"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function TermsPage() {
  const { t } = useLocale();

  const clauses = [
    {
      title: t("terms.clauses.service.title"),
      content: t("terms.clauses.service.content"),
    },
    {
      title: t("terms.clauses.user.title"),
      content: t("terms.clauses.user.content"),
    },
    {
      title: t("terms.clauses.security.title"),
      content: t("terms.clauses.security.content"),
    },
    {
      title: t("terms.clauses.thirdParty.title"),
      content: t("terms.clauses.thirdParty.content"),
    },
    {
      title: t("terms.clauses.changes.title"),
      content: t("terms.clauses.changes.content"),
    },
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-primary-300">{t("terms.title")}</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">{t("terms.subtitle")}</h1>
        <p className="mt-4 text-gray-300">
          {t("terms.description")}
        </p>
      </div>

      {clauses.map((clause, index) => (
        <section key={index} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
          <h2 className="text-xl font-semibold text-white">{clause.title}</h2>
          <p className="text-gray-300">{clause.content}</p>
        </section>
      ))}

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
        <h3 className="text-lg font-semibold text-white">{t("terms.contact.title")}</h3>
        <p className="text-gray-300">
          {t("terms.contact.content")}{" "}
          <a className="text-primary-200 underline" href={`mailto:${t("terms.contact.email")}`}>
            {t("terms.contact.email")}
          </a>{" "}
          {t("terms.contact.emailAction")}{" "}
          <Link href="/privacy" className="text-primary-200 underline">
            {t("terms.contact.privacyLink")}
          </Link>{" "}
          {t("terms.contact.privacyAction")}
        </p>
      </section>
    </main>
  );
}

