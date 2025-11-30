# Vercel Environment Variables

## Gerekli Environment Variables

Vercel dashboard'da şu environment variable'ları ayarlayın:

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (admin işlemleri için)

### App Configuration
- `NEXT_PUBLIC_APP_URL` - Production app URL (ör: https://your-app.vercel.app)
- `CORS_ORIGIN` - CORS origin (production domain, ör: https://your-app.vercel.app)

### AI (Optional)
- `OPENAI_API_KEY` - OpenAI API key (opsiyonel)
- `GOOGLE_AI_API_KEY` veya `GEMINI_API_KEY` - Google AI API key (opsiyonel)

### Server
- `PORT` - Server port (Vercel otomatik ayarlar, gerekmez)
- `NODE_ENV` - production (Vercel otomatik ayarlar)

## Mevcut Değerler (Fallback)

Kod içinde fallback değerler var:
- Supabase URL: `https://eaibfqnjgkflvxdxfblw.supabase.co`
- Supabase Keys: Kod içinde hardcoded (production'da environment variable kullanılmalı)

## Vercel Dashboard'da Ayarlama

1. Vercel dashboard'a git
2. Project Settings > Environment Variables
3. Her variable'ı ekle (Production, Preview, Development için)


