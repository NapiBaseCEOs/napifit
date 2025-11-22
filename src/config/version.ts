export const APP_VERSION = "0.1.55";

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
    version: "0.1.55",
    date: "2024-11-22",
    title: "Takvim ve Arayüz İyileştirmeleri",
    highlights: [
      "Aktivite takvimi kompakt ve okunabilir hale getirildi",
      "Genel arayüz boyutu küçültüldü (~%10-15)",
      "Kullanıcılar kendi önerilerini silebiliyor",
      "Profil sayfası istatistikleri düzeltildi",
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
