# 🚀 Android Studio'da Yapılacaklar - Adım Adım

## ✅ HAZIRLIK (5 dakika)

### 1. Android Studio'yu Aç
- Windows Başlat menüsünden "Android Studio" arayın ve açın
- İlk açılışsa, kurulum sihirbazını tamamlayın

### 2. Projeyi Aç
- Android Studio açıldığında **"Open"** butonuna tıklayın
- Şu klasörü seçin: `C:\Users\Administrator\Desktop\NapiBase\android-native`
- **"OK"** tıklayın

### 3. ⚠️ ÖNEMLİ: Gradle JDK Ayarlayın (İlk Açılışta Gerekli)

**Eğer "Incompatible Gradle JVM" hatası görüyorsanız:**

1. **File > Settings** açın (veya `Ctrl+Alt+S`)
2. **Build, Execution, Deployment > Build Tools > Gradle** seçin
3. **Gradle JDK** dropdown'ından **jbr-17** veya **Embedded JDK** seçin
4. **Apply** ve **OK** tıklayın

### 4. Gradle Sync Bekle
- Android Studio otomatik olarak Gradle sync başlatacak
- Sağ altta "Gradle sync" mesajını göreceksiniz
- **İlk kez açıyorsanız 10-15 dakika sürebilir** (bağımlılıklar indiriliyor)
- Sync tamamlanana kadar bekleyin
- **Eğer hata görürseniz:** `GRADLE_FIX.md` dosyasına bakın

---

## ⚙️ YAPILANDIRMA (10 dakika)

### 4. API URL'ini Güncelle

**Dosya:** `app/build.gradle`

**Bulun:**
```gradle
buildConfigField "String", "API_BASE_URL", "\"https://your-api-server.com/api\""
```

**Değiştirin:**
```gradle
buildConfigField "String", "API_BASE_URL", "\"http://localhost:3001/api\""
```

**VEYA** eğer API sunucusunu deploy ettinizse:
```gradle
buildConfigField "String", "API_BASE_URL", "\"https://your-deployed-api.com/api\""
```

**Nasıl:**
1. Sol panelde `app` > `build.gradle` dosyasını açın
2. `defaultConfig` bölümünü bulun
3. `API_BASE_URL` satırını bulun ve değiştirin
4. Dosyayı kaydedin (`Ctrl+S`)

### 5. Supabase Credentials Güncelle

**Dosya:** `app/src/main/java/com/napibase/napifit/auth/AuthManager.kt`

**Bulun:**
```kotlin
private val supabaseUrl = "YOUR_SUPABASE_URL"
private val supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY"
```

**Değiştirin:**
```kotlin
private val supabaseUrl = "https://xxxxx.supabase.co"  // Gerçek Supabase URL'iniz
private val supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  // Gerçek anon key'iniz
```

**Nasıl:**
1. Sol panelde `app` > `src` > `main` > `java` > `com` > `napibase` > `napifit` > `auth` > `AuthManager.kt` dosyasını açın
2. Dosyanın üst kısmında `supabaseUrl` ve `supabaseAnonKey` değişkenlerini bulun
3. Gerçek değerlerinizi yazın
4. Dosyayı kaydedin

**Supabase credentials nerede:**
- Ana projede `.env` dosyasında `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🔨 BUILD (5 dakika)

### 6. Projeyi Build Et

1. Üst menüden **Build > Make Project** seçin
   - VEYA `Ctrl+F9` tuşlarına basın
2. Build süreci başlayacak
3. Alt panelde "Build" sekmesinde ilerlemeyi göreceksiniz
4. Hatalar varsa kırmızı olarak gösterilecek

### 7. Hataları Kontrol Et

**Eğer hata varsa:**

#### Drawable Bulunamadı Hatası
- ✅ Zaten oluşturuldu (ic_dashboard, ic_health, ic_water, ic_community, ic_profile)
- Eğer hala hata varsa: **Build > Clean Project** yapın, sonra **Build > Rebuild Project**

#### ViewBinding Hatası
- **Build > Clean Project** yapın
- **Build > Rebuild Project** yapın

#### Diğer Hatalar
- Hata mesajını okuyun
- İlgili dosyayı açın ve düzeltin
- Tekrar build edin

---

## 📱 ÇALIŞTIRMA (5 dakika)

### 8. Emulator veya Cihaz Hazırla

#### Seçenek A: Emulator (Önerilen - İlk Test İçin)

1. Üst menüden **Tools > Device Manager** açın
2. **Create Device** butonuna tıklayın
3. Bir cihaz seçin (örn: **Pixel 5**)
4. **Next** tıklayın
5. Sistem görüntüsü seçin:
   - **API 34** (Android 14) - Önerilen
   - VEYA **API 33** (Android 13)
   - **Download** butonuna tıklayarak indirin (gerekirse)
6. **Next** > **Finish** tıklayın
7. Emulator listesinde cihazınızı göreceksiniz
8. **Play** butonuna tıklayarak emulator'ü başlatın

#### Seçenek B: Fiziksel Cihaz

1. Android telefonunuzu USB ile bilgisayara bağlayın
2. Telefonda:
   - **Ayarlar** > **Telefon Hakkında** > **Yapı Numarası**'na 7 kez tıklayın (Developer Options açılır)
   - **Ayarlar** > **Geliştirici Seçenekleri** > **USB Hata Ayıklama** aktif edin
3. Android Studio'da cihazınızı göreceksiniz

### 9. Uygulamayı Çalıştır

1. Üst menüden **Run > Run 'app'** seçin
   - VEYA yeşil **▶️ play** butonuna tıklayın
2. Cihaz/emulator seçin
3. **OK** tıklayın
4. Uygulama build edilecek ve cihazda açılacak

**İlk çalıştırma 2-3 dakika sürebilir.**

---

## 📦 APK OLUŞTURMA (10 dakika)

### 10. Release APK Build

1. Üst menüden **Build > Generate Signed Bundle / APK** seçin
2. **APK** seçin, **Next** tıklayın
3. **Create new...** tıklayın (ilk kez)
4. Keystore bilgilerini doldurun:
   - **Key store path:** Bir klasör seçin ve `napifit-release.keystore` yazın
   - **Password:** Güçlü bir şifre (unutmayın!)
   - **Key alias:** `napifit`
   - **Key password:** Aynı şifre veya farklı (unutmayın!)
   - **Validity:** 10000 (yıl)
   - **Certificate bilgileri:** İsteğe bağlı
5. **OK** tıklayın
6. **Next** tıklayın
7. **release** build variant'ını seçin
8. **V1 (Jar Signature)** ve **V2 (Full APK Signature)** işaretleyin
9. **Finish** tıklayın
10. Build tamamlandığında bildirim göreceksiniz
11. **locate** linkine tıklayarak APK'nın yerini görebilirsiniz

**APK Konumu:**
```
app/build/outputs/apk/release/app-release.apk
```

---

## ✅ KONTROL LİSTESİ

- [ ] Android Studio açıldı
- [ ] Proje açıldı (`android-native` klasörü)
- [ ] Gradle sync tamamlandı (hata yok)
- [ ] `app/build.gradle` içinde `API_BASE_URL` güncellendi
- [ ] `AuthManager.kt` içinde Supabase credentials güncellendi
- [ ] Proje build edildi (hata yok)
- [ ] Emulator veya cihaz hazır
- [ ] Uygulama çalıştırıldı (cihazda açıldı)
- [ ] APK oluşturuldu (opsiyonel)

---

## 🆘 SORUN GİDERME

### Gradle Sync Başarısız
- İnternet bağlantınızı kontrol edin
- **File > Invalidate Caches / Restart** yapın
- **File > Sync Project with Gradle Files** tekrar deneyin

### Build Hatası
- **Build > Clean Project** yapın
- **Build > Rebuild Project** yapın
- Hata mesajını okuyun ve ilgili dosyayı düzeltin

### Emulator Çalışmıyor
- **Tools > SDK Manager** açın
- Android SDK ve emulator'ün yüklü olduğundan emin olun
- HAXM veya Hyper-V'nin aktif olduğundan emin olun

### Uygulama Çöküyor
- **Logcat** sekmesinde hata mesajlarını kontrol edin
- API sunucusunun çalıştığından emin olun
- Supabase credentials'ların doğru olduğundan emin olun

---

## 📞 SONRAKI ADIMLAR

1. **API Sunucusunu Başlat:**
   ```bash
   cd api-server
   npm install
   npm run dev
   ```

2. **Test Et:**
   - Uygulamayı açın
   - Login/Register ekranını test edin
   - API bağlantısını test edin

3. **Geliştirmeye Devam:**
   - UI'ı tamamlayın
   - Room database ekleyin (offline support)
   - Push notifications ekleyin

