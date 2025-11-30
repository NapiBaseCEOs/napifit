# Cloudflare D1 Database Kurulum Rehberi

Bu rehber NapiFit uygulaması için Cloudflare D1 (SQLite) veritabanını nasıl kuracağınızı açıklar.

## 📋 İçindekiler

1. [D1 Database Oluşturma](#1-d1-database-oluşturma)
2. [Wrangler.toml Yapılandırması](#2-wranglertoml-yapılandırması)
3. [Migration'ları Uygulama](#3-migrationları-uygulama)
4. [Production Deployment](#4-production-deployment)

## 1. D1 Database Oluşturma

### Yöntem 1: Wrangler CLI ile

```bash
npm run d1:create
```

Komutu çalıştırdığınızda şuna benzer bir çıktı alacaksınız:

```
✅ Successfully created DB 'napifit-db'!

Created your database using D1's new storage backend. The new storage backend is not yet recommended for production workloads, but backs up your data via point-in-time restore.

[[d1_databases]]
binding = "DB"
database_name = "napifit-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Database ID'yi kopyalayın!** Bunu `wrangler.toml` dosyasına ekleyeceksiniz.

### Yöntem 2: Cloudflare Dashboard'dan

1. [Cloudflare Dashboard](https://dash.cloudflare.com/)'a gidin
2. Sol menüden **Storage & Databases** > **D1 SQL database** seçin
3. **Create Database** butonuna tıklayın
4. Database adı: `napifit-db`
5. **Create** butonuna tıklayın
6. Oluşturulan database'in ID'sini kopyalayın

## 2. Wrangler.toml Yapılandırması

`wrangler.toml` dosyasını açın ve database ID'yi ekleyin:

```toml
[[d1_databases]]
binding = "DB"
database_name = "napifit-db"
database_id = "YOUR_DATABASE_ID_HERE"  # <-- Buraya ID'yi ekleyin
```

### Production ve Preview için

Eğer production ve preview için ayrı database'ler kullanmak istiyorsanız:

```toml
[env.production]
[[env.production.d1_databases]]
binding = "DB"
database_name = "napifit-db"
database_id = "PRODUCTION_DATABASE_ID"

[env.preview]
[[env.preview.d1_databases]]
binding = "DB"
database_name = "napifit-db-preview"
database_id = "PREVIEW_DATABASE_ID"
```

## 3. Migration'ları Uygulama

### Otomatik Kurulum (Önerilen)

```bash
node scripts/d1-init.js
```

Bu script şunları yapar:
1. D1 database oluşturur (eğer yoksa)
2. Prisma client'ı generate eder
3. Migration'ları oluşturur
4. Migration'ları local D1'e uygular

### Manuel Kurulum

#### Adım 1: Prisma Client Generate

```bash
npm run prisma:generate
```

#### Adım 2: Migration Oluştur

```bash
npm run prisma:migrate
```

Bu komut local SQLite dosyası (`dev.db`) için migration oluşturur.

#### Adım 3: Migration'ı D1'e Uygula

**Local D1'e:**
```bash
node scripts/d1-migrate.js
```

veya

```bash
npm run d1:migrate
```

**Production D1'e:**
```bash
npm run d1:migrate:remote
```

## 4. Production Deployment

### Cloudflare Pages'e Deploy

1. **GitHub repository'yi bağlayın:**
   - Cloudflare Dashboard > Pages > Create a project
   - GitHub repository'yi seçin

2. **Build settings:**
   - Build command: `npm run cloudflare:build`
   - Build output directory: `.open-next`
   - Root directory: `/`

3. **Environment Variables:**
   - `AUTH_SECRET`: NextAuth secret
   - `GOOGLE_CLIENT_ID`: Google OAuth Client ID
   - `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret
   - `NEXTAUTH_URL`: Production URL (örn: https://napifit.pages.dev)

   **Not:** `DATABASE_URL` gerekmez! D1 binding otomatik olarak `wrangler.toml` dosyasından okunur.

4. **D1 Binding:**
   - Cloudflare Pages otomatik olarak `wrangler.toml` dosyasındaki D1 binding'i algılar
   - Production database ID'sinin `wrangler.toml` dosyasında doğru olduğundan emin olun

5. **İlk Migration'ı Production'a Uygula:**
   ```bash
   npm run d1:migrate:remote
   ```

## 🔧 Yeni Migration Ekleme

Schema'da değişiklik yaptığınızda:

1. **Local SQLite için migration oluştur:**
   ```bash
   npm run prisma:migrate
   ```

2. **Local D1'e uygula (test için):**
   ```bash
   node scripts/d1-migrate.js
   ```

3. **Production D1'e uygula:**
   ```bash
   npm run d1:migrate:remote
   ```

## 📊 Veritabanı Yönetimi

### Backup

```bash
npm run d1:backup
```

### SQL Query Çalıştırma

**Local:**
```bash
wrangler d1 execute napifit-db --local --command="SELECT * FROM User LIMIT 10"
```

**Production:**
```bash
wrangler d1 execute napifit-db --remote --command="SELECT * FROM User LIMIT 10"
```

### Prisma Studio (Local SQLite)

```bash
npm run prisma:studio
```

Prisma Studio sadece local SQLite dosyası (`dev.db`) ile çalışır. D1 için direkt SQL query'ler kullanın.

## 🐛 Sorun Giderme

### Migration Hatası

Eğer migration uygulanırken hata alırsanız:

1. Migration dosyasını kontrol edin: `prisma/migrations/[migration-name]/migration.sql`
2. SQLite syntax'ına uygun olduğundan emin olun
3. Manuel olarak SQL çalıştırabilirsiniz:
   ```bash
   wrangler d1 execute napifit-db --remote --file=./prisma/migrations/[migration-name]/migration.sql
   ```

### Database ID Bulunamıyor

```bash
# Tüm D1 database'leri listele
wrangler d1 list
```

### Binding Hatası

`wrangler.toml` dosyasındaki `database_id` ve `database_name` değerlerinin doğru olduğundan emin olun.

## 📚 Daha Fazla Bilgi

- [Cloudflare D1 Dokümantasyonu](https://developers.cloudflare.com/d1/)
- [Wrangler D1 Komutları](https://developers.cloudflare.com/workers/wrangler/commands/#d1)
- [Prisma SQLite Dokümantasyonu](https://www.prisma.io/docs/concepts/database-connectors/sqlite)

