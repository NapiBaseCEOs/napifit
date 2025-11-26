# 🔧 Supabase Dependency Fix - Final

## ❌ Sorun

Build hatası:
```
Could not find io.github.jan-tennert.supabase:auth-kt
ModuleVersionNotFoundException
```

## ✅ Çözüm

### 1. Repository Eklendi
`settings.gradle` dosyasına Supabase repository'leri eklendi:
- JitPack (Supabase Kotlin SDK için)
- Sonatype OSS (alternatif repository)

### 2. BOM (Bill of Materials) Kullanımı
`app/build.gradle` dosyasında BOM kullanılarak versiyon yönetimi yapılıyor:
- `bom:2.5.0` - Tüm Supabase dependency'leri için merkezi versiyon yönetimi
- `auth-kt` ve `postgrest-kt` - Versiyon belirtilmeden (BOM'dan alınacak)

## 📝 Yapılan Değişiklikler

### settings.gradle
```gradle
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    repositories {
        google()
        mavenCentral()
        maven { url = uri("https://jitpack.io") }
        maven { url = uri("https://s01.oss.sonatype.org/content/repositories/releases/") }
    }
}
```

### app/build.gradle
```gradle
// Supabase Auth - Using BOM for version management
implementation(platform("io.github.jan-tennert.supabase:bom:2.5.0"))
implementation("io.github.jan-tennert.supabase:auth-kt")
implementation("io.github.jan-tennert.supabase:postgrest-kt")
implementation("io.ktor:ktor-client-android:2.3.5")
```

## 🚀 Sonraki Adımlar

1. **Gradle Sync:**
   - File > Sync Project with Gradle Files
   - Supabase dependency'leri indirilecek

2. **Build:**
   - Build > Make Project
   - Build başarılı olmalı

3. **Test:**
   - Run > Run 'app'
   - Uygulama çalışmalı

## 📚 Notlar

- BOM kullanımı tüm Supabase dependency'lerinin uyumlu versiyonlarda olmasını sağlar
- JitPack repository Supabase Kotlin SDK'nın ana repository'sidir
- Sonatype OSS alternatif bir repository'dir

## 🐛 Sorun Giderme

### Hala "Could not find" hatası alıyorsanız:

1. **Cache Temizleme:**
   - File > Invalidate Caches / Restart
   - Gradle sync tekrar yapın

2. **Gradle Wrapper Güncelleme:**
   - `gradle-wrapper.properties` dosyasını kontrol edin
   - Gradle versiyonu 8.5 olmalı

3. **İnternet Bağlantısı:**
   - İnternet bağlantınızı kontrol edin
   - Firewall/proxy ayarlarını kontrol edin

4. **Manuel Dependency Kontrolü:**
   - Supabase Kotlin SDK'nın en son versiyonunu kontrol edin
   - BOM versiyonunu güncelleyin (gerekirse)

## ✅ Beklenen Sonuç

- ✅ Gradle sync başarılı
- ✅ Build başarılı
- ✅ Supabase dependency'leri çözümlendi
- ✅ Uygulama çalışıyor




