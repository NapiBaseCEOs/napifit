import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

// Prisma ve bcryptjs Edge Runtime'da sorun yaratabilir
// export const runtime = 'edge'; // Kaldırıldı

export async function POST(request: Request) {
  try {
    // Database bağlantısını test et
    await prisma.$connect();
  } catch (dbError) {
    console.error("Database connection error:", dbError);
    return NextResponse.json(
      { 
        message: "Veritabanına bağlanılamadı. Lütfen daha sonra tekrar deneyin.",
        error: "DATABASE_CONNECTION_ERROR"
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { firstName, lastName, dateOfBirth, email, password } = body as { 
      firstName?: string; 
      lastName?: string; 
      dateOfBirth?: string; 
      email?: string; 
      password?: string 
    };
    
    // Validasyon
    if (!firstName || !firstName.trim()) {
      return NextResponse.json({ message: "Ad zorunludur" }, { status: 400 });
    }
    if (!lastName || !lastName.trim()) {
      return NextResponse.json({ message: "Soyad zorunludur" }, { status: 400 });
    }
    if (!dateOfBirth) {
      return NextResponse.json({ message: "Doğum tarihi zorunludur" }, { status: 400 });
    }
    if (!email || !password) {
      return NextResponse.json({ message: "Email ve şifre zorunludur" }, { status: 400 });
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

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ message: "Bu email zaten kayıtlı" }, { status: 409 });
    }

    const passwordHash = await hash(password, 10);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    
    await prisma.user.create({
      data: { 
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: fullName, // Geriye dönük uyumluluk için
        dateOfBirth: birthDate,
        email, 
        password: passwordHash 
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Register error:", error);
    // Daha detaylı hata mesajı (development'ta)
    const errorMessage = error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu";
    
    // Prisma hatası kontrolü
    if (error instanceof Error && error.message.includes("Prisma")) {
      return NextResponse.json(
        { 
          message: "Veritabanı hatası. Lütfen daha sonra tekrar deneyin.",
          error: "DATABASE_ERROR"
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        message: errorMessage,
        details: process.env.NODE_ENV === "development" ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

