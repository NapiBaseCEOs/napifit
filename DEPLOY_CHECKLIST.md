# ✅ Cloudflare Pages Deploy Checklist

## 📋 Ön Hazırlık

### 1. GitHub Repository
- [ ] GitHub'da repository oluşturuldu
- [ ] Local repository GitHub'a bağlandı
- [ ] Tüm dosyalar commit edildi ve push edildi

### 2. Cloudflare D1 Database
- [ ] Cloudflare Dashboard > Storage > D1 > Create Database
- [ ] Database adı: `napifit-db`
- [ ] Database ID kopyalandı
- [ ] `wrangler.toml` dosyasına database_id eklendi

### 3. Environment Variables (GitHub Secrets)
Repository Settings > Secrets and variables > Actions > New repository secret:

- [ ] `CLOUDFLARE_API_TOKEN` - Cloudflare API token
- [ ] `CLOUDFLARE_ACCOUNT_ID` - Cloudflare Account ID
- [ ] `AUTH_SECRET` - NextAuth secret (32+ karakter)
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- [ ] `NEXTAUTH_URL` - Production URL (örn: https://napifit.pages.dev)

### 4. Cloudflare Pages Environment Variables
Cloudflare Dashboard > Pages > napifit > Settings > Environment variables:

- [ ] `AUTH_SECRET` - NextAuth secret
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- [ ] `NEXTAUTH_URL` - Production URL
- [ ] `NEXT_PUBLIC_APP_URL` - Production URL

**Not:** `DATABASE_URL` gerekmez! D1 binding otomatik olarak `wrangler.toml`'dan okunur.

## 🚀 Deploy Adımları

### Adım 1: Cloudflare D1 Database Oluştur

```bash
# Cloudflare Dashboard'dan:
# 1. Storage & Databases > D1 SQL database > Create Database
# 2. Database adı: napifit-db
# 3. Database ID'yi kopyala
```

**Veya Wrangler CLI ile:**
```bash
npm run d1:create
```

### Adım 2: Wrangler.toml Güncelle

`wrangler.toml` dosyasını açın ve database ID'leri ekleyin:

```toml
[[d1_databases]]
binding = "DB"
database_name = "napifit-db"
database_id = "YOUR_DATABASE_ID_HERE"  # <-- Buraya

[env.production.d1_databases]
binding = "DB"
database_name = "napifit-db"
database_id = "YOUR_DATABASE_ID_HERE"  # <-- Buraya
```

### Adım 3: D1 Migration Uygula

```bash
# Production D1'e migration uygula
npm run d1:migrate:remote
```

**Not:** Migration dosyası oluşturmak için:
```bash
npm run prisma:migrate -- --name migration_name
```

Sonra `prisma/migrations/` klasöründeki SQL dosyasını D1'e uygulayın.

### Adım 4: GitHub Secrets Ekle

1. GitHub repository > Settings > Secrets and variables > Actions
2. Her secret'ı ekle (yukarıdaki listede)

**Cloudflare API Token Oluşturma:**
- Cloudflare Dashboard > My Profile > API Tokens
- Create Token > Edit Cloudflare Workers template
- Permissions: Account (Cloudflare Pages:Edit), Zone (Settings:Read, Zone:Read)
- Continue to summary > Create Token

**Account ID Bulma:**
- Cloudflare Dashboard'da sağ üstte account dropdown'dan bulunur

### Adım 5: Cloudflare Pages Projesi Oluştur

1. Cloudflare Dashboard > Pages > Create a project
2. Connect to Git > GitHub repository'yi seçin
3. Build settings:
   - **Framework preset:** Next.js
   - **Build command:** `npm run cloudflare:build`
   - **Build output directory:** `.open-next`
   - **Root directory:** `/` (boş)
4. **Create project**

### Adım 6: Environment Variables (Cloudflare Pages)

Cloudflare Pages > Settings > Environment variables:

**Production:**
```
AUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
NEXTAUTH_URL=https://napifit.pages.dev
NEXT_PUBLIC_APP_URL=https://napifit.pages.dev
```

### Adım 7: Google OAuth Redirect URI Güncelle

1. Google Cloud Console > OAuth 2.0 Client IDs
2. Authorized redirect URIs kısmına ekle:
   ```
   https://napifit.pages.dev/api/auth/callback/google
   ```
3. Save

### Adım 8: İlk Deploy

```bash
# Versiyonu güncelle ve commit/push
npm run deploy
```

GitHub Actions otomatik olarak deploy edecek.

## ✅ Post-Deploy Kontroller

- [ ] Site açılıyor mu?
- [ ] Kayıt sayfası çalışıyor mu?
- [ ] Google OAuth çalışıyor mu?
- [ ] Dashboard açılıyor mu?
- [ ] D1 database bağlantısı çalışıyor mu?

## 🔧 Sorun Giderme

### Build Hatası
- [ ] `npm run cloudflare:build` local'de çalışıyor mu?
- [ ] Environment variables doğru mu?

### D1 Binding Hatası
- [ ] `wrangler.toml` dosyasındaki database_id doğru mu?
- [ ] Migration'lar uygulandı mı?

### OAuth Hatası
- [ ] Redirect URI doğru mu?
- [ ] `NEXTAUTH_URL` environment variable doğru mu?

## 📚 Detaylı Rehber

- `DEPLOY.md` - Detaylı deploy rehberi
- `D1_SETUP.md` - D1 database kurulum rehberi
- `GIT_SETUP.md` - Git kurulum rehberi

