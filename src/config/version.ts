export const APP_VERSION = "0.1.52";

export type ReleaseNote = {
  version: string;
  date: string;
  title: string;
  highlights: string[];
};

export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: "0.1.52",
    date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" }),
    title: "Su hatırlatıcısı & aktivite takvimi & beğenmeme sistemi",
    highlights: [
      "💧 Su hatırlatıcısı sistemi - Günlük su tüketimi takibi, görsel kadeh animasyonu, browser bildirimleri",
      "📅 Aktivite takvimi - Dashboard ve sağlık sayfasında günlük aktivite takibi, renkli durum göstergeleri",
      "👎 Beğenmeme sistemi - Topluluk önerilerine dislike butonu eklendi",
      "🎨 Modern sağlık ekranı - Renkli gradient tasarım, gereksiz metrikler kaldırıldı (sadece kilo ve bağırsak sağlığı)",
      "🔔 Bildirim sistemi - Su hatırlatıcısı için ayarlanabilir aralıklı bildirimler",
      "⚖️ Sadeleştirilmiş metrikler - BMI, yağ oranı, kas kütlesi gibi kullanıcının bilemeyeceği metrikler kaldırıldı",
      "📊 Bugün özeti - Takvimde bugün için eksiklik kontrolü ve uyarılar",
    ],
  },
  {
    version: "0.1.51",
    date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" }),
    title: "Topluluk sistemi & her kullanıcıya özel profil linkleri",
    highlights: [
      "👥 Topluluk sayfası - Kullanıcılar özellik önerebilir, beğenebilir ve görüntüleyebilir",
      "💡 Özellik önerileri - Topluluk üyeleri yeni özellikler önerebilir, beğeni sayısına göre sıralanır",
      "👑 Yılın adamı sistemi - En çok önerisi uygulanan kullanıcılar liderlik tablosunda görünür",
      "🔗 Her kullanıcıya özel profil linki - /profile?userId=xxx ile herhangi bir kullanıcının profilini görüntüle",
      "🔒 Gizlilik ayarları - Profili ve topluluk istatistiklerini gizleme seçeneği",
      "📊 Topluluk istatistikleri - Profil sayfasında öneri sayıları ve uygulanan öneriler gösterilir",
      "🌐 Ana sayfaya topluluk bölümü - En beğenilen öneriler ve yılın adamı özeti",
      "🎯 'Dashboard' kelimesi Türkçeleştirildi - Artık 'Kontrol Paneli' olarak görünüyor",
    ],
  },
  {
    version: "0.1.50",
    date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" }),
    title: "Çok dilli destek & gerçek kullanıcı yorumları",
    highlights: [
      "🌍 Çok dilli yapı (i18n) - IP-based dil algılama, 8 dil desteği (TR, EN, DE, FR, ES, IT, RU, AR)",
      "⭐ Gerçek kullanıcı yorumları sistemi - Kullanıcılar yorum yazabilir, AI ile sentiment analizi yapılıyor",
      "🤖 AI sentiment analizi - En övgü içeren yorumlar otomatik olarak ana sayfada gösteriliyor",
      "🎯 Logo indir butonu kaldırıldı - Gereksiz buton temizlendi",
      "🗑️ Topluluk akışı ve beta memnuniyeti kaldırıldı - Olmayan veriler temizlendi",
      "✨ Sayı animasyonları - Tüm istatistikler 0'dan başlayıp hedef değere animasyonlu yükseliyor",
      "🔄 Gerçek zamanlı güncellemeler - Ana sayfa verileri 30 saniyede bir otomatik güncelleniyor",
    ],
  },
  {
    version: "0.1.49",
    date: "20 Kas 2025",
    title: "Optimizasyonlar & kullanıcı deneyimi iyileştirmeleri",
    highlights: [
      "✨ Pop-up dialog iyileştirmesi - Çirkin tarayıcı alert() yerine güzel tasarımlı dialog gösterimi",
      "📱 Mobil performans optimizasyonu - MobilePerformanceTuner layout'a eklendi, düşük güçlü cihazlar için otomatik optimizasyon",
      "🎨 Güncel versiyon bildirimi - Versiyon güncel olduğunda bilgilendirici ve şık bir dialog gösterimi",
      "⚡ Tam site kontrolü - Tüm proje lint, TypeScript ve build kontrolünden geçirildi",
      "🔧 Desktop optimizasyonları - Büyük ekranlar için daha iyi layout ve görsel düzenlemeler",
      "🚀 Build başarısı - Production build hatasız tamamlandı, tüm sayfalar optimize edildi",
    ],
  },
  {
    version: "0.1.48",
    date: "20 Kas 2025",
    title: "Dashboard geliştirmeleri & görsel iyileştirmeler",
    highlights: [
      "📱 Yeni sürüm bildirimi - Ana sayfadaki 'Yeni sürüm' butonuna tıklandığında detaylı release notes gösteriliyor",
      "💪 Kontrol Paneli BMR gösterimi - Bazal Metabolizma Hızı ve TDEE (aktivite ile birlikte) hesaplama",
      "🫁 Bağırsak sağlığı göstergesi - Kontrol Paneli'nde bağırsak sağlığı durumu ve renkli progress bar",
      "⚖️ Günlük kalori dengesi - BMR + yakılan kalori - alınan kalori formülü ile gerçek zamanlı takip",
      "🎨 Ana sayfa renk optimizasyonları - Daha canlı gradient'ler, gelişmiş hover efektleri ve animasyonlar",
      "✨ Görsel iyileştirmeler - Kullanıcı memnuniyeti kartına gradient glow, perks kartlarına hover animasyonları",
      "🚀 Performans optimizasyonları - Kontrol Paneli'nde daha hızlı veri yükleme ve görsel geri bildirimler",
    ],
  },
  {
    version: "0.1.47",
    date: "20 Kas 2025",
    title: "Akıllı kalori takibi & sağlık analizi",
    highlights: [
      "🤖 Otomatik kalori hesaplama - Yiyecek yazıldığında tüm miktarlar için kalori hesaplanıyor",
      "📊 Öğün sağlık göstergesi - AI ile sağlık değerlendirmesi, yağ seviyesi ve öneriler",
      "💪 BMR (Bazal Metabolizma Hızı) takibi - Hiçbir şey yapmasanız bile yaktığınız kalori",
      "🫁 Bağırsak sağlığı takibi - Günlük bağırsak sağlığı durumu ve yönlendirmeler",
      "⚡ Optimize edilmiş performans - Sadece 1 API çağrısı ile tüm miktarlar hesaplanıyor",
      "🎯 Yiyecek tipine göre akıllı miktar seçenekleri (tavuk için kaşık göstermez)",
      "✏️ Özel gram girişi - İstediğiniz gram miktarını manuel girebilirsiniz",
    ],
  },
  {
    version: "0.1.46",
    date: "17 Kas 2025",
    title: "AI kalori tahmini & PWA",
    highlights: [
      "OpenAI tabanlı API ile egzersiz/öğün kalorileri otomatik hesaplanıyor",
      "Sağlık formlarında 'AI ile hesapla' butonları ve açıklamalar",
      "Manifest, ikonlar ve mobil 'Telefona ekle' prompt'u ile PWA/Capacitor uyumu",
    ],
  },
  {
    version: "0.1.45",
    date: "17 Kas 2025",
    title: "Aurora tema ve modern landing",
    highlights: [
      "Ana sayfada aurora arka plan, gradient CTA ve güven kartları",
      "Profil düzenleme deneyimine inline değişiklik özeti",
      "Kayıt formuna gizlilik onayı ve Google veri paylaşım bilgilendirmesi",
    ],
  },
  {
    version: "0.1.44",
    date: "16 Kas 2025",
    title: "Gelişmiş Auth & onboarding",
    highlights: [
      "Email doğrulaması bekleyen kullanıcılar için yeniden gönder butonu",
      "Şifre politikası (8+ karakter, büyük harf + rakam) zorunlu hale getirildi",
      "Supabase kayıtlarında otomatik profil oluşturma ve onboarding iyileştirmeleri",
    ],
  },
  {
    version: "0.1.43",
    date: "14 Kas 2025",
    title: "Supabase geçişi ve performans",
    highlights: [
      "NextAuth + Prisma yerine Supabase Auth & veritabanı entegrasyonu",
      "Google OAuth mobil yönlendirme ve callback düzeltmeleri",
      "Kontrol Paneli, sağlık ve profil sayfalarının Supabase sorgularıyla yeniden yazılması",
    ],
  },
];
