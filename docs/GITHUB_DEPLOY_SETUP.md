# 🚀 GitHub Actions ile Vercel Deploy Kurulumu

## Gerekli GitHub Secrets

GitHub repository'nizde aşağıdaki secrets'ları eklemeniz gerekiyor:

### Vercel Secrets
1. **VERCEL_TOKEN**: Vercel hesabınızdan alın
   - Vercel Dashboard → Settings → Tokens
   - Yeni token oluşturun ve kopyalayın

2. **VERCEL_ORG_ID**: Vercel organizasyon ID'si
   - Vercel Dashboard → Settings → General
   - Organization ID'yi kopyalayın

3. **VERCEL_PROJECT_ID**: Vercel proje ID'si
   - Vercel Dashboard → Projeniz → Settings → General
   - Project ID'yi kopyalayın

### Environment Variables (Vercel Dashboard'dan)
Aşağıdaki environment variables'ları Vercel Dashboard'dan ekleyin:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `GEMINI_API_KEY`

## GitHub Secrets Ekleme

1. GitHub repository'nize gidin
2. Settings → Secrets and variables → Actions
3. "New repository secret" butonuna tıklayın
4. Her bir secret için yukarıdaki bilgileri ekleyin

## Otomatik Deploy

Artık `main` veya `feat/supabase-migration` branch'ine push yaptığınızda:
- GitHub Actions otomatik olarak çalışacak
- Build işlemi yapılacak
- Vercel production'a deploy edilecek

## Manuel Deploy

GitHub Actions sayfasından "Run workflow" butonuna tıklayarak manuel deploy da yapabilirsiniz.

