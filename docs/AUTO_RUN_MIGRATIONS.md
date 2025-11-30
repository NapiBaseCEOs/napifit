# Otomatik Migration Çalıştırma

Supabase CLI ile otomatik çalıştırmak için access token gerekiyor.

## Access Token Nasıl Alınır?

1. Supabase Dashboard'a gidin: https://supabase.com/dashboard
2. Sağ üstteki profil ikonuna tıklayın
3. **Account Settings** > **Access Tokens** bölümüne gidin
4. **Generate New Token** butonuna tıklayın
5. Token'ı kopyalayın

## Token ile Çalıştırma

Token'ı aldıktan sonra şu komutları çalıştırın:

```powershell
# Token'ı environment variable olarak set edin
$env:SUPABASE_ACCESS_TOKEN = "YOUR_TOKEN_HERE"

# Projeyi link edin
npx supabase link --project-ref eaibfqnjgkflvxdxfblw

# Migration'ları push edin
npx supabase db push
```

## Alternatif: Direkt SQL Çalıştırma

Eğer token almak istemiyorsanız, `run_migrations_and_add_request.sql` dosyasını Supabase Dashboard SQL Editor'de çalıştırın - bu daha hızlı!

