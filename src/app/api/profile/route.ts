import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
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

    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { message: "Profil bilgileri alınırken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      password,
      height,
      weight,
      age,
      gender,
      targetWeight,
      dailySteps,
    } = body as {
      name?: string;
      password?: string;
      height?: number | null;
      weight?: number | null;
      age?: number | null;
      gender?: string | null;
      targetWeight?: number | null;
      dailySteps?: number | null;
    };

    // Update data hazırla
    const updateData: any = {};
    if (name !== undefined) updateData.name = name || null;
    if (password) {
      updateData.password = await hash(password, 10);
    }
    if (height !== undefined) updateData.height = height;
    if (weight !== undefined) updateData.weight = weight;
    if (age !== undefined) updateData.age = age;
    if (gender !== undefined) updateData.gender = gender || null;
    if (targetWeight !== undefined) updateData.targetWeight = targetWeight;
    if (dailySteps !== undefined) updateData.dailySteps = dailySteps;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "Güncellenecek veri yok" }, { status: 400 });
    }

    // Update işlemi
    const user = await prisma.user.update({
      where: { email: session.user.email.toLowerCase() },
      data: updateData,
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
      },
    });

    return NextResponse.json({ message: "Profil güncellendi", user });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Profil güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}
