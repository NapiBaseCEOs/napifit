# Vercel Deployment Rehberi

## ✅ Deployment Başarılı

**Production URL:** `https://napifit-idn9undo5-sefas-projects-21462460.vercel.app`

## 🔧 Environment Variables Ayarlama

Vercel dashboard'da şu environment variable'ları ayarlayın:

1. **Vercel Dashboard'a gidin:** https://vercel.com/sefas-projects-21462460/napifit
2. **Settings > Environment Variables** bölümüne gidin
3. Şu variable'ları ekleyin:

### Zorunlu Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://eaibfqnjgkflvxdxfblw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhaWJmcW5qZ2tmbHZ4ZHhmYmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMTA1NDQsImV4cCI6MjA3ODg4NjU0NH0.PQfYaHk8aF04Lbh1q2RhpaMfs46OZuFPtbwtNhAnhbc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhaWJmcW5qZ2tmbHZ4ZHhmYmx3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMxMDU0NCwiZXhwIjoyMDc4ODg2NTQ0fQ.YwfYQdotQ_osNoDP6qm-JSuj-b6oJf-TlIKpQL8pBY0
NEXT_PUBLIC_APP_URL=https://napifit-idn9undo5-sefas-projects-21462460.vercel.app
CORS_ORIGIN=https://napifit-idn9undo5-sefas-projects-21462460.vercel.app
```

### Opsiyonel Variables

```
OPENAI_API_KEY=your-openai-key (opsiyonel)
GOOGLE_AI_API_KEY=your-google-ai-key (opsiyonel)
```

## 📱 Android App API URL Güncelleme

Production URL'i Android app'e ekleyin:

1. `android-native/app/build.gradle` dosyasını açın
2. Release build type'ında API URL'i güncelleyin:

```gradle
buildTypes {
    release {
        // Production API URL
        buildConfigField "String", "API_BASE_URL", "\"https://napifit-idn9undo5-sefas-projects-21462460.vercel.app/api/\""
    }
}
```

## 🧪 Test Endpoints

### Health Check
```
GET https://napifit-idn9undo5-sefas-projects-21462460.vercel.app/health
```

### API Endpoints
```
GET https://napifit-idn9undo5-sefas-projects-21462460.vercel.app/api/feature-requests
POST https://napifit-idn9undo5-sefas-projects-21462460.vercel.app/api/auth/signin
```

## 🔄 Redeploy

Environment variable'ları ekledikten sonra:
```bash
npx vercel --prod
```

Veya Vercel dashboard'dan "Redeploy" butonuna tıklayın.


