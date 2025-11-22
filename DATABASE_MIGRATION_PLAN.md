# Veritabanı Geçiş Planı: D1 → Turso

## Mevcut Durum
- ❌ D1 Database binding çalışmıyor
- ❌ Register API 503 hatası veriyor
- ✅ Google OAuth endpoint çalışıyor (ama database hatası var)

## Turso Database
- ✅ SQLite tabanlı (D1'e benzer)
- ✅ Ücretsiz tier: 500 MB storage, 1 milyon row read/day
- ✅ Edge network (hızlı)
- ✅ Prisma ile uyumlu
- ✅ Cloudflare Pages ile çalışır

## Geçiş Adımları

### 1. Turso Hesabı Oluştur
- https://turso.tech/ adresine git
- Ücretsiz hesap oluştur
- Database oluştur: `napifit-db`

### 2. Turso CLI Kurulumu
```bash
npm install -g @libsql/client
npm install @libsql/client
```

### 3. Environment Variables
```env
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
```

### 4. Prisma Schema Güncelleme
- `prisma/schema.prisma` dosyasını Turso için güncelle

### 5. Migration
- Mevcut schema'yı Turso'ya migrate et

## Alternatif: Supabase (PostgreSQL)
- Daha güçlü ama daha karmaşık
- Ücretsiz tier: 500 MB storage
- Real-time özellikler

