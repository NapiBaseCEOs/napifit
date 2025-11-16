import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const mealSchema = z.object({
  imageUrl: z.string().url().optional().nullable(),
  foods: z.array(z.object({
    name: z.string(),
    calories: z.number().min(0),
    quantity: z.string().optional(),
  })).optional(),
  totalCalories: z.number().min(0).max(50000).optional(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  recommendations: z.any().optional().nullable(),
});

// GET - Tek öğün getir
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

    const meal = await prisma.meal.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!meal) {
      return NextResponse.json({ message: "Öğün bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(meal);
  } catch (error) {
    console.error("Meal fetch error:", error);
    return NextResponse.json(
      {
        message: "Öğün alınırken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

// PUT - Öğün güncelle
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

    // Öğünün kullanıcıya ait olduğunu kontrol et
    const existingMeal = await prisma.meal.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingMeal) {
      return NextResponse.json({ message: "Öğün bulunamadı" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = mealSchema.parse(body);

    const updateData: any = {};
    if (validatedData.imageUrl !== undefined) updateData.imageUrl = validatedData.imageUrl;
    if (validatedData.foods !== undefined) updateData.foods = validatedData.foods as any;
    if (validatedData.totalCalories !== undefined) updateData.totalCalories = validatedData.totalCalories;
    if (validatedData.mealType !== undefined) updateData.mealType = validatedData.mealType;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes;
    if (validatedData.recommendations !== undefined) updateData.recommendations = validatedData.recommendations;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "Güncellenecek veri yok" }, { status: 400 });
    }

    const meal = await prisma.meal.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Öğün güncellendi",
      meal,
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

    console.error("Meal update error:", error);
    return NextResponse.json(
      {
        message: "Öğün güncellenirken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

// DELETE - Öğün sil
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

    // Öğünün kullanıcıya ait olduğunu kontrol et
    const existingMeal = await prisma.meal.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingMeal) {
      return NextResponse.json({ message: "Öğün bulunamadı" }, { status: 404 });
    }

    await prisma.meal.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Öğün silindi",
    });
  } catch (error) {
    console.error("Meal delete error:", error);
    return NextResponse.json(
      {
        message: "Öğün silinirken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

