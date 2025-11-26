# Android Studio Kurulum ve Yapılandırma Rehberi

## 1. Android Studio'yu Başlat

### Windows'ta:
- Başlat menüsünden "Android Studio" arayın ve açın
- VEYA: `C:\Users\[KullanıcıAdı]\AppData\Local\Android\Sdk` klasöründe `studio64.exe` çalıştırın

## 2. Projeyi Aç

1. Android Studio açıldığında **"Open"** veya **"Open an Existing Project"** seçin
2. Şu klasörü seçin: `C:\Users\Administrator\Desktop\NapiBase\android-native`
3. **"OK"** tıklayın

## 3. Gradle Sync

Android Studio projeyi açtığında otomatik olarak Gradle sync başlayacak. Eğer başlamazsa:

1. Üst menüden **File > Sync Project with Gradle Files** seçin
2. VEYA sağ üstteki **elephant ikonu**na tıklayın
3. İlk kez açıyorsanız, bağımlılıklar indirilecek (5-10 dakika sürebilir)

## 4. Eksik Dosyaları Oluştur

Android Studio'da bazı dosyalar eksik olabilir. Şunları kontrol edin:

### 4.1. Drawable İkonları

`app/src/main/res/drawable/` klasöründe şu ikonlar olmalı:
- `ic_dashboard.xml`
- `ic_health.xml`
- `ic_water.xml`
- `ic_community.xml`
- `ic_profile.xml`

**Eğer yoksa:** Android Studio'da sağ tık > New > Vector Asset ile oluşturun veya basit XML drawable'lar ekleyin.

### 4.2. Launcher İkonları

`app/src/main/res/mipmap-*/` klasörlerinde launcher ikonları olmalı.

**Eğer yoksa:** Android Studio'da sağ tık > New > Image Asset ile oluşturun.

## 5. Yapılandırma Dosyalarını Güncelle

### 5.1. API Base URL

`app/build.gradle` dosyasını açın ve şu satırı bulun:
```gradle
buildConfigField "String", "API_BASE_URL", "\"https://your-api-server.com/api\""
```

Bunu kendi API sunucu URL'inizle değiştirin:
```gradle
buildConfigField "String", "API_BASE_URL", "\"http://localhost:3001/api\""  // Local için
// VEYA
buildConfigField "String", "API_BASE_URL", "\"https://your-deployed-api.com/api\""  // Production için
```

### 5.2. Supabase Credentials

`app/src/main/java/com/napibase/napifit/auth/AuthManager.kt` dosyasını açın ve şu satırları güncelleyin:

```kotlin
private val supabaseUrl = "YOUR_SUPABASE_URL" // Gerçek Supabase URL'inizi yazın
private val supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY" // Gerçek Supabase anon key'inizi yazın
```

**Örnek:**
```kotlin
private val supabaseUrl = "https://xxxxx.supabase.co"
private val supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 6. Build Configuration

### 6.1. SDK Versiyonlarını Kontrol Et

`app/build.gradle` dosyasında:
- `compileSdk 34` - Android 14
- `minSdk 24` - Android 7.0 (Nougat)
- `targetSdk 34` - Android 14

Bu değerler uygunsa değiştirmeyin.

### 6.2. Java/Kotlin Versiyonları

`app/build.gradle` dosyasında:
- `sourceCompatibility JavaVersion.VERSION_17`
- `targetCompatibility JavaVersion.VERSION_17`
- `jvmTarget = '17'`

## 7. Eksik Drawable Dosyalarını Oluştur

Android Studio'da:

1. `app/src/main/res/drawable/` klasörüne sağ tıklayın
2. **New > Vector Asset** seçin
3. Her ikon için:
   - **ic_dashboard**: Dashboard ikonu
   - **ic_health**: Health ikonu
   - **ic_water**: Water ikonu
   - **ic_community**: Community ikonu
   - **ic_profile**: Profile ikonu

**VEYA** basit XML drawable'lar oluşturun (aşağıdaki örnekler).

## 8. Projeyi Build Et

1. Üst menüden **Build > Make Project** seçin
2. VEYA `Ctrl+F9` (Windows) / `Cmd+F9` (Mac) tuşlarına basın
3. Build süreci başlayacak ve hataları göreceksiniz

## 9. Hataları Düzelt

### Olası Hatalar:

#### 9.1. Drawable Bulunamadı
**Hata:** `drawable/ic_dashboard not found`
**Çözüm:** Eksik drawable dosyalarını oluşturun (Adım 7)

#### 9.2. Navigation Graph Hatası
**Hata:** Navigation graph fragment'ları bulamıyor
**Çözüm:** `mobile_navigation.xml` dosyasındaki fragment ID'lerini kontrol edin

#### 9.3. ViewBinding Hatası
**Hata:** ViewBinding class'ları oluşturulamıyor
**Çözüm:** 
- `Build > Clean Project` yapın
- `Build > Rebuild Project` yapın

## 10. Emulator veya Cihaz Hazırla

### 10.1. Emulator Oluştur
1. **Tools > Device Manager** açın
2. **Create Device** tıklayın
3. Bir cihaz seçin (örn: Pixel 5)
4. Sistem görüntüsü seçin (API 34 - Android 14)
5. **Finish** tıklayın

### 10.2. Fiziksel Cihaz
1. Android cihazınızı USB ile bağlayın
2. Cihazda **Developer Options** açın
3. **USB Debugging** aktif edin
4. Android Studio'da cihazı görüyor olmalısınız

## 11. Uygulamayı Çalıştır

1. Üst menüden **Run > Run 'app'** seçin
2. VEYA yeşil **play** butonuna tıklayın
3. Cihaz/emulator seçin
4. **OK** tıklayın

## 12. APK Build (Release)

Release APK oluşturmak için:

1. Üst menüden **Build > Generate Signed Bundle / APK** seçin
2. **APK** seçin
3. **Next** tıklayın
4. Keystore oluşturun veya mevcut olanı seçin
5. **Next** tıklayın
6. **release** build variant'ını seçin
7. **Finish** tıklayın

APK şu konumda oluşacak:
```
app/build/outputs/apk/release/app-release.apk
```

## Önemli Notlar

- İlk build uzun sürebilir (10-15 dakika)
- İnternet bağlantısı gereklidir (bağımlılıklar için)
- API sunucusu çalışıyor olmalı (test için)
- Supabase credentials doğru olmalı

## Sorun Giderme

### Gradle Sync Başarısız
- İnternet bağlantınızı kontrol edin
- **File > Invalidate Caches / Restart** yapın
- Gradle wrapper versiyonunu kontrol edin

### Build Hatası
- **Build > Clean Project** yapın
- **Build > Rebuild Project** yapın
- Hata mesajını okuyun ve ilgili dosyayı düzeltin

### Emulator Çalışmıyor
- **Tools > SDK Manager** açın
- Android SDK ve emulator'ün yüklü olduğundan emin olun
- HAXM veya Hyper-V'nin aktif olduğundan emin olun




