# 🧪 Deployment Test Rehberi

## ✅ Deployment Başarılı

**Production URL:** `https://napifit-idn9undo5-sefas-projects-21462460.vercel.app`

## 🔧 Yapılması Gerekenler

### 1. Vercel Environment Variables

Vercel dashboard'da şu environment variable'ları ayarlayın:

**Vercel Dashboard:** https://vercel.com/sefas-projects-21462460/napifit/settings/environment-variables

**Eklenmesi Gereken Variables:**

```
NEXT_PUBLIC_SUPABASE_URL=https://eaibfqnjgkflvxdxfblw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhaWJmcW5qZ2tmbHZ4ZHhmYmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMTA1NDQsImV4cCI6MjA3ODg4NjU0NH0.PQfYaHk8aF04Lbh1q2RhpaMfs46OZuFPtbwtNhAnhbc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhaWJmcW5qZ2tmbHZ4ZHhmYmx3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMxMDU0NCwiZXhwIjoyMDc4ODg2NTQ0fQ.YwfYQdotQ_osNoDP6qm-JSuj-b6oJf-TlIKpQL8pBY0
NEXT_PUBLIC_APP_URL=https://napifit-idn9undo5-sefas-projects-21462460.vercel.app
CORS_ORIGIN=https://napifit-idn9undo5-sefas-projects-21462460.vercel.app
```

**Not:** Environment variable'ları ekledikten sonra Vercel otomatik olarak yeniden deploy edecek.

### 2. Test Endpoints

#### Health Check
```
GET https://napifit-idn9undo5-sefas-projects-21462460.vercel.app/health
```

Beklenen yanıt:
```json
{
  "status": "ok",
  "timestamp": "2025-11-25T14:46:59.447Z"
}
```

#### Feature Requests (Public)
```
GET https://napifit-idn9undo5-sefas-projects-21462460.vercel.app/api/feature-requests
```

#### Auth Endpoints
```
POST https://napifit-idn9undo5-sefas-projects-21462460.vercel.app/api/auth/signin
Body: { "email": "test@example.com", "password": "password123" }
```

### 3. Android App Test

1. **Debug APK Build:**
   ```bash
   cd android-native
   ./gradlew assembleDebug
   ```

2. **APK Yükleme:**
   - APK dosyası: `android-native/app/build/outputs/apk/debug/NapiFit-1.0.0-debug.apk`
   - Emulator veya fiziksel cihaza yükleyin

3. **API URL Test:**
   - Debug build: Local API server kullanır (`http://10.0.2.2:3001/api/`)
   - Release build: Production API kullanır (`https://napifit-idn9undo5-sefas-projects-21462460.vercel.app/api/`)

### 4. Web App Test

1. **Production URL:** https://napifit-idn9undo5-sefas-projects-21462460.vercel.app
2. **Login sayfası:** https://napifit-idn9undo5-sefas-projects-21462460.vercel.app/login
3. **Forgot password:** https://napifit-idn9undo5-sefas-projects-21462460.vercel.app/forgot-password

## 🔍 Sorun Giderme

### API Endpoints Çalışmıyor

1. Vercel dashboard'da environment variable'ları kontrol edin
2. Deployment logs'u kontrol edin
3. API server build'inin başarılı olduğundan emin olun (`api-server/dist/server.js` dosyası var mı?)

### CORS Hatası

1. `CORS_ORIGIN` environment variable'ını kontrol edin
2. Production domain'i ekleyin

### Authentication Hatası

1. Supabase environment variable'larını kontrol edin
2. API server'ın Supabase'e bağlanabildiğinden emin olun


