# 🔧 Supabase Repository Fix

## ❌ Sorun

Build hatası:
```
Could not find io.github.jan-tennert.supabase:auth-kt
```

## ✅ Çözüm

### 1. Repository Yapılandırması Güncellendi
`settings.gradle` dosyasında repository'lere `content` bloğu eklendi:
- JitPack repository'sine Supabase group'u eklendi
- Sonatype OSS repository'sine Supabase group'u eklendi

### 2. Explicit Versiyon Kullanımı
BOM yerine direkt versiyon numaraları kullanılıyor:
- `auth-kt:2.5.0`
- `postgrest-kt:2.5.0`

## 📝 Yapılan Değişiklikler

### settings.gradle
```gradle
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    repositories {
        google()
        mavenCentral()
        maven { 
            url = uri("https://jitpack.io")
            content {
                includeGroup("io.github.jan-tennert.supabase")
            }
        }
        maven { 
            url = uri("https://s01.oss.sonatype.org/content/repositories/releases/")
            content {
                includeGroup("io.github.jan-tennert.supabase")
            }
        }
    }
}
```

### app/build.gradle
```gradle
// Supabase Auth - Using explicit versions with JitPack
implementation("io.github.jan-tennert.supabase:auth-kt:2.5.0")
implementation("io.github.jan-tennert.supabase:postgrest-kt:2.5.0")
implementation("io.ktor:ktor-client-android:2.3.5")
```

## 🚀 Sonraki Adımlar

### 1. Gradle Sync (ZORUNLU!)
Android Studio'da:
1. **File > Sync Project with Gradle Files**
   - VEYA
2. Üstteki sarı banner'da **"Sync Now"** butonuna tıklayın
   - VEYA
3. Gradle panelinde (sağ üstte) **elektrik ikonu**na tıklayın

### 2. Sync Tamamlanana Kadar Bekleyin
- Alt kısımda "Gradle sync in progress..." mesajı görünecek
- Sync tamamlandığında "Gradle sync finished" mesajı görünecek

### 3. Build
- Sync başarılı olduktan sonra **Build > Make Project**
- Build başarılı olmalı

## 🐛 Sorun Giderme

### Hala "Could not find" hatası alıyorsanız:

1. **Cache Temizleme:**
   ```
   File > Invalidate Caches / Restart
   "Invalidate and Restart" seçin
   ```

2. **Gradle Wrapper Güncelleme:**
   Terminal'de:
   ```bash
   cd android-native
   ./gradlew wrapper --gradle-version 8.5
   ```

3. **Manuel Dependency İndirme:**
   Terminal'de:
   ```bash
   cd android-native
   ./gradlew dependencies --refresh-dependencies
   ```

4. **Repository Kontrolü:**
   - İnternet bağlantınızı kontrol edin
   - Firewall/proxy ayarlarını kontrol edin
   - VPN kullanıyorsanız kapatıp deneyin

## 📚 Notlar

- `content` bloğu Gradle'a hangi repository'den hangi dependency'leri alacağını söyler
- Bu, dependency resolution'ı hızlandırır ve doğru repository'yi kullanmayı garanti eder
- JitPack, GitHub projeleri için Maven repository sağlar
- Sonatype OSS, alternatif bir Maven repository'dir

## ✅ Beklenen Sonuç

- ✅ Gradle sync başarılı
- ✅ Supabase dependency'leri indirildi
- ✅ Build başarılı
- ✅ Uygulama çalışıyor

## ⚠️ ÖNEMLİ

**Gradle Sync yapmadan build başarısız olur!**
Android Studio'da sarı banner'da "Sync Now" butonuna tıklayın veya File > Sync Project with Gradle Files yapın.




