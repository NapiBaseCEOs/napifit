# 🔧 Git Kurulumu ve İlk Deploy

## ⚠️ Git Kurulu Değil

Git kurulu değil görünüyor. Commit ve push işlemleri için Git gereklidir.

## 📥 Git Kurulumu

### Windows için:

1. **Git for Windows indirin:**
   - https://git-scm.com/download/win
   - Veya: https://github.com/git-for-windows/git/releases

2. **Kurulum yapın:**
   - İndirdiğiniz installer'ı çalıştırın
   - Varsayılan ayarlarla kurun
   - "Add Git to PATH" seçeneğini işaretleyin

3. **Kurulumu kontrol edin:**
   ```powershell
   git --version
   ```

### Alternatif: GitHub Desktop

Git komut satırı yerine GitHub Desktop kullanabilirsiniz:
- https://desktop.github.com/

## 🚀 Kurulum Sonrası

Git kurulumundan sonra, proje klasöründe şu komutları çalıştırın:

```powershell
# Git repository başlat (eğer yoksa)
git init

# Branch'i main yap
git branch -M main

# GitHub repository URL'sini ekle (GitHub'da oluşturduktan sonra)
git remote add origin https://github.com/KULLANICI_ADI/napifit.git

# Tüm dosyaları ekle
git add .

# Commit yap
git commit -m "feat: Versiyon 0.1.1 - Modern tasarım güncellemesi

- Fitness temalı modern renk paleti
- Ana sayfa hero section güncellendi
- Login/Register sayfaları modernleştirildi
- Dashboard kartları hover efektleri
- DEPLOY.md ve CONTRIBUTING.md eklendi
- Versiyon: 0.1.1"

# GitHub'a push et
git push -u origin main
```

## 🤖 Otomatik Script Kullanımı

Git kurulumundan sonra otomatik script'i kullanabilirsiniz:

```powershell
node scripts/git-setup.js
```

Bu script:
1. ✅ Git repository'yi başlatır
2. ✅ Remote repository eklemenizi ister
3. ✅ Otomatik commit yapar
4. ✅ Push yapmanızı sorar

## 📦 Versiyon Güncellemesi

Her deploy öncesi versiyon otomatik güncellenir:

```powershell
node scripts/version-update.js
```

Bu script `package.json` ve `src/config/version.ts` dosyalarındaki versiyonu küçük bir artışla günceller (0.1.1 -> 0.1.2).

## ⚡ Hızlı Deploy

Git kurulumundan sonra tek komutla deploy:

```powershell
npm run deploy
```

Bu komut:
1. Versiyonu günceller
2. Git commit yapar
3. Push eder (remote varsa)

## 🔄 Manuel Deploy Süreci

1. **Versiyonu güncelle:**
   ```powershell
   npm run version:update
   ```

2. **Commit ve push:**
   ```powershell
   npm run git:commit
   ```

3. **Cloudflare Pages otomatik deploy edecek** (GitHub Actions ile)

## 📝 Notlar

- Versiyon numarası her deploy'da otomatik artar
- Git commit mesajları otomatik oluşturulur
- Cloudflare Pages GitHub repository'yi dinler ve otomatik deploy yapar
- Detaylı deploy rehberi için: `DEPLOY.md`

## ✅ Hazır Olunca

Git kurulumundan sonra proje klasöründe:

```powershell
node scripts/git-setup.js
```

komutunu çalıştırın. Script size rehberlik edecek.

