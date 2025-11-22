import Link from "next/link";

const sections = [
  {
    title: "Topladığımız Veriler",
    body: [
      "Ad, soyad, e-posta adresi ve Supabase üzerinden saklanan profil bilgileriniz.",
      "Girdiğiniz sağlık metrikleri (boy, kilo, günlük adım, hedefler).",
      "Google ile giriş yaptığınızda Google'ın paylaştığı temel profil bilgileri.",
    ],
  },
  {
    title: "Verilerin Kullanım Amacı",
    body: [
      "Size kişiselleştirilmiş öneriler sunmak ve sağlık panelini oluşturmak.",
      "Destek talebi veya bildirimler için sizinle iletişime geçmek.",
      "Anonimleştirilmiş istatistikler üreterek ürün geliştirme kararları almak.",
    ],
  },
  {
    title: "Saklama Süresi ve Güvenlik",
    body: [
      "Veriler Supabase üzerinde saklanır ve istemci-sunucu arasında TLS ile şifrelenir.",
      "Hesabınızı silmeniz halinde tüm profil kayıtları 30 gün içinde kalıcı olarak temizlenir.",
      "Yalnızca yetkili ekip üyeleri ve sistemler bu verilere erişebilir.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-primary-300">Gizlilik İlkesi</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Gizlilik Politikası</h1>
        <p className="mt-4 text-gray-300">
          NapiFit olarak kişisel verilerinizi yalnızca ürün deneyimi sunmak ve iyileştirmek amacıyla işleriz. Aşağıdaki
          başlıklar verilerinizi nasıl topladığımızı, sakladığımızı ve koruduğumuzu açıklar.
        </p>
      </div>

      {sections.map((section) => (
        <section
          key={section.title}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3 backdrop-blur-xl shadow-[0_20px_60px_rgba(3,4,12,0.45)]"
        >
          <h2 className="text-xl font-semibold text-white">{section.title}</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            {section.body.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}

      <section className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-6 space-y-3">
        <h3 className="text-lg font-semibold text-white">Haklarınız</h3>
        <p className="text-gray-200">
          Verilerinize erişme, düzeltme veya silme talepleri için{" "}
          <a className="text-primary-200 underline" href="mailto:support@napibase.com">
            support@napibase.com
          </a>{" "}
          adresinden bize ulaşabilirsiniz. Talepler 15 gün içinde yanıtlanır.
        </p>
        <p className="text-sm text-gray-400">
          Daha fazla bilgi için{" "}
          <Link href="/terms" className="text-primary-200 underline">
            Kullanım Şartları
          </Link>{" "}
          sayfasına göz atabilirsiniz.
        </p>
      </section>
    </main>
  );
}

