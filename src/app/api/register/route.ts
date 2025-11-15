import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { getDB, queryOne, execute } from "@/lib/d1";

// D1 Database kullanımı - Cloudflare Pages için optimize edildi
// export const runtime = 'edge'; // Kaldırıldı

export async function POST(request: Request) {
  // D1 Database bağlantısını test et
  const db = getDB(request);
  
  if (!db) {
    // D1 yoksa Prisma'ya fallback yap (development için)
    try {
      const { prisma } = await import("../../../lib/prisma");
      const dbConnected = await prisma.$connect().then(() => true).catch(() => false);
      
      if (!dbConnected) {
        return NextResponse.json(
          { 
            message: "Veritabanına bağlanılamadı. Lütfen daha sonra tekrar deneyin.",
            error: "DATABASE_CONNECTION_ERROR"
          },
          { status: 503 }
        );
      }
      
      // Prisma ile devam et (fallback)
      return await registerWithPrisma(request, prisma);
    } catch (err) {
      return NextResponse.json(
        { 
          message: "Veritabanına bağlanılamadı. Lütfen daha sonra tekrar deneyin.",
          error: "DATABASE_CONNECTION_ERROR"
        },
        { status: 503 }
      );
    }
  }
  
  // D1 ile devam et (production)
  return await registerWithD1(request);
}

async function registerWithD1(request: Request) {
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

    // D1: Email kontrolü
    const existingUser = await queryOne<{ id: string }>(
      'SELECT id FROM User WHERE email = ?',
      [email],
      request
    );
    
    if (existingUser) {
      return NextResponse.json({ message: "Bu email zaten kayıtlı" }, { status: 409 });
    }

    // Password hash
    const passwordHash = await hash(password, 10);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // D1: Kullanıcı oluştur
    const success = await execute(
      `INSERT INTO User (id, email, password, name, firstName, lastName, dateOfBirth, createdAt, updatedAt, onboardingCompleted) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        email,
        passwordHash,
        fullName,
        firstName.trim(),
        lastName.trim(),
        birthDate.toISOString(),
        new Date().toISOString(),
        new Date().toISOString(),
        0 // false
      ],
      request
    );

    if (!success) {
      return NextResponse.json(
        { 
          message: "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.",
          error: "DATABASE_ERROR"
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Register error:", error);
    const errorMessage = error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu";
    
    return NextResponse.json(
      { 
        message: errorMessage,
        details: process.env.NODE_ENV === "development" ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

// Fallback: Prisma ile kayıt (development için)
async function registerWithPrisma(request: Request, prisma: any) {
  // Request body zaten okunmuş olabilir, clone edip oku
  const clonedRequest = request.clone();
  try {
    const body = await clonedRequest.json();
    const { firstName, lastName, dateOfBirth, email, password } = body as { 
      firstName?: string; 
      lastName?: string; 
      dateOfBirth?: string; 
      email?: string; 
      password?: string 
    };
    
    // Validasyon (aynı)
    if (!firstName || !firstName.trim() || !lastName || !lastName.trim() || !dateOfBirth || !email || !password) {
      return NextResponse.json({ message: "Tüm alanlar zorunludur" }, { status: 400 });
    }
    
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
        name: fullName,
        dateOfBirth: birthDate,
        email, 
        password: passwordHash 
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Register error (Prisma):", error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : "Kayıt sırasında bir hata oluştu",
        error: "DATABASE_ERROR"
      },
      { status: 500 }
    );
  }
}

