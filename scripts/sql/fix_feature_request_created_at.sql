-- ============================================
-- ÖNERİNİN CREATED_AT DEĞERİNİ GÜNCELLE
-- ============================================
-- Bu script önerinin created_at değerini bugün olarak günceller
-- böylece "En Yeni" sekmesinde en üstte görünür

-- Öneriyi bugüne taşı
UPDATE public.feature_requests
SET created_at = now() - interval '1 hour'  -- 1 saat önce eklenmiş gibi görünsün
WHERE title = 'Su İçme Hatırlatıcısı'
  AND user_id IN (
    SELECT id FROM public.profiles 
    WHERE LOWER(full_name) LIKE '%mert%' AND LOWER(full_name) LIKE '%demir%'
  );

-- Güncellenmiş öneriyi kontrol et
SELECT 
  fr.id,
  fr.title,
  fr.created_at,
  fr.is_implemented,
  p.full_name as user_name
FROM public.feature_requests fr
LEFT JOIN public.profiles p ON fr.user_id = p.id
WHERE fr.title = 'Su İçme Hatırlatıcısı'
ORDER BY fr.created_at DESC
LIMIT 1;

