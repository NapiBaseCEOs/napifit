# ✅ Google OAuth Callback URL - DOĞRU FORMAT

## 🎯 Doğru Callback URL

**Vercel için:**
```
https://napifit.vercel.app/api/auth/callback/google
```

**Custom domain için:**
```
https://napibase.com/api/auth/callback/google
```

## ❌ YANLIŞ ÖRNEKLER

- ❌ `https://napifit.vercel.app/api/auth/callback/g` (eksik - "google" olmalı)
- ❌ `https://napifit.vercel.app/api/auth/callback/google/` (sonunda `/` olmamalı)
- ❌ `http://napifit.vercel.app/api/auth/callback/google` (`https` olmalı)
- ❌ `napifit.vercel.app/api/auth/callback/google` (`https://` eksik)

## 📝 Google Cloud Console'da Nasıl Eklenir?

1. https://console.cloud.google.com/apis/credentials adresine gidin
2. OAuth 2.0 Client ID'nize tıklayın
3. **"Authorized redirect URIs"** bölümüne şunu ekleyin:
   ```
   https://napifit.vercel.app/api/auth/callback/google
   ```
4. **"Authorized JavaScript origins"** bölümüne şunu ekleyin:
   ```
   https://napifit.vercel.app
   ```
5. **SAVE** butonuna tıklayın

## ✅ Kontrol Listesi

- [ ] URL'nin sonunda `/` YOK
- [ ] `https` kullanılıyor (`http` değil)
- [ ] `/api/auth/callback/google` path tam olarak yazılmış
- [ ] Boşluk veya ekstra karakter YOK
- [ ] Domain doğru (napifit.vercel.app veya napibase.com)

## 🔍 NextAuth.js Callback Path

NextAuth.js otomatik olarak şu path'i kullanır:
- Provider: `google` → Callback: `/api/auth/callback/google`
- Provider: `github` → Callback: `/api/auth/callback/github`
- Provider: `facebook` → Callback: `/api/auth/callback/facebook`

**ÖNEMLİ:** Provider adı (`google`) callback path'in sonuna eklenir.

