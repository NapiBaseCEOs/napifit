# 🚀 Supabase Manuel Migration

## ⚠️ ÖNEMLİ: Supabase'de tablolar yok!

Migration otomatik çalışmadı. Manuel olarak yapmanız gerekiyor.

## 📝 Adım 1: Supabase SQL Editor'den Migration Çalıştırın

1. **Supabase Dashboard'a gidin**: https://supabase.com/dashboard/project/eaibfqnjgkflvxdxfblw
2. **SQL Editor** sekmesine tıklayın (sol menüden)
3. **New Query** butonuna tıklayın
4. `supabase-migration.sql` dosyasının içeriğini kopyalayıp yapıştırın
5. **Run** butonuna tıklayın (veya `Ctrl+Enter`)

## ✅ Adım 2: Tabloları Kontrol Edin

1. **Database** > **Tables** sekmesine gidin
2. Şu tabloların oluşturulduğunu kontrol edin:
   - ✅ User
   - ✅ Account
   - ✅ Session
   - ✅ VerificationToken
   - ✅ HealthMetric
   - ✅ Workout
   - ✅ Meal

## 🔧 Adım 3: Kodları Düzeltin

Kodlar zaten düzeltildi:
- ✅ `prisma/schema.prisma` - PostgreSQL
- ✅ `src/lib/auth.ts` - Sadece Prisma
- ✅ `src/app/api/register/route.ts` - Sadece Prisma
- ✅ `src/app/api/profile/route.ts` - Sadece Prisma

## 🚀 Adım 4: Deploy Edin

```bash
git add -A
git commit -m "FIX: Supabase migration - tüm kodlar Prisma"
git push origin main
```

Vercel otomatik deploy edecek.

## 🧪 Adım 5: Test Edin

1. **Register**: https://napifit.vercel.app/register
2. **Login**: https://napifit.vercel.app/login
3. **Google OAuth**: "Google ile devam et" butonu

## ⚠️ Sorun Giderme

### Migration hatası alırsanız:
- SQL Editor'de hata mesajını kontrol edin
- Tablolar zaten varsa `CREATE TABLE IF NOT EXISTS` kullanıldı, sorun olmamalı

### Kayıt ol çalışmıyorsa:
- Vercel Dashboard > Environment Variables > `DATABASE_URL` kontrol edin
- Supabase Dashboard > Settings > Database > Connection string kontrol edin

