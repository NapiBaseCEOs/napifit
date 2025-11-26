# 🔄 Gradle Sync Talimatları

## ⚠️ ÖNEMLİ: Gradle Sync Yapın!

Android Studio'da şu uyarıyı görüyorsunuz:
> "Gradle files have changed since last project sync. A project sync may be necessary..."

## ✅ Yapılacaklar

### 1. Gradle Sync Yapın
1. **File > Sync Project with Gradle Files** seçin
   - VEYA
2. Üstteki sarı banner'da **"Sync Now"** butonuna tıklayın
   - VEYA
3. Gradle panelinde (sağ üstte) **elektrik ikonu**na tıklayın

### 2. Sync Tamamlanana Kadar Bekleyin
- Alt kısımda "Gradle sync in progress..." mesajı görünecek
- Sync tamamlandığında "Gradle sync finished" mesajı görünecek
- Hata varsa kırmızı hata mesajları görünecek

### 3. Sync Sonrası Build
- Sync başarılı olduktan sonra **Build > Make Project** yapın
- Build başarılı olmalı

## 🐛 Sorun Giderme

### Sync Başarısız Olursa:

1. **Cache Temizleme:**
   - File > Invalidate Caches / Restart
   - "Invalidate and Restart" seçin
   - Android Studio yeniden başlayacak
   - Sync'i tekrar deneyin

2. **Gradle Wrapper Güncelleme:**
   - Terminal'de: `cd android-native && ./gradlew wrapper --gradle-version 8.5`
   - Sync'i tekrar deneyin

3. **Manuel Dependency İndirme:**
   - Terminal'de: `cd android-native && ./gradlew dependencies --refresh-dependencies`
   - Sync'i tekrar deneyin

4. **İnternet Bağlantısı:**
   - İnternet bağlantınızı kontrol edin
   - Firewall/proxy ayarlarını kontrol edin
   - VPN kullanıyorsanız kapatıp deneyin

## 📝 Notlar

- Gradle sync, dependency'leri indirmek için gereklidir
- Sync yapılmadan build başarısız olur
- Sync işlemi ilk seferde birkaç dakika sürebilir

## ✅ Başarı Kriterleri

- ✅ "Gradle sync finished" mesajı görünmeli
- ✅ Build Output'ta hata olmamalı
- ✅ Dependency'ler indirilmiş olmalı




