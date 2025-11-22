# Vercel Deploy Kurulum Rehberi

## 1. Vercel CLI Kurulumu

Vercel CLI zaten kuruldu. Kontrol etmek için:
```bash
vercel --version
```

## 2. Vercel'e Giriş Yap

```bash
vercel login
```

## 3. Projeyi Vercel'e Bağla

```bash
npm run vercel:link
```

Veya manuel olarak:
```bash
vercel link
```

## 4. Environment Variables Ayarla

### Vercel Dashboard'dan:
1. Vercel Dashboard > Projeniz > Settings > Environment Variables
2. Aşağıdaki değişkenleri ekleyin:

```
TURSO_DATABASE_URL=libsql://your-database-name-your-org.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token
AUTH_SECRET=your-random-secret-key-minimum-32-characters
NEXTAUTH_URL=https://your-app.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
DATABASE_URL=libsql://your-database-name-your-org.turso.io
```

### Vercel CLI ile:
```bash
vercel env add TURSO_DATABASE_URL
vercel env add TURSO_AUTH_TOKEN
vercel env add AUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add NEXT_PUBLIC_APP_URL
vercel env add DATABASE_URL
```

## 5. Turso Database Migration

Turso database'e migration uygula:
```bash
node scripts/apply-turso-migration.js
```

Veya manuel olarak:
```bash
npm install -g @libsql/cli
libsql migrate --url $TURSO_DATABASE_URL --auth-token $TURSO_AUTH_TOKEN --file prisma/migrations/init_schema.sql
```

## 6. Deploy

### Production Deploy:
```bash
npm run vercel:deploy
```

### Preview Deploy:
```bash
vercel
```

### GitHub'dan Otomatik Deploy:
1. Vercel Dashboard > Projeniz > Settings > Git
2. GitHub repository'nizi bağlayın
3. Her push'ta otomatik deploy olacak

## 7. Build Ayarları

Vercel otomatik olarak Next.js projelerini algılar. `vercel.json` dosyası zaten hazır.

## 8. Database Bağlantısı

- **Production**: Turso Database kullanılır
- **Development**: Local SQLite (file:./dev.db)
- **Fallback**: Prisma (development için)

## 9. Önemli Notlar

- Turso database migration'ı production'a deploy etmeden önce uygulayın
- Environment variables'ları production, preview ve development için ayrı ayrı ayarlayın
- `NEXTAUTH_URL` ve `NEXT_PUBLIC_APP_URL` değerlerini deploy sonrası Vercel URL'iniz ile güncelleyin

## 10. Troubleshooting

### Build Hatası:
- Environment variables'ların doğru ayarlandığından emin olun
- `npm install` çalıştırın
- `prisma generate` çalıştırın

### Database Bağlantı Hatası:
- Turso credentials'ların doğru olduğundan emin olun
- Migration'ın uygulandığından emin olun
- Turso dashboard'dan database'in aktif olduğunu kontrol edin

