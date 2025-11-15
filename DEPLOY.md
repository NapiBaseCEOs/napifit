# 🚀 NapiFit Deployment Rehberi

Bu rehber NapiFit uygulamasını Cloudflare Pages'e deploy etmek için gerekli adımları açıklar.

## 📋 İçindekiler

1. [GitHub Repository Hazırlığı](#1-github-repository-hazırlığı)
2. [Cloudflare D1 Database Kurulumu](#2-cloudflare-d1-database-kurulumu)
3. [Cloudflare Pages Projesi Oluşturma](#3-cloudflare-pages-projesi-oluşturma)
4. [Environment Variables Ayarlama](#4-environment-variables-ayarlama)
5. [GitHub Actions Workflow](#5-github-actions-workflow)
6. [Deploy Sonrası Kontroller](#6-deploy-sonrası-kontroller)

## 1. GitHub Repository Hazırlığı

### Adım 1: Repository Oluşturma

1. GitHub'da yeni bir repository oluşturun:
   - Repository adı: `napifit` (veya istediğiniz ad)
   - Public veya Private seçin
   - README, .gitignore ve LICENSE eklemeyin (zaten var)

### Adım 2: Local Repository'yi GitHub'a Push Etme

```bash
# Git repository başlat (eğer yoksa)
git init

# Tüm dosyaları stage'e ekle
git add .

# İlk commit
git commit -m "Initial commit: NapiFit health tracking app"

# GitHub repository'yi remote olarak ekle
git remote add origin https://github.com/KULLANICI_ADI/napifit.git

# Main branch'e push et
git branch -M main
git push -u origin main
```

## 2. Cloudflare D1 Database Kurulumu

### Adım 1: D1 Database Oluşturma

**Yöntem 1: Cloudflare Dashboard'dan**

1. [Cloudflare Dashboard](https://dash.cloudflare.com/)'a gidin
2. Sol menüden **Storage & Databases** > **D1 SQL database** seçin
3. **Create Database** butonuna tıklayın
4. Database adı: `napifit-db`
5. **Create** butonuna tıklayın
6. Oluşturulan database'in **Database ID**'sini kopyalayın

**Yöntem 2: Wrangler CLI ile**

```bash
npm run d1:create
```

Komut çıktısında `database_id` bulunur.

### Adım 2: Wrangler.toml Güncelleme

`wrangler.toml` dosyasını açın ve database ID'yi ekleyin:

```toml
[[d1_databases]]
binding = "DB"
database_name = "napifit-db"
database_id = "YOUR_DATABASE_ID_HERE"  # <-- Buraya ID'yi ekleyin
```

### Adım 3: D1 Migration'ları Uygulama

```bash
# Production D1'e migration uygula
npm run d1:migrate:remote
```

## 3. Cloudflare Pages Projesi Oluşturma

### Adım 1: Pages Projesi Oluşturma

1. Cloudflare Dashboard > **Pages** > **Create a project**
2. **Connect to Git** seçeneğini seçin
3. GitHub hesabınızı bağlayın (gerekirse)
4. Repository'yi seçin: `napifit`

### Adım 2: Build Ayarları

**Framework preset:** Next.js

**Build settings:**
- **Build command:** `npm run cloudflare:build`
- **Build output directory:** `.open-next`
- **Root directory:** `/` (boş bırakın)

**Environment variables:**
- Build sırasında ekleyeceğiz (sonraki adım)

### Adım 3: Deploy

**Create project** butonuna tıklayın.

## 4. Environment Variables Ayarlama

### Cloudflare Pages Dashboard'dan

1. Proje sayfasında **Settings** > **Environment variables** sekmesine gidin

2. Şu environment variable'ları ekleyin:

#### Production Variables:

```
AUTH_SECRET=your-strong-random-secret-minimum-32-chars
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_URL=https://napifit.pages.dev
NEXT_PUBLIC_APP_URL=https://napifit.pages.dev
```

**Not:** `DATABASE_URL` gerekmez! D1 binding otomatik olarak `wrangler.toml`'dan okunur.

### GitHub Secrets (GitHub Actions için)

Repository Settings > Secrets and variables > Actions

Şu secrets'ları ekleyin:

```
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
AUTH_SECRET=your-auth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_URL=https://napifit.pages.dev
```

**Cloudflare API Token Oluşturma:**

1. Cloudflare Dashboard > **My Profile** > **API Tokens**
2. **Create Token** > **Edit Cloudflare Workers** template
3. Permissions:
   - Account: **Cloudflare Pages:Edit**
   - Zone: **Zone Settings:Read, Zone:Read**
4. **Continue to summary** > **Create Token**
5. Token'ı kopyalayın (sadece bir kez gösterilir!)

**Account ID Bulma:**

Cloudflare Dashboard'da sağ üstte account dropdown'dan bulunur veya Workers & Pages sayfasında görünür.

## 5. GitHub Actions Workflow

Workflow dosyası `.github/workflows/cloudflare-pages.yml` içinde tanımlı.

**Özellikler:**
- ✅ Her `push` işleminde otomatik deploy
- ✅ Prisma Client generate
- ✅ Cloudflare Pages build
- ✅ D1 database binding otomatik

**Manuel deploy:**

```bash
git add .
git commit -m "Update app"
git push origin main
```

GitHub Actions otomatik olarak deploy edecek.

## 6. Deploy Sonrası Kontroller

### Adım 1: Site URL Kontrolü

1. Cloudflare Pages proje sayfasında **Custom domains** kontrol edin
2. Varsayılan URL: `https://napifit-ACCOUNT_ID.pages.dev`
3. Veya custom domain ekleyin

### Adım 2: Environment Variables Güncelleme

Site URL'inizi aldıktan sonra:

1. **Cloudflare Pages Settings** > **Environment variables**
2. `NEXTAUTH_URL` ve `NEXT_PUBLIC_APP_URL` güncelleyin
3. **Save** butonuna tıklayın
4. Yeni bir deploy tetikleyin (Settings > Deployments > Retry deployment)

### Adım 3: Google OAuth Redirect URI Güncelleme

1. [Google Cloud Console](https://console.cloud.google.com/)'a gidin
2. OAuth 2.0 Client ID'nizi seçin
3. **Authorized redirect URIs** kısmına ekleyin:
   ```
   https://napifit.pages.dev/api/auth/callback/google
   ```
4. **Save** butonuna tıklayın

### Adım 4: D1 Database Kontrolü

```bash
# Database'in çalıştığını kontrol et
wrangler d1 execute napifit-db --remote --command="SELECT COUNT(*) FROM User"
```

### Adım 5: Test

1. Site URL'inizi tarayıcıda açın
2. Kayıt ol / Giriş yap test edin
3. Dashboard'u test edin
4. Sağlık metriklerini test edin

## 🔧 Sorun Giderme

### Build Hatası

**Problem:** Build sırasında Prisma hatası

**Çözüm:**
```bash
# Local'de test et
npm run cloudflare:build
```

### D1 Binding Hatası

**Problem:** Database bağlanamıyor

**Çözüm:**
1. `wrangler.toml` dosyasındaki `database_id` kontrol edin
2. D1 database'in oluşturulduğundan emin olun
3. Migration'ların uygulandığından emin olun

### Environment Variables Çalışmıyor

**Problem:** Environment variables okunamıyor

**Çözüm:**
1. Cloudflare Pages Settings > Environment variables kontrol edin
2. Değişikliklerden sonra yeniden deploy edin
3. Variable adlarının doğru yazıldığından emin olun

### Google OAuth Hatası

**Problem:** Google ile giriş yapılamıyor

**Çözüm:**
1. Google Cloud Console'da redirect URI'yi kontrol edin
2. `NEXTAUTH_URL` environment variable'ının doğru olduğundan emin olun
3. Google OAuth credentials'ların doğru olduğundan emin olun

## 📚 Ek Kaynaklar

- [Cloudflare D1 Dokümantasyonu](https://developers.cloudflare.com/d1/)
- [Cloudflare Pages Dokümantasyonu](https://developers.cloudflare.com/pages/)
- [NextAuth.js Dokümantasyonu](https://next-auth.js.org/)
- [Prisma Dokümantasyonu](https://www.prisma.io/docs/)

## ✅ Deployment Checklist

- [ ] GitHub repository oluşturuldu ve push edildi
- [ ] Cloudflare D1 database oluşturuldu
- [ ] `wrangler.toml` dosyasına database_id eklendi
- [ ] D1 migration'ları production'a uygulandı
- [ ] Cloudflare Pages projesi oluşturuldu
- [ ] Environment variables eklendi
- [ ] GitHub Secrets eklendi
- [ ] Google OAuth redirect URI güncellendi
- [ ] İlk deploy başarılı
- [ ] Site test edildi ve çalışıyor

## 🎉 Başarılı Deploy!

Tebrikler! NapiFit uygulamanız artık canlıda. Her push işleminde otomatik olarak deploy edilecek.

Sorularınız için issue açabilirsiniz.

