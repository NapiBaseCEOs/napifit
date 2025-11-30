# Cloudflare Pages Database (D1) Setup

## ÖNEMLİ: DATABASE_URL Environment Variable

Cloudflare Pages'de Prisma'nın D1 ile çalışması için **DATABASE_URL** environment variable'ı ayarlanmalıdır.

### Adım 1: Cloudflare Pages Dashboard

1. https://dash.cloudflare.com/ → **Pages** → **napifit** projesini seçin
2. **Settings** → **Environment variables** sekmesine gidin
3. **Add variable** butonuna tıklayın

### Adım 2: DATABASE_URL Ekleyin

**Variable name:** `DATABASE_URL`

**Value (Production için):**
```
file:./prisma/db.sqlite?connection_limit=1
```

VEYA D1 binding kullanıyorsanız:
```
file:./napifit-db.sqlite
```

**⚠️ NOT:** Cloudflare Pages'de D1 binding otomatik olarak kullanılır, ancak Prisma'nın DATABASE_URL'e ihtiyacı vardır. D1 binding'i Prisma ile kullanmak için özel bir adapter gerekiyor.

### Adım 3: Environment Variable'ı Kaydedin

1. **Add** butonuna tıklayın
2. Production, Preview ve Development için ayrı ayrı ekleyin (gerekiyorsa)
3. **Save** butonuna tıklayın

### Adım 4: Redeploy

1. **Settings** → **Builds & deployments** sekmesine gidin
2. **Redeploy** butonuna tıklayın
3. Deployment'ın tamamlanmasını bekleyin

## Test

Deployment'tan sonra test edin:

```bash
curl https://napibase.com/api/auth/debug
```

Database bağlantısı test edilmeli.

