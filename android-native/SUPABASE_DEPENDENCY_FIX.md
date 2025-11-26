# Supabase Dependency Hatası Düzeltmesi

## 🔴 Sorun
**"Failed to resolve: io.github.jan-tennert.supabase:auth-kt:2.5.0"**

Supabase Kotlin SDK dependency'leri çözülemiyor.

## ✅ Yapılan Düzeltmeler

### 1. BOM (Bill of Materials) Kullanımı
Supabase dependency'leri artık BOM kullanarak yönetiliyor:
- `platform("io.github.jan-tennert.supabase:bom:2.5.0")` eklendi
- Bu, tüm Supabase modüllerinin uyumlu versiyonlarını sağlar
- `auth-kt` ve `postgrest-kt` artık versiyon numarası olmadan kullanılıyor

### 2. Repository Temizlendi
- JitPack repository kaldırıldı (Supabase Maven Central'da)
- Sadece `google()` ve `mavenCentral()` kullanılıyor

## 📋 Android Studio'da Yapılacaklar

### 1. Gradle Sync'i Tekrar Deneyin
1. **File > Sync Project with Gradle Files** seçin
2. VEYA sağ üstteki **elephant ikonu**na tıklayın
3. Sync tamamlanana kadar bekleyin (2-3 dakika)

### 2. Eğer Hala Hata Varsa

#### Cache Temizleme
1. **File > Invalidate Caches / Restart** seçin
2. **Invalidate and Restart** tıklayın
3. Android Studio yeniden başladığında sync'i tekrar deneyin

#### Offline Mode Kontrolü
1. **File > Settings > Build, Execution, Deployment > Build Tools > Gradle** açın
2. **Offline work** checkbox'ının **işaretli olmadığından** emin olun
3. **Apply** ve **OK** tıklayın
4. Sync'i tekrar deneyin

#### İnternet Bağlantısı Kontrolü
- Maven Central'a erişim olduğundan emin olun
- Firewall veya proxy ayarlarını kontrol edin

## ✅ Başarı Kontrolü

Sync başarılı olduğunda:
- ✅ "Failed to resolve" hatası kaybolacak
- ✅ Alt panelde "BUILD SUCCESSFUL" görünecek
- ✅ Supabase dependency'leri indirilecek
- ✅ Proje yapısı düzgün görünecek

## 📚 Supabase Kotlin SDK Versiyonları

**BOM Versiyonu:** 2.5.0
- `auth-kt`: BOM'dan otomatik versiyon alır
- `postgrest-kt`: BOM'dan otomatik versiyon alır
- `ktor-client-android`: 2.3.5 (manuel belirtildi)

## 🔍 Alternatif Çözüm (Gerekirse)

Eğer BOM çalışmazsa, manuel versiyonlar kullanılabilir:

```gradle
implementation 'io.github.jan-tennert.supabase:auth-kt:2.3.0'
implementation 'io.github.jan-tennert.supabase:postgrest-kt:2.3.0'
```

Ancak önce BOM yöntemini deneyin, daha güvenilir.




