# 🔧 Vercel Environment Variables Setup

## ✅ Supabase Database URL

```
postgresql://postgres:Sefatrtr178289*@db.eaibfqnjgkflvxdxfblw.supabase.co:5432/postgres
```

## 📝 Vercel Dashboard'da Manuel Ekleme

1. Vercel Dashboard'a gidin: https://vercel.com/dashboard
2. **napifit** projesini seçin
3. **Settings** > **Environment Variables**
4. **Add New** butonuna tıklayın
5. Şu bilgileri girin:
   - **Key**: `DATABASE_URL`
   - **Value**: `postgresql://postgres:Sefatrtr178289*@db.eaibfqnjgkflvxdxfblw.supabase.co:5432/postgres`
   - **Environment**: Tümünü seçin (Production, Preview, Development)
6. **Save** butonuna tıklayın

## 🔄 Redeploy

Environment variable ekledikten sonra:
1. Vercel Dashboard > napifit > **Deployments**
2. En son deployment'ın yanındaki **⋯** (üç nokta) > **Redeploy**
3. Veya yeni bir commit push edin

## ✅ Migration

Migration otomatik olarak Vercel build sırasında çalışacak (`prisma generate` build script'inde var).

VEYA manuel olarak:
```bash
npx prisma generate
npx prisma db push
```

## 🧪 Test

Deployment tamamlandıktan sonra:
1. https://napifit.vercel.app/register - Kayıt ol
2. https://napifit.vercel.app/login - Giriş yap
3. Google OAuth - Test et

