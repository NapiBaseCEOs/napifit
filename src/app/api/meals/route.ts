import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const mealSchema = z.object({
  imageUrl: z.string().url().optional().nullable(),
  foods: z.array(z.object({
    name: z.string(),
    calories: z.number().min(0),
    quantity: z.string().optional(),
  })),
  totalCalories: z.number().min(0).max(50000),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  recommendations: z.any().optional().nullable(),
});

// GET - Tüm öğünleri listele
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
    const date = searchParams.get("date"); // YYYY-MM-DD formatında

    const where: any = { userId: user.id };
    
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const meals = await prisma.meal.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 100),
      skip: offset,
    });

    const total = await prisma.meal.count({
      where,
    });

    return NextResponse.json({
      meals,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Meals fetch error:", error);
    return NextResponse.json(
      {
        message: "Öğünler alınırken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

// POST - Yeni öğün ekle
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
    const validatedData = mealSchema.parse(body);

    const meal = await prisma.meal.create({
      data: {
        userId: user.id,
        imageUrl: validatedData.imageUrl ?? null,
        foods: validatedData.foods as any,
        totalCalories: validatedData.totalCalories,
        mealType: validatedData.mealType ?? null,
        notes: validatedData.notes ?? null,
        recommendations: validatedData.recommendations ?? null,
      },
    });

    return NextResponse.json(
      {
        message: "Öğün başarıyla eklendi",
        meal,
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

    console.error("Meal create error:", error);
    return NextResponse.json(
      {
        message: "Öğün eklenirken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

