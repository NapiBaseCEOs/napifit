import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail, isFounderEmail } from "@/config/admins";
import { WATER_PROFILE_ID, WATER_PROFILE_PLACEHOLDER } from "@/lib/community/water-reminder";
import ProfilePageClient from "@/components/profile/ProfilePageClient";
import { getTranslation } from "@/lib/i18n/translations";
import { defaultLocale } from "@/lib/i18n/locales";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: { userId?: string };
};

export default async function ProfilePage({ searchParams }: Props) {
  const supabase = createSupabaseServerClient();
  const cookieStore = cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || defaultLocale) as any;
  const t = (key: string) => getTranslation(locale, key as any);
  
  // Kullanıcı kontrolü - dashboard ile aynı pattern
  const {
    data: { user: authUser },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("User fetch error:", userError);
    redirect("/login");
  }

  if (!authUser) {
    redirect("/login");
  }

  const requestedUserId = searchParams.userId;
  const normalizedUserId =
    requestedUserId && requestedUserId.toLowerCase() === "mert-demir"
      ? WATER_PROFILE_ID
      : requestedUserId;

  // Eğer userId parametresi varsa, o kullanıcının profilini göster, yoksa kendi profilini göster
  const targetUserId = normalizedUserId || authUser.id;
  const isOwnProfile = targetUserId === authUser.id;

  // Başka birinin profilini görüntülüyorsak ve gizliyse, sadece admin görebilir veya public profile false ise kısıtlı bilgi göster
  // Kendi profilini görüntülüyorsak normal supabase client, başkasınınkini görüntülüyorsak admin client
  const profileClient = isOwnProfile ? supabase : supabaseAdmin;
  
  const { data: profileData, error: profileError } = await profileClient
    .from("profiles")
    .select(
      "id,email,full_name,avatar_url,created_at,height_cm,weight_kg,age,gender,target_weight_kg,daily_steps,show_public_profile,show_community_stats,country_code"
    )
    .eq("id", targetUserId)
    .maybeSingle();

  const renderProfileNotFound = (title = "Profil bulunamadı", description = "Aradığınız kullanıcı profili mevcut değil.") => (
    <main className="min-h-screen px-4 py-8 sm:px-6 bg-[#03060f]">
      <div className="mx-auto max-w-3xl space-y-6 text-center">
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
        <p className="text-sm text-gray-400">{description}</p>
        <Link
          href="/community"
          className="inline-flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-gray-600 hover:bg-gray-800 hover:text-white"
        >
          Topluluğa Dön
        </Link>
      </div>
    </main>
  );

  const shouldUseWaterPlaceholder = !isOwnProfile && targetUserId === WATER_PROFILE_ID;
  const resolvedProfileData = profileData ?? (shouldUseWaterPlaceholder ? (WATER_PROFILE_PLACEHOLDER as any) : null);

  // Eğer kendi profilini görüntülüyorsak ve profil yoksa, onboarding'e yönlendir
  if (isOwnProfile) {
    if (profileError) {
      console.error("Profile fetch error:", profileError);
      // Veritabanı hatası değilse (örn: profil yoksa) onboarding'e yönlendir
      if (profileError.code === 'PGRST116') {
        // PGRST116 = no rows returned
        redirect("/onboarding");
      } else {
        // Diğer hatalar için dashboard'a yönlendir
        console.error("Unexpected profile error:", profileError);
        redirect("/dashboard");
      }
    }

    if (!profileData) {
      // Profil bulunamadıysa onboarding'e yönlendir
      redirect("/onboarding");
    }
  } else {
    // Başka birinin profilini görüntülüyorsak
    if (profileError && profileError.code !== "PGRST116") {
      console.error("Profile fetch error:", profileError);
      return renderProfileNotFound("Profil yüklenemedi", "Beklenmeyen bir hata oluştu.");
    }

    if (!resolvedProfileData) {
      return renderProfileNotFound();
    }
  }

  // ProfileData artık tanımlı olmalı
  if (!resolvedProfileData) {
    return isOwnProfile ? redirect("/onboarding") : renderProfileNotFound();
  }

  const profile = resolvedProfileData as {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
    height_cm: number | null;
    weight_kg: number | null;
    age: number | null;
    gender: "male" | "female" | "other" | null;
    target_weight_kg: number | null;
    daily_steps: number | null;
    show_public_profile: boolean | null;
    show_community_stats: boolean | null;
    country_code: string | null;
  };

  const showPublicProfile = profile.show_public_profile ?? true;
  const isAdminProfile = isAdminEmail(profile.email);
  const isFounderProfile = isFounderEmail(profile.email);

  // Başka birinin profilini görüntülüyorsak ve gizliyse
  if (!isOwnProfile && showPublicProfile === false) {
    // Gizli profil - sadece genel bilgileri göster
    return (
      <main className="min-h-screen px-4 py-8 sm:px-6 bg-[#03060f]">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white">{t("profile.title")}</h1>
              <p className="mt-1 text-sm text-gray-400">{t("profile.hidden")}</p>
            </div>
            <Link
              href="/community"
              className="rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-gray-600 hover:bg-gray-800 hover:text-white"
            >
              {t("profile.backToCommunity")}
            </Link>
          </div>
          <div className="rounded-2xl border border-gray-800/60 bg-gray-900/80 p-8 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-800 mx-auto mb-4 text-3xl">
              {profile.full_name?.[0]?.toUpperCase() || "?"}
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">{t("profile.hiddenUser")}</h2>
            <p className="text-gray-400">{t("profile.hiddenDesc")}</p>
          </div>
        </div>
      </main>
    );
  }

  const user = {
    id: profile.id,
    name: profile.full_name,
    email: isOwnProfile ? profile.email : (showPublicProfile ? profile.email : null), // Email sadece kendi profilinde veya public profil ise
    image: profile.avatar_url,
    emailVerified: isOwnProfile ? Boolean(authUser.email_confirmed_at) : false,
    createdAt: new Date(profile.created_at),
    height: profile.height_cm,
    weight: profile.weight_kg,
    age: profile.age,
    gender: profile.gender,
    targetWeight: profile.target_weight_kg,
    dailySteps: profile.daily_steps,
    countryCode: profile.country_code,
  };

  return (
    <ProfilePageClient
      user={user}
      isOwnProfile={isOwnProfile}
      showPublicProfile={showPublicProfile}
      isAdminProfile={isAdminProfile}
      isFounderProfile={isFounderProfile}
    />
  );
}
