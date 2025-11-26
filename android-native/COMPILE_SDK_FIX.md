# 🔧 Compile SDK ve AGP Güncelleme

## ❌ Sorun

Build hatası:
```
Dependency 'androidx.browser:browser:1.9.0' requires libraries and depend on it to compile against version 36 or later of the Android APIs.
:app is currently compiled against android-34.
```

## ✅ Çözüm

### 1. Compile SDK Güncellendi
- `compileSdk 34` → `compileSdk 36`
- `targetSdk 34` → `targetSdk 36`

### 2. Android Gradle Plugin Güncellendi
- `AGP 8.2.1` → `AGP 8.5.2`
- API 36 desteği eklendi

### 3. Supabase Dependency Düzeltildi
- BOM kullanımı tutarlı hale getirildi
- Manuel versiyon (3.2.6) kaldırıldı, BOM'dan versiyon alınıyor

## 📝 Yapılan Değişiklikler

### app/build.gradle
```gradle
android {
    namespace 'com.napibase.napifit'
    compileSdk 36  // 34'ten 36'ya güncellendi

    defaultConfig {
        applicationId "com.napibase.napifit"
        minSdk 24
        targetSdk 36  // 34'ten 36'ya güncellendi
        ...
    }
    ...
}

dependencies {
    ...
    // Supabase Auth - Using BOM for version management
    implementation(platform("io.github.jan-tennert.supabase:bom:2.5.0"))
    implementation("io.github.jan-tennert.supabase:auth-kt")  // BOM'dan versiyon alacak
    implementation("io.github.jan-tennert.supabase:postgrest-kt")  // BOM'dan versiyon alacak
    implementation("io.ktor:ktor-client-android:2.3.5")
    ...
}
```

### build.gradle
```gradle
dependencies {
    classpath 'com.android.tools.build:gradle:8.5.2'  // 8.2.1'den 8.5.2'ye güncellendi
    classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
}
```

## 🚀 Sonraki Adımlar

### 1. Gradle Sync (ZORUNLU!)
1. **File > Sync Project with Gradle Files**
   - VEYA
2. Gradle panelinde (sağ üstte) **elektrik ikonu**na tıklayın

### 2. AGP Upgrade Assistant (Önerilir)
Android Studio'da pop-up'ta:
1. **"Start AGP Upgrade Assistant"** butonuna tıklayın
2. AGP güncelleme sihirbazını takip edin
3. Otomatik güncellemeleri onaylayın

### 3. Build
- Sync başarılı olduktan sonra **Build > Make Project**
- Build başarılı olmalı

## 🐛 Sorun Giderme

### Hala compileSdk hatası alıyorsanız:

1. **AGP Upgrade Assistant Kullanın:**
   - Android Studio'da pop-up'ta "Start AGP Upgrade Assistant" butonuna tıklayın
   - Otomatik güncellemeleri onaylayın

2. **Manuel AGP Güncelleme:**
   Eğer `8.5.2` çalışmazsa, en son versiyonu kontrol edin:
   ```gradle
   classpath 'com.android.tools.build:gradle:8.6.0'  // En son versiyon
   ```

3. **Gradle Wrapper Güncelleme:**
   Terminal'de:
   ```bash
   cd android-native
   ./gradlew wrapper --gradle-version 8.5
   ```

4. **Cache Temizleme:**
   - File > Invalidate Caches / Restart
   - "Invalidate and Restart" seçin

## 📚 Notlar

- **compileSdk 36:** Android 14 (API 36) için gerekli
- **targetSdk 36:** Uygulamanın Android 14'e uyumlu olduğunu gösterir
- **AGP 8.5.2:** API 36 desteği sağlar
- **BOM kullanımı:** Tüm Supabase dependency'lerinin uyumlu versiyonlarda olmasını sağlar

## ✅ Beklenen Sonuç

- ✅ Gradle sync başarılı
- ✅ Compile SDK hatası kayboldu
- ✅ Build başarılı
- ✅ AGP güncellendi
- ✅ Uygulama çalışıyor

## ⚠️ ÖNEMLİ

**AGP Upgrade Assistant kullanmanız önerilir!**
Android Studio'da görünen pop-up'ta "Start AGP Upgrade Assistant" butonuna tıklayın. Bu, otomatik olarak tüm gerekli güncellemeleri yapacaktır.




