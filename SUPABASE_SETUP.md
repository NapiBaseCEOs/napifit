# 🚀 Supabase Setup - Hızlı Başlangıç

## ✅ Supabase'e Geçiş Tamamlandı!

Tüm kodlar Supabase PostgreSQL için güncellendi. Şimdi sadece setup yapmanız gerekiyor.

## 📝 Adım 1: Supabase Projesi Oluştur

1. https://supabase.com adresine gidin
2. "Start your project" → GitHub ile giriş
3. "New Project" → "New organization" (ilk kez)
4. Proje bilgileri:
   - **Name**: napifit
   - **Database Password**: Güçlü bir şifre oluşturun (kaydedin!)
   - **Region**: En yakın region (örn: Europe West)
5. "Create new project" → 2-3 dakika bekleyin

## 📝 Adım 2: Database URL Al

1. Supabase Dashboard > **Project Settings** (sol altta ⚙️)
2. **Database** sekmesi
3. **Connection string** bölümünde **URI** seçin
4. Şu formatta URL göreceksiniz:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
5. `[YOUR-PASSWORD]` kısmını oluşturduğunuz şifre ile değiştirin
6. URL'i kopyalayın

## 📝 Adım 3: Vercel Environment Variables

Vercel Dashboard > napifit > Settings > Environment Variables:

### Ekle/Değiştir:
- **DATABASE_URL** = Supabase'den aldığınız PostgreSQL URL
  ```
  postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
  ```

### Sil (artık gerekli değil):
- ~~TURSO_DATABASE_URL~~
- ~~TURSO_AUTH_TOKEN~~

### Aynı Kalacak:
- NEXTAUTH_URL
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- AUTH_SECRET

## 📝 Adım 4: Migration

Terminal'de çalıştırın:

```bash
cd "C:\Users\Administrator\.cursor\worktrees\NapiBase\VtwMH"
npx prisma generate
npx prisma db push
```

Bu komutlar:
1. Prisma Client'ı PostgreSQL için generate eder
2. Schema'yı Supabase'e push eder (tabloları oluşturur)

## ✅ Test

1. Vercel'e deploy edin (otomatik olacak)
2. https://napifit.vercel.app/register - Kayıt ol
3. https://napifit.vercel.app/login - Giriş yap
4. Google OAuth - Test et

## 🎉 Sonuç

Artık:
- ✅ Register çalışacak
- ✅ Login çalışacak
- ✅ Google OAuth çalışacak
- ✅ Tüm API'ler çalışacak
- ✅ Supabase Dashboard'dan verileri görebilirsiniz

## 📊 Supabase Dashboard

https://supabase.com/dashboard > napifit > **Table Editor**

Buradan tüm verileri görebilir, manuel düzenleyebilirsiniz.

