-- Storage bucket ve policy'leri oluştur
-- meals bucket'ı fotoğraf depolamak için kullanılır

-- Bucket oluştur (SQL ile doğrudan bucket oluşturulamaz, Supabase API kullanılmalı)
-- Bu migration sadece policy'leri oluşturur
-- Bucket'ı manuel olarak Dashboard'dan veya script ile oluşturun

-- Storage policies
-- Note: Supabase storage.objects için policy'ler oluşturulur
-- IF NOT EXISTS desteklenmediği için önce DROP ediyoruz

-- 1. INSERT Policy - Kullanıcılar kendi fotoğraflarını yükleyebilir
DROP POLICY IF EXISTS "Kullanıcılar kendi fotoğraflarını yükleyebilir" ON storage.objects;
CREATE POLICY "Kullanıcılar kendi fotoğraflarını yükleyebilir"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'meals' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 2. SELECT Policy - Herkes public fotoğrafları okuyabilir
DROP POLICY IF EXISTS "Herkes public fotoğrafları okuyabilir" ON storage.objects;
CREATE POLICY "Herkes public fotoğrafları okuyabilir"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'meals');

-- 3. UPDATE Policy - Kullanıcılar kendi fotoğraflarını güncelleyebilir
DROP POLICY IF EXISTS "Kullanıcılar kendi fotoğraflarını güncelleyebilir" ON storage.objects;
CREATE POLICY "Kullanıcılar kendi fotoğraflarını güncelleyebilir"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'meals' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'meals' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. DELETE Policy - Kullanıcılar kendi fotoğraflarını silebilir
DROP POLICY IF EXISTS "Kullanıcılar kendi fotoğraflarını silebilir" ON storage.objects;
CREATE POLICY "Kullanıcılar kendi fotoğraflarını silebilir"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'meals' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

