# 🚀 GitHub Actions ile Deploy Talimatları

## Durum
✅ GitHub Actions workflow dosyası oluşturuldu: `.github/workflows/vercel-deploy.yml`
✅ Tüm değişiklikler commit edildi
⏳ GitHub'a push yapılması gerekiyor (authentication gerekli)

## Adımlar

### 1. GitHub'a Push Yapın
Lokal makinenizde şu komutu çalıştırın:
```bash
cd /home/sefa/Desktop/NapiBase
git push origin feat/supabase-migration
```

### 2. GitHub Secrets Ekleme (İlk Kez)
Eğer daha önce eklemediyseniz, GitHub repository'nizde:

1. GitHub → Settings → Secrets and variables → Actions
2. Şu secrets'ları ekleyin:
   - `VERCEL_TOKEN` - Vercel Dashboard → Settings → Tokens
   - `VERCEL_ORG_ID` - Vercel Dashboard → Settings → General
   - `VERCEL_PROJECT_ID` - Vercel Dashboard → Projeniz → Settings → General

### 3. Otomatik Deploy
Push yaptıktan sonra:
- GitHub Actions otomatik olarak çalışacak
- Build işlemi yapılacak
- Vercel production'a deploy edilecek

### 4. Deploy Durumunu Kontrol
- GitHub repository → Actions sekmesi
- "Deploy to Vercel" workflow'unu göreceksiniz
- Yeşil tik = Başarılı deploy ✅

## Manuel Deploy (Opsiyonel)
GitHub Actions sayfasından "Run workflow" butonuna tıklayarak manuel deploy da yapabilirsiniz.
