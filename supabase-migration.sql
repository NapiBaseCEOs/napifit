-- Supabase Migration SQL
-- Bu SQL'i Supabase SQL Editor'den çalıştırın

-- User table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "age" INTEGER,
    "gender" TEXT,
    "targetWeight" DOUBLE PRECISION,
    "dailySteps" INTEGER,
    "activityLevel" TEXT,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Account table
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- Session table
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- VerificationToken table
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("token")
);

-- HealthMetric table
CREATE TABLE IF NOT EXISTS "HealthMetric" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION,
    "bodyFat" DOUBLE PRECISION,
    "muscleMass" DOUBLE PRECISION,
    "water" DOUBLE PRECISION,
    "bmi" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthMetric_pkey" PRIMARY KEY ("id")
);

-- Workout table
CREATE TABLE IF NOT EXISTS "Workout" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "duration" INTEGER,
    "calories" DOUBLE PRECISION,
    "distance" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- Meal table
CREATE TABLE IF NOT EXISTS "Meal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "foods" JSONB NOT NULL,
    "totalCalories" DOUBLE PRECISION NOT NULL,
    "mealType" TEXT,
    "notes" TEXT,
    "recommendations" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE INDEX IF NOT EXISTS "HealthMetric_userId_createdAt_idx" ON "HealthMetric"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "Workout_userId_createdAt_idx" ON "Workout"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "Meal_userId_createdAt_idx" ON "Meal"("userId", "createdAt");

-- Foreign keys
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "HealthMetric" ADD CONSTRAINT "HealthMetric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

