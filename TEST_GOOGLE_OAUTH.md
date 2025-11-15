# Google OAuth Sorun Giderme Kılavuzu

## ✅ Durum Kontrolü (Tamamlandı)

### Backend Yapılandırması
- ✅ Google Provider aktif
- ✅ NEXTAUTH_URL: https://napibase.com
- ✅ Callback URL: https://napibase.com/api/auth/callback/google
- ✅ Environment variables set

### Sorun
URL'de `error=OAuthSignin` görünüyor. Bu NextAuth.js'in genel OAuth hatasıdır.

## 🔍 Olası Nedenler ve Çözümler

### 1. Google Cloud Console Ayarları (EN ÖNEMLİ)

**Adım 1: OAuth 2.0 Client ID Kontrol**
1. https://console.cloud.google.com/apis/credentials adresine gidin
2. Mevcut OAuth 2.0 Client ID'nizi bulun ve tıklayın
3. **Authorized redirect URIs** bölümünde MUTLAKA şu URL olmalı:
   ```
   https://napibase.com/api/auth/callback/google
   ```
   
**UYARI:** 
- URL'nin sonunda `/` olmamalı
- `http` değil `https` olmalı
- Tam olarak bu formatta olmalı

**Adım 2: OAuth Consent Screen**
1. Sol menüden "OAuth consent screen" seçin
2. Publishing status kontrol edin:
   - **"In production"** ise → Doğrudan çalışmalı
   - **"Testing"** ise → Test users eklenmiş olmalı

**Test Mode'daysa:**
1. "Test users" bölümüne tıklayın
2. "ADD USERS" butonuna tıklayın
3. Giriş yapacağınız Gmail adresinizi ekleyin
4. SAVE

### 2. Client ID ve Secret Kontrolü

**Cloudflare Pages'de doğru değerler var mı?**

Test için terminal'de çalıştırın:
```bash
curl https://napibase.com/api/auth/debug
```

Çıktıda:
- `GOOGLE_CLIENT_ID: "SET (hidden)"` ✅
- `GOOGLE_CLIENT_SECRET: "SET (hidden)"` ✅

Her ikisi de SET olmalı.

**Yanlış değerler girilmişse:**
1. Cloudflare Pages Dashboard > napifit > Settings > Environment variables
2. GOOGLE_CLIENT_ID ve GOOGLE_CLIENT_SECRET'i Google Console'dan kopyalayıp yapıştırın
3. Save
4. Settings > Builds & deployments > Redeploy

### 3. Tarayıcı Cache Problemi

1. **Incognito/Private pencere** açın
2. `https://napibase.com/login` adresine gidin
3. "Google ile devam et" butonuna tıklayın
4. Sonucu kontrol edin

### 4. Google API'leri Aktif mi?

1. https://console.cloud.google.com/apis/library adresine gidin
2. "Google+ API" veya "People API" arayın
3. Enable edin (disabled ise)

## 🧪 Test Adımları

### Manuel Test
1. Incognito pencere açın
2. https://napibase.com/login
3. "Google ile devam et" tıklayın
4. Google hesabı seçin
5. İzinleri kabul edin

### Beklenen Akış
```
napibase.com/login 
  → Google OAuth ekranı
  → İzin ver
  → napibase.com/api/auth/callback/google?code=...
  → napibase.com/onboarding
```

### Hata Durumunda URL
```
napibase.com/login?callbackUrl=...&error=OAuthSignin
```

Bu durumda:
1. Browser Console açın (F12)
2. Network sekmesinde "callback/google" isteğini bulun
3. Response'u kontrol edin
4. Hata mesajını görün

## 🔧 Hızlı Çözüm Kontrol Listesi

- [ ] Google Console'da redirect URI ekledim
- [ ] OAuth consent screen ayarlandı
- [ ] Test users eklendi (test mode ise)
- [ ] GOOGLE_CLIENT_ID doğru
- [ ] GOOGLE_CLIENT_SECRET doğru
- [ ] Cloudflare Pages redeploy yaptım
- [ ] 5 dakika bekledim (Google değişiklikleri yayması için)
- [ ] Incognito pencerede test ettim
- [ ] Browser cache temizledim

## 📞 Hala Çalışmıyorsa

### Server Loglarını Kontrol
Cloudflare Pages Dashboard > Deployment > Functions > Logs

OAuth callback sırasında hata mesajı görünebilir.

### NextAuth Debug Mode
Zaten aktif. Console'da `🔐 Sign in attempt:` logunu göreceksiniz.

### Client ID Doğrulama
Google Console'daki Client ID ile Cloudflare Pages'deki tam olarak aynı mı?
- Baştaki/sondaki boşluk yok mu?
- Copy-paste doğru yapıldı mı?

## ✨ Çalışır Hale Geldikten Sonra

Login sayfasından "Google ile devam et" butonuna tıklayınca:
1. Google hesap seçim ekranı açılacak
2. İzin ver diyeceksiniz
3. `/onboarding` sayfasına yönlendirileceksiniz
4. Profil bilgileriniz otomatik doldurulacak

---

**Son Güncelleme:** v0.1.19
**Status:** Backend hazır, Google Console ayarları bekleniyor

