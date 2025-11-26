-- ============================================
-- RLS BYPASS İLE ÖNERİ EKLEME
-- ============================================
-- Bu script RLS'yi bypass ederek kesin olarak çalışır

-- RLS'yi bypass et (postgres role ile)
SET LOCAL role postgres;

-- 1. Mert Demir kullanıcısını bul ve göster
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

-- 2. Öneriyi ekle (RLS bypass ile)
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
  now() - interval '2 hours'
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

-- 3. Profili herkese açık yap
UPDATE public.profiles 
SET show_public_profile = true 
WHERE (
  LOWER(full_name) LIKE '%mert%' AND LOWER(full_name) LIKE '%demir%'
);

-- 4. Kontrol et
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

-- RLS'yi geri aç (opsiyonel)
RESET role;

