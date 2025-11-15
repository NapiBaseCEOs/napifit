import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// getServerSession NextAuth kullandığı için Edge Runtime'da çalışmaz
// export const runtime = 'edge'; // Kaldırıldı

const onboardingSchema = z.object({
  height: z.number().min(100).max(250), // cm
  weight: z.number().min(30).max(300), // kg
  age: z.number().min(13).max(120), // yaş
  gender: z.enum(["male", "female", "other"]),
  targetWeight: z.number().min(30).max(300), // kg
  dailySteps: z.number().min(0).max(100000), // adım
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = onboardingSchema.parse(body);

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        height: validatedData.height,
        weight: validatedData.weight,
        age: validatedData.age,
        gender: validatedData.gender,
        targetWeight: validatedData.targetWeight,
        dailySteps: validatedData.dailySteps,
        onboardingCompleted: true,
      },
      select: {
        id: true,
        onboardingCompleted: true,
      },
    });

    return NextResponse.json({
      message: "Profil bilgileri kaydedildi",
      user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Geçersiz veri",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Onboarding error:", error);
    
    // Daha detaylı hata mesajı
    const errorMessage = error instanceof Error ? error.message : "Bilgiler kaydedilirken hata oluştu";
    
    return NextResponse.json(
      { 
        message: errorMessage,
        details: process.env.NODE_ENV === "development" ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

