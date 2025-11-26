# 🔧 Supabase Dependency - BOM 2.4.0 Fix

## ❌ Sorun

Build başarılı ama uyarı var:
```
Failed to resolve: io.github.jan-tennert.supabase:auth-kt:2.4.0
```

Explicit versiyonlar da çözümlenemiyor.

## ✅ Çözüm

### 1. BOM Kullanımına Geri Dönüldü
BOM 2.4.0 versiyonu ile denenecek:
- `bom:2.4.0` - Tüm Supabase dependency'leri için merkezi versiyon yönetimi
- `auth-kt` ve `postgrest-kt` - Versiyon belirtilmeden (BOM'dan alınacak)

### 2. Repository Yapılandırması Basitleştirildi
Content filtering kaldırıldı, tüm repository'ler açık bırakıldı:
- JitPack
- Sonatype OSS Releases
- Sonatype OSS Snapshots
- Maven Central (zaten var)

## 📝 Yapılan Değişiklikler

### settings.gradle
```gradle
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    repositories {
        google()
        mavenCentral()
        // Supabase Kotlin SDK repositories (try all possible sources)
        maven { url = uri("https://jitpack.io") }
        maven { url = uri("https://s01.oss.sonatype.org/content/repositories/releases/") }
        maven { url = uri("https://oss.sonatype.org/content/repositories/snapshots/") }
        // Maven Central should have it too
    }
}
```

### app/build.gradle
```gradle
// Supabase Auth - Try with BOM using latest version
// If BOM fails, we'll use explicit versions as fallback
implementation(platform("io.github.jan-tennert.supabase:bom:2.4.0"))
implementation("io.github.jan-tennert.supabase:auth-kt")
implementation("io.github.jan-tennert.supabase:postgrest-kt")
implementation("io.ktor:ktor-client-android:2.3.5")
```

## 🚀 Sonraki Adımlar

### 1. Cache Temizleme (ZORUNLU!)
1. **File > Invalidate Caches / Restart**
2. **"Invalidate and Restart"** seçin
3. Android Studio yeniden başlayacak

### 2. Gradle Sync
1. **File > Sync Project with Gradle Files**
   - VEYA
2. Gradle panelinde (sağ üstte) **elektrik ikonu**na tıklayın

### 3. Build
- Sync başarılı olduktan sonra **Build > Make Project**
- "Failed to resolve" uyarısı kaybolmalı

## 🐛 Sorun Giderme

### Hala "Failed to resolve" uyarısı varsa:

1. **Manuel Dependency Kontrolü:**
   Terminal'de dependency'leri kontrol edin:
   ```bash
   cd android-native
   ./gradlew dependencies --refresh-dependencies | grep supabase
   ```

2. **Alternatif BOM Versiyonları:**
   Eğer `2.4.0` çalışmazsa, şu versiyonları deneyin:
   ```gradle
   implementation(platform("io.github.jan-tennert.supabase:bom:2.3.0"))
   ```
   VEYA
   ```gradle
   implementation(platform("io.github.jan-tennert.supabase:bom:2.2.0"))
   ```

3. **Explicit Versiyonlar (Son Çare):**
   Eğer BOM hiç çalışmazsa, explicit versiyonlar kullanın:
   ```gradle
   implementation("io.github.jan-tennert.supabase:auth-kt:2.3.0")
   implementation("io.github.jan-tennert.supabase:postgrest-kt:2.3.0")
   ```

4. **Repository Kontrolü:**
   - İnternet bağlantınızı kontrol edin
   - Firewall/proxy ayarlarını kontrol edin
   - JitPack erişilebilir mi: https://jitpack.io/#io.github.jan-tennert/supabase
   - Maven Central'da var mı kontrol edin: https://mvnrepository.com/artifact/io.github.jan-tennert.supabase

5. **GitHub Repository Kontrolü:**
   Supabase Kotlin SDK'nın GitHub repository'sini kontrol edin:
   - https://github.com/supabase-community/supabase-kt
   - Releases sayfasından doğru versiyonu bulun
   - README'deki kurulum talimatlarını takip edin

## 📚 Notlar

- **BOM 2.4.0:** Daha stabil bir versiyon olabilir
- **Repository Sırası:** Tüm repository'ler açık, Gradle en uygun olanı bulacak
- **Content Filtering:** Kaldırıldı, tüm repository'ler taranacak
- **Fallback:** BOM çalışmazsa explicit versiyonlar kullanılabilir

## ✅ Beklenen Sonuç

- ✅ Gradle sync başarılı
- ✅ "Failed to resolve" uyarısı kayboldu
- ✅ Supabase dependency'leri çözümlendi
- ✅ Build başarılı
- ✅ Uygulama çalışıyor

## ⚠️ ÖNEMLİ

**Cache temizleme ZORUNLU!**
1. File > Invalidate Caches / Restart
2. File > Sync Project with Gradle Files
3. Build > Make Project

## 🔄 Alternatif Çözüm

Eğer hala çalışmazsa, Supabase Kotlin SDK'nın GitHub repository'sinden doğru kurulum talimatlarını kontrol edin:
- https://github.com/supabase-community/supabase-kt
- README.md dosyasındaki kurulum adımlarını takip edin




