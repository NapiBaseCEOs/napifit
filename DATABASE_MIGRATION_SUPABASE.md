# 🗄️ Supabase Database Migration Guide

## ✅ Neden Supabase?

- ✅ PostgreSQL tabanlı (güvenilir, standart)
- ✅ Ücretsiz tier (500MB database, 2GB bandwidth)
- ✅ Vercel ile mükemmel uyum
- ✅ Prisma ile direkt çalışır
- ✅ Kolay setup
- ✅ Real-time özellikler (ileride kullanılabilir)

## 📝 Adım 1: Supabase Hesabı Oluştur

1. https://supabase.com adresine gidin
2. "Start your project" butonuna tıklayın
3. GitHub ile giriş yapın
4. Yeni proje oluşturun:
   - **Name**: napifit
   - **Database Password**: Güçlü bir şifre oluşturun (kaydedin!)
   - **Region**: En yakın region seçin
5. Proje oluşturulmasını bekleyin (2-3 dakika)

## 📝 Adım 2: Database URL Al

1. Supabase Dashboard > Project Settings > Database
2. **Connection string** bölümünde **URI** seçin
3. Şu formatta bir URL göreceksiniz:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
4. Bu URL'i kopyalayın

## 📝 Adım 3: Vercel Environment Variables

Vercel Dashboard > napifit > Settings > Environment Variables:

1. **DATABASE_URL** = Supabase'den aldığınız PostgreSQL URL
2. **TURSO_DATABASE_URL** = SİL (artık gerekli değil)
3. **TURSO_AUTH_TOKEN** = SİL (artık gerekli değil)

Diğer environment variables aynı kalacak:
- NEXTAUTH_URL
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- AUTH_SECRET

## 📝 Adım 4: Prisma Schema Güncelle

Prisma schema PostgreSQL için güncellenecek (otomatik yapılacak).

## 📝 Adım 5: Migration

Migration otomatik yapılacak.

## ✅ Sonuç

Supabase'e geçiş tamamlandıktan sonra:
- ✅ Register çalışacak
- ✅ Login çalışacak
- ✅ Google OAuth çalışacak
- ✅ Tüm API'ler çalışacak

