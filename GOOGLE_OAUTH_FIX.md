# 🔧 Google OAuth Tam Çözüm Kılavuzu (v0.1.21)

## ✅ Backend Durumu

Tüm kontroller tamamlandı ve backend %100 hazır:

```
✅ NextAuth yapılandırması: OK
✅ Google Provider: Active  
✅ Callback URL: https://napibase.com/api/auth/callback/google
✅ NEXTAUTH_URL: https://napibase.com
✅ GOOGLE_CLIENT_ID: SET
✅ GOOGLE_CLIENT_SECRET: SET
✅ AUTH_SECRET: SET
✅ JWT-only mode: Active (DB hatası OAuth'u engellemez)
```

## ❌ Mevcut Hata

```
URL: /login?callbackUrl=https%3A%2F%2Fnapibase.com%2Fonboarding&error=OAuthSignin
```

Bu hata **Google Cloud Console ayarlarından** kaynaklanıyor.

## 🎯 KESIN ÇÖZÜM - Adım Adım

### ADIM 1: Google Cloud Console - Credentials Sayfası

1. https://console.cloud.google.com/apis/credentials adresini açın
2. **Doğru projeyi** seçtiğinizden emin olun (üst kısımda proje adı)
3. "Credentials" altında **OAuth 2.0 Client IDs** bölümünü bulun
4. Mevcut Client ID'nizin adına tıklayın (örn: "Web client 1")

### ADIM 2: Client ID ve Secret Kontrolü

**ÖNEMLİ:** Ekranda gösterilen:
- **Client ID** → Bu, Cloudflare Pages'deki `GOOGLE_CLIENT_ID` ile **TAM OLARAK** aynı olmalı
- **Client secret** → Bu, Cloudflare Pages'deki `GOOGLE_CLIENT_SECRET` ile **TAM OLARAK** aynı olmalı

**Eğer şüpheniz varsa:**
1. Google Console'dan Client ID ve Secret'i kopyalayın
2. Cloudflare Pages > napifit > Settings > Environment variables
3. `GOOGLE_CLIENT_ID` ve `GOOGLE_CLIENT_SECRET`'i silin
4. Yeniden ekleyin (paste yapın)
5. Save
6. Redeploy

### ADIM 3: Authorized Redirect URIs

Ekranın alt kısmında "Authorized redirect URIs" bölümünde şu URL'in **TAM OLARAK** ekli olması gerekiyor:

```
https://napibase.com/api/auth/callback/google
```

**Kontrol listesi:**
- [ ] URL'nin sonunda `/` YOK
- [ ] `https` kullanılıyor (`http` değil)
- [ ] `napibase.com` yazımı doğru
- [ ] `/api/auth/callback/google` path doğru
- [ ] Boşluk veya ekstra karakter YOK

**Ekleme:**
1. "ADD URI" butonuna tıklayın
2. Tam olarak şunu yapıştırın: `https://napibase.com/api/auth/callback/google`
3. Enter'a basın
4. Listenin içinde göründüğünden emin olun

### ADIM 4: Authorized JavaScript Origins

"Authorized JavaScript origins" bölümünde şu URL'in ekli olması gerekiyor:

```
https://napibase.com
```

**Ekleme:**
1. "ADD URI" butonuna tıklayın
2. Tam olarak şunu yapıştırın: `https://napibase.com`
3. Enter'a basın

### ADIM 5: SAVE

**ÇOK ÖNEMLİ:**
- Ekranın en altındaki **"SAVE"** butonuna tıklayın
- "Credentials saved" mesajını görene kadar bekleyin
- **Save etmeden çıkmayın!**

### ADIM 6: OAuth Consent Screen Kontrolü

1. Sol menüden **"OAuth consent screen"** seçin
2. **Publishing status** kontrol edin:

**"In production" ise:**
- ✅ Herkes giriş yapabilir, başka bir şey yapmanıza gerek yok

**"Testing" ise:**
- ⚠️ Sadece test kullanıcıları giriş yapabilir
- "Test users" bölümüne tıklayın
- "ADD USERS" butonuna tıklayın
- Giriş yapacağınız **Gmail adresinizi** ekleyin
- SAVE

### ADIM 7: 5 Dakika Bekleyin

Google değişiklikleri tüm sunuculara yaymak için 5 dakika alır.
Kahve molası verin ☕

### ADIM 8: Test

1. **Yeni Incognito pencere** açın (Ctrl+Shift+N)
2. `https://napibase.com/login` adresine gidin
3. "Google ile devam et" butonuna tıklayın
4. Gmail hesabınızı seçin
5. İzinleri kabul edin

**Beklenen:**
```
✅ Google hesap seçimi
✅ İzin ekranı
✅ Yönlendirme: /onboarding
```

## 🔍 Hala Çalışmıyorsa - Debug

### Network Tab Kontrolü

1. F12 → **Network** sekmesi
2. "Google ile devam et" tıklayın
3. Filtrede "callback" yazın
4. `callback/google` isteğini bulun
5. **Response** tab'ına bakın

**Olası hatalar ve anlamları:**

| Hata Kodu | Anlam | Çözüm |
|-----------|-------|-------|
| `redirect_uri_mismatch` | Redirect URI Google Console'da yok veya farklı | ADIM 3'ü tekrar yapın |
| `invalid_client` | Client ID veya Secret yanlış | ADIM 2'yi tekrar yapın |
| `access_denied` | Kullanıcı test users'da değil | ADIM 6'yı kontrol edin |
| `unauthorized_client` | OAuth consent screen tamamlanmamış | Consent screen'i tamamlayın |

### Console Log Kontrolü

1. F12 → **Console** sekmesi
2. "Google ile devam et" tıklayın
3. Kırmızı hata mesajlarına bakın
4. Hata mesajını bana gönderin

## 📞 Hala Çalışmıyorsa

Aşağıdaki bilgileri paylaşın:

1. **Network Tab'dan:**
   - `callback/google` request'inin Response body
   - Status code

2. **Google Console Screenshot:**
   - Authorized redirect URIs listesi
   - OAuth consent screen status

3. **Cloudflare Pages Environment Variables:**
   - `NEXTAUTH_URL` değeri
   - `GOOGLE_CLIENT_ID` ilk 10 karakteri

Bu bilgilerle kesin sorunu bulup çözeriz!

---

**Son Güncelleme:** v0.1.21  
**Backend Status:** ✅ READY  
**Google Console:** ⚠️ Manuel kontrol gerekli

