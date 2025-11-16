import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const workoutSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  type: z.enum(["cardio", "strength", "flexibility", "sports", "other"]).optional(),
  duration: z.number().min(1).max(1440).optional().nullable(),
  calories: z.number().min(0).max(10000).optional().nullable(),
  distance: z.number().min(0).max(1000).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

// GET - Tek egzersiz getir
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

    const workout = await prisma.workout.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!workout) {
      return NextResponse.json({ message: "Egzersiz bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(workout);
  } catch (error) {
    console.error("Workout fetch error:", error);
    return NextResponse.json(
      {
        message: "Egzersiz alınırken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

// PUT - Egzersiz güncelle
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

    // Egzersizin kullanıcıya ait olduğunu kontrol et
    const existingWorkout = await prisma.workout.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingWorkout) {
      return NextResponse.json({ message: "Egzersiz bulunamadı" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = workoutSchema.parse(body);

    const updateData: any = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.type !== undefined) updateData.type = validatedData.type;
    if (validatedData.duration !== undefined) updateData.duration = validatedData.duration;
    if (validatedData.calories !== undefined) updateData.calories = validatedData.calories;
    if (validatedData.distance !== undefined) updateData.distance = validatedData.distance;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "Güncellenecek veri yok" }, { status: 400 });
    }

    const workout = await prisma.workout.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Egzersiz güncellendi",
      workout,
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

    console.error("Workout update error:", error);
    return NextResponse.json(
      {
        message: "Egzersiz güncellenirken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

// DELETE - Egzersiz sil
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

    // Egzersizin kullanıcıya ait olduğunu kontrol et
    const existingWorkout = await prisma.workout.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingWorkout) {
      return NextResponse.json({ message: "Egzersiz bulunamadı" }, { status: 404 });
    }

    await prisma.workout.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Egzersiz silindi",
    });
  } catch (error) {
    console.error("Workout delete error:", error);
    return NextResponse.json(
      {
        message: "Egzersiz silinirken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

