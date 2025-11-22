# 🏋️‍♂️ NapiFit

> Vercel + Supabase üzerinde çalışan modern sağlık ve fitness asistanı

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3FCF8E?style=for-the-badge&logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel)

NapiFit; kullanıcı onboarding’i, sağlık metrikleri, egzersiz ve beslenme takibi gibi özellikleri tek çatı altında toplayan tam-stack bir uygulamadır. Arayüz tasarımı korunarak backend ve veri katmanı tamamen Supabase’e taşındı ve Vercel CLI ile kontrol edilebilir hale getirildi.

## 🌟 Öne çıkanlar

- 🔐 **Supabase Auth**: Google OAuth + e-posta/şifre desteği (Session & RLS hazır)
- 🗄️ **Postgres + RLS**: Sağlık metrikleri, egzersizler ve öğünler için güvenli tablolar
- 📊 **Gerçek zamanlı Dashboard**: BMI, hedefe kalan kilo, günlük kalori ve adım özetleri
- 🍽️ **Beslenme / Egzersiz formları**: Zod ile doğrulanmış API uçları
- 📱 **Capacitor uyumluluğu**: Mobilde Google girişini destekleyen OAuth köprüsü
- 🚀 **Vercel CLI akışı**: `vercel build`, `vercel deploy` ve `vercel dev` komutları hazır

## ⚡ Hızlı Başlangıç

```bash
git clone https://github.com/napibase/napifit.git
cd napifit
npm install
cp env.example .env
# .env içini Supabase & uygulama URL bilgilerinizle doldurun

# Supabase şemasını uygulayın
# (Supabase CLI yoksa migration dosyasını Dashboard > SQL üzerinden çalıştırın)
npx supabase db push || psql < supabase/migrations/0001_init.sql

npm run dev
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde açılır.

## 🔑 Gerekli ortam değişkenleri

`.env` dosyası:

```
NEXT_PUBLIC_SUPABASE_URL="https://PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="public-anon-key"
SUPABASE_SERVICE_ROLE_KEY="service-role-key"    # Sadece sunucu tarafında kullanılır
NEXT_PUBLIC_APP_URL="http://localhost:3000"     # Prod ortamda Vercel URL’iniz
```

Google OAuth için Supabase Dashboard > Authentication > Providers bölümünden Google sağlayıcısını aktif edip aynı `redirect URL`yi kullanın:

- Geliştirme: `http://localhost:3000/auth/callback`
- Prod: `https://your-app.vercel.app/auth/callback`

## 🗄️ Supabase şeması

`supabase/migrations/0001_init.sql` dosyası aşağıdakileri oluşturur:

- `profiles`, `health_metrics`, `workouts`, `meals` tabloları (RLS açık)
- `handle_new_user` trigger’ı (auth.users eklenince profil oluşturur)
- `avg_daily_steps` fonksiyonu (landing sayfasındaki istatistikler için)

Migration’ı uygulamak için:

```bash
# Supabase CLI varsa
npx supabase db push

# Ya da Dashboard > SQL Editor > Run SQL ile dosya içeriğini çalıştırın
```

## 🧪 Geliştirme komutları

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Next.js geliştirme sunucusu |
| `npm run build` | Production build |
| `npm run lint` | ESLint kontrolleri |
| `npm run vercel:dev` | Vercel dev (env senaryolarını test etmek için) |
| `npm run vercel:build` | CI ile aynı Vercel build adımı |
| `npm run vercel:deploy` | `vercel deploy --prod` |
| `npm run android:build / ios:build` | Capacitor hedefleri |

## 🚀 Vercel dağıtımı

1. `vercel link` ile projeyi bağlayın.
2. Vercel dashboard’ında aşağıdaki Environment Variables değerlerini ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (Serverless Function’lar için **Encrypted**)
   - `NEXT_PUBLIC_APP_URL`
3. `npm run vercel:build` ile yerelde test edin.
4. `npm run vercel:deploy` veya Vercel Git entegrasyonu ile yayınlayın.

## 📱 Mobil (Capacitor)

Google OAuth için `src/lib/google-oauth-mobile.ts` dosyası Supabase OAuth URL’sini Capacitor Browser ile açıp deep-link dönüşlerini yönetir. Android/iOS için:

```bash
npm run android:build && npm run android:open
npm run ios:build && npm run ios:open
```

## 📂 Proje yapısı

```
src/
 ├─ app/
 │   ├─ (auth)           # login/register/onboarding
 │   ├─ (app)            # dashboard, profile, health
 │   └─ api              # Supabase tabanlı Route Handlers
 ├─ components/          # Tasarım bileşenleri (değişmedi)
 ├─ lib/
 │   └─ supabase/        # client, server, admin helperları
 └─ types/
```

## 🤝 Katkıda bulunma

1. Fork & branch (`git checkout -b feature/awesome`)
2. Kod stilini koruyarak geliştirme yapın
3. `npm run lint && npm run vercel:build`
4. PR açmadan önce Supabase migration’larının güncel olduğundan emin olun

## 📄 Lisans

MIT – detaylar için `LICENSE`.

