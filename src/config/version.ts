export const APP_VERSION = "0.1.48";

export type ReleaseNote = {
  version: string;
  date: string;
  title: string;
  highlights: string[];
};

export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: "0.1.48",
    date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" }),
    title: "Dashboard geliştirmeleri & görsel iyileştirmeler",
    highlights: [
      "📱 Yeni sürüm bildirimi - Ana sayfadaki 'Yeni sürüm' butonuna tıklandığında detaylı release notes gösteriliyor",
      "💪 Dashboard BMR gösterimi - Bazal Metabolizma Hızı ve TDEE (aktivite ile birlikte) hesaplama",
      "🫁 Bağırsak sağlığı göstergesi - Dashboard'da bağırsak sağlığı durumu ve renkli progress bar",
      "⚖️ Günlük kalori dengesi - BMR + yakılan kalori - alınan kalori formülü ile gerçek zamanlı takip",
      "🎨 Ana sayfa renk optimizasyonları - Daha canlı gradient'ler, gelişmiş hover efektleri ve animasyonlar",
      "✨ Görsel iyileştirmeler - Kullanıcı memnuniyeti kartına gradient glow, perks kartlarına hover animasyonları",
      "🚀 Performans optimizasyonları - Dashboard'da daha hızlı veri yükleme ve görsel geri bildirimler",
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
      "Dashboard, sağlık ve profil sayfalarının Supabase sorgularıyla yeniden yazılması",
    ],
  },
];
