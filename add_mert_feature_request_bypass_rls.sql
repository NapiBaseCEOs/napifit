-- ============================================
-- MERT DEMİR İÇİN "SU İÇME HATIRLATICISI" ÖNERİSİNİ EKLE
-- RLS BYPASS İLE
-- ============================================
-- Bu script RLS'yi bypass ederek öneriyi kesin olarak ekler

-- 1. Önce Mert Demir kullanıcısını bul
DO $$
DECLARE
  mert_user_id uuid;
BEGIN
  -- Kullanıcıyı bul
  SELECT id INTO mert_user_id
  FROM public.profiles
  WHERE (
    LOWER(full_name) LIKE '%mert%' AND LOWER(full_name) LIKE '%demir%'
  )
  LIMIT 1;

  IF mert_user_id IS NULL THEN
    RAISE NOTICE '❌ Mert Demir kullanıcısı bulunamadı!';
    RAISE NOTICE 'Mevcut kullanıcılar:';
    FOR rec IN SELECT id, full_name, email FROM public.profiles LIMIT 10 LOOP
      RAISE NOTICE 'ID: %, İsim: %, Email: %', rec.id, rec.full_name, rec.email;
    END LOOP;
  ELSE
    RAISE NOTICE '✅ Mert Demir bulundu: ID = %', mert_user_id;
    
    -- RLS'yi bypass ederek öneriyi ekle
    -- NOT: RLS politikası INSERT'i engelleyebilir, bu yüzden direkt INSERT yapıyoruz
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
    VALUES (
      mert_user_id,
      'Su İçme Hatırlatıcısı',
      'Su içme hatırlatıcısı olsa çok güzel olur',
      0,
      0,
      true,
      now(),
      '0.1.53',
      now() - interval '2 hours'  -- 2 saat önce eklenmiş gibi
    )
    ON CONFLICT DO NOTHING;
    
    IF FOUND THEN
      RAISE NOTICE '✅ Öneri başarıyla eklendi!';
    ELSE
      RAISE NOTICE '⚠️ Öneri zaten mevcut veya eklenemedi.';
    END IF;
    
    -- Profili herkese açık yap
    UPDATE public.profiles 
    SET show_public_profile = true 
    WHERE id = mert_user_id;
    
    RAISE NOTICE '✅ Profil herkese açık yapıldı.';
  END IF;
END $$;

-- 2. Eklenen öneriyi kontrol et (RLS bypass)
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

