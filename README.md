# 🏋️‍♂️ NapiFit

> Modern sağlık ve fitness takip uygulaması

**NapiFit** - NapiBase tarafından geliştirilmiş, modern ve kullanıcı dostu sağlık takip platformu. Hem web hem de mobil (Android/iOS) platformlarda çalışır.

![NapiFit](https://img.shields.io/badge/NapiFit-v0.1.0-22c55e?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Cloudflare](https://img.shields.io/badge/Cloudflare-D1-orange?style=for-the-badge&logo=cloudflare)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)

## 🌟 Özellikler

- 🔐 **Modern Kimlik Doğrulama**: Google OAuth ve e-posta/şifre ile güvenli giriş
- 📊 **Sağlık Dashboard**: BMI hesaplama, kilo takibi, hedef belirleme ve detaylı sağlık metrikleri
- 💪 **Egzersiz Takibi**: Antrenmanlarınızı kaydedin, ilerlemenizi görüntüleyin
- 🍎 **Beslenme Takibi**: Öğünlerinizi kaydedin ve kalori alımınızı takip edin
- 📱 **Mobil Uygulama**: Capacitor ile Android ve iOS desteği
- 🚀 **Cloudflare Pages**: Otomatik GitHub deploy ile kolay yayınlama
- 🎨 **Modern UI**: Tailwind CSS ile responsive, animasyonlu ve modern arayüz
- ⚡ **Serverless**: Cloudflare D1 (SQLite) ile hızlı ve ölçeklenebilir veritabanı

## ⚡ Hızlı Başlangıç

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Versiyonu güncelle ve deploy et (Git kurulumundan sonra)
npm run deploy
```

**Detaylı rehber için:** `QUICK_START.md` dosyasına bakın.

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+ 
- Cloudflare D1 veritabanı (SQLite - Cloudflare tarafından sağlanır)
- Google OAuth 2.0 credentials (Google Cloud Console)
- Cloudflare hesabı

### Adımlar

1. **Repository'yi klonlayın:**

```bash
git clone https://github.com/napibase/napifit.git
cd napifit
```

2. **Bağımlılıkları yükleyin:**

```bash
npm install
```

3. **Ortam değişkenlerini ayarlayın:**

`.env` dosyası oluşturun:

```bash
# Database (SQLite - local development için)
DATABASE_URL="file:./dev.db"

# Authentication
AUTH_SECRET="rastgele-güçlü-bir-secret"
AUTH_TRUST_HOST=true
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="google-client-id"
GOOGLE_CLIENT_SECRET="google-client-secret"

# App URL (production için)
NEXT_PUBLIC_APP_URL="https://napifit.pages.dev"
```

4. **D1 veritabanını kurun:**

```bash
# D1 database oluştur ve migration'ları uygula
npm run d1:create

# Veya otomatik kurulum script'ini çalıştır
node scripts/d1-init.js
```

5. **Prisma client'ı generate edin:**

```bash
npm run prisma:generate
```

6. **Geliştirme sunucusunu başlatın:**

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 📱 Mobil Uygulama (Android/iOS)

### Android

```bash
# Build ve sync
npm run android:build

# Android Studio'yu aç
npm run android:open
```

### iOS

```bash
# Build ve sync
npm run ios:build

# Xcode'u aç
npm run ios:open
```

## ☁️ Cloudflare Pages Deployment

### GitHub Actions ile Otomatik Deploy

1. **Cloudflare D1 Database oluşturun:**

```bash
# Local'de test etmek için
npm run d1:create

# Veya Cloudflare Dashboard'dan:
# Storage & Databases > D1 > Create Database
# Database adı: napifit-db
```

Oluşturduktan sonra `wrangler.toml` dosyasına database_id ekleyin.

2. **D1 Migration'ları uygulayın:**

```bash
# Local D1'e migration uygula
node scripts/d1-migrate.js

# Production D1'e migration uygula
npm run d1:migrate:remote
```

3. **GitHub Secrets ekleyin:**

Repository Settings > Secrets > Actions kısmından şu secrets'ları ekleyin:

- `DATABASE_URL`: Local development için `file:./dev.db` (production'da gerekmez, D1 binding kullanılır)
- `AUTH_SECRET`: NextAuth secret
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret
- `NEXTAUTH_URL`: Production URL (örn: https://napifit.pages.dev)
- `CLOUDFLARE_API_TOKEN`: Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare Account ID

4. **Cloudflare Pages'de projeyi bağlayın:**

- Cloudflare Dashboard > Pages > Create a project
- GitHub repository'yi bağlayın
- Build settings:
  - Build command: `npm run cloudflare:build`
  - Build output directory: `.open-next`
  - Root directory: `/`

5. **Environment Variables ekleyin:**

Cloudflare Pages dashboard'undan environment variables ekleyin:
- `AUTH_SECRET`: NextAuth secret
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret
- `NEXTAUTH_URL`: Production URL

**Not:** D1 database binding otomatik olarak `wrangler.toml` dosyasından alınır. `DATABASE_URL` gerekmez, D1 binding kullanılır.

### Manuel Deploy

```bash
# Build
npm run cloudflare:build

# Preview (local)
npm run cloudflare:preview

# Deploy (wrangler ile)
npx wrangler pages deploy .open-next --project-name=napifit
```

## 📁 Proje Yapısı

```
napifit/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (auth)/      # Auth sayfaları (login, register)
│   │   ├── (app)/       # Uygulama sayfaları (dashboard, profile, health)
│   │   ├── api/         # API routes
│   │   └── ...
│   ├── components/       # React bileşenleri
│   ├── lib/             # Utility fonksiyonları
│   └── types/           # TypeScript tipleri
├── prisma/              # Prisma schema ve migrations
├── public/              # Statik dosyalar
└── ...
```

## 🔧 Scripts

- `npm run dev` - Geliştirme sunucusu
- `npm run build` - Production build
- `npm run start` - Production sunucu
- `npm run lint` - ESLint kontrolü
- `npm run prisma:generate` - Prisma client oluştur
- `npm run prisma:migrate` - Migration oluştur (local SQLite için)
- `npm run prisma:studio` - Prisma Studio
- `npm run d1:create` - D1 database oluştur
- `npm run d1:migrate` - Local D1'e migration uygula
- `npm run d1:migrate:remote` - Production D1'e migration uygula
- `node scripts/d1-init.js` - D1 kurulum script'i (database oluştur + migration)
- `node scripts/d1-migrate.js` - D1 migration helper script
- `npm run android:build` - Android build
- `npm run ios:build` - iOS build
- `npm run cloudflare:build` - Cloudflare Pages build

## 📝 Google OAuth Kurulumu

1. [Google Cloud Console](https://console.cloud.google.com/)'a gidin
2. Yeni bir proje oluşturun
3. OAuth 2.0 Client ID oluşturun
4. Authorized redirect URIs ekleyin:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
5. Client ID ve Secret'ı `.env` dosyasına ekleyin

## 🗄️ Veritabanı (Cloudflare D1)

Cloudflare D1 (SQLite) veritabanı kullanılır. D1, Cloudflare'ın serverless SQLite veritabanı hizmetidir. Prisma schema dosyası `prisma/schema.prisma` içinde tanımlıdır.

### D1 Kurulumu

```bash
# 1. D1 database oluştur
npm run d1:create

# 2. Database ID'yi wrangler.toml dosyasına ekle (komut çıktısında görünecek)

# 3. Prisma client generate et
npm run prisma:generate

# 4. Migration oluştur (local SQLite için)
npm run prisma:migrate

# 5. D1'e migration uygula
node scripts/d1-migrate.js

# Veya hepsini otomatik yap
node scripts/d1-init.js
```

### Migration

```bash
# Yeni migration oluştur (local SQLite için)
npm run prisma:migrate

# Local D1'e migration uygula
node scripts/d1-migrate.js

# Production D1'e migration uygula
npm run d1:migrate:remote
```

### D1 Binding

Cloudflare Pages'de D1 binding otomatik olarak `wrangler.toml` dosyasından okunur. Production'da Prisma client D1 binding üzerinden çalışır.

**Not:** Local development için SQLite dosyası (`dev.db`) kullanılır. Production'da Cloudflare D1 kullanılır.

## 📄 Lisans

MIT License - Detaylar için `LICENSE` dosyasına bakın.

## 👥 Geliştirici

NapiBase

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add some amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📞 İletişim

Sorularınız için issue açabilirsiniz.

