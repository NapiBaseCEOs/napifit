import Link from "next/link";

const clauses = [
  {
    title: "Hizmet Tanımı",
    content:
      "NapiFit; sağlık metriklerini kaydetmenizi, Supabase üzerinde saklamanızı ve Vercel üzerinden sunulan web/mobil uygulamalarımızdan erişmenizi sağlar.",
  },
  {
    title: "Kullanıcı Yükümlülükleri",
    content:
      "Hesap bilgilerinizin gizliliğinden siz sorumlusunuz. Yanlış veya saldırgan içerik göndermek, diğer kullanıcıların deneyimini bozacak davranışlarda bulunmak veya RLS politikalarını aşmaya çalışmak yasaktır.",
  },
  {
    title: "Veri Güvenliği",
    content:
      "Supabase ve Vercel altyapılarıyla tüm veriler TLS üzerinden şifrelenir. Sistemler düzenli olarak güncellenir; ancak internet tabanlı hiçbir platform %100 güvenlik garantisi veremez.",
  },
  {
    title: "Üçüncü Taraf Bağlantılar",
    content:
      "Google OAuth veya diğer sağlayıcılarla giriş yaptığınızda, ilgili hizmetlerin politikaları da geçerli olur. Giriş ekranında sunulan bilgileri inceleyerek ilerleyin.",
  },
  {
    title: "Değişiklikler",
    content:
      "Bu şartlar zaman zaman güncellenebilir. Güncel versiyon her zaman bu sayfada yayınlanır. Kritik değişiklikler e-posta ile paylaşılır.",
  },
];

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-primary-300">Kullanım Koşulları</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Kullanım Şartları</h1>
        <p className="mt-4 text-gray-300">
          Bu doküman, NapiFit servislerini kullanırken uyulması gereken temel kuralları ve sorumlulukları belirtir.
          Platformu kullanmaya devam ederek bu şartları kabul etmiş olursunuz.
        </p>
      </div>

      {clauses.map((clause) => (
        <section key={clause.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
          <h2 className="text-xl font-semibold text-white">{clause.title}</h2>
          <p className="text-gray-300">{clause.content}</p>
        </section>
      ))}

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
        <h3 className="text-lg font-semibold text-white">İletişim</h3>
        <p className="text-gray-300">
          Herhangi bir soru veya geribildirim için{" "}
          <a className="text-primary-200 underline" href="mailto:legal@napibase.com">
            legal@napibase.com
          </a>{" "}
          adresine e-posta gönderebilirsiniz. Gizlilikle ilgili sorular için{" "}
          <Link href="/privacy" className="text-primary-200 underline">
            Gizlilik Politikası
          </Link>{" "}
          sayfasını inceleyin.
        </p>
      </section>
    </main>
  );
}

