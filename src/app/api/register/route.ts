import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { queryOne, execute, testConnection } from "@/lib/turso";

// Force dynamic - Turso kullanıyoruz
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // Turso bağlantı kontrolü
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { message: "Veritabanı bağlantı hatası. Lütfen daha sonra tekrar deneyin." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, dateOfBirth, email, password } = body as {
      firstName?: string;
      lastName?: string;
      dateOfBirth?: string;
      email?: string;
      password?: string;
    };

    // Validasyon
    if (!firstName?.trim()) {
      return NextResponse.json({ message: "Ad zorunludur" }, { status: 400 });
    }
    if (!lastName?.trim()) {
      return NextResponse.json({ message: "Soyad zorunludur" }, { status: 400 });
    }
    if (!dateOfBirth) {
      return NextResponse.json({ message: "Doğum tarihi zorunludur" }, { status: 400 });
    }
    if (!email?.trim() || !password) {
      return NextResponse.json({ message: "Email ve şifre zorunludur" }, { status: 400 });
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ message: "Geçerli bir email adresi giriniz" }, { status: 400 });
    }

    // Şifre uzunluk kontrolü
    if (password.length < 6) {
      return NextResponse.json({ message: "Şifre en az 6 karakter olmalıdır" }, { status: 400 });
    }

    // Doğum tarihi validasyonu
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;

    if (actualAge < 18) {
      return NextResponse.json({ message: "18 yaşından küçükler kayıt olamaz" }, { status: 400 });
    }

    // Email kontrolü - kullanıcı zaten var mı?
    const existingUser = await queryOne<{ id: string }>(
      'SELECT id FROM User WHERE email = ?',
      [email.trim().toLowerCase()]
    );

    if (existingUser) {
      return NextResponse.json({ message: "Bu email zaten kayıtlı" }, { status: 409 });
    }

    // Password hash
    const passwordHash = await hash(password, 10);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();

    // Kullanıcı oluştur
    const success = await execute(
      `INSERT INTO User (id, email, password, name, firstName, lastName, dateOfBirth, createdAt, updatedAt, onboardingCompleted) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        email.trim().toLowerCase(),
        passwordHash,
        fullName,
        firstName.trim(),
        lastName.trim(),
        birthDate.toISOString(),
        now,
        now,
        0 // false
      ]
    );

    if (!success) {
      return NextResponse.json(
        { message: "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
