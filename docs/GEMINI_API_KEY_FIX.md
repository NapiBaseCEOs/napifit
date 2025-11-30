# 🔧 GEMINI_API_KEY Sorunu ve Çözümü

## ❌ Sorun
"AI API anahtarı geçersiz veya eksik" hatası alıyorsunuz.

## 🔍 Tespit Edilen Sorun
API key'de **HTTP referrer kısıtlaması** var. Bu, API key'in sadece belirli domain'lerden kullanılmasına izin verildiği anlamına geliyor.

Hata mesajı:
```
[403 Forbidden] Requests from referer <empty> are blocked.
API_KEY_HTTP_REFERRER_BLOCKED
```

## ✅ Çözüm Adımları

### 1. Google AI Studio'ya Gidin
https://aistudio.google.com/app/apikey

### 2. API Key'i Düzenleyin veya Yeni Key Oluşturun

**Seçenek A: Kısıtlamaları Kaldırın (Önerilen)**
1. Mevcut API key'in yanındaki **"Edit"** butonuna tıklayın
2. **"API restrictions"** bölümünde **"Don't restrict key"** seçeneğini seçin
3. **"Save"** butonuna tıklayın

**Seçenek B: Domain Kısıtlaması Ekleyin**
1. Mevcut API key'in yanındaki **"Edit"** butonuna tıklayın
2. **"API restrictions"** bölümünde **"HTTP referrers (web sitesi)"** seçeneğini seçin
3. Şu domain'leri ekleyin:
   ```
   https://napibase.com/*
   https://*.vercel.app/*
   http://localhost:3000/*
   ```
4. **"Save"** butonuna tıklayın

### 3. Yeni API Key Oluşturun (Alternatif)
1. **"Create API Key"** butonuna tıklayın
2. Yeni proje seçin veya mevcut projeyi kullanın
3. **"Don't restrict key"** seçeneğini seçin (veya domain kısıtlaması ekleyin)
4. Key'i kopyalayın

### 4. Vercel'e API Key'i Ekleyin/Güncelleyin

**Vercel CLI ile:**
```bash
vercel env add GEMINI_API_KEY production
# API key'i yapıştırın
vercel env add GEMINI_API_KEY preview
# API key'i yapıştırın
vercel env add GEMINI_API_KEY development
# API key'i yapıştırın
```

**Vercel Dashboard ile:**
1. https://vercel.com/sefas-projects-21462460/napifit/settings/environment-variables adresine gidin
2. `GEMINI_API_KEY` değişkenini bulun
3. **"Edit"** butonuna tıklayın
4. Yeni API key'i yapıştırın
5. **"Save"** butonuna tıklayın

### 5. Yeni Deploy Yapın
```bash
vercel --prod
```

Veya Vercel Dashboard'dan **"Redeploy"** yapın.

## 🧪 Test
Deploy sonrası AI Asistan'ı test edin:
1. Siteyi açın
2. AI Asistan widget'ına tıklayın
3. "naber" yazın
4. Yanıt almalısınız

## 📝 Notlar
- API key kısıtlamaları güvenlik için önemlidir
- Production için domain kısıtlaması eklemek daha güvenlidir
- Development için "Don't restrict key" kullanabilirsiniz

