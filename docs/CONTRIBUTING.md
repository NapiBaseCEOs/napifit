# Katkıda Bulunma Rehberi

NapiFit projesine katkıda bulunmak istediğiniz için teşekkür ederiz! 🎉

## 📋 İçindekiler

1. [Başlangıç](#başlangıç)
2. [Geliştirme Ortamı Kurulumu](#geliştirme-ortamı-kurulumu)
3. [Katkı Süreci](#katkı-süreci)
4. [Kod Standartları](#kod-standartları)
5. [Commit Mesajları](#commit-mesajları)

## Başlangıç

1. Projeyi fork edin
2. Repository'yi clone edin:
   ```bash
   git clone https://github.com/YOUR_USERNAME/napifit.git
   cd napifit
   ```
3. Feature branch oluşturun:
   ```bash
   git checkout -b feature/amazing-feature
   ```

## Geliştirme Ortamı Kurulumu

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. `.env` dosyası oluşturun (`.env.example` örneğini kullanın)

3. Prisma client'ı generate edin:
   ```bash
   npm run prisma:generate
   ```

4. Development server'ı başlatın:
   ```bash
   npm run dev
   ```

## Katkı Süreci

1. **Issue oluşturun** (büyük değişiklikler için önce tartışın)
2. **Feature branch** oluşturun
3. **Değişikliklerinizi** yapın
4. **Test edin** (local'de çalıştığından emin olun)
5. **Commit edin** (anlamlı commit mesajları kullanın)
6. **Push edin** ve **Pull Request** açın

## Kod Standartları

- TypeScript kullanın
- ESLint kurallarına uyun
- Tailwind CSS ile stil verin
- Responsive tasarım uygulayın
- Accessibility standartlarına uyun

## Commit Mesajları

Anlamlı commit mesajları yazın:

```
feat: Yeni özellik eklendi
fix: Bug düzeltildi
docs: Dokümantasyon güncellendi
style: Kod formatı düzenlendi
refactor: Kod yeniden yapılandırıldı
test: Test eklendi
chore: Build veya dependency güncellemesi
```

Örnek:
```bash
git commit -m "feat: Dashboard'a yeni sağlık metrikleri eklendi"
```

## Pull Request Checklist

- [ ] Kod çalışıyor ve test edildi
- [ ] ESLint hataları yok
- [ ] TypeScript hataları yok
- [ ] Responsive tasarım test edildi
- [ ] Commit mesajları anlamlı
- [ ] README güncellendi (gerekirse)

Teşekkürler! 🙏

