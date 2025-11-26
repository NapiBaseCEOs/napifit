# 🧪 Android Uygulaması Test Rehberi

## ✅ API Server Durumu

**Status:** ✅ Çalışıyor  
**Port:** 3001  
**URL:** http://localhost:3001  
**Emulator URL:** http://10.0.2.2:3001/api/

## 📱 Test Adımları

### 1. Uygulamayı Çalıştırın

Android Studio'da:
- **Run** > **Run 'app'** veya `Shift+F10`
- Emulator'de veya fiziksel cihazda çalıştırın

### 2. Logcat'i Açın

Android Studio'da:
- **View** > **Tool Windows** > **Logcat**
- Filter: `com.napibase.napifit`

### 3. Test Senaryoları

#### ✅ Dashboard Fragment
1. Uygulama açıldığında Dashboard görünmeli
2. Logcat'te şu API çağrılarını görmelisiniz:
   ```
   GET http://10.0.2.2:3001/api/meals?limit=50&offset=0&date=2025-11-25
   GET http://10.0.2.2:3001/api/workouts?limit=50&offset=0
   GET http://10.0.2.2:3001/api/water-intake?date=2025-11-25
   ```
3. İstatistikler görünmeli (0 olabilir, normal)

#### ✅ Health Fragment
1. Alt menüden **Health** sekmesine gidin
2. Öğün veya antrenman ekleyin
3. Logcat'te şu API çağrılarını görmelisiniz:
   ```
   POST http://10.0.2.2:3001/api/meals
   POST http://10.0.2.2:3001/api/workouts
   ```

#### ✅ Water Fragment
1. Alt menüden **Water** sekmesine gidin
2. Su ekleme butonlarına tıklayın
3. Logcat'te şu API çağrılarını görmelisiniz:
   ```
   POST http://10.0.2.2:3001/api/water-intake
   GET http://10.0.2.2:3001/api/water-intake?date=2025-11-25
   ```

#### ✅ Profile Fragment
1. Alt menüden **Profile** sekmesine gidin
2. Logcat'te şu API çağrılarını görmelisiniz:
   ```
   GET http://10.0.2.2:3001/api/profile
   GET http://10.0.2.2:3001/api/meals?limit=1&offset=0
   GET http://10.0.2.2:3001/api/workouts?limit=1&offset=0
   ```
3. Profil bilgileri görünmeli (401 hatası normal, auth yok)

#### ✅ Community Fragment
1. Alt menüden **Community** sekmesine gidin
2. Logcat'te şu API çağrılarını görmelisiniz:
   ```
   GET http://10.0.2.2:3001/api/feature-requests?sort=likes&limit=50&offset=0
   ```
3. Feature request'ler listelenmeli veya "Henüz öneri yok" mesajı görünmeli

## 🔍 Beklenen Log Mesajları

### ✅ Başarılı API Çağrıları
```
okhttp.OkHttpClient: --> GET http://10.0.2.2:3001/api/...
okhttp.OkHttpClient: <-- 200 OK
```

### ⚠️ Auth Gerektiren Endpoint'ler (Normal)
```
okhttp.OkHttpClient: <-- 401 Unauthorized
```
Bu normal, çünkü henüz authentication implementasyonu yok.

### ❌ Bağlantı Hatası (API Server Kapalıysa)
```
okhttp.OkHttpClient: <-- HTTP FAILED: java.net.ConnectException
```
API server'ı başlatın: `cd api-server && npm run dev`

## 🐛 Sorun Giderme

### API Server'a Bağlanılamıyor

**Sorun:** `Failed to connect to /10.0.2.2:3001`

**Çözüm:**
1. API server'ın çalıştığını kontrol edin
2. Tarayıcıda `http://localhost:3001/health` adresini açın
3. Emulator kullanıyorsanız `10.0.2.2` doğru adres
4. Fiziksel cihaz kullanıyorsanız bilgisayarınızın IP adresini kullanın

### 401 Unauthorized Hataları

**Sorun:** Tüm API çağrıları 401 dönüyor

**Açıklama:** Bu normal! Henüz authentication implementasyonu yok. Uygulama:
- Auth gerektirmeyen endpoint'lerde çalışır (feature-requests)
- Auth gerektiren endpoint'lerde varsayılan değerler gösterir

### Coroutine Cancellation Hataları

**Sorun:** `JobCancellationException` logları

**Durum:** ✅ Düzeltildi! Artık bu hatalar loglanmıyor.

## 📊 Test Sonuçları

### ✅ Çalışan Özellikler
- [x] Dashboard - İstatistikler gösteriliyor
- [x] Health - Öğün/antrenman ekleme
- [x] Water - Su ekleme
- [x] Profile - Profil görüntüleme
- [x] Community - Feature request listesi

### ⏳ Bekleyen Özellikler
- [ ] Authentication (Login/Signup)
- [ ] Profile güncelleme
- [ ] Feature request beğenme/beğenmeme
- [ ] Feature request oluşturma

## 🎯 Sonraki Adımlar

1. ✅ API server çalışıyor
2. ✅ Tüm fragment'lar API'ye entegre edildi
3. ⏭️ Authentication implementasyonu
4. ⏭️ UI iyileştirmeleri
5. ⏭️ Error handling iyileştirmeleri


