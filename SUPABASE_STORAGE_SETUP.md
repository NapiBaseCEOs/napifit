# 📸 Supabase Storage Kurulumu

Fotoğraf yükleme özelliği için Supabase Storage bucket'ı oluşturulmalıdır.

## Adımlar

1. **Supabase Dashboard'a gidin**
   - https://supabase.com/dashboard
   - Projenizi seçin

2. **Storage bölümüne gidin**
   - Sol menüden "Storage" seçin
   - "New bucket" butonuna tıklayın

3. **Bucket oluşturun**
   - **Name**: `meals`
   - **Public bucket**: ✅ **Açık** (Public seçeneğini işaretleyin)
   - "Create bucket" butonuna tıklayın

4. **Bucket politikalarını ayarlayın**
   - Storage > Policies
   - `meals` bucket'ını seçin
   - Aşağıdaki politikaları ekleyin:

### Upload Policy (Yükleme İzni)
```
CREATE POLICY "Kullanıcılar kendi fotoğraflarını yükleyebilir"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'meals' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Read Policy (Okuma İzni)
```
CREATE POLICY "Herkes public fotoğrafları okuyabilir"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'meals');
```

5. **Test edin**
   - Uygulamada fotoğraf çekmeyi deneyin
   - Fotoğraf başarıyla yüklendiğinde Supabase Storage'da görünür olmalı

## Notlar

- Bucket public olmalı ki OpenAI görseli URL'den okuyabilsin
- Fotoğraflar `user_id/timestamp.jpg` formatında saklanır
- Her kullanıcı sadece kendi klasörüne yazabilir


