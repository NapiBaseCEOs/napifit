import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const workoutSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.enum(["cardio", "strength", "flexibility", "sports", "other"]),
  duration: z.number().min(1).max(1440).optional().nullable(),
  calories: z.number().min(0).max(10000).optional().nullable(),
  distance: z.number().min(0).max(1000).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

// GET - Tüm egzersizleri listele
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const workouts = await prisma.workout.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 100),
      skip: offset,
    });

    const total = await prisma.workout.count({
      where: { userId: user.id },
    });

    return NextResponse.json({
      workouts,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Workouts fetch error:", error);
    return NextResponse.json(
      {
        message: "Egzersizler alınırken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

// POST - Yeni egzersiz ekle
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = workoutSchema.parse(body);

    const workout = await prisma.workout.create({
      data: {
        userId: user.id,
        name: validatedData.name,
        type: validatedData.type,
        duration: validatedData.duration ?? null,
        calories: validatedData.calories ?? null,
        distance: validatedData.distance ?? null,
        notes: validatedData.notes ?? null,
      },
    });

    return NextResponse.json(
      {
        message: "Egzersiz başarıyla eklendi",
        workout,
      },
      { status: 201 }
    );
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

    console.error("Workout create error:", error);
    return NextResponse.json(
      {
        message: "Egzersiz eklenirken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

