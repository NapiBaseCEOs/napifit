# ✅ Vercel Deploy Checklist

## 📋 Hazırlık Adımları

### 1. ✅ Vercel CLI Kurulumu
- [x] Vercel CLI kuruldu (`vercel --version`)

### 2. ✅ Proje Yapılandırması
- [x] `vercel.json` oluşturuldu
- [x] `.vercelignore` oluşturuldu
- [x] `next.config.mjs` Vercel için güncellendi
- [x] `package.json` Vercel script'leri eklendi
- [x] Turso database entegrasyonu eklendi
- [x] `env.example` güncellendi

### 3. ⏳ Vercel'e Giriş ve Proje Bağlama
- [ ] Vercel'e giriş yap: `vercel login`
- [ ] Projeyi bağla: `npm run vercel:link`

### 4. ⏳ Environment Variables Ayarlama
Vercel Dashboard > Projeniz > Settings > Environment Variables

Aşağıdaki değişkenleri ekleyin:

```
TURSO_DATABASE_URL=libsql://your-database-name-your-org.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token
AUTH_SECRET=your-random-secret-key-minimum-32-characters
NEXTAUTH_URL=https://your-app.vercel.app (deploy sonrası güncellenecek)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app (deploy sonrası güncellenecek)
DATABASE_URL=libsql://your-database-name-your-org.turso.io
```

### 5. ⏳ Turso Database Migration
- [ ] Turso database oluşturuldu
- [ ] Migration uygulandı: `node scripts/apply-turso-migration.js`

### 6. ⏳ GitHub Entegrasyonu
- [ ] Vercel Dashboard > Settings > Git
- [ ] GitHub repository bağlandı
- [ ] Otomatik deploy aktif

### 7. ⏳ İlk Deploy
- [ ] `npm run vercel:deploy` veya GitHub'dan otomatik deploy
- [ ] Deploy başarılı kontrolü
- [ ] Environment variables güncellendi (NEXTAUTH_URL, NEXT_PUBLIC_APP_URL)

### 8. ⏳ Test
- [ ] Site erişilebilir
- [ ] Register API çalışıyor
- [ ] Google OAuth çalışıyor
- [ ] Login çalışıyor

## 📝 Notlar

- Environment variables'ları production, preview ve development için ayrı ayrı ayarlayın
- Turso database migration'ı production'a deploy etmeden önce uygulayın
- `NEXTAUTH_URL` ve `NEXT_PUBLIC_APP_URL` değerlerini deploy sonrası Vercel URL'iniz ile güncelleyin
- Google OAuth redirect URI'yi Vercel URL'iniz ile güncelleyin

## 🚀 Hızlı Deploy

```bash
# 1. Vercel'e giriş
vercel login

# 2. Projeyi bağla
vercel link

# 3. Environment variables'ları ayarla (Dashboard'dan veya CLI ile)
vercel env add TURSO_DATABASE_URL
vercel env add TURSO_AUTH_TOKEN
# ... diğerleri

# 4. Deploy
npm run vercel:deploy
```

## 📚 Detaylı Rehber

Detaylı kurulum için `VERCEL_SETUP.md` dosyasına bakın.

