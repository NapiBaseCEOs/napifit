# Özellik Önerisi Ekleme Rehberi

Bu rehber, Supabase CLI kullanarak manuel olarak özellik önerisi ekleme işlemini açıklar.

## 1. Dislike Sistemi Migration'ını Çalıştır

Önce dislike sistemini veritabanına eklemelisiniz:

```bash
# Supabase CLI ile migration'ı çalıştır
supabase db push

# VEYA Supabase Dashboard'dan SQL Editor'de çalıştır:
# supabase/migrations/0007_add_dislikes.sql dosyasının içeriğini çalıştır
```

## 2. Özellik Önerisini Ekle

### Yöntem 1: Supabase CLI ile

```bash
# Supabase CLI ile SQL dosyasını çalıştır
supabase db execute --file add_feature_request.sql
```

### Yöntem 2: Supabase Dashboard'dan

1. Supabase Dashboard'a gidin
2. SQL Editor'ü açın
3. Aşağıdaki SQL'i çalıştırın (Mert Demir kullanıcı ID'sini değiştirin):

```sql
-- Mert Demir kullanıcısını bul
SELECT id, full_name, email 
FROM public.profiles 
WHERE LOWER(full_name) LIKE '%mert%' AND LOWER(full_name) LIKE '%demir%';

-- Eğer kullanıcı bulunamazsa, tüm kullanıcıları listele
SELECT id, full_name, email FROM public.profiles LIMIT 10;

-- Kullanıcı ID'sini aldıktan sonra (örnek: 'user-uuid-here'), öneriyi ekle:
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
  'user-uuid-here', -- Mert Demir'in user_id'sini buraya yazın
  'Su İçme Hatırlatıcısı',
  'Su içme hatırlatıcısı olsa çok güzel olur',
  0,
  0,
  true, -- Uygulandı olarak işaretle
  now(), -- Bugün uygulandı
  '0.1.52', -- Güncel versiyon numarası
  now() - interval '7 days' -- 7 gün önce oluşturulmuş gibi göster
);
```

### Yöntem 3: Otomatik Script (Kullanıcıyı Bulur)

`add_feature_request.sql` dosyasını Supabase SQL Editor'de çalıştırın. Bu script:
- Mert Demir kullanıcısını otomatik bulur
- Bulamazsa mevcut kullanıcıları listeler
- Öneriyi ekler

## 3. Kontrol Et

Önerinin eklendiğini kontrol etmek için:

```sql
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

## 4. Gizlilik Kontrolü

Kullanıcının profili herkese açık olmalı ki ismine tıklanabilsin:

```sql
-- Mert Demir kullanıcısının gizlilik ayarını kontrol et
SELECT id, full_name, show_public_profile 
FROM public.profiles 
WHERE LOWER(full_name) LIKE '%mert%' AND LOWER(full_name) LIKE '%demir%';

-- Eğer gizliyse, herkese açık yap:
UPDATE public.profiles 
SET show_public_profile = true 
WHERE LOWER(full_name) LIKE '%mert%' AND LOWER(full_name) LIKE '%demir%';
```

## Notlar

- Öneri ekledikten sonra siteyi yenileyin
- Kullanıcının `show_public_profile = true` olması gerekir ki ismine tıklanabilsin
- Öneri "Uygulandı" olarak işaretlenmiş olacak
- Versiyon numarasını (`0.1.52`) güncel versiyonla değiştirmeyi unutmayın

