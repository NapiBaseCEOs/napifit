# 🤖 Roboflow Görsel Analiz Kurulumu

Google/GenAI seçenekleri yerine artık tamamen ücretsiz **Roboflow Hosted API** kullanılıyor.

## ✅ Yapılan Değişiklikler

1. Hugging Face bağımlılığı kaldırıldı, `@huggingface/inference` paketi silindi.
2. API `/api/ai/analyze-photo` çağrıları Roboflow `detect` endpoint'ine yönlendiriliyor.
3. Dönen sınıflandırmalar mevcut besin tablosu ile eşleştirilerek makro değerler hesaplanıyor.

## 🔑 Gerekli Environment Variables

`.env` ve Vercel ortamında şunları ayarla:

```
ROBOFLOW_API_KEY=rf_xxx
ROBOFLOW_MODEL_ID=workspace/food-model   # örn: napifit/meal-detector
ROBOFLOW_MODEL_VERSION=1                 # opsiyonel, varsayılan 1
```

Opsiyonel olarak özel bir endpoint kullanıyorsan:

```
ROBOFLOW_API_URL=https://detect.roboflow.com
```

## 📝 Roboflow API Key Alma

1. https://roboflow.com/ adresinde ücretsiz hesap oluştur.
2. Dashboard → *Create Project* → `Food` tabanlı bir dataset/model seç ya da yükle.
3. `Project > Deploy` sekmesinde `Hosted API Key` değerini kopyala.
4. Model adını (`workspace/model`) ve versiyonunu `.env` + Vercel'e ekle.

## 🎯 Özellikler

- ✅ **Ücretsiz plan** ile ayda 1.000+ çağrı (kart gerekmez)
- ✅ **Base64 görsel desteği** (kameradan gelen veri direkt gönderiliyor)
- ✅ **Hızlı** (Roboflow CDN üzerinden ortalama <1 sn)
- ✅ **Kolay yönetim**: Modeli Roboflow arayüzünden tekrar eğitebilirsin.

## ⚠️ Notlar

- API key eksikse `/api/ai/analyze-photo` 503 döner.
- Model sınıf isimlerini `src/lib/ai/calorie-estimator.ts` içindeki `NUTRITION_RULES` listesiyle eşleştir; gerekirse yeni anahtar kelimeler ekle.
- Roboflow endpoint'i rate limit uygular; hata mesajı `isQuotaError` alanı üzerinden kullanıcıya iletilir.

## 🧪 Test

1. `npm run dev` çalıştır.
2. Uygulamada "Öğün" sekmesine girip fotoğraf çek/yükle.
3. Inspect → Network sekmesinde `/api/ai/analyze-photo` yanıtını doğrula.
4. `vercel logs <deployment>` ile prod ortamında Roboflow hatalarını takip et.


