# Vercel Proje Import Rehberi

## 📋 Vercel'e Import Ederken Seçilecek Ayarlar

### 1. Framework Preset
**Seçin:** `Next.js` (otomatik algılanır)

### 2. Root Directory
**Seçin:** `./` (root directory)

### 3. Build Command
**Seçin:** `npm run build` (otomatik algılanır, değiştirmeyin)

### 4. Output Directory
**Seçin:** `.next` (otomatik algılanır, değiştirmeyin)

### 5. Install Command
**Seçin:** `npm install` (otomatik algılanır, değiştirmeyin)

### 6. Development Command
**Seçin:** `npm run dev` (otomatik algılanır, değiştirmeyin)

## ⚙️ Önemli Notlar

- **Framework Preset:** Next.js seçili olmalı
- **Root Directory:** Boş bırakın veya `./` yazın
- **Build Settings:** Vercel otomatik algılar, değiştirmeyin
- **Environment Variables:** Import sonrası Settings'ten ekleyin

## 🔄 Import Sonrası

1. Environment Variables ekleyin (Settings > Environment Variables)
2. GitHub repository'yi bağlayın (Settings > Git)
3. İlk deploy otomatik başlayacak
4. Migration otomatik uygulanacak (build sırasında)

