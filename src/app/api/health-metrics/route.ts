import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const healthMetricSchema = z.object({
  weight: z.number().min(30).max(300).optional().nullable(),
  bodyFat: z.number().min(0).max(100).optional().nullable(),
  muscleMass: z.number().min(0).max(200).optional().nullable(),
  water: z.number().min(0).max(100).optional().nullable(),
  bmi: z.number().min(10).max(60).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

// GET - Tüm sağlık metriklerini listele
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

    const healthMetrics = await prisma.healthMetric.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 100),
      skip: offset,
    });

    const total = await prisma.healthMetric.count({
      where: { userId: user.id },
    });

    return NextResponse.json({
      healthMetrics,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Health metrics fetch error:", error);
    return NextResponse.json(
      {
        message: "Sağlık metrikleri alınırken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

// POST - Yeni sağlık metrik ekle
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
    const validatedData = healthMetricSchema.parse(body);

    // En az bir metrik olmalı
    if (
      !validatedData.weight &&
      !validatedData.bodyFat &&
      !validatedData.muscleMass &&
      !validatedData.water &&
      !validatedData.bmi
    ) {
      return NextResponse.json(
        { message: "En az bir metrik değeri gerekli" },
        { status: 400 }
      );
    }

    const healthMetric = await prisma.healthMetric.create({
      data: {
        userId: user.id,
        weight: validatedData.weight ?? null,
        bodyFat: validatedData.bodyFat ?? null,
        muscleMass: validatedData.muscleMass ?? null,
        water: validatedData.water ?? null,
        bmi: validatedData.bmi ?? null,
        notes: validatedData.notes ?? null,
      },
    });

    // Eğer kilo güncellendiyse, kullanıcının ana kilosunu da güncelle
    if (validatedData.weight) {
      await prisma.user.update({
        where: { id: user.id },
        data: { weight: validatedData.weight },
      });
    }

    return NextResponse.json(
      {
        message: "Sağlık metrik başarıyla eklendi",
        healthMetric,
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

    console.error("Health metric create error:", error);
    return NextResponse.json(
      {
        message: "Sağlık metrik eklenirken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

