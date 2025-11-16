# 🔧 Vercel Google OAuth Fix

## ✅ Yapılan Düzeltmeler

### 1. NEXTAUTH_URL Düzeltmesi
- Vercel için `VERCEL_URL` environment variable'ı kontrol ediliyor
- `napibase.com` yerine `napifit.vercel.app` kullanılıyor
- Otomatik URL algılama eklendi

### 2. Auth Sistemi - Sadece Turso
- `authorize` callback: Sadece Turso kullanıyor
- `signIn` callback: Sadece Turso kullanıyor
- `jwt` callback: Sadece Turso kullanıyor
- D1 ve Prisma fallback'leri kaldırıldı

### 3. Cookie Ayarları
- Domain ayarları kaldırıldı (Vercel için gerekli değil)
- `sameSite: "lax"` kullanılıyor
- Secure cookies HTTPS için aktif

## 🎯 Google Cloud Console Ayarları

### Authorized Redirect URIs
Vercel deployment URL'inizi ekleyin:
```
https://napifit.vercel.app/api/auth/callback/google
```

**VEYA** custom domain kullanıyorsanız:
```
https://napibase.com/api/auth/callback/google
```

## ⚙️ Vercel Environment Variables

Şu environment variables'ların **MUTLAKA** ayarlanmış olması gerekiyor:

1. **NEXTAUTH_URL** = `https://napifit.vercel.app` (veya custom domain)
2. **GOOGLE_CLIENT_ID** = Google Cloud Console'dan alınan Client ID
3. **GOOGLE_CLIENT_SECRET** = Google Cloud Console'dan alınan Client Secret
4. **AUTH_SECRET** = Güçlü bir secret (openssl rand -base64 32 ile oluşturulabilir)
5. **TURSO_DATABASE_URL** = Turso database URL
6. **TURSO_AUTH_TOKEN** = Turso auth token

## 🧪 Test

Deployment tamamlandıktan sonra:
1. https://napifit.vercel.app/login adresine gidin
2. "Google ile devam et" butonuna tıklayın
3. Google hesap seçme ekranı gelmeli
4. Hesap seçtikten sonra onboarding sayfasına yönlendirilmeli

## ❌ Hata Durumunda

Eğer `error=google` hatası alıyorsanız:
1. Google Cloud Console'da Authorized Redirect URIs kontrol edin
2. Vercel environment variables kontrol edin
3. Vercel deployment loglarını kontrol edin

