-- ============================================
-- API'NİN DÖNDÜRDÜĞÜ VERİYİ TEST ET
-- ============================================

-- 1. "En Beğenilenler" sıralaması (varsayılan)
SELECT 
  fr.id,
  fr.title,
  fr.like_count,
  fr.created_at,
  p.full_name as user_name
FROM public.feature_requests fr
LEFT JOIN public.profiles p ON fr.user_id = p.id
ORDER BY fr.like_count DESC, fr.created_at DESC
LIMIT 50;

-- 2. "En Yeni" sıralaması
SELECT 
  fr.id,
  fr.title,
  fr.like_count,
  fr.created_at,
  p.full_name as user_name
FROM public.feature_requests fr
LEFT JOIN public.profiles p ON fr.user_id = p.id
ORDER BY fr.created_at DESC
LIMIT 50;

-- 3. "Uygulananlar" sıralaması
SELECT 
  fr.id,
  fr.title,
  fr.is_implemented,
  fr.implemented_at,
  p.full_name as user_name
FROM public.feature_requests fr
LEFT JOIN public.profiles p ON fr.user_id = p.id
WHERE fr.is_implemented = true
ORDER BY fr.implemented_at DESC
LIMIT 50;

-- 4. "Su İçme Hatırlatıcısı" önerisini özellikle kontrol et
SELECT 
  fr.id,
  fr.title,
  fr.description,
  fr.like_count,
  fr.dislike_count,
  fr.is_implemented,
  fr.implemented_at,
  fr.created_at,
  p.full_name as user_name,
  p.show_public_profile,
  'En Beğenilenler pozisyonu' as sort_type,
  (
    SELECT COUNT(*) + 1
    FROM public.feature_requests fr2
    WHERE (fr2.like_count > fr.like_count) 
       OR (fr2.like_count = fr.like_count AND fr2.created_at > fr.created_at)
  ) as position_in_likes_sort
FROM public.feature_requests fr
LEFT JOIN public.profiles p ON fr.user_id = p.id
WHERE fr.title = 'Su İçme Hatırlatıcısı';

