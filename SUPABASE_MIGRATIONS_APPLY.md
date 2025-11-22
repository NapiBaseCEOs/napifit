# Supabase Migration'ları Uygulama Rehberi

Bu dosya, yeni migration'ları Supabase Dashboard üzerinden nasıl uygulayacağınızı açıklar.

## Migration Dosyaları

1. **0007_add_dislikes.sql** - Beğenmeme sistemi (dislike)
2. **0006_water_intake.sql** - Su tüketimi takibi

## Adım 1: Dislike Sistemi Migration'ını Uygula

1. Supabase Dashboard'a gidin: https://supabase.com/dashboard
2. Projenizi seçin
3. Sol menüden **SQL Editor**'ü açın
4. **New Query** butonuna tıklayın
5. `supabase/migrations/0007_add_dislikes.sql` dosyasının içeriğini kopyalayıp yapıştırın
6. **Run** butonuna tıklayın
7. Başarılı olduğunda "Success" mesajını göreceksiniz

## Adım 2: Su Tüketimi Migration'ını Uygula (Eğer henüz uygulanmadıysa)

1. Aynı SQL Editor'de yeni bir query oluşturun
2. `supabase/migrations/0006_water_intake.sql` dosyasının içeriğini kopyalayıp yapıştırın
3. **Run** butonuna tıklayın

## Adım 3: Manuel Öneri Ekleme

1. SQL Editor'de yeni bir query oluşturun
2. `add_feature_request.sql` dosyasının içeriğini kopyalayıp yapıştırın
3. **Run** butonuna tıklayın
4. Script çalıştığında:
   - Mert Demir kullanıcısını otomatik bulur
   - Bulamazsa mevcut kullanıcıları listeler (NOTICE mesajlarına bakın)
   - Bulursa öneriyi ekler ve kullanıcının profilini herkese açık yapar

### Manuel Ekleme (Alternatif)

Eğer script çalışmazsa veya farklı bir kullanıcı kullanmak isterseniz:

```sql
-- 1. Kullanıcıyı bul
SELECT id, full_name, email, show_public_profile 
FROM public.profiles 
WHERE LOWER(full_name) LIKE '%mert%' OR LOWER(full_name) LIKE '%demir%'
LIMIT 5;

-- 2. Bulunan user_id'yi kullanarak öneriyi ekle (user_id'yi değiştirin)
INSERT INTO public.feature_requests (
  user_id,
  title,
  description,
  like_count,
  dislike_count,
  is_implemented,
  implemented_at,
  implemented_version,
  created_at
) VALUES (
  'USER_ID_BURAYA', -- Yukarıdaki sorgudan aldığınız id'yi buraya yazın
  'Su İçme Hatırlatıcısı',
  'Su içme hatırlatıcısı olsa çok güzel olur',
  0,
  0,
  true, -- Uygulandı olarak işaretle
  now(), -- Bugün uygulandı
  '0.1.53', -- Versiyon numarası
  now() - interval '7 days' -- 7 gün önce oluşturulmuş gibi göster
);

-- 3. Kullanıcının profilini herkese açık yap
UPDATE public.profiles 
SET show_public_profile = true 
WHERE id = 'USER_ID_BURAYA'; -- Yukarıdaki user_id'yi buraya yazın
```

## Kontrol

Migration'ların başarılı olduğunu kontrol etmek için:

```sql
-- Dislike tablosunu kontrol et
SELECT * FROM public.feature_request_dislikes LIMIT 1;

-- Water intake tablosunu kontrol et
SELECT * FROM public.water_intake LIMIT 1;

-- Feature requests tablosunda dislike_count kolonunu kontrol et
SELECT id, title, like_count, dislike_count 
FROM public.feature_requests 
LIMIT 5;

-- Eklenen öneriyi kontrol et
SELECT 
  fr.id,
  fr.title,
  fr.description,
  fr.is_implemented,
  fr.implemented_version,
  p.full_name as user_name,
  p.show_public_profile
FROM public.feature_requests fr
JOIN public.profiles p ON fr.user_id = p.id
WHERE fr.title = 'Su İçme Hatırlatıcısı'
ORDER BY fr.created_at DESC;
```

## Hata Durumunda

Eğer migration sırasında hata alırsanız:

1. **Tablo zaten var hatası**: Migration'lar idempotent olmalı (IF NOT EXISTS kullanır), ancak bazen sorun olabilir
   - Çözüm: Hata veren satırları atlayın veya tabloyu manuel kontrol edin

2. **Permission hatası**: RLS politikaları sorun çıkarabilir
   - Çözüm: Supabase Dashboard > Authentication > Policies'den kontrol edin

3. **Trigger hatası**: Fonksiyonlar zaten tanımlı olabilir
   - Çözüm: Hata veren CREATE FUNCTION'ları DROP FUNCTION ile önce silin, sonra tekrar oluşturun

## Notlar

- Migration'ları sırayla uygulayın (0006, sonra 0007)
- Her migration'dan sonra kontrol sorgularını çalıştırın
- Öneri ekledikten sonra siteyi yenileyin ve topluluk sayfasını kontrol edin
- Kullanıcının `show_public_profile = true` olduğundan emin olun ki ismine tıklanabilsin

