# 2025-11-23 – Multi-Language Support (16 Dil Desteği)

## 🌍 Çoklu Dil Sistemi
- **16 dil desteği eklendi**: Türkçe, İngilizce, Almanca, Fransızca, İspanyolca, İtalyanca, Rusça, Arapça, Portekizce, Çince, Japonca, Korece, Hintçe, Hollandaca, İsveççe, Lehçe
- **Otomatik dil algılama**: IP geolocation (Vercel/Cloudflare headers) üzerinden kullanıcının konumuna göre otomatik dil seçimi
- **150+ ülke mapping**: Her ülke için en uygun dil otomatik olarak belirleniyor
- **Default locale İngilizce** olarak değiştirildi (global erişim için)
- **Browser language fallback**: IP detection çalışmazsa tarayıcı dili kullanılıyor
- **Cookie persistence**: Kullanıcının seçtiği dil cookie'de saklanıyor

## 🎨 Dil Değiştirme UI
- Header'a bayraklı dropdown dil değiştirici eklendi
- Her dilin native adı ve İngilizce karşılığı görüntüleniyor
- Aktif dil highlight ediliyor
- Responsive tasarım (mobil ve desktop)

## 🔧 Teknik Altyapı
- Server-side locale detection middleware ile
- Tüm UI elementleri için translation key sistemi
- Email templates çoklu dil desteği
- Fallback mekanizması (eksik çeviriler İngilizce'ye fallback)

## 🕐 Timezone Düzeltmesi
- AI Asistan artık **Türkiye saat dilimini** (Europe/Istanbul - UTC+3) kullanıyor
- Proaktif mesajlar doğru yerel saate göre gönderiliyor

---

# 2025-11-23 – AI Asistan Bildirim Güncellemesi

- AI Asistanının verdiği her cevap ile proaktif hatırlatmaları bildirim merkezine kaydediyoruz. Bildirimler okundu olarak işaretlenebiliyor ve sadece size ait kayıtlar Supabase'de tutuluyor.
- Proaktif mesajlar yinelenirse otomatik olarak filtreleniyor; aynı hatırlatma aynı gün içinde tekrar bildirime düşmüyor.
- Yardımcı mesajlardan gelen hızlı aksiyon butonları sağlıktaki ilgili forma yönlendiriyor (ör. egzersiz, öğün, su kayıtları).
- Otomatik su/öğün kayıtları başarılı olursa hem sohbette hem bildirimlerde özet dönüyor, böylece yaptığınız her kayıt tek yerden takip edilebiliyor.
- Proaktif mesaj üretimi 100+ farklı şablon ve ton kombinasyonuyla zenginleştirildi; yeni sistem her saat taze içerik üreterek tekrar eden mesajları engelliyor.

