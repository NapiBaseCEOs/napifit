export const APP_VERSION = "0.1.47";

export type ReleaseNote = {
  version: string;
  date: string;
  title: string;
  highlights: string[];
};

export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: "0.1.47",
    date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" }),
    title: "Kamera ile öğün fotoğrafı analizi",
    highlights: [
      "📷 Kamera ile öğün fotoğrafı çekme özelliği eklendi",
      "🤖 GPT-4 Vision ile otomatik besin analizi (kalori, protein, yağ, karbonhidrat)",
      "✅ Öğün önerileri (önerilir/önerilmez/moderat) ve detaylı açıklamalar",
      "📊 Her yiyecek için detaylı besin değerleri gösterimi",
      "💾 Tek tıkla onaylayıp öğünü kaydetme",
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
