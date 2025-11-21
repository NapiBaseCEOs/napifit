-- ============================================
-- ÖNERİNİN GÖRÜNÜRLÜĞÜNÜ KONTROL ET
-- ============================================

-- 1. Tüm önerileri listele (son eklenenler önce)
SELECT 
  fr.id,
  fr.title,
  fr.description,
  fr.like_count,
  fr.dislike_count,
  fr.is_implemented,
  fr.implemented_at,
  fr.implemented_version,
  fr.created_at,
  p.full_name as user_name,
  p.show_public_profile,
  p.id as user_id
FROM public.feature_requests fr
LEFT JOIN public.profiles p ON fr.user_id = p.id
ORDER BY fr.created_at DESC
LIMIT 10;

-- 2. "Su İçme Hatırlatıcısı" önerisini kontrol et
SELECT 
  fr.id,
  fr.title,
  fr.description,
  fr.like_count,
  fr.dislike_count,
  fr.is_implemented,
  fr.implemented_at,
  fr.implemented_version,
  fr.created_at,
  p.full_name as user_name,
  p.show_public_profile,
  p.id as user_id
FROM public.feature_requests fr
LEFT JOIN public.profiles p ON fr.user_id = p.id
WHERE fr.title = 'Su İçme Hatırlatıcısı'
ORDER BY fr.created_at DESC;

-- 3. Mert Demir'in önerilerini kontrol et
SELECT 
  fr.id,
  fr.title,
  fr.description,
  fr.like_count,
  fr.dislike_count,
  fr.is_implemented,
  fr.created_at
FROM public.feature_requests fr
WHERE fr.user_id IN (
  SELECT id FROM public.profiles 
  WHERE LOWER(full_name) LIKE '%mert%' AND LOWER(full_name) LIKE '%demir%'
)
ORDER BY fr.created_at DESC;

