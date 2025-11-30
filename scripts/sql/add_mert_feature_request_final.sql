-- ============================================
-- MERT DEMİR İÇİN "SU İÇME HATIRLATICISI" ÖNERİSİNİ EKLE
-- ============================================
-- Bu script öneriyi kesin olarak ekler

-- 1. Önce Mert Demir kullanıcısını bul ve göster
SELECT 
  id,
  full_name,
  email,
  show_public_profile
FROM public.profiles
WHERE LOWER(full_name) LIKE '%mert%' 
   OR LOWER(full_name) LIKE '%demir%'
ORDER BY created_at DESC
LIMIT 5;

-- 2. Mevcut önerileri kontrol et
SELECT 
  fr.id,
  fr.title,
  fr.description,
  fr.is_implemented,
  p.full_name as user_name
FROM public.feature_requests fr
LEFT JOIN public.profiles p ON fr.user_id = p.id
WHERE fr.title LIKE '%su%' OR fr.title LIKE '%hatırlat%'
ORDER BY fr.created_at DESC;

-- 3. Öneriyi ekle (alt sorgu ile)
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
  now() - interval '2 hours'  -- 2 saat önce eklenmiş gibi
FROM public.profiles p
WHERE (
  LOWER(p.full_name) LIKE '%mert%' AND LOWER(p.full_name) LIKE '%demir%'
)
AND NOT EXISTS (
  SELECT 1 FROM public.feature_requests fr
  WHERE fr.user_id = p.id 
    AND fr.title = 'Su İçme Hatırlatıcısı'
)
LIMIT 1
RETURNING *;

-- 4. Profili herkese açık yap
UPDATE public.profiles 
SET show_public_profile = true 
WHERE (
  LOWER(full_name) LIKE '%mert%' AND LOWER(full_name) LIKE '%demir%'
)
AND show_public_profile = false;

-- 5. Eklenen öneriyi kontrol et
SELECT 
  fr.id,
  fr.title,
  fr.description,
  fr.is_implemented,
  fr.implemented_at,
  fr.implemented_version,
  fr.created_at,
  fr.like_count,
  fr.dislike_count,
  p.full_name as user_name,
  p.email,
  p.show_public_profile
FROM public.feature_requests fr
LEFT JOIN public.profiles p ON fr.user_id = p.id
WHERE fr.title = 'Su İçme Hatırlatıcısı'
ORDER BY fr.created_at DESC
LIMIT 5;

