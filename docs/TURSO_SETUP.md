# Turso Database Kurulum Rehberi

## 1. Turso Hesabı Oluştur
1. https://turso.tech/ adresine git
2. "Sign Up" ile ücretsiz hesap oluştur
3. Email doğrulaması yap

## 2. Turso Database Oluştur
1. Dashboard'a git
2. "Create Database" butonuna tıkla
3. Database adı: `napifit-db`
4. Region seç (en yakın: `iad` veya `fra`)
5. "Create" butonuna tıkla

## 3. Auth Token Oluştur
1. Database sayfasında "Settings" sekmesine git
2. "Tokens" bölümünde "Create Token" butonuna tıkla
3. Token adı: `napifit-token`
4. Token'ı kopyala (bir daha gösterilmeyecek!)

## 4. Database URL'i Al
1. Database sayfasında "Connect" sekmesine git
2. "libSQL" URL'ini kopyala
3. Format: `libsql://napifit-db-xxxxx.turso.io`

## 5. Environment Variables Ekle
Cloudflare Pages Settings > Environment Variables:
- `TURSO_DATABASE_URL`: libsql://napifit-db-xxxxx.turso.io
- `TURSO_AUTH_TOKEN`: turso_xxxxx...

## 6. Local Development
`.env.local` dosyasına ekle:
```
TURSO_DATABASE_URL=libsql://napifit-db-xxxxx.turso.io
TURSO_AUTH_TOKEN=turso_xxxxx...
DATABASE_URL=libsql://napifit-db-xxxxx.turso.io?authToken=turso_xxxxx...
```

## 7. Migration
```bash
npm install @libsql/client
npx prisma generate
npx prisma db push
```

## Notlar
- Turso ücretsiz tier: 500 MB storage, 1M row read/day
- Edge network ile hızlı
- SQLite uyumlu (mevcut schema çalışır)

