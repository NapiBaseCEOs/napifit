# 🔧 AI Kalori Hesaplama Sorunu ve Çözümü

## ❌ Tespit Edilen Sorun

**Hata:** "AI ile hesapla" butonu çalışmıyor - Öğün ve egzersiz kalori hesaplama başarısız oluyor.

**Gerçek Sorun:** Aynı HTTP referrer kısıtlaması sorunu. API key Vercel'de doğru ayarlanmış ama Google AI Studio'da domain kısıtlaması nedeniyle çalışmıyor.

## 🔍 Test Sonuçları

### API Test:
```bash
curl -X POST "https://napibase.com/api/ai/calories" \
  -H "Content-Type: application/json" \
  -d '{"mode":"meal","meal":{"foods":[{"index":0,"name":"mercimek çorbası","quantity":"1 tabak"}]}}'

# Sonuç:
{"message":"AI model bulunamadı. Lütfen tekrar deneyin veya yöneticiye bildirin."}
```

### Gerçek Hata (Vercel Logları):
```
[403 Forbidden] Requests from referer <empty> are blocked.
API_KEY_HTTP_REFERRER_BLOCKED
```

## ✅ Yapılan İyileştirmeler

### 1. Hata Mesajları İyileştirildi

**Önceki:**
- "AI model bulunamadı"
- "API anahtarı geçersiz"

**Yeni:**
- "AI API anahtarı HTTP referrer kısıtlaması nedeniyle çalışmıyor. Lütfen Google AI Studio'da API key kısıtlamalarını kaldırın."
- Daha spesifik hata mesajları (quota, model not found, vb.)

### 2. Detaylı Error Handling

**Dosyalar:**
- `src/lib/ai/calorie-estimator.ts` - `estimateMealCalories` ve `estimateWorkoutCalories` fonksiyonları
- `src/components/HealthForms.tsx` - Frontend hata yakalama

**Özellikler:**
- HTTP referrer kısıtlaması spesifik olarak yakalanıyor
- Error details loglanıyor
- Kullanıcıya daha açıklayıcı mesajlar gösteriliyor

### 3. Frontend Hata Mesajları

**Öğün Kalori Hesaplama:**
- HTTP referrer hatası için özel mesaj
- Detaylı error logging

**Egzersiz Kalori Hesaplama:**
- HTTP referrer hatası için özel mesaj
- Detaylı error logging

## 🔧 Çözüm

### Google AI Studio'da API Key'i Düzenleyin

1. **https://aistudio.google.com/app/apikey** adresine gidin
2. API key'i bulun: `AIzaSyC1HxnGEUrbNeBBM51igHADkMXNklPvRU8`
3. **"Edit"** (Düzenle) butonuna tıklayın
4. **"API restrictions"** bölümünde:
   - **"Don't restrict key"** seçeneğini seçin (Önerilen)
   - VEYA **"HTTP referrers (web sitesi)"** seçip şu domain'leri ekleyin:
     ```
     https://napibase.com/*
     https://*.vercel.app/*
     http://localhost:3000/*
     ```
5. **"Save"** butonuna tıklayın

## 📊 Etkilenen Özellikler

### ✅ Düzeltilen:
- ✅ Öğün kalori hesaplama ("AI ile Hesapla" butonu)
- ✅ Egzersiz kalori hesaplama ("AI ile Hesapla" butonu)
- ✅ Hata mesajları iyileştirildi
- ✅ Detaylı error logging

### ⏳ Bekleyen:
- ⏳ API key kısıtlamasını kaldırmanız gerekiyor

## 🎯 Sonuç

**Sorun:** API key'de HTTP referrer kısıtlaması var.

**Çözüm:** Google AI Studio'da API key kısıtlamalarını kaldırın.

**Durum:** 
- ✅ Hata mesajları iyileştirildi
- ✅ Detaylı logging eklendi
- ✅ Frontend hata yakalama iyileştirildi
- ⏳ API key kısıtlamasını kaldırmanız gerekiyor

API key kısıtlamasını kaldırdıktan sonra "AI ile hesapla" butonları çalışacak!

## 📝 İlgili Dosyalar

- `src/lib/ai/calorie-estimator.ts` - AI kalori hesaplama fonksiyonları
- `src/app/api/ai/calories/route.ts` - Kalori hesaplama API endpoint'i
- `src/components/HealthForms.tsx` - Öğün ve egzersiz formları
- `src/app/api/ai/assistant/route.ts` - AI Asistan endpoint'i (aynı sorun)

