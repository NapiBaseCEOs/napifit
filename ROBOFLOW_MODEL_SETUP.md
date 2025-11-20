# Roboflow Model Oluşturma Rehberi

Bu rehber, NapiBase projesi için Roboflow'da kendi food detection modelinizi nasıl oluşturacağınızı açıklar.

## Adım 1: Roboflow Hesabı ve Workspace

1. **Roboflow Dashboard'a git:**
   - https://app.roboflow.com/napibase
   - Eğer workspace yoksa, yeni bir workspace oluşturun

2. **API Key'i al:**
   - Dashboard > Settings > API Keys
   - "Private API Key" (Roboflow Keys) bölümünden key'i kopyala
   - Bu key'i `.env` dosyasına ekle: `ROBOFLOW_API_KEY=your_key_here`

## Adım 2: Proje Oluşturma

1. **Yeni Proje Oluştur:**
   - Dashboard'da "Create Project" butonuna tıkla
   - Project Name: `meal-detector` (veya istediğiniz isim)
   - Project Type: **Object Detection** seç (yiyecekleri bounding box ile tespit eder)
   - "Create Project" butonuna tıkla

## Adım 3: Dataset Hazırlama

1. **Görselleri Yükle:**
   - En az **50-100 yiyecek fotoğrafı** topla
   - Çeşitli açılardan, farklı yiyecekler
   - Yüksek kaliteli, net görseller tercih edilir

2. **Görselleri Etiketle:**
   - Her fotoğrafta yiyecekleri bounding box ile işaretle
   - Her yiyecek için class adı ver (örn: "pizza", "burger", "salad")
   - Roboflow'un otomatik labeling özelliğini kullanabilirsiniz

3. **Dataset'i Böl:**
   - Train: %70
   - Validation: %20
   - Test: %10

## Adım 4: Model Eğitimi

1. **Train Butonuna Tıkla:**
   - Roboflow otomatik olarak model eğitecek
   - Eğitim süresi dataset boyutuna göre değişir (genellikle 10-30 dakika)

2. **Model Performansını Kontrol Et:**
   - Precision, Recall, mAP metriklerini kontrol et
   - Gerekirse daha fazla görsel ekleyip tekrar eğit

## Adım 5: Deploy ve API Bilgilerini Al

1. **Deploy:**
   - "Deploy" sekmesine git
   - "Hosted API" seçeneğini seç
   - Model ID ve Version bilgilerini kopyala

2. **Model Bilgilerini .env'e Ekle:**
   ```env
   ROBOFLOW_API_KEY=your_api_key_here
   ROBOFLOW_MODEL_ID=napibase/meal-detector
   ROBOFLOW_MODEL_VERSION=1
   ROBOFLOW_API_URL=https://detect.roboflow.com
   ```

## Adım 6: Test

1. **API'yi Test Et:**
   ```bash
   python test_roboflow_integration.py
   ```

2. **Vercel'e Deploy Et:**
   ```bash
   vercel env add ROBOFLOW_API_KEY
   vercel env add ROBOFLOW_MODEL_ID
   vercel env add ROBOFLOW_MODEL_VERSION
   vercel env add ROBOFLOW_API_URL
   vercel deploy --prod
   ```

## Notlar

- **Classification vs Detection:**
  - **Object Detection** (`detect.roboflow.com`): Yiyecekleri bounding box ile tespit eder, birden fazla yiyecek tespit edebilir
  - **Classification** (`classify.roboflow.com`): Tüm görseli tek bir kategoriye sınıflandırır

- **Model Performansı:**
  - Daha fazla görsel = daha iyi performans
  - Çeşitli açılardan görseller ekleyin
  - Farklı ışık koşullarında görseller kullanın

- **API Limitleri:**
  - Roboflow'un ücretsiz planında aylık 1,000 inference limiti var
  - Daha fazla kullanım için ücretli plan gerekebilir

## Sorun Giderme

### API Key Geçersiz (401/403)
- Roboflow Dashboard > Settings > API Keys'den yeni key alın
- Private API Key (Roboflow Keys) kullanın, Public API Key değil

### Model Bulunamadı (404)
- Model ID formatını kontrol edin: `workspace/project-name`
- Version numarasını kontrol edin

### Method Not Allowed (405)
- Model tipini kontrol edin:
  - Object Detection → `https://detect.roboflow.com`
  - Classification → `https://classify.roboflow.com`

### Sonuç Alınamıyor
- Model henüz eğitilmemiş olabilir
- Dataset yeterli değil olabilir
- Görsel formatını kontrol edin (base64, JPEG/PNG)




