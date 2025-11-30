# 🔄 Cloudflare Workers vs Cloudflare Pages

## Fark Nedir?

### Cloudflare Workers
- **Serverless function platform**
- API endpoint'leri, backend servisleri için
- `wrangler deploy` komutu ile deploy edilir
- Daha küçük, hızlı başlayan fonksiyonlar

### Cloudflare Pages
- **Static site hosting + Serverless functions**
- Next.js, React, Vue gibi framework'ler için
- GitHub entegrasyonu ile **otomatik deploy**
- `wrangler pages deploy` komutu ile manuel deploy edilebilir
- **Ancak genellikle GitHub bağlantısı ile otomatik deploy yapılır**

## Bizim Durumumuz

**NapiFit = Cloudflare Pages projesi**

- ✅ Next.js uygulaması
- ✅ GitHub entegrasyonu ile otomatik deploy
- ✅ `wrangler.toml` dosyasında `pages_build_output_dir` tanımlı
- ✅ GitHub Actions sadece **build** yapıyor, deploy **Cloudflare Pages** yapıyor

## Hata Çözümü

GitHub Actions workflow'unda **`wrangler deploy`** komutu yanlış!

**Yanlış:**
```yaml
- name: Deploy
  run: npx wrangler deploy  # ❌ Bu Workers için!
```

**Doğru:**
```yaml
- name: Deploy to Cloudflare Pages
  uses: cloudflare/pages-action@v1  # ✅ Bu Pages için!
```

## Cloudflare Pages Deploy Süreci

1. **GitHub'a push** → GitHub Actions tetiklenir
2. **GitHub Actions build yapar** → `.open-next` klasörü oluşturulur
3. **Cloudflare Pages Action deploy eder** → `.open-next` klasörünü Cloudflare'e yükler
4. **Cloudflare Pages otomatik olarak deploy eder** → Site canlıya çıkar

## Environment Variables

### Build Sırasında (GitHub Actions)
- Sadece build için dummy değerler yeterli
- `DATABASE_URL: "file:./dev.db"` (dummy)
- Diğer env'ler opsiyonel (sadece uyarıları önlemek için)

### Production'da (Cloudflare Pages)
- Cloudflare Pages Dashboard > Settings > Environment variables
- Bu değerler **runtime'da** kullanılır
- GitHub Secrets **değil**, **Cloudflare Pages Environment Variables** kullanılır

## Düzeltme

GitHub Actions workflow dosyası güncellendi:
- ✅ `wrangler deploy` kaldırıldı (yanlış komut)
- ✅ `cloudflare/pages-action@v1` kullanılıyor (doğru)
- ✅ Build komutu düzeltildi

## Sonuç

**Workers** ve **Pages** farklı! 

Bizim projemiz **Pages** olduğu için:
- ✅ GitHub Actions otomatik deploy yapıyor
- ✅ Manuel `wrangler deploy` gerekmez
- ✅ `wrangler pages deploy` sadece manuel deploy için

