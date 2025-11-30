# 📸 Supabase Storage Bucket Kurulumu

## Hızlı Kurulum (Otomatik)

1. **.env.local veya .env dosyasına ekleyin:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

2. **Service Role Key'i almak için:**
   - Supabase Dashboard > Project Settings > API
   - "service_role" key'ini kopyalayın (secret key, dikkatli kullanın!)

3. **Script'i çalıştırın:**
```bash
node scripts/create-storage-bucket.js
```

## Manuel Kurulum (Dashboard)

Eğer script çalışmazsa, manuel olarak yapın:

### 1. Bucket Oluşturma

1. Supabase Dashboard'a gidin: https://supabase.com/dashboard
2. Projenizi seçin
3. Sol menüden **"Storage"** seçin
4. **"New bucket"** butonuna tıklayın
5. Şunları ayarlayın:
   - **Name**: `meals`
   - **Public bucket**: ✅ **Açık** (Public seçeneğini işaretleyin)
6. **"Create bucket"** butonuna tıklayın

### 2. Policy'leri Oluşturma

1. Supabase Dashboard > **SQL Editor**
2. **New Query** butonuna tıklayın
3. Aşağıdaki SQL'i yapıştırın ve **Run** butonuna tıklayın:

```sql
-- 1. INSERT Policy - Kullanıcılar kendi fotoğraflarını yükleyebilir
CREATE POLICY IF NOT EXISTS "Kullanıcılar kendi fotoğraflarını yükleyebilir"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'meals' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 2. SELECT Policy - Herkes public fotoğrafları okuyabilir
CREATE POLICY IF NOT EXISTS "Herkes public fotoğrafları okuyabilir"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'meals');

-- 3. UPDATE Policy - Kullanıcılar kendi fotoğraflarını güncelleyebilir
CREATE POLICY IF NOT EXISTS "Kullanıcılar kendi fotoğraflarını güncelleyebilir"
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
CREATE POLICY IF NOT EXISTS "Kullanıcılar kendi fotoğraflarını silebilir"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'meals' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### 3. Migration Dosyasını Kullanma

Alternatif olarak, migration dosyasını kullanabilirsiniz:

1. Supabase Dashboard > SQL Editor
2. `supabase/migrations/0002_create_storage_bucket.sql` dosyasının içeriğini kopyalayın
3. SQL Editor'e yapıştırın ve Run edin

## Test Etme

Kurulum tamamlandıktan sonra:

1. Uygulamada fotoğraf çekmeyi deneyin
2. Fotoğraf başarıyla yüklendiğinde Supabase Storage'da görünür olmalı
3. Storage > meals bucket'ında fotoğrafınızı görebilmelisiniz

## Notlar

- ✅ Bucket **public** olmalı (OpenAI görseli URL'den okuyabilmek için)
- ✅ Fotoğraflar `user_id/timestamp.jpg` formatında saklanır
- ✅ Her kullanıcı sadece kendi klasörüne yazabilir
- ✅ Herkes public fotoğrafları okuyabilir


