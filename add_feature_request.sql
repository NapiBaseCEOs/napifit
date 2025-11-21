-- Mert Demir kullanıcısını bul ve su içme hatırlatıcısı önerisini ekle
-- Önce kullanıcıyı bul
DO $$
DECLARE
  mert_user_id uuid;
BEGIN
  -- Mert Demir kullanıcısını bul (full_name'e göre)
  SELECT id INTO mert_user_id
  FROM public.profiles
  WHERE LOWER(full_name) LIKE '%mert%' AND LOWER(full_name) LIKE '%demir%'
  LIMIT 1;

  -- Eğer kullanıcı bulunamazsa, örnek bir UUID kullan (manuel olarak değiştirin)
  IF mert_user_id IS NULL THEN
    RAISE NOTICE 'Mert Demir kullanıcısı bulunamadı. Lütfen kullanıcı ID''sini manuel olarak girin.';
    -- Tüm kullanıcıları listele
    RAISE NOTICE 'Mevcut kullanıcılar:';
    FOR rec IN SELECT id, full_name, email FROM public.profiles LIMIT 10 LOOP
      RAISE NOTICE 'ID: %, İsim: %, Email: %', rec.id, rec.full_name, rec.email;
    END LOOP;
  ELSE
    -- Su içme hatırlatıcısı önerisini ekle
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
      mert_user_id,
      'Su İçme Hatırlatıcısı',
      'Su içme hatırlatıcısı olsa çok güzel olur',
      0,
      0,
      true, -- Uygulandı olarak işaretle
      now(), -- Bugün uygulandı
      '0.1.52', -- Versiyon numarası (güncel versiyonu kullanın)
      now() - interval '7 days' -- 7 gün önce oluşturulmuş gibi göster
    )
    ON CONFLICT DO NOTHING;
    
    -- Kullanıcının profili herkese açık olsun
    UPDATE public.profiles 
    SET show_public_profile = true 
    WHERE id = mert_user_id;
    
    RAISE NOTICE 'Öneri başarıyla eklendi. Kullanıcı ID: %', mert_user_id;
  END IF;
END $$;

-- Kullanıcıyı kontrol et
SELECT id, full_name, email, show_public_profile 
FROM public.profiles 
WHERE LOWER(full_name) LIKE '%mert%' OR LOWER(full_name) LIKE '%demir%';

