# 🚀 Cloudflare Pages Deploy - Hazır!

## ✅ Tamamlanan İşlemler

### 1. Kayıt Sayfası Güncellemeleri
- ✅ Ad ve Soyad alanları zorunlu eklendi
- ✅ Doğum tarihi alanı zorunlu eklendi
- ✅ 18 yaş kontrolü eklendi
- ✅ Prisma schema güncellendi (firstName, lastName, dateOfBirth)
- ✅ API route validasyonları eklendi
- ✅ Form validasyonları eklendi

### 2. Versiyon Güncellemesi
- ✅ Versiyon: 0.1.6
- ✅ package.json güncellendi
- ✅ src/config/version.ts güncellendi

### 3. Deploy Hazırlıkları
- ✅ GitHub Actions workflow hazır (.github/workflows/cloudflare-pages.yml)
- ✅ wrangler.toml hazır (D1 database binding)
- ✅ opennext.config.ts hazır
- ✅ public/_routes.json hazır
- ✅ DEPLOY.md rehberi hazır
- ✅ DEPLOY_CHECKLIST.md checklist hazır

## 📋 Sonraki Adımlar

### 1. Git Commit ve Push

**GitHub Desktop kullanarak:**
1. GitHub Desktop'u açın
2. File > Add Local Repository > Bu klasörü seçin
3. Summary: `feat: Versiyon 0.1.6 - Kayıt sayfası güncellemeleri`
4. Commit ve Push

**Veya terminal:**
```bash
# Git path'i bul (GitHub Desktop içinde)
# Önce GitHub Desktop'tan repository'yi açın
# Sonra:
git add .
git commit -m "feat: Versiyon 0.1.6 - Kayıt sayfası güncellemeleri

- Ad, Soyad ve Doğum tarihi zorunlu alanlar eklendi
- 18 yaş kontrolü eklendi
- Prisma schema güncellendi (firstName, lastName, dateOfBirth)
- Form validasyonları iyileştirildi"
git push
```

### 2. Cloudflare D1 Database Oluştur

**Cloudflare Dashboard'dan:**
1. [Cloudflare Dashboard](https://dash.cloudflare.com/) > Storage > D1 SQL database
2. Create Database
3. Database adı: `napifit-db`
4. Create
5. **Database ID'yi kopyalayın**

**Veya Wrangler CLI ile:**
```bash
npm run d1:create
# Çıktıdan database_id'yi kopyalayın
```

### 3. Wrangler.toml Güncelle

`wrangler.toml` dosyasını açın ve database ID'leri ekleyin:

```toml
[[d1_databases]]
binding = "DB"
database_name = "napifit-db"
database_id = "YOUR_DATABASE_ID_HERE"  # <-- Buraya yapıştırın

[env.production.d1_databases]
binding = "DB"
database_name = "napifit-db"
database_id = "YOUR_DATABASE_ID_HERE"  # <-- Buraya yapıştırın
```

### 4. D1 Migration Uygula

**Önce migration dosyası oluşturun:**
```bash
# Local'de migration oluştur
npm run prisma:migrate -- --name add_firstname_lastname_dateofbirth
```

**Sonra D1'e uygulayın:**
```bash
# Prisma migration'ı D1'e uygula
npm run d1:migrate:remote
```

**Not:** SQLite migration'ları Prisma otomatik oluşturur. `prisma/migrations/` klasöründeki SQL dosyasını D1'e uygulayın.

### 5. GitHub Secrets Ekle

GitHub repository > Settings > Secrets and variables > Actions:

1. **CLOUDFLARE_API_TOKEN**
   - Cloudflare Dashboard > My Profile > API Tokens > Create Token
   - Template: Edit Cloudflare Workers
   - Permissions: Account (Cloudflare Pages:Edit), Zone (Settings:Read, Zone:Read)
   - Create Token > Kopyalayın

2. **CLOUDFLARE_ACCOUNT_ID**
   - Cloudflare Dashboard'da sağ üstte account dropdown'dan bulunur

3. **AUTH_SECRET**
   - Rastgele 32+ karakter string (örn: `openssl rand -base64 32`)

4. **GOOGLE_CLIENT_ID**
   - Google Cloud Console > OAuth 2.0 Client IDs > Client ID

5. **GOOGLE_CLIENT_SECRET**
   - Google Cloud Console > OAuth 2.0 Client IDs > Client Secret

6. **NEXTAUTH_URL**
   - Production URL: `https://napifit-XXXXX.pages.dev` (deploy sonrası güncellenecek)

### 6. Cloudflare Pages Projesi Oluştur

1. Cloudflare Dashboard > Pages > Create a project
2. Connect to Git > GitHub > Repository seçin: `napifit`
3. **Build settings:**
   - **Framework preset:** Next.js
   - **Build command:** `npm run cloudflare:build`
   - **Build output directory:** `.open-next`
   - **Root directory:** `/` (boş bırakın)
4. **Environment variables:** (Build sırasında)
   - `DATABASE_URL`: `file:./dev.db` (dummy, sadece build için)
   - `AUTH_SECRET`: Secret'tan
   - `GOOGLE_CLIENT_ID`: Secret'tan
   - `GOOGLE_CLIENT_SECRET`: Secret'tan
   - `NEXTAUTH_URL`: Site URL'i (deploy sonrası güncellenecek)
5. **Create project**

### 7. Cloudflare Pages Environment Variables

Cloudflare Pages > Settings > Environment variables:

**Production variables:**
```
AUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
NEXTAUTH_URL=https://napifit-XXXXX.pages.dev
NEXT_PUBLIC_APP_URL=https://napifit-XXXXX.pages.dev
```

**Not:** `DATABASE_URL` gerekmez! D1 binding otomatik olarak `wrangler.toml`'dan okunur.

### 8. Google OAuth Redirect URI

1. [Google Cloud Console](https://console.cloud.google.com/) > OAuth 2.0 Client IDs
2. Client ID'yi seçin
3. **Authorized redirect URIs** kısmına ekleyin:
   ```
   https://napifit-XXXXX.pages.dev/api/auth/callback/google
   ```
4. Save

### 9. İlk Deploy

GitHub'a push yaptıktan sonra:
- GitHub Actions otomatik olarak deploy edecek
- Cloudflare Pages dashboard'dan deploy durumunu izleyebilirsiniz

## 📚 Detaylı Rehberler

- **DEPLOY.md** - Detaylı deploy rehberi
- **DEPLOY_CHECKLIST.md** - Adım adım checklist
- **D1_SETUP.md** - D1 database kurulum rehberi

## ✅ Kontrol Listesi

- [ ] Kayıt sayfası güncellemeleri tamamlandı
- [ ] Versiyon 0.1.6'ya güncellendi
- [ ] Git commit yapıldı ve push edildi
- [ ] Cloudflare D1 database oluşturuldu
- [ ] wrangler.toml dosyasına database_id eklendi
- [ ] D1 migration'ları uygulandı
- [ ] GitHub Secrets eklendi
- [ ] Cloudflare Pages projesi oluşturuldu
- [ ] Cloudflare Pages environment variables eklendi
- [ ] Google OAuth redirect URI güncellendi
- [ ] İlk deploy başarılı

## 🎉 Hazır!

Tüm hazırlıklar tamamlandı! Şimdi deploy için yukarıdaki adımları takip edin.

Sorularınız için dokümantasyonlara bakabilirsiniz.

