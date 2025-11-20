# 📸 Supabase Storage Kurulumu - Manuel Adımlar

Service Role Key alındı, ancak Supabase URL'ine erişim sağlanamadı. 
Lütfen aşağıdaki adımları manuel olarak takip edin:

## 1. Bucket Oluşturma (Dashboard)

1. **Supabase Dashboard**'a gidin: https://supabase.com/dashboard
2. Projenizi seçin (ref: `eaibfqnjgkflvxdxfbw`)
3. Sol menüden **"Storage"** seçin
4. **"New bucket"** butonuna tıklayın
5. Şunları ayarlayın:
   - **Name**: `meals`
   - **Public bucket**: ✅ **Açık** (Çok önemli!)
6. **"Create bucket"** butonuna tıklayın

## 2. Policy'leri Oluşturma (SQL Editor)

1. Supabase Dashboard > **"SQL Editor"**
2. **"New query"** butonuna tıklayın
3. Aşağıdaki SQL'i yapıştırın ve **"Run"** butonuna tıklayın:

```sql
-- Storage Policies for meals bucket
-- Not: IF NOT EXISTS desteklenmez, önce DROP ediyoruz

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
```

## 3. Test Etme

Kurulum tamamlandıktan sonra:
1. Uygulamada fotoğraf çekmeyi deneyin
2. Fotoğraf başarıyla yüklendiğinde Storage > meals bucket'ında görünür olmalı

## Hazır Dosyalar

- ✅ `supabase/migrations/0002_create_storage_bucket.sql` - Policy migration dosyası
- ✅ Bu dosyayı da SQL Editor'de çalıştırabilirsiniz

## Notlar

- ✅ Bucket **public** olmalı (OpenAI görseli URL'den okuyabilmek için)
- ✅ Fotoğraflar `user_id/timestamp.jpg` formatında saklanır
- ✅ Her kullanıcı sadece kendi klasörüne yazabilir
- ✅ Herkes public fotoğrafları okuyabilir

