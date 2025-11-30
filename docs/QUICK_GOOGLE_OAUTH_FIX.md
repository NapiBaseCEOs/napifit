# 🚀 Google OAuth Hızlı Çözüm

## TL;DR

Site backend'i %100 hazır. Sorun sadece **Google Cloud Console** ayarlarında.

## ✅ 3 Dakikada Çözüm

### 1. Google Console Aç
https://console.cloud.google.com/apis/credentials

### 2. OAuth Client ID Tıkla
Mevcut OAuth 2.0 Client ID'nize tıklayın

### 3. Bu URL'yi Ekle

**Authorized redirect URIs** bölümüne:
```
https://napibase.com/api/auth/callback/google
```

**Authorized JavaScript origins** bölümüne:
```
https://napibase.com
```

### 4. SAVE Butonu
En alttaki SAVE butonuna tıklayın

### 5. Test Users (Eğer "Testing" modundaysa)
- OAuth consent screen sayfasına gidin
- Test users bölümüne Gmail adresinizi ekleyin

### 6. 5 Dakika Bekle + Test

Incognito pencerede:
```
https://napibase.com/login → Google ile devam et
```

## 🔍 Şüphe Duyuyorsanız

### Client ID/Secret Yenile

1. Google Console > Credentials
2. Mevcut OAuth Client ID'yi açın  
3. **Client ID** ve **Client secret**'i kopyalayın
4. Cloudflare Pages > Settings > Environment variables
5. `GOOGLE_CLIENT_ID` = [paste]
6. `GOOGLE_CLIENT_SECRET` = [paste]  
7. Save
8. Redeploy

## ✨ Çalışınca

```
✅ Google hesap seçimi
✅ İzin ekranı  
✅ /onboarding'e yönlendirme
✅ Profil bilgileri dolu
```

---

**Backend:** ✅ READY (v0.1.21)  
**Google Console:** ⏳ Kontrol edilmeli

