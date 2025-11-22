-- ============================================
-- SU İÇME HATIRLATICISI ÖNERİSİNİ EKLE
-- Kullanıcı ID: ce507534-ab1a-4ccf-b0c3-4d42e8a608b1
-- ============================================

-- Öneriyi ekle
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
  'ce507534-ab1a-4ccf-b0c3-4d42e8a608b1',
  'Su İçme Hatırlatıcısı',
  'Su içme hatırlatıcısı olsa çok güzel olur',
  0,
  0,
  true,
  now(),
  '0.1.53',
  now() - interval '2 hours'  -- 2 saat önce eklenmiş gibi görünsün
)
RETURNING *;

-- Profili herkese açık yap
UPDATE public.profiles 
SET show_public_profile = true 
WHERE id = 'ce507534-ab1a-4ccf-b0c3-4d42e8a608b1';

-- Eklenen öneriyi kontrol et
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
  AND fr.user_id = 'ce507534-ab1a-4ccf-b0c3-4d42e8a608b1'
ORDER BY fr.created_at DESC
LIMIT 1;

