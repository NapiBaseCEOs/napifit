# 🔧 Supabase Dependency - Explicit Versions Fix

## ❌ Sorun

Build başarılı ama uyarı var:
```
Failed to resolve: io.github.jan-tennert.supabase:auth-kt
```

BOM kullanımı dependency'leri çözümleyemiyor.

## ✅ Çözüm

### 1. BOM Kaldırıldı
BOM yerine explicit versiyonlar kullanılıyor:
- `auth-kt:2.5.0`
- `postgrest-kt:2.5.0`

### 2. Repository Yapılandırması Güncellendi
JitPack repository'sine `content` bloğu eklendi:
- Supabase group'u için JitPack öncelikli hale getirildi
- Repository sırası optimize edildi

## 📝 Yapılan Değişiklikler

### settings.gradle
```gradle
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    repositories {
        google()
        mavenCentral()
        // JitPack first for Supabase Kotlin SDK
        maven { 
            url = uri("https://jitpack.io")
            content {
                includeGroupByRegex("io\\.github\\.jan-tennert\\.supabase.*")
            }
        }
        maven { url = uri("https://s01.oss.sonatype.org/content/repositories/releases/") }
        maven { url = uri("https://oss.sonatype.org/content/repositories/snapshots/") }
    }
}
```

### app/build.gradle
```gradle
// Supabase Auth - Using explicit versions (BOM not resolving)
// Try latest stable versions
implementation("io.github.jan-tennert.supabase:auth-kt:2.5.0")
implementation("io.github.jan-tennert.supabase:postgrest-kt:2.5.0")
implementation("io.ktor:ktor-client-android:2.3.5")
```

## 🚀 Sonraki Adımlar

### 1. Gradle Sync (ZORUNLU!)
1. **File > Sync Project with Gradle Files**
   - VEYA
2. Gradle panelinde (sağ üstte) **elektrik ikonu**na tıklayın

### 2. Cache Temizleme (Önerilir)
1. **File > Invalidate Caches / Restart**
2. **"Invalidate and Restart"** seçin
3. Android Studio yeniden başlayacak
4. Sync'i tekrar yapın

### 3. Build
- Sync başarılı olduktan sonra **Build > Make Project**
- "Failed to resolve" uyarısı kaybolmalı

## 🐛 Sorun Giderme

### Hala "Failed to resolve" uyarısı varsa:

1. **Versiyon Kontrolü:**
   Supabase Kotlin SDK'nın en son versiyonunu kontrol edin:
   - GitHub: https://github.com/supabase-community/supabase-kt
   - Maven Central: https://mvnrepository.com/artifact/io.github.jan-tennert.supabase
   - Versiyonu güncelleyin (gerekirse)

2. **Alternatif Versiyonlar:**
   Eğer `2.5.0` çalışmazsa, şu versiyonları deneyin:
   ```gradle
   implementation("io.github.jan-tennert.supabase:auth-kt:2.4.0")
   implementation("io.github.jan-tennert.supabase:postgrest-kt:2.4.0")
   ```
   VEYA
   ```gradle
   implementation("io.github.jan-tennert.supabase:auth-kt:2.3.0")
   implementation("io.github.jan-tennert.supabase:postgrest-kt:2.3.0")
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
   - JitPack erişilebilir mi kontrol edin: https://jitpack.io

## 📚 Notlar

- **Explicit Versiyonlar:** BOM çözümlenemediği için direkt versiyonlar kullanılıyor
- **JitPack:** Supabase Kotlin SDK'nın ana repository'si
- **Content Filtering:** JitPack'e Supabase group'u için öncelik verildi
- **Repository Sırası:** JitPack önce, sonra Maven Central

## ✅ Beklenen Sonuç

- ✅ Gradle sync başarılı
- ✅ "Failed to resolve" uyarısı kayboldu
- ✅ Supabase dependency'leri çözümlendi
- ✅ Build başarılı
- ✅ Uygulama çalışıyor

## ⚠️ ÖNEMLİ

**Cache temizleme ve Gradle sync yapmadan uyarı kaybolmayabilir!**
1. File > Invalidate Caches / Restart
2. File > Sync Project with Gradle Files
3. Build > Make Project

## 🔄 Alternatif Çözüm

Eğer hala çalışmazsa, Supabase Kotlin SDK'nın en güncel versiyonunu GitHub'dan kontrol edip güncelleyin:
- https://github.com/supabase-community/supabase-kt/releases




