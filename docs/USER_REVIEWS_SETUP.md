# user_reviews Tablosu Kurulum Talimatları

## Durum
- Migration dosyası hazır: `supabase/migrations/20240530_user_reviews.sql`
- Migration repair yapıldı
- Supabase CLI ile otomatik push başarısız (migration conflict)

## Manuel Kurulum (Önerilen)

### Adım 1: Supabase Dashboard'a Git
1. https://app.supabase.com adresine git
2. **napifit** projesini seç (gqxmqymoqlkqjautoama)

### Adım 2: SQL Editor'ı Aç
1. Sol menüden **SQL Editor** seçeneğine tıkla
2. **New Query** butonuna tıkla

### Adım 3: SQL'i Çalıştır
Aşağıdaki SQL'i kopyala ve çalıştır:

```sql
-- Create user_reviews table
CREATE TABLE IF NOT EXISTS public.user_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  ai_sentiment_score DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all reviews"
  ON public.user_reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own reviews"
  ON public.user_reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.user_reviews
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.user_reviews
  FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_user_reviews_user_id ON public.user_reviews(user_id);
CREATE INDEX idx_user_reviews_is_featured ON public.user_reviews(is_featured);
CREATE INDEX idx_user_reviews_ai_sentiment_score ON public.user_reviews(ai_sentiment_score DESC);
CREATE INDEX idx_user_reviews_created_at ON public.user_reviews(created_at DESC);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_reviews_updated_at
  BEFORE UPDATE ON public.user_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Adım 4: Doğrulama
SQL çalıştıktan sonra:
1. **Table Editor** > **user_reviews** tablosunu kontrol et
2. Production sitesini yenile: https://napifit.vercel.app
3. `/api/reviews/featured` endpoint'i artık warning vermeyecek

## Alternatif: CLI ile (Gelişmiş)
```bash
# Supabase connection string al
npx supabase projects api-keys --project-ref eaibfqnjgkflvxdxfblw

# psql ile bağlan ve SQL çalıştır
psql "postgresql://postgres:[PASSWORD]@db.eaibfqnjgkflvxdxfblw.supabase.co:5432/postgres" -f supabase/migrations/20240530_user_reviews.sql
```

## Sonuç
Tablo oluşturulduktan sonra:
- ✅ user_reviews warning'i kaybolacak
- ✅ Gerçek kullanıcı yorumları kaydedilebilecek
- ✅ AI sentiment analysis çalışacak
- ✅ Featured reviews sistemi aktif olacak
