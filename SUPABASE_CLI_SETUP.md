# Supabase CLI ile Migration Uygulama

## Otomatik Çalıştırma (Supabase CLI)

### Adım 1: Supabase'e Login Olun

```bash
npx supabase login
```

Bu komut sizi tarayıcıda açacak, Supabase hesabınızla giriş yapın ve access token alın.

### Adım 2: Projeyi Link Edin

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

Proje ref'i Supabase Dashboard URL'sinde: `https://supabase.com/dashboard/project/eaibfqnjgkflvxdxfblw`
Proje ref: `eaibfqnjgkflvxdxfblw`

### Adım 3: Migration'ları Push Edin

```bash
npx supabase db push
```

Bu komut `supabase/migrations/` klasöründeki tüm migration'ları Supabase'e gönderir.

### Adım 4: Öneriyi Ekleyin

`run_migrations_and_add_request.sql` dosyasını Supabase Dashboard SQL Editor'de çalıştırın.

## Manuel Çalıştırma (Önerilen - Daha Hızlı)

1. Supabase Dashboard'a gidin
2. SQL Editor'ü açın
3. `run_migrations_and_add_request.sql` dosyasının **tüm içeriğini** kopyalayıp yapıştırın
4. **Run** (F5) butonuna tıklayın

Bu yöntem daha hızlı ve doğrudan çalışır.

