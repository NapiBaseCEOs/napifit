# Supabase Migration Uygulama Talimatları

## Hızlı Başlangıç

1. **Supabase Dashboard'a gidin**: https://supabase.com/dashboard
2. Projenizi seçin
3. Sol menüden **SQL Editor**'ü açın
4. **New Query** butonuna tıklayın
5. `apply_all_migrations.sql` dosyasının **tüm içeriğini** kopyalayıp yapıştırın
6. **Run** (veya F5) butonuna tıklayın
7. İşlem tamamlandıktan sonra kontrol sorguları çalışacak ve sonuçları göreceksiniz

## Ne Yapılacak?

### ✅ Adım 1: Su Tüketimi Takibi
- `water_intake` tablosu oluşturulacak
- Profil tablosuna su ayarları eklenecek

### ✅ Adım 2: Beğenmeme Sistemi
- `feature_request_dislikes` tablosu oluşturulacak
- `feature_requests` tablosuna `dislike_count` kolonu eklenecek
- Trigger'lar ve RLS politikaları eklenecek

### ✅ Adım 3: Manuel Öneri Ekleme
- Mert Demir kullanıcısı bulunacak
- "Su İçme Hatırlatıcısı" önerisi eklenecek
- Kullanıcının profili herkese açık yapılacak

## Kontrol

Migration başarılı olduysa:

1. **Su tablosu**: `SELECT * FROM water_intake LIMIT 1;` - Tablo var olmalı
2. **Dislike tablosu**: `SELECT * FROM feature_request_dislikes LIMIT 1;` - Tablo var olmalı
3. **Öneri**: Topluluk sayfasında "Su İçme Hatırlatıcısı" önerisi görünmeli
4. **Kullanıcı**: Mert Demir'in ismine tıklanabilmeli (show_public_profile = true olmalı)

## Sorun Giderme

### "Table already exists" Hatası
✅ **Normal** - Migration dosyaları `IF NOT EXISTS` kullanır, güvenli

### "Function already exists" Hatası
✅ **Normal** - `CREATE OR REPLACE` kullanılır, fonksiyonlar güncellenir

### Mert Demir Bulunamadı
⚠️ **Manuel ekleme gerekir**:
1. SQL Editor'de şu sorguyu çalıştırın:
```sql
SELECT id, full_name, email FROM public.profiles LIMIT 10;
```
2. Kullanıcı ID'sini bulun
3. Şu sorguyu çalıştırın (user_id'yi değiştirin):
```sql
INSERT INTO public.feature_requests (
  user_id, title, description, like_count, dislike_count, 
  is_implemented, implemented_at, implemented_version, created_at
) VALUES (
  'USER_ID_BURAYA',
  'Su İçme Hatırlatıcısı',
  'Su içme hatırlatıcısı olsa çok güzel olur',
  0, 0, true, now(), '0.1.52', now() - interval '7 days'
);

UPDATE public.profiles 
SET show_public_profile = true 
WHERE id = 'USER_ID_BURAYA';
```

## Migration Sonrası

1. ✅ Siteyi yenileyin
2. ✅ Topluluk sayfasına gidin (`/community`)
3. ✅ "Su İçme Hatırlatıcısı" önerisini kontrol edin
4. ✅ Mert Demir'in ismine tıklayın (profile'a gitmeli)
5. ✅ Dislike butonunu test edin
6. ✅ Su hatırlatıcısı sayfasına gidin (`/water`)

## Notlar

- Migration'lar idempotent'tir (tekrar çalıştırılabilir)
- Eğer bir kısım hata verirse, sadece o kısmı atlayabilirsiniz
- Tüm işlemler `IF NOT EXISTS` veya `OR REPLACE` kullanır, güvenlidir

