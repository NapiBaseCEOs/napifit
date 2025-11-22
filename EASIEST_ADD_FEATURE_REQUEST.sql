-- ============================================
-- EN KOLAY YÖNTEM: MANUEL UUID İLE EKLEME
-- ============================================
-- Adım 1: Aşağıdaki sorguyu çalıştırın ve Mert Demir'in ID'sini bulun
SELECT id, full_name, email FROM public.profiles 
WHERE LOWER(full_name) LIKE '%mert%' OR LOWER(full_name) LIKE '%demir%';

-- Adım 2: Yukarıdaki sorgudan bulduğunuz ID'yi kopyalayın
-- Örnek: ce507534-abla-4ccf-b0c3-4d42e8a608b1

-- Adım 3: Aşağıdaki INSERT'te USER_ID'yi bulduğunuz ID ile değiştirin ve çalıştırın

-- ÖNERİYİ EKLE (USER_ID'yi değiştirin!)
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

-- PROFİLİ HERKESE AÇIK YAP (Aynı ID'yi kullanın)
UPDATE public.profiles 
SET show_public_profile = true 
WHERE id = 'ce507534-abla-4ccf-b0c3-4d42e8a608b1';  -- 👈 AYNI ID'Yİ KULLANIN

-- KONTROL ET
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

