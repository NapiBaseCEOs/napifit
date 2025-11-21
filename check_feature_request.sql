-- Topluluk sayfasında görünmeyen öneriyi kontrol et

-- 1. Önerinin var olup olmadığını kontrol et
SELECT 
  fr.id,
  fr.title,
  fr.description,
  fr.like_count,
  fr.dislike_count,
  fr.is_implemented,
  fr.implemented_version,
  fr.created_at,
  fr.user_id,
  p.full_name as user_name,
  p.id as profile_id,
  p.show_public_profile
FROM public.feature_requests fr
LEFT JOIN public.profiles p ON fr.user_id = p.id
WHERE fr.title = 'Su İçme Hatırlatıcısı'
ORDER BY fr.created_at DESC;

-- 2. Tüm önerileri kontrol et - En Beğenilenler sıralaması
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
ORDER BY fr.like_count DESC, fr.created_at DESC
LIMIT 10;

-- 3. En Yeni önerileri kontrol et
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

-- 4. Uygulanan önerileri kontrol et
SELECT 
  fr.id,
  fr.title,
  fr.like_count,
  fr.implemented_version,
  fr.implemented_at,
  fr.created_at,
  p.full_name as user_name
FROM public.feature_requests fr
LEFT JOIN public.profiles p ON fr.user_id = p.id
WHERE fr.is_implemented = true
ORDER BY fr.implemented_at DESC
LIMIT 10;
