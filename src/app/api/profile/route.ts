import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { queryOne as tursoQueryOne, testConnection as tursoTestConnection } from "@/lib/turso";
import { getDB, queryOne } from "@/lib/d1";

// getServerSession NextAuth kullandığı için Edge Runtime'da çalışmaz
// export const runtime = 'edge'; // Kaldırıldı

// Force dynamic rendering - session ve headers kullanıyoruz
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    // 1. Turso Database kontrolü (Vercel production için)
    if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
      const tursoAvailable = await tursoTestConnection();
      if (tursoAvailable) {
        try {
          const user = await tursoQueryOne<{
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
            [session.user.email]
          );

          if (user) {
            return NextResponse.json({
              ...user,
              emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
              createdAt: new Date(user.createdAt),
              onboardingCompleted: user.onboardingCompleted === 1,
            });
          }
        } catch (tursoError) {
          console.error("Turso query error in profile GET:", tursoError);
          // Fallback to D1 or Prisma
        }
      }
    }

    // 2. D1 Database kontrolü (Cloudflare için)
    const db = getDB(request);
    if (db) {
      try {
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
          [session.user.email],
          request
        );

        if (user) {
          return NextResponse.json({
            ...user,
            emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
            createdAt: new Date(user.createdAt),
            onboardingCompleted: user.onboardingCompleted === 1,
          });
        }
      } catch (d1Error) {
        console.error("D1 query error in profile GET:", d1Error);
        // Fallback to Prisma
      }
    }

    // 3. Fallback: Prisma kullan (development için)
    const dbConnected = await prisma.$connect().then(() => true).catch(() => false);
    
    if (!dbConnected) {
      console.warn("⚠️ Database not connected, returning 503");
      return NextResponse.json(
        { 
          message: "Veritabanına bağlanılamadı. Lütfen daha sonra tekrar deneyin.",
          error: "DATABASE_CONNECTION_ERROR"
        },
        { status: 503 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        height: true,
        weight: true,
        age: true,
        gender: true,
        targetWeight: true,
        dailySteps: true,
        onboardingCompleted: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    
    return NextResponse.json(
      { 
        message: "Profil bilgileri alınırken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined
      },
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

    const body = await request.json();
    const { 
      name, 
      password, 
      height, 
      weight, 
      age, 
      gender, 
      targetWeight, 
      dailySteps 
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

    const updateData: any = {};
    if (name !== undefined) updateData.name = name || null;
    if (password) {
      updateData.password = await hash(password, 10);
    }
    if (height !== undefined) updateData.height = height;
    if (weight !== undefined) updateData.weight = weight;
    if (age !== undefined) updateData.age = age;
    if (gender !== undefined) updateData.gender = gender || null;
    if (targetWeight !== undefined) updateData.targetWeight = targetWeight;
    if (dailySteps !== undefined) updateData.dailySteps = dailySteps;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "Güncellenecek veri yok" }, { status: 400 });
    }

    // 1. Turso Database kontrolü (Vercel production için)
    if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
      const tursoAvailable = await tursoTestConnection();
      if (tursoAvailable) {
        try {
          const { execute: tursoExecute, queryOne: tursoQueryOne } = await import("@/lib/turso");
          
          // Update query oluştur
          const setClauses: string[] = [];
          const values: any[] = [];
          
          if (updateData.name !== undefined) {
            setClauses.push('name = ?');
            values.push(updateData.name);
          }
          if (updateData.password) {
            setClauses.push('password = ?');
            values.push(updateData.password);
          }
          if (updateData.height !== undefined) {
            setClauses.push('height = ?');
            values.push(updateData.height);
          }
          if (updateData.weight !== undefined) {
            setClauses.push('weight = ?');
            values.push(updateData.weight);
          }
          if (updateData.age !== undefined) {
            setClauses.push('age = ?');
            values.push(updateData.age);
          }
          if (updateData.gender !== undefined) {
            setClauses.push('gender = ?');
            values.push(updateData.gender);
          }
          if (updateData.targetWeight !== undefined) {
            setClauses.push('targetWeight = ?');
            values.push(updateData.targetWeight);
          }
          if (updateData.dailySteps !== undefined) {
            setClauses.push('dailySteps = ?');
            values.push(updateData.dailySteps);
          }
          
          setClauses.push('updatedAt = ?');
          values.push(new Date().toISOString());
          values.push(session.user.email);

          const success = await tursoExecute(
            `UPDATE User SET ${setClauses.join(', ')} WHERE email = ?`,
            values
          );

          if (success) {
            const user = await tursoQueryOne<{
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
              [session.user.email]
            );

            if (user) {
              return NextResponse.json({ message: "Profil güncellendi", user });
            }
          }
        } catch (tursoError) {
          console.error("Turso update error in profile PUT:", tursoError);
          // Fallback to D1 or Prisma
        }
      }
    }

    // 2. D1 Database kontrolü (Cloudflare için)
    const db = getDB(request);
    if (db) {
      try {
        const { execute } = await import("@/lib/d1");
        
        // Update query oluştur
        const setClauses: string[] = [];
        const values: any[] = [];
        
        if (updateData.name !== undefined) {
          setClauses.push('name = ?');
          values.push(updateData.name);
        }
        if (updateData.password) {
          setClauses.push('password = ?');
          values.push(updateData.password);
        }
        if (updateData.height !== undefined) {
          setClauses.push('height = ?');
          values.push(updateData.height);
        }
        if (updateData.weight !== undefined) {
          setClauses.push('weight = ?');
          values.push(updateData.weight);
        }
        if (updateData.age !== undefined) {
          setClauses.push('age = ?');
          values.push(updateData.age);
        }
        if (updateData.gender !== undefined) {
          setClauses.push('gender = ?');
          values.push(updateData.gender);
        }
        if (updateData.targetWeight !== undefined) {
          setClauses.push('targetWeight = ?');
          values.push(updateData.targetWeight);
        }
        if (updateData.dailySteps !== undefined) {
          setClauses.push('dailySteps = ?');
          values.push(updateData.dailySteps);
        }
        
        setClauses.push('updatedAt = ?');
        values.push(new Date().toISOString());
        values.push(session.user.email);

        const success = await execute(
          `UPDATE User SET ${setClauses.join(', ')} WHERE email = ?`,
          values,
          request
        );

        if (success) {
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
            [session.user.email],
            request
          );

          if (user) {
            return NextResponse.json({ message: "Profil güncellendi", user });
          }
        }
      } catch (d1Error) {
        console.error("D1 update error in profile PUT:", d1Error);
        // Fallback to Prisma
      }
    }

    // 3. Fallback: Prisma kullan (development için)
    try {
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

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        height: true,
        weight: true,
        age: true,
        gender: true,
        targetWeight: true,
        dailySteps: true,
      },
    });

    return NextResponse.json({ message: "Profil güncellendi", user });
  } catch (error) {
    console.error("Profile update error:", error);
    
    return NextResponse.json(
      { 
        message: "Profil güncellenirken hata oluştu",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

