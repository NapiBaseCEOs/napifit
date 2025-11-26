# Gradle JDK Seçimi - Adım Adım

## ⚠️ Mevcut Durum
Android Studio'da **Java 21** seçili, ancak **Gradle 8.5 Java 21'i desteklemiyor** (maksimum Java 19).

## ✅ Çözüm: Java 17 veya 19 Seçin

### Seçenek 1: Download JDK (Önerilen - 2 dakika)

1. Settings dialog'unda **"Gradle JDK"** dropdown'ını açın
2. **"Download JDK..."** seçeneğine tıklayın
3. Açılan dialog'da:
   - **Vendor:** JetBrains Runtime
   - **Version:** **17** (LTS) veya **19** seçin
   - **Location:** Varsayılan konumu kullanın
4. **Download** tıklayın
5. İndirme tamamlandığında otomatik olarak seçilecek
6. **Apply** ve **OK** tıklayın

### Seçenek 2: Android Studio Embedded JDK (Hızlı)

Eğer Android Studio'nun kendi JDK'sı varsa:

1. **"Gradle JDK"** dropdown'ını açın
2. **"Embedded JDK"** veya **"jbr-17"** veya **"jbr-19"** seçeneğini arayın
3. Eğer görünmüyorsa, Seçenek 1'i kullanın

### Seçenek 3: Manuel JDK Ekleme

Eğer sisteminizde Java 17 veya 19 yüklüyse:

1. **"Gradle JDK"** dropdown'ını açın
2. **"Add JDK from disk..."** seçeneğine tıklayın
3. Java yükleme klasörünü seçin (örn: `C:\Program Files\Java\jdk-17`)
4. **OK** tıklayın
5. Dropdown'dan yeni eklenen JDK'yı seçin

## 📋 Önerilen Seçim

**En İyi Seçenek:** JetBrains Runtime 17 (LTS)
- ✅ En stabil
- ✅ Android için standart
- ✅ Gradle 8.5 ile tam uyumlu

## ✅ Ayarları Kaydetme

1. JDK'yı seçtikten sonra:
   - **Apply** tıklayın (ayarları kaydeder, dialog açık kalır)
   - **OK** tıklayın (ayarları kaydeder ve dialog'u kapatır)

2. Gradle sync'i otomatik başlayacak veya:
   - **File > Sync Project with Gradle Files** seçin

## 🎯 Başarı Kontrolü

Sync başarılı olduğunda:
- ✅ Alt panelde "BUILD SUCCESSFUL" görünecek
- ✅ "Incompatible Gradle JVM" hatası kaybolacak
- ✅ Proje yapısı düzgün görünecek

## ⚠️ Önemli Notlar

- **Java 21 kullanmayın** - Gradle 8.5 desteklemiyor
- **Java 17 veya 19 kullanın** - Tam uyumlu
- **Java 8 kullanmayın** - Çok eski, modern Android için yetersiz




