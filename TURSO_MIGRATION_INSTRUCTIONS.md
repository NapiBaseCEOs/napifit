# Turso Migration Talimatları

## ✅ Deploy Tamamlandı
- Versiyon: 0.1.45
- Deploy başarılı
- Tüm testler geçti (%100 başarı)

## 🔧 Turso Migration Yapılması Gerekenler

### 1. Turso Database Oluştur (Eğer yapılmadıysa)
1. https://turso.tech/ adresine git
2. "Sign Up" ile ücretsiz hesap oluştur
3. Dashboard'da "Create Database" butonuna tıkla
4. Database adı: `napifit-db`
5. Region seç (en yakın: `iad` veya `fra`)
6. "Create" butonuna tıkla

### 2. Auth Token Oluştur
1. Database sayfasında "Settings" > "Tokens"
2. "Create Token" butonuna tıkla
3. Token adı: `napifit-token`
4. Token'ı kopyala (bir daha gösterilmeyecek!)

### 3. Database URL'i Al
1. Database sayfasında "Connect" sekmesine git
2. "libSQL" URL'ini kopyala
3. Format: `libsql://napifit-db-xxxxx.turso.io`

### 4. Cloudflare Pages Environment Variables Ekle
Cloudflare Pages Dashboard > napifit > Settings > Environment Variables:
- `TURSO_DATABASE_URL`: `libsql://napifit-db-xxxxx.turso.io`
- `TURSO_AUTH_TOKEN`: `turso_xxxxx...`

**Önemli:** Production environment'a ekle!

### 5. Migration Uygula

#### Seçenek 1: Turso Dashboard'dan (Önerilen)
1. Turso Dashboard > napifit-db > "SQL Editor"
2. `prisma/migrations/init_schema.sql` dosyasının içeriğini kopyala
3. SQL Editor'a yapıştır ve "Run" butonuna tıkla

#### Seçenek 2: Script ile (Local)
```bash
# Environment variables'ları ayarla
export TURSO_DATABASE_URL=libsql://napifit-db-xxxxx.turso.io
export TURSO_AUTH_TOKEN=turso_xxxxx...

# Migration script'ini çalıştır
node scripts/apply-turso-migration.js
```

### 6. Test Et
Migration sonrası:
1. Siteyi yenile
2. Register sayfasına git
3. Kayıt formunu doldur
4. "Kayıt Ol" butonuna tıkla
5. Başarılı olmalı (artık 503 hatası olmamalı)

## 📊 Mevcut Durum

### ✅ Çalışan Özellikler
- Site erişilebilir
- Tüm sayfalar çalışıyor
- Google OAuth endpoint çalışıyor
- NextAuth providers aktif
- Environment variables ayarlı

### ⚠️ Bekleyen
- Turso database migration (Register API için gerekli)
- D1 binding (opsiyonel, Turso kullanılacak)

## 🔄 Database Öncelik Sırası

1. **D1** (Cloudflare D1) - Eğer binding varsa
2. **Turso** (libSQL) - Eğer environment variables varsa ⭐
3. **Prisma** (Local SQLite) - Development fallback

## 📝 Notlar

- Turso ücretsiz tier: 500 MB storage, 1M row read/day
- Edge network ile hızlı
- SQLite uyumlu (mevcut schema çalışır)
- Migration sonrası Register API çalışacak

