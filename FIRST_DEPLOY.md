# 🚀 İlk Deploy - Cloudflare Pages

## ✅ Hazırlıklar Tamamlandı

- ✅ GitHub repository push edildi
- ✅ GitHub Secrets eklendi
- ✅ GitHub Actions workflow hazır
- ✅ wrangler.toml D1 database ID eklendi
- ✅ Build başarılı

## ⚠️ Site Açılmıyor Nedenleri

### 1. Cloudflare Pages Projesi Oluşturulmamış

**Kontrol:**
- [Cloudflare Dashboard](https://dash.cloudflare.com/) > Pages
- `napifit` projesi var mı?

**Yoksa oluşturun:**
1. Pages > Create a project
2. Connect to Git > GitHub > `NapiBaseCEOs/napifit`
3. Build settings:
   - Framework preset: **Next.js**
   - Build command: `npm run cloudflare:build`
   - Build output directory: `.open-next`
   - Root directory: `/` (boş)
4. **Create project**

### 2. İlk Deploy Başlatılmamış

**Manuel Deploy:**
1. Cloudflare Pages > napifit > Settings > Builds & deployments
2. **Retry deployment** veya **Trigger deployment**
3. Veya GitHub'a yeni bir commit push edin

### 3. Environment Variables Eksik

**Cloudflare Pages > Settings > Environment variables (Production):**

```
AUTH_SECRET=your-auth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_URL=https://napifit.pages.dev
NEXT_PUBLIC_APP_URL=https://napifit.pages.dev
```

**Not:** `DATABASE_URL` gerekmez! D1 binding otomatik olarak `wrangler.toml`'dan okunur.

### 4. D1 Migration'ları Uygulanmamış

**D1 Migration Uygula:**
```bash
# Migration oluştur (eğer yoksa)
npm run prisma:migrate -- --name add_firstname_lastname_dateofbirth

# D1'e uygula (remote)
npm run d1:migrate:remote
```

**Veya Cloudflare Dashboard'dan:**
1. Storage > D1 > napifit-db
2. Execute SQL tab
3. Migration SQL'lerini çalıştırın

### 5. Custom Domain Ayarlanmamış

**Site URL:**
- Varsayılan: `https://napifit-XXXXX.pages.dev`
- Custom domain: `https://napifit.pages.dev` (ayarlanmışsa)

**Kontrol:**
- Cloudflare Pages > napifit > Custom domains
- Hangi URL aktif?

## 🔧 Hızlı Çözüm Adımları

### Adım 1: Cloudflare Pages Projesi Kontrolü

```bash
# GitHub Actions workflow'u tetikle
$env:Path = $env:Path + ";C:\Program Files\GitHub CLI"
gh workflow run cloudflare-pages.yml --repo NapiBaseCEOs/napifit
```

### Adım 2: Environment Variables Ekle

Cloudflare Pages Dashboard > Settings > Environment variables:

**Production variables:**
- `AUTH_SECRET` = .env'den değer
- `GOOGLE_CLIENT_ID` = .env'den değer
- `GOOGLE_CLIENT_SECRET` = .env'den değer
- `NEXTAUTH_URL` = `https://napifit.pages.dev` (veya gerçek URL)
- `NEXT_PUBLIC_APP_URL` = `https://napifit.pages.dev` (veya gerçek URL)

### Adım 3: D1 Migration Uygula

```bash
# D1 migration uygula
npm run d1:migrate:remote
```

**Veya Cloudflare Dashboard'dan:**
1. Storage > D1 > napifit-db
2. Execute SQL
3. Migration SQL'lerini çalıştır

### Adım 4: İlk Deploy Tetikle

**Yöntem 1: GitHub'a yeni commit push**
```bash
# Versiyonu güncelle
node scripts/version-update.js

# Commit ve push
$gitPath = "C:\Users\Administrator\AppData\Local\GitHubDesktop\app-3.5.4\resources\app\git\cmd\git.exe"
& $gitPath add .
& $gitPath commit -m "chore: İlk deploy için hazırlık"
& $gitPath push origin main
```

**Yöntem 2: Cloudflare Dashboard'dan**
1. Cloudflare Pages > napifit
2. Deployments > Retry latest deployment
3. Veya Settings > Builds > Trigger deployment

## 📋 Deploy Checklist

- [ ] Cloudflare Pages projesi oluşturuldu
- [ ] Environment variables eklendi
- [ ] D1 database migration'ları uygulandı
- [ ] İlk deploy tetiklendi
- [ ] Build başarılı
- [ ] Site açılıyor

## 🐛 Sorun Giderme

### Build Hatası
- GitHub Actions > napifit > Actions
- Son workflow run'ını kontrol edin
- Hata mesajlarını okuyun

### Environment Variables Hatası
- Cloudflare Pages > Settings > Environment variables
- Tüm değişkenlerin doğru eklendiğinden emin olun
- Deploy'dan sonra eklenen değişkenler için yeniden deploy gerekir

### D1 Database Hatası
- Storage > D1 > napifit-db
- Database'in oluşturulduğundan emin olun
- Migration'ların uygulandığından emin olun
- `wrangler.toml` dosyasındaki database_id doğru mu?

### Site Açılmıyor
- Cloudflare Pages > napifit > Deployments
- Son deployment'ın durumunu kontrol edin
- Preview URL'yi deneyin
- Browser console'da hata var mı?

## ✅ Sonraki Adımlar

1. Cloudflare Pages projesi oluşturun
2. Environment variables ekleyin
3. D1 migration'ları uygulayın
4. İlk deploy'u tetikleyin
5. Site URL'ini kontrol edin

## 🎉 Başarılı Deploy Sonrası

- Site açılacak
- GitHub'a yeni push yapıldığında otomatik deploy edilecek
- Custom domain eklenebilir
- Analytics ve monitoring açılabilir

