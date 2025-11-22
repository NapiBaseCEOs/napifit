# 🚀 Vercel Import Adımları - Basit Rehber

## 📋 Vercel'e Import Ederken Seçilecek Ayarlar

### Adım 1: Vercel Dashboard'a Git
1. https://vercel.com adresine git
2. "Add New..." > "Project" tıkla
3. GitHub repository'ni seç veya "Import Git Repository" tıkla

### Adım 2: Repository Seç
- GitHub repository'ni seç: `NapiBaseCEOs/napifit`
- "Import" butonuna tıkla

### Adım 3: Framework Preset
**Seç:** `Next.js` (otomatik algılanır, değiştirme)

### Adım 4: Root Directory
**Bırak:** Boş (veya `./` yaz) - Root directory kullanılacak

### Adım 5: Build Settings
**Değiştirme!** Vercel otomatik algılar:
- **Framework Preset:** Next.js ✅
- **Build Command:** `npm run build` ✅ (otomatik)
- **Output Directory:** `.next` ✅ (otomatik)
- **Install Command:** `npm install` ✅ (otomatik)
- **Development Command:** `npm run dev` ✅ (otomatik)

### Adım 6: Environment Variables
**Şimdilik atla** - Import sonrası ekleyeceğiz

### Adım 7: Deploy
- "Deploy" butonuna tıkla
- İlk deploy başlayacak (environment variables olmadan başarısız olabilir, normal)

## ⚙️ Import Sonrası Yapılacaklar

### 1. Environment Variables Ekle
Vercel Dashboard > Projeniz > Settings > Environment Variables

Aşağıdaki değişkenleri ekle (Production, Preview, Development için):

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

### 2. Yeni Deploy Başlat
Environment variables eklendikten sonra:
- Deployments > En son deploy > "Redeploy" tıkla
- Veya yeni bir commit push et

### 3. Migration Otomatik Uygulanacak
Build sırasında migration otomatik uygulanacak (vercel-postbuild.js script'i çalışacak)

## ✅ Özet

**Import sırasında:**
- Framework: Next.js (otomatik)
- Root Directory: Boş bırak
- Build Settings: Değiştirme (otomatik)
- Environment Variables: Şimdilik atla

**Import sonrası:**
- Environment Variables ekle
- Yeni deploy başlat
- Migration otomatik uygulanacak

## 🎯 Önemli Notlar

- Migration **otomatik** uygulanacak (build sırasında)
- Environment variables **mutlaka** eklenmeli
- İlk deploy environment variables olmadan başarısız olabilir, normal
- Environment variables eklendikten sonra yeni deploy başlat

