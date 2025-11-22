-- Önce doğru UUID'yi bulalım
SELECT id, full_name, email, show_public_profile 
FROM public.profiles 
WHERE LOWER(full_name) LIKE '%mert%' AND LOWER(full_name) LIKE '%demir%'
LIMIT 1;

-- Yukarıdaki sorgudan aldığınız UUID'yi aşağıdaki sorguda kullanın
-- (UUID'yi manuel olarak değiştirin)

-- Mert Demir için "Su İçme Hatırlatıcısı" önerisini ekle
-- NOT: UUID'yi yukarıdaki sorgudan alıp buraya yapıştırın
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
  id, -- Yukarıdaki SELECT'ten gelen UUID'yi kullan
  'Su İçme Hatırlatıcısı',
  'Su içme hatırlatıcısı olsa çok güzel olur',
  0,
  0,
  true,
  now(),
  '0.1.53',
  now() - interval '7 days'
FROM public.profiles 
WHERE LOWER(full_name) LIKE '%mert%' AND LOWER(full_name) LIKE '%demir%'
  AND id IS NOT NULL
LIMIT 1
ON CONFLICT DO NOTHING;

-- Kullanıcının profili herkese açık olduğundan emin ol
UPDATE public.profiles 
SET show_public_profile = true 
WHERE LOWER(full_name) LIKE '%mert%' AND LOWER(full_name) LIKE '%demir%';

-- Eklenen öneriyi kontrol et
SELECT 
  fr.id,
  fr.title,
  fr.description,
  fr.is_implemented,
  fr.implemented_version,
  fr.created_at,
  fr.like_count,
  fr.dislike_count,
  p.full_name as user_name,
  p.show_public_profile
FROM public.feature_requests fr
LEFT JOIN public.profiles p ON fr.user_id = p.id
WHERE p.id IN (
  SELECT id FROM public.profiles 
  WHERE LOWER(full_name) LIKE '%mert%' AND LOWER(full_name) LIKE '%demir%'
)
  AND fr.title = 'Su İçme Hatırlatıcısı'
ORDER BY fr.created_at DESC
LIMIT 1;
