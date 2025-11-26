# 🔍 Uygulama Crash Debug Rehberi

## ❌ Sorun

Uygulama açılmadan kapanıyor (crash).

## 🔧 Yapılan Düzeltmeler

### 1. Theme Düzeltildi
- `Theme.Material3.Dark.NoActionBar` → `Theme.MaterialComponents.DayNight.NoActionBar`
- Material3 dependency'si yok, Material Components kullanılıyor

### 2. MainActivity Güvenli Hale Getirildi
- Try-catch eklendi
- Detaylı log'lar eklendi
- Hata mesajları görüntüleniyor

## 🐛 Debug Adımları

### 1. Logcat'i Kontrol Edin
Android Studio'da:
1. **View > Tool Windows > Logcat** açın
2. Filtre: `MainActivity` veya `AndroidRuntime`
3. Crash log'unu kontrol edin

### 2. Common Crash Sebepleri

#### A. Resource Not Found
```
android.content.res.Resources$NotFoundException
```
**Çözüm:** Eksik resource'ları kontrol edin (layout, drawable, string, color)

#### B. ClassNotFoundException
```
java.lang.ClassNotFoundException
```
**Çözüm:** Fragment veya Activity class'larının doğru pakette olduğundan emin olun

#### C. NullPointerException
```
java.lang.NullPointerException
```
**Çözüm:** findViewById veya binding null kontrolü yapın

#### D. Theme Not Found
```
android.view.InflateException: Binary XML file line #X: Error inflating class
```
**Çözüm:** Theme parent'ının doğru olduğundan emin olun

## 📝 Kontrol Edilecekler

### 1. Layout Dosyaları
Tüm fragment layout'ları var mı?
- `fragment_dashboard.xml` ✅
- `fragment_health.xml` ✅
- `fragment_water.xml` ✅
- `fragment_community.xml` ✅
- `fragment_profile.xml` ✅

### 2. Resource Dosyaları
- `strings.xml` - Tüm string'ler var mı? ✅
- `colors.xml` - Tüm color'lar var mı? ✅
- `themes.xml` - Theme doğru mu? ✅ (Düzeltildi)

### 3. Navigation
- `mobile_navigation.xml` - Tüm fragment'ler tanımlı mı? ✅
- `bottom_nav_menu.xml` - Tüm menu item'lar var mı? ✅

### 4. Fragment Classes
Tüm fragment class'ları var mı?
- `DashboardFragment.kt` ✅
- `HealthFragment.kt` ✅
- `WaterFragment.kt` ✅
- `CommunityFragment.kt` ✅
- `ProfileFragment.kt` ✅

## 🚀 Sonraki Adımlar

### 1. Logcat'i Kontrol Edin
Logcat'te hata mesajını bulun ve paylaşın.

### 2. Build > Clean Project
Bazen cache sorunları olabilir:
- **Build > Clean Project**
- **Build > Rebuild Project**

### 3. Invalidate Caches
- **File > Invalidate Caches / Restart**
- **"Invalidate and Restart"** seçin

## 📚 Notlar

- **Theme:** Material3 yerine Material Components kullanılıyor
- **Logging:** MainActivity'de detaylı log'lar eklendi
- **Error Handling:** Try-catch ile hatalar yakalanıyor

## 🔍 Logcat Komutları

Terminal'de:
```bash
adb logcat | grep -i "MainActivity\|AndroidRuntime\|FATAL"
```

Veya Android Studio'da:
- **View > Tool Windows > Logcat**
- Filtre: `tag:MainActivity` veya `level:error`




