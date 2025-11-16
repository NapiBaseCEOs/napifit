import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
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

// GET - Tek sağlık metrik getir
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const healthMetric = await prisma.healthMetric.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!healthMetric) {
      return NextResponse.json({ message: "Sağlık metrik bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(healthMetric);
  } catch (error) {
    console.error("Health metric fetch error:", error);
    return NextResponse.json(
      {
        message: "Sağlık metrik alınırken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

// PUT - Sağlık metrik güncelle
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Metriğin kullanıcıya ait olduğunu kontrol et
    const existingMetric = await prisma.healthMetric.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingMetric) {
      return NextResponse.json({ message: "Sağlık metrik bulunamadı" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = healthMetricSchema.parse(body);

    const updateData: any = {};
    if (validatedData.weight !== undefined) updateData.weight = validatedData.weight;
    if (validatedData.bodyFat !== undefined) updateData.bodyFat = validatedData.bodyFat;
    if (validatedData.muscleMass !== undefined) updateData.muscleMass = validatedData.muscleMass;
    if (validatedData.water !== undefined) updateData.water = validatedData.water;
    if (validatedData.bmi !== undefined) updateData.bmi = validatedData.bmi;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "Güncellenecek veri yok" }, { status: 400 });
    }

    const healthMetric = await prisma.healthMetric.update({
      where: { id: params.id },
      data: updateData,
    });

    // Eğer kilo güncellendiyse, kullanıcının ana kilosunu da güncelle
    if (validatedData.weight !== undefined) {
      await prisma.user.update({
        where: { id: user.id },
        data: { weight: validatedData.weight },
      });
    }

    return NextResponse.json({
      message: "Sağlık metrik güncellendi",
      healthMetric,
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

    console.error("Health metric update error:", error);
    return NextResponse.json(
      {
        message: "Sağlık metrik güncellenirken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

// DELETE - Sağlık metrik sil
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Metriğin kullanıcıya ait olduğunu kontrol et
    const existingMetric = await prisma.healthMetric.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingMetric) {
      return NextResponse.json({ message: "Sağlık metrik bulunamadı" }, { status: 404 });
    }

    await prisma.healthMetric.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Sağlık metrik silindi",
    });
  } catch (error) {
    console.error("Health metric delete error:", error);
    return NextResponse.json(
      {
        message: "Sağlık metrik silinirken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

