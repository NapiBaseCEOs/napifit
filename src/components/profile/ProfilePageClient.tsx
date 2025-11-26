"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCountryFlag } from "@/lib/country-flags";
import ProfileEditForm from "./ProfileEditForm";
import CommunityStats from "./CommunityStats";

interface ProfilePageClientProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    emailVerified: boolean;
    createdAt: Date;
    height: number | null;
    weight: number | null;
    age: number | null;
    gender: string | null;
    targetWeight: number | null;
    dailySteps: number | null;
    countryCode: string | null;
  };
  isOwnProfile: boolean;
  showPublicProfile: boolean;
  isAdminProfile: boolean;
  isFounderProfile: boolean;
}

export default function ProfilePageClient({
  user,
  isOwnProfile,
  showPublicProfile,
  isAdminProfile,
  isFounderProfile,
}: ProfilePageClientProps) {
  const { t } = useLocale();

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 bg-[#03060f]">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">{t("profile.title")}</h1>
            <p className="mt-1 text-sm text-gray-400">
              {isOwnProfile ? t("profile.yourInfo") : `${user.name || t("common.user")} ${t("profile.userInfo")}`}
            </p>
          </div>
          {isOwnProfile ? (
            <Link
              href="/dashboard"
              className="rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-gray-600 hover:bg-gray-800 hover:text-white"
            >
              {t("profile.backToDashboard")}
            </Link>
          ) : (
            <Link
              href="/community"
              className="rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-gray-600 hover:bg-gray-800 hover:text-white"
            >
              {t("profile.backToCommunity")}
            </Link>
          )}
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6 shadow-xl backdrop-blur sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="relative h-24 w-24 sm:h-32 sm:w-32">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  fill
                  className="rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-2xl font-semibold text-white sm:text-3xl">
                  {(user.name || user.email || "U")[0].toUpperCase()}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-4 text-center sm:text-left">
              <div>
                <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-semibold text-white">{user.name || t("common.user")}</h2>
                    {user.countryCode && (
                      <span className="text-2xl" title={user.countryCode}>
                        {getCountryFlag(user.countryCode)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {isFounderProfile && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/40 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-100">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3 7h7l-5.5 4.5L18 22l-6-3.5L6 22l1.5-8.5L2 9h7z" />
                        </svg>
                        {t("common.founder")}
                      </span>
                    )}
                    {isAdminProfile && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-100">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3 7h7l-5.5 4.5L18 22l-6-3.5L6 22l1.5-8.5L2 9h7z" />
                        </svg>
                        {t("common.admin")}
                      </span>
                    )}
                  </div>
                </div>
                {user.email && <p className="mt-1 text-sm text-gray-400">{user.email}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        {isOwnProfile && (
          <ProfileEditForm
            profile={{
              name: user.name ?? "",
              height: user.height ?? null,
              weight: user.weight ?? null,
              age: user.age ?? null,
              gender: (user.gender as "male" | "female" | "other" | null) ?? null,
              targetWeight: user.targetWeight ?? null,
              dailySteps: user.dailySteps ?? null,
              showPublicProfile: showPublicProfile,
              showCommunityStats: true,
            }}
          />
        )}

        {/* Community Stats */}
        {showPublicProfile && <CommunityStats userId={user.id} />}
      </div>
    </main>
  );
}

