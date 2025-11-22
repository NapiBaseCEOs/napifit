# 🚀 Google AdSense Optimizasyon Rehberi

Bu rehber, NapiFit sitesinde Google AdSense ile **en yüksek gelir** elde etmek için yapmanız gereken adımları içerir.

## 📋 AdSense Dashboard'da Yapılacaklar

### 1. Auto Ads (Otomatik Reklamlar) - ⭐ EN ÖNEMLİ

**Neden Önemli:**
- Google AI ile en uygun yerlere otomatik reklam yerleştirir
- En yüksek gelir getiren pozisyonları seçer
- Manuel yerleşimden %30-50 daha fazla gelir sağlar

**Nasıl Açılır:**
1. AdSense dashboard'a giriş yapın
2. Sol menüden **"Reklamlar"** → **"Otomatik reklamlar"** seçin
3. **"Otomatik reklamları etkinleştir"** butonuna tıklayın
4. Aşağıdaki reklam formatlarını **AÇIK** yapın:
   - ✅ **Görüntülü reklamlar** (Display ads)
   - ✅ **Makale içi reklamlar** (In-article ads)
   - ✅ **Akış içi reklamlar** (In-feed ads)
   - ✅ **Eşleşen içerik** (Matched content) - Önerilir
   - ✅ **Anchored ads** (Mobil için) - Önerilir
   - ✅ **Vignette ads** (Mobil için) - Önerilir

**Önemli Not:** Auto ads açıldıktan sonra 24-48 saat içinde reklamlar görünmeye başlar.

---

### 2. Manuel Reklam Birimleri Oluşturma

Siteye manuel reklam yerleşimleri ekledik. AdSense dashboard'da bu reklam birimlerini oluşturmanız gerekiyor:

**Adımlar:**
1. AdSense dashboard → **"Reklamlar"** → **"Reklam birimleri"**
2. **"Yeni reklam birimi"** butonuna tıklayın
3. Her reklam için aşağıdaki bilgileri girin:

#### Reklam 1: Header Altı (Above the fold)
- **Ad:** `Homepage - Header Altı`
- **Reklam boyutu:** Otomatik (Responsive)
- **Reklam formatı:** Görüntülü reklamlar
- **Reklam slot ID:** `1234567890` (AdSense'den alacağınız gerçek ID)

#### Reklam 2: İçerik Arası 1
- **Ad:** `Homepage - İçerik Arası 1`
- **Reklam boyutu:** Otomatik (Responsive)
- **Reklam formatı:** Yatay (Horizontal)
- **Reklam slot ID:** `1234567891`

#### Reklam 3: İçerik Arası 2
- **Ad:** `Homepage - İçerik Arası 2`
- **Reklam boyutu:** Otomatik (Responsive)
- **Reklam formatı:** Görüntülü reklamlar
- **Reklam slot ID:** `1234567892`

#### Reklam 4: Footer Üstü
- **Ad:** `Homepage - Footer Üstü`
- **Reklam boyutu:** Otomatik (Responsive)
- **Reklam formatı:** Yatay (Horizontal)
- **Reklam slot ID:** `1234567893`

#### Reklam 5: Dashboard Üstü
- **Ad:** `Dashboard - Üst`
- **Reklam boyutu:** Otomatik (Responsive)
- **Reklam formatı:** Görüntülü reklamlar
- **Reklam slot ID:** `1234567894`

#### Reklam 6: Dashboard İçerik Arası
- **Ad:** `Dashboard - İçerik Arası`
- **Reklam boyutu:** Otomatik (Responsive)
- **Reklam formatı:** Yatay (Horizontal)
- **Reklam slot ID:** `1234567895`

**Önemli:** Her reklam birimi oluşturulduktan sonra, AdSense size bir **"data-ad-slot"** ID'si verecek. Bu ID'leri `src/app/page.tsx` ve `src/components/DashboardContent.tsx` dosyalarındaki `adSlot` değerlerine güncellemeniz gerekiyor.

---

### 3. Reklam Optimizasyonu Ayarları

**AdSense Dashboard → "Reklamlar" → "Optimizasyon"**

Aşağıdaki ayarları yapın:

#### Reklam Yoğunluğu
- **Maksimum reklam sayısı:** 6-8 reklam (sayfa başına)
- **Reklam aralığı:** En az 300px (reklamlar arası mesafe)

#### Reklam Boyutları
- ✅ **Responsive reklamlar** (Otomatik boyutlandırma)
- ✅ **728x90** (Leaderboard - Desktop)
- ✅ **300x250** (Medium Rectangle - En yüksek gelir)
- ✅ **320x100** (Large Mobile Banner - Mobil)
- ✅ **336x280** (Large Rectangle - Desktop)

#### Reklam Formatları
- ✅ **Görüntülü reklamlar** (Display ads)
- ✅ **Metin reklamları** (Text ads) - Daha az gelir ama daha az rahatsız edici
- ✅ **Yerel reklamlar** (Native ads) - Yüksek tıklama oranı

---

### 4. Kullanıcı Rızası (GDPR Uyumu)

**AdSense Dashboard → "Reklamlar" → "Kullanıcı rızası"**

1. **"3 seçenekli mesaj"** seçin (GDPR uyumu için)
2. **"Google'ın CMP'sini kullan"** seçeneğini aktif edin
3. Mesaj metnini özelleştirin (isteğe bağlı)

**Önemli:** GDPR uyumu için kullanıcı rızası zorunludur. Aksi halde Avrupa kullanıcılarına reklam gösterilemez.

---

### 5. Reklam Filtreleri ve Engellemeler

**AdSense Dashboard → "Reklamlar" → "Filtreler"**

#### Engellenen Kategoriler
- Alkol, kumar, yetişkin içerik gibi kategorileri engelleyin (isteğe bağlı)
- Sağlık ve fitness sitesi olduğu için uygun olmayan reklamları engelleyin

#### Hassas Kategoriler
- **"Hassas kategorileri engelle"** seçeneğini açın
- Sağlık ve fitness ile uyumsuz reklamları engelleyin

---

## 💰 Gelir Optimizasyonu İpuçları

### 1. En Yüksek Gelir Getiren Pozisyonlar

Sıralama (yüksekten düşüğe):
1. **Header altı (Above the fold)** - %40-50 gelir
2. **İçerik arası (In-article)** - %25-35 gelir
3. **Sidebar (Desktop)** - %15-20 gelir
4. **Footer üstü** - %10-15 gelir

### 2. Reklam Formatları (Gelir Sıralaması)

1. **300x250 Medium Rectangle** - En yüksek gelir
2. **728x90 Leaderboard** - Yüksek gelir
3. **336x280 Large Rectangle** - Orta-yüksek gelir
4. **Responsive Auto** - Orta gelir (ama tüm cihazlarda çalışır)

### 3. Mobil Optimizasyon

- Mobil trafik %60+ ise, mobil reklam formatlarını önceliklendirin
- **Anchored ads** ve **Vignette ads** mobilde yüksek gelir sağlar
- Mobil reklam boyutları: 320x100, 300x250, 320x50

### 4. Reklam Yerleşimi Best Practices

✅ **YAPILMASI GEREKENLER:**
- Reklamları içerikle doğal bir şekilde entegre edin
- "Above the fold" (ekranın görünen kısmı) alanına reklam koyun
- İçerik arası reklamlar yüksek tıklama oranı sağlar
- Responsive reklamlar kullanın (tüm cihazlarda çalışır)

❌ **YAPILMAMASI GEREKENLER:**
- Sayfayı reklamlarla doldurmayın (kullanıcı deneyimi kötüleşir)
- Reklamları birbirine çok yakın yerleştirmeyin (minimum 300px)
- Reklamları içerikten ayırt edilemeyecek şekilde stil vermeyin
- Tıklama tuzağı (clickbait) reklamlar kullanmayın (AdSense politikası ihlali)

---

## 📊 Performans Takibi

### AdSense Dashboard Metrikleri

**Önemli Metrikler:**
- **RPM (Revenue Per Mille):** 1000 görüntüleme başına gelir
- **CPC (Cost Per Click):** Tıklama başına gelir
- **CTR (Click-Through Rate):** Tıklama oranı (%)
- **Sayfa görüntüleme:** Toplam sayfa görüntüleme sayısı

**Hedef Değerler:**
- **RPM:** $2-5 (Türkiye için)
- **CTR:** %1-3 (Sağlık/fitness siteleri için)
- **CPC:** $0.10-0.50 (Türkiye için)

### Optimizasyon Önerileri

1. **Haftalık raporları inceleyin**
2. **En yüksek gelir getiren reklam pozisyonlarını belirleyin**
3. **Düşük performans gösteren reklamları kaldırın veya değiştirin**
4. **Mobil ve desktop performansını karşılaştırın**
5. **Farklı reklam formatlarını test edin**

---

## 🔧 Teknik Entegrasyon

### Siteye Eklenen Reklam Bileşenleri

1. **`src/components/ads/AdSenseAd.tsx`** - Manuel reklam bileşeni
2. **`src/components/ads/AdSenseAutoAds.tsx`** - Auto ads bileşeni (şu an kullanılmıyor, Auto ads dashboard'dan açılıyor)
3. **`src/app/layout.tsx`** - AdSense script'i (zaten ekli)

### Reklam Slot ID'lerini Güncelleme

AdSense dashboard'da reklam birimlerini oluşturduktan sonra:

1. Her reklam biriminin **"data-ad-slot"** ID'sini kopyalayın
2. `src/app/page.tsx` dosyasındaki `adSlot` değerlerini güncelleyin
3. `src/components/DashboardContent.tsx` dosyasındaki `adSlot` değerlerini güncelleyin

**Örnek:**
```tsx
// Önce (placeholder)
<AdSenseAd adSlot="1234567890" ... />

// Sonra (gerçek ID)
<AdSenseAd adSlot="1234567890123456" ... />
```

---

## ⚠️ Önemli Notlar

1. **AdSense Onayı:** Site AdSense tarafından onaylanana kadar reklamlar görünmez (1-7 gün sürebilir)

2. **Reklam Politikaları:**
   - Tıklama tuzağı kullanmayın
   - Reklamları içerik gibi göstermeyin
   - Kullanıcıları yanıltmayın
   - AdSense politikalarına uyun

3. **Performans:**
   - İlk hafta düşük gelir normal (Google öğrenme aşamasında)
   - 2-4 hafta sonra gelir artmaya başlar
   - 3-6 ay sonra maksimum gelire ulaşılır

4. **Trafik:**
   - Daha fazla trafik = Daha fazla gelir
   - SEO optimizasyonu yapın
   - Sosyal medya paylaşımları yapın
   - İçerik kalitesini artırın

---

## 📞 Destek

Sorularınız için:
- AdSense Yardım Merkezi: https://support.google.com/adsense
- AdSense Topluluk: https://support.google.com/adsense/community

---

**Son Güncelleme:** 2024-11-21
**Versiyon:** 1.0

