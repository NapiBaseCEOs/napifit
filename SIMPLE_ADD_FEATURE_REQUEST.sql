-- ============================================
-- BASİT: SU İÇME HATIRLATICISI ÖNERİSİNİ EKLE
-- ============================================
-- Bu script önce kullanıcıyı bulur, sonra öneriyi ekler

-- ADIM 1: Mert Demir kullanıcısını bul
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

-- ADIM 2: Yukarıdaki sorgudan kullanıcı ID'sini alın ve aşağıdaki INSERT'te kullanın
-- Örnek: user_id = 'ce507534-abla-4ccf-b0c3-4d42e8a608b1' (yukarıdaki sorgudan alacağınız ID)

-- ADIM 3: Öneriyi ekle (USER_ID'yi yukarıdaki sorgudan aldığınız ID ile değiştirin)
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
  'ce507534-abla-4ccf-b0c3-4d42e8a608b1',  -- 👈 BURAYI YUKARIDAKİ SORGUYLA BULDUĞUNUZ ID İLE DEĞİŞTİRİN
  'Su İçme Hatırlatıcısı',
  'Su içme hatırlatıcısı olsa çok güzel olur',
  0,
  0,
  true,
  now(),
  '0.1.53',
  now() - interval '2 hours'
)
RETURNING *;

-- ADIM 4: Profili herkese açık yap
UPDATE public.profiles 
SET show_public_profile = true 
WHERE id = 'ce507534-abla-4ccf-b0c3-4d42e8a608b1';  -- 👈 BURAYI DA AYNI ID İLE DEĞİŞTİRİN

-- ADIM 5: Kontrol et
SELECT 
  fr.id,
  fr.title,
  fr.description,
  fr.is_implemented,
  fr.created_at,
  p.full_name as user_name
FROM public.feature_requests fr
LEFT JOIN public.profiles p ON fr.user_id = p.id
WHERE fr.title = 'Su İçme Hatırlatıcısı'
ORDER BY fr.created_at DESC;

