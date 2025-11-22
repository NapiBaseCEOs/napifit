# Topluluk Sayfası Sorun Giderme Rehberi

## Öneri Ekleniyor Ama Görünmüyor

### 1. Kontrol Sorguları

Önce veritabanında önerinin gerçekten eklendiğini kontrol edin:

```sql
-- Önerinin var olup olmadığını kontrol et
SELECT 
  fr.id,
  fr.title,
  fr.description,
  fr.like_count,
  fr.dislike_count,
  fr.is_implemented,
  fr.created_at,
  p.full_name as user_name
FROM public.feature_requests fr
LEFT JOIN public.profiles p ON fr.user_id = p.id
WHERE fr.title = 'Su İçme Hatırlatıcısı'
ORDER BY fr.created_at DESC;
```

### 2. Sıralama Kontrolü

Varsayılan sıralama **"En Beğenilenler"** olduğu için yeni öneri (like_count = 0) en alta düşebilir. Şu sekmeleri deneyin:

1. **"En Yeni"** sekmesine tıklayın - Yeni eklenen öneri en üstte görünmeli
2. **"Uygulananlar"** sekmesine tıklayın - `is_implemented = true` olduğu için burada görünmeli

### 3. Sayfa Yenileme

1. Tarayıcıda **Hard Refresh** yapın:
   - Windows: `Ctrl + Shift + R` veya `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

2. Veya tarayıcı cache'ini temizleyin:
   - DevTools açın (F12)
   - Network sekmesinde "Disable cache" işaretleyin
   - Sayfayı yenileyin

### 4. API Kontrolü

Tarayıcı konsolunda (F12 > Console) şu URL'yi test edin:

```javascript
// En Yeni öneriler
fetch('/api/feature-requests?sort=newest&limit=10')
  .then(r => r.json())
  .then(data => console.log(data));

// Uygulanan öneriler
fetch('/api/feature-requests?sort=implemented&limit=10')
  .then(r => r.json())
  .then(data => console.log(data));

// En Beğenilenler
fetch('/api/feature-requests?sort=likes&limit=10')
  .then(r => r.json())
  .then(data => console.log(data));
```

### 5. Olası Sorunlar ve Çözümleri

#### Sorun 1: Profil Bağlantısı
- **Belirti**: Öneri var ama kullanıcı adı görünmüyor
- **Çözüm**: `profiles` tablosunda kullanıcının kaydı olmalı ve `show_public_profile = true` olmalı

#### Sorun 2: RLS Politikası
- **Belirti**: Öneri veritabanında var ama API'den gelmiyor
- **Çözüm**: RLS politikalarını kontrol edin - `feature_requests` tablosu herkese açık olmalı

#### Sorun 3: Profil Join Hatası
- **Belirti**: API'den null profiller geliyor
- **Çözüm**: `profiles` tablosunda `user_id` eşleşmeli

### 6. Hızlı Test

Topluluk sayfasında şunları deneyin:

1. ✅ **"En Yeni"** sekmesine tıklayın
2. ✅ **"Uygulananlar"** sekmesine tıklayın
3. ✅ Sayfayı **hard refresh** yapın (Ctrl + Shift + R)
4. ✅ Tarayıcı cache'ini temizleyin
5. ✅ Farklı bir tarayıcıda test edin

### 7. Veritabanı Kontrolü

`check_feature_request.sql` dosyasını Supabase SQL Editor'de çalıştırın:

```sql
-- Tüm önerileri kontrol et
SELECT 
  fr.id,
  fr.title,
  fr.like_count,
  fr.is_implemented,
  fr.created_at,
  p.full_name as user_name
FROM public.feature_requests fr
LEFT JOIN public.profiles p ON fr.user_id = p.id
ORDER BY fr.created_at DESC
LIMIT 10;
```

## Notlar

- Yeni öneri `like_count = 0` olduğu için "En Beğenilenler" sıralamasında en alta düşer
- `is_implemented = true` olduğu için "Uygulananlar" sekmesinde görünmeli
- "En Yeni" sekmesinde her zaman en üstte görünmeli

