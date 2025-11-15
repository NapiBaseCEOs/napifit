import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { redirect } from "next/navigation";
import DashboardContent from "../../../components/DashboardContent";

// getServerSession ve Prisma Edge Runtime'da sorun yaratabilir
// export const runtime = 'edge'; // Kaldırıldı

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Kullanıcı profil bilgilerini al
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || "" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      height: true,
      weight: true,
      age: true,
      gender: true,
      targetWeight: true,
      dailySteps: true,
      onboardingCompleted: true,
      createdAt: true,
    },
  });

  // Bugünkü kalori toplamını al
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayMeals = await prisma.meal.findMany({
    where: {
      userId: user?.id,
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const todayCalories = todayMeals.reduce((sum, meal) => sum + meal.totalCalories, 0);

  // Onboarding tamamlanmamışsa yönlendir
  if (!user?.onboardingCompleted) {
    redirect("/onboarding");
  }

  // BMI hesapla
  const calculateBMI = (height: number | null, weight: number | null): number | null => {
    if (!height || !weight) return null;
    const heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  // BMI kategorisi
  const getBMICategory = (bmi: number | null): { label: string; color: string } => {
    if (!bmi) return { label: "Hesaplanamadı", color: "gray" };
    if (bmi < 18.5) return { label: "Zayıf", color: "blue" };
    if (bmi < 25) return { label: "Normal", color: "green" };
    if (bmi < 30) return { label: "Fazla Kilolu", color: "yellow" };
    return { label: "Obez", color: "red" };
  };

  // Kilo farkı hesapla
  const weightDifference = user.weight && user.targetWeight 
    ? parseFloat((user.targetWeight - user.weight).toFixed(1))
    : null;

  const bmi = calculateBMI(user.height, user.weight);
  const bmiCategory = getBMICategory(bmi);

  return (
    <DashboardContent
      user={user}
      bmi={bmi}
      bmiCategory={bmiCategory}
      weightDifference={weightDifference}
      todayCalories={todayCalories}
      todayMeals={todayMeals}
    />
  );
}

