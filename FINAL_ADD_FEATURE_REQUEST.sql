-- ============================================
-- FİNAL: SU İÇME HATIRLATICISI ÖNERİSİNİ EKLE
-- ============================================
-- Bu dosyayı Supabase Dashboard > SQL Editor'de çalıştırın
-- Tüm kontrolleri içerir ve tek seferde çalışır

-- 1. Mert Demir kullanıcısını kontrol et
SELECT id::text as user_id, full_name, email, show_public_profile 
FROM public.profiles 
WHERE LOWER(full_name) LIKE '%mert%' AND LOWER(full_name) LIKE '%demir%'
LIMIT 1;

-- 2. Öneriyi ekle (alt sorgu ile, UUID'yi manuel yazmaya gerek yok)
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
) 
SELECT 
  p.id,
  'Su İçme Hatırlatıcısı',
  'Su içme hatırlatıcısı olsa çok güzel olur',
  0,
  0,
  true,
  now(),
  '0.1.53',
  now() - interval '7 days'
FROM public.profiles p
WHERE LOWER(p.full_name) LIKE '%mert%' AND LOWER(p.full_name) LIKE '%demir%'
  AND NOT EXISTS (
    SELECT 1 FROM public.feature_requests fr
    WHERE fr.user_id = p.id 
      AND fr.title = 'Su İçme Hatırlatıcısı'
  )
LIMIT 1;

-- 3. Kullanıcının profili herkese açık olduğundan emin ol
UPDATE public.profiles 
SET show_public_profile = true 
WHERE LOWER(full_name) LIKE '%mert%' AND LOWER(full_name) LIKE '%demir%';

-- 4. Eklenen öneriyi kontrol et
SELECT 
  fr.id,
  fr.title,
  fr.description,
  fr.like_count,
  fr.dislike_count,
  fr.is_implemented,
  fr.implemented_version,
  fr.created_at,
  p.full_name as user_name,
  p.email,
  p.show_public_profile,
  p.id as user_id
FROM public.feature_requests fr
LEFT JOIN public.profiles p ON fr.user_id = p.id
WHERE p.id IN (
  SELECT id FROM public.profiles 
  WHERE LOWER(full_name) LIKE '%mert%' AND LOWER(full_name) LIKE '%demir%'
)
  AND fr.title = 'Su İçme Hatırlatıcısı'
ORDER BY fr.created_at DESC
LIMIT 1;

-- 5. Tüm önerileri listele (kontrol için)
SELECT 
  fr.id,
  fr.title,
  fr.like_count,
  fr.dislike_count,
  fr.is_implemented,
  fr.created_at,
  p.full_name as user_name
FROM public.feature_requests fr
LEFT JOIN public.profiles p ON fr.user_id = p.id
ORDER BY fr.created_at DESC
LIMIT 5;

