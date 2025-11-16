import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { queryOne, execute, testConnection } from "@/lib/turso";

// Force dynamic - Turso kullanıyoruz
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    // Turso bağlantı kontrolü
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { message: "Veritabanı bağlantı hatası. Lütfen daha sonra tekrar deneyin." },
        { status: 503 }
      );
    }

    // Kullanıcıyı bul
    const user = await queryOne<{
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
      emailVerified: string | null;
      createdAt: string;
      height: number | null;
      weight: number | null;
      age: number | null;
      gender: string | null;
      targetWeight: number | null;
      dailySteps: number | null;
      onboardingCompleted: number;
    }>(
      `SELECT id, name, email, image, emailVerified, createdAt, height, weight, age, gender, targetWeight, dailySteps, onboardingCompleted 
       FROM User WHERE email = ?`,
      [session.user.email.toLowerCase()]
    );

    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({
      ...user,
      emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
      createdAt: new Date(user.createdAt),
      onboardingCompleted: user.onboardingCompleted === 1,
    });
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

    // Turso bağlantı kontrolü
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { message: "Veritabanı bağlantı hatası. Lütfen daha sonra tekrar deneyin." },
        { status: 503 }
      );
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

    // Update query oluştur
    const setClauses: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      setClauses.push('name = ?');
      values.push(name || null);
    }
    if (password) {
      const passwordHash = await hash(password, 10);
      setClauses.push('password = ?');
      values.push(passwordHash);
    }
    if (height !== undefined) {
      setClauses.push('height = ?');
      values.push(height);
    }
    if (weight !== undefined) {
      setClauses.push('weight = ?');
      values.push(weight);
    }
    if (age !== undefined) {
      setClauses.push('age = ?');
      values.push(age);
    }
    if (gender !== undefined) {
      setClauses.push('gender = ?');
      values.push(gender || null);
    }
    if (targetWeight !== undefined) {
      setClauses.push('targetWeight = ?');
      values.push(targetWeight);
    }
    if (dailySteps !== undefined) {
      setClauses.push('dailySteps = ?');
      values.push(dailySteps);
    }

    if (setClauses.length === 0) {
      return NextResponse.json({ message: "Güncellenecek veri yok" }, { status: 400 });
    }

    setClauses.push('updatedAt = ?');
    values.push(new Date().toISOString());
    values.push(session.user.email.toLowerCase());

    // Update işlemi
    const success = await execute(
      `UPDATE User SET ${setClauses.join(', ')} WHERE email = ?`,
      values
    );

    if (!success) {
      return NextResponse.json(
        { message: "Profil güncellenirken hata oluştu" },
        { status: 500 }
      );
    }

    // Güncellenmiş kullanıcıyı getir
    const user = await queryOne<{
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
      height: number | null;
      weight: number | null;
      age: number | null;
      gender: string | null;
      targetWeight: number | null;
      dailySteps: number | null;
    }>(
      `SELECT id, name, email, image, height, weight, age, gender, targetWeight, dailySteps 
       FROM User WHERE email = ?`,
      [session.user.email.toLowerCase()]
    );

    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profil güncellendi", user });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Profil güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}
