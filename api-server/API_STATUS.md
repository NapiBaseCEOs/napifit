# 🚀 API Server Status

## ✅ Sunucu Durumu

**Status:** Çalışıyor  
**Port:** 3001  
**URL:** http://localhost:3001  
**Health Check:** http://localhost:3001/health

## 📡 API Endpoints

### Health Check
- **GET** `/health` - Sunucu durumu kontrolü
  - ✅ Çalışıyor

### Profile
- **GET** `/api/profile` - Kullanıcı profili
- **PUT** `/api/profile` - Profil güncelleme
  - 🔐 Auth gerekli

### Meals
- **GET** `/api/meals` - Öğün listesi
- **POST** `/api/meals` - Yeni öğün ekleme
- **PUT** `/api/meals/:id` - Öğün güncelleme
- **DELETE** `/api/meals/:id` - Öğün silme
  - 🔐 Auth gerekli

### Workouts
- **GET** `/api/workouts` - Egzersiz listesi
- **POST** `/api/workouts` - Yeni egzersiz ekleme
- **PUT** `/api/workouts/:id` - Egzersiz güncelleme
- **DELETE** `/api/workouts/:id` - Egzersiz silme
  - 🔐 Auth gerekli

### Water Intake
- **GET** `/api/water-intake` - Su tüketimi listesi
- **POST** `/api/water-intake` - Su tüketimi ekleme
- **PUT** `/api/water-intake/:id` - Su tüketimi güncelleme
- **DELETE** `/api/water-intake/:id` - Su tüketimi silme
  - 🔐 Auth gerekli

### Health Metrics
- **GET** `/api/health-metrics` - Sağlık metrikleri
- **POST** `/api/health-metrics` - Yeni metrik ekleme
  - 🔐 Auth gerekli

### Feature Requests
- **GET** `/api/feature-requests` - Öneri listesi
- **POST** `/api/feature-requests` - Yeni öneri ekleme
- **DELETE** `/api/feature-requests/:id` - Öneri silme
  - 🔐 Auth gerekli (silme için admin)

### Feature Requests Like
- **POST** `/api/feature-requests/:id/like` - Öneri beğenme
- **POST** `/api/feature-requests/:id/dislike` - Öneri beğenmeme
  - 🔐 Auth gerekli

### Leaderboard
- **GET** `/api/feature-requests/leaderboard` - Topluluk liderlik tablosu
  - ✅ Herkese açık

## 🔧 Yapılandırma

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase Anon Key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase Service Role Key (opsiyonel)
- `PORT` - Sunucu portu (varsayılan: 3001)
- `CORS_ORIGIN` - CORS origin (varsayılan: "*")

### Supabase Bağlantısı
- ✅ Supabase URL: Yapılandırıldı
- ✅ Supabase Anon Key: Yapılandırıldı
- ✅ Supabase Service Role Key: Yapılandırıldı (admin işlemleri için)

## 📱 Android Uygulaması İçin

### API Base URL
```
http://localhost:3001/api
```

### Emulator İçin
Android emulator'de `localhost` çalışmaz. Bunun yerine:
```
http://10.0.2.2:3001/api
```

### Fiziksel Cihaz İçin
Bilgisayarınızın IP adresini kullanın:
```
http://192.168.x.x:3001/api
```

## 🧪 Test

### Health Check
```bash
curl http://localhost:3001/health
```

### API Test (Auth gerekli)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/profile
```

## 🐛 Sorun Giderme

### Port 3001 Kullanımda
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill
```

### Environment Variables Yüklenmiyor
- Ana dizindeki `.env` dosyasını kontrol edin
- `api-server/src/config/supabase.ts` dosyasında fallback değerler var

### Supabase Bağlantı Hatası
- Supabase URL ve key'lerin doğru olduğundan emin olun
- İnternet bağlantınızı kontrol edin

## 📝 Notlar

- Sunucu `tsx watch` ile çalışıyor (hot reload aktif)
- Tüm route'lar `/api` prefix'i ile başlıyor
- CORS tüm origin'lere açık (production'da kısıtlayın)
- Error handling middleware tüm route'lar için aktif

## 🚀 Başlatma

```bash
cd api-server
npm run dev
```

## 🛑 Durdurma

Terminal'de `Ctrl+C` ile durdurun.




