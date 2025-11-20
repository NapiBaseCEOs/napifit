# 🔧 Gemini API Sorunu ve Çözümü

## 🔍 Tespit Edilen Sorunlar

### 1. API Model Adı Hatası
- **Hata**: `models/gemini-pro is not found for API version v1beta`
- **Neden**: Model adı veya API key geçersiz olabilir
- **Test**: Tüm model adları test edildi, hiçbiri çalışmadı

### 2. API Key Sorunu
- **API Key**: `AIzaSyBgZuV-z0C4Nzqy_HT9WmL0l3wHa7H36QU`
- **Durum**: Tüm model adları 404 döndü
- **Olası Nedenler**:
  - API key geçersiz veya süresi dolmuş
  - API key farklı bir proje için oluşturulmuş
  - API key'de yeterli yetki yok

## ✅ Yapılan İyileştirmeler

### 1. Hata Mesajları İyileştirildi
- Detaylı hata mesajları eklendi
- API key hatası ayrı işleniyor
- Model hatası ayrı işleniyor
- Kullanıcıya daha anlaşılır mesajlar gösteriliyor

### 2. Error Handling Geliştirildi
- `src/app/api/ai/calories/route.ts` - Detaylı hata kontrolü
- `src/lib/ai/calorie-estimator.ts` - Spesifik hata mesajları
- Development modda tam hata mesajı, production'da kullanıcı dostu mesaj

## 🔧 Çözüm Adımları

### 1. Google AI Studio'dan Yeni API Key Oluşturun

1. **Google AI Studio'ya gidin**: https://aistudio.google.com/
2. **Get API Key** butonuna tıklayın
3. **Yeni proje oluşturun** veya mevcut projeyi seçin
4. **API key'i kopyalayın**

### 2. Vercel'e API Key Ekleyin

1. **Vercel Dashboard** > Projeniz > **Settings** > **Environment Variables**
2. **GEMINI_API_KEY** ekleyin:
   ```
   GEMINI_API_KEY=your-new-api-key-here
   ```
3. **Environment** seçin: Production, Preview, Development (hepsi)
4. **Save** butonuna tıklayın

### 3. Doğru Model Adını Kullanın

Google Gemini API'de doğru model adları:
- `gemini-pro` (eski, ücretsiz)
- `gemini-1.5-pro` (yeni, ücretli olabilir)
- `gemini-1.5-flash` (yeni, ücretsiz)

**Not**: API key'e göre farklı modeller erişilebilir olabilir.

### 4. API Key'i Test Edin

```bash
# Test script'i çalıştırın
node scripts/test-gemini-calories.js
```

## 📋 Kontrol Listesi

- [ ] Google AI Studio'da API key oluşturuldu
- [ ] Vercel'e GEMINI_API_KEY eklendi (tüm environments)
- [ ] API key test edildi ve çalışıyor
- [ ] Model adı doğru ayarlandı
- [ ] Vercel'de yeni deploy yapıldı

## 🧪 Test

Deploy sonrası test edin:
1. Siteye gidin: https://napibase.com/health
2. "Öğün" sekmesine gidin
3. Bir yemek adı girin (örn: "pilav")
4. Miktar seçin (örn: "1 porsiyon")
5. "AI ile kalorileri doldur" butonuna tıklayın
6. Kalori hesaplaması başarılı olmalı

## 🔄 Alternatif Çözümler

Eğer Gemini API çalışmazsa:
1. **OpenAI API** kullanılabilir (ücretli)
2. **Hugging Face Inference API** (ücretsiz, bazı modeller)
3. **Local model** kullanılabilir (daha yavaş)

## 📞 Destek

Sorun devam ederse:
- Google AI Studio dokümantasyonu: https://ai.google.dev/docs
- Vercel logları kontrol edin: `vercel logs <deployment-url>`
- Console logları kontrol edin (browser dev tools)

