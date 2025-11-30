export const APP_VERSION = "2.0.0";

export type ReleaseNote = {
  version: string;
  date: string;
  title: string;
  highlights: string[];
  features: string[];
  fixes: string[];
  improvements: string[];
};

export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: "2.0.0",
    date: "2025-11-30",
    title: "NapiFit v2.0 - Büyük Güncelleme",
    highlights: [
      "🎉 Tamamen yenilenen modern arayüz ve kullanıcı deneyimi",
      "🎮 Oyunlaştırma sistemi: XP, Seviyeler ve Başarı Rozetleri",
      "📊 Gelişmiş Dashboard: Detaylı grafikler ve özet kartları",
      "🤖 AI Koç: Akıllı öneriler ve sesli komut desteği",
    ],
    features: [
      "Oyunlaştırma Sistemi: Her aktivite için XP kazanın, seviye atlayın",
      "Başarı Rozetleri: 8 farklı kategoride rozetler kazanın",
      "AI Koç: Kişiselleştirilmiş haftalık planlar ve anlık öneriler",
      "Sesli Komut: Konuşarak öğün ve egzersiz ekleyin (Türkçe)",
      "Global Arama: (Cmd+K) ile her şeye hızlıca ulaşın",
      "Sosyal Özellikler: Arkadaşlarınızı takip edin",
    ],
    fixes: [
      "Google Giriş sorunları tamamen giderildi",
      "Mobil uyumluluk sorunları çözüldü",
      "Performans optimizasyonları yapıldı",
      "Güvenlik güncellemeleri uygulandı",
    ],
    improvements: [
      "Karanlık/Aydınlık mod desteği (Sistem temasıyla uyumlu)",
      "Daha hızlı sayfa yüklemeleri için Skeleton ekranlar",
      "Erişilebilirlik iyileştirmeleri (Ekran okuyucu desteği)",
      "Gelişmiş hata yönetimi ve bilgilendirme mesajları",
    ],
  },
  {
    version: "0.1.55",
    date: "2024-11-22",
    title: "Takvim ve Arayüz İyileştirmeleri",
    highlights: [
      "Aktivite takvimi kompakt ve okunabilir hale getirildi",
      "Genel arayüz boyutu küçültüldü (~%10-15)",
    ],
    features: [
      "Kullanıcılar artık hiç beğeni almamış kendi önerilerini silebiliyor",
      "Aktivite takvimi kompakt ve okunabilir hale getirildi",
    ],
    fixes: [
      "Profil sayfasındaki topluluk istatistikleri tekilleştirildi",
      "Aynı başlıklı öneriler artık tek gösteriliyor",
    ],
    improvements: [
      "Genel arayüz boyutu küçültüldü (~%10-15)",
      "Dashboard ve Health sayfaları daha sıkı layout",
      "Mobilde daha akıcı deneyim",
      "Render yükü azaltıldı",
    ],
  },
];
