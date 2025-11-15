import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// getServerSession ve Prisma Edge Runtime'da sorun yaratabilir
// export const runtime = 'edge'; // Kaldırıldı

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  let user = null;
  try {
    user = await prisma.user.findUnique({
      where: { email: session.user?.email || "" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        height: true,
        weight: true,
        age: true,
        gender: true,
        targetWeight: true,
        dailySteps: true,
        onboardingCompleted: true,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
  }

  if (!user) {
    redirect("/login");
  }

  // BMI hesapla
  const calculateBMI = (height: number | null, weight: number | null): number | null => {
    if (!height || !weight) return null;
    const heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  const bmi = calculateBMI(user.height, user.weight);

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 bg-[#0a0a0a]">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Profil</h1>
            <p className="mt-1 text-sm text-gray-400">Hesap bilgileriniz ve istatistikleriniz</p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-gray-600 hover:bg-gray-800 hover:text-white"
          >
            Dashboard
          </Link>
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
                <h2 className="text-2xl font-semibold text-white">{user.name || "İsimsiz Kullanıcı"}</h2>
                <p className="mt-1 text-sm text-gray-400">{user.email}</p>
                {user.emailVerified && (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Doğrulanmış
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg border border-gray-800/60 bg-gray-900/50 p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Üyelik</p>
                  <p className="mt-1 text-sm font-medium text-gray-200">
                    {new Date(user.createdAt).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                {user.height && (
                  <div className="rounded-lg border border-gray-800/60 bg-gray-900/50 p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Boy</p>
                    <p className="mt-1 text-sm font-medium text-gray-200">{user.height} cm</p>
                  </div>
                )}
                {user.weight && (
                  <div className="rounded-lg border border-gray-800/60 bg-gray-900/50 p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Kilo</p>
                    <p className="mt-1 text-sm font-medium text-gray-200">{user.weight} kg</p>
                  </div>
                )}
                {bmi && (
                  <div className="rounded-lg border border-gray-800/60 bg-gray-900/50 p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">BMI</p>
                    <p className="mt-1 text-sm font-medium text-gray-200">{bmi}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {(user.age || user.gender || user.targetWeight || user.dailySteps) && (
          <div className="grid gap-4 sm:grid-cols-2">
            {user.age && (
              <div className="rounded-xl border border-gray-800/60 bg-gray-900/80 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Yaş</p>
                <p className="mt-2 text-2xl font-semibold text-white">{user.age}</p>
              </div>
            )}
            {user.gender && (
              <div className="rounded-xl border border-gray-800/60 bg-gray-900/80 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Cinsiyet</p>
                <p className="mt-2 text-2xl font-semibold text-white capitalize">
                  {user.gender === "male" ? "Erkek" : user.gender === "female" ? "Kadın" : "Diğer"}
                </p>
              </div>
            )}
            {user.targetWeight && (
              <div className="rounded-xl border border-gray-800/60 bg-gray-900/80 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Hedef Kilo</p>
                <p className="mt-2 text-2xl font-semibold text-white">{user.targetWeight} kg</p>
              </div>
            )}
            {user.dailySteps && (
              <div className="rounded-xl border border-gray-800/60 bg-gray-900/80 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Günlük Adım</p>
                <p className="mt-2 text-2xl font-semibold text-white">{user.dailySteps.toLocaleString()}</p>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Hızlı İşlemler</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:border-gray-600 hover:bg-gray-800 hover:text-white"
            >
              Dashboard'a Dön
            </Link>
            <Link
              href="/health"
              className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-purple-500/30 transition-transform hover:-translate-y-0.5"
            >
              Sağlık Takibi
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

