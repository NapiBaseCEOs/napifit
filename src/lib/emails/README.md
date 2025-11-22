# 📧 E-posta Sistemi - Çoklu Dil Desteği

Bu klasör, NapiFit uygulaması için çok dilli e-posta şablonları ve gönderme sistemi içerir.

## 🎯 Özellikler

- ✅ Çoklu dil desteği (Türkçe, İngilizce ve daha fazlası)
- ✅ Responsive HTML e-posta şablonları
- ✅ Plain text alternatifleri
- ✅ Kullanıcı diline göre otomatik seçim
- ✅ E-posta türleri:
  - E-posta doğrulama
  - Şifre sıfırlama
  - Hoş geldin mesajı
  - Şifre değiştirme onayı

## 📁 Dosya Yapısı

```
src/lib/emails/
├── templates.ts    # E-posta şablonları (çoklu dil)
├── sender.ts       # E-posta gönderme fonksiyonları
└── README.md       # Bu dosya
```

## 🚀 Kullanım

### 1. E-posta Şablonu Alma

```typescript
import { getEmailTemplate } from "@/lib/emails/templates";

// Türkçe e-posta doğrulama şablonu
const template = getEmailTemplate("tr", "email_verification", {
  confirmationUrl: "https://napifit.com/verify?token=...",
  userName: "Ahmet",
});

console.log(template.subject); // "E-posta Adresinizi Doğrulayın - NapiFit"
console.log(template.html);    // HTML içerik
console.log(template.text);    // Plain text içerik
```

### 2. E-posta Gönderme

```typescript
import { sendEmail, getUserLocale } from "@/lib/emails/sender";

// Kullanıcının dilini tespit et
const locale = await getUserLocale(userId, "tr");

// E-posta gönder
await sendEmail({
  to: "user@example.com",
  locale: locale,
  type: "email_verification",
  params: {
    confirmationUrl: "https://napifit.com/verify?token=...",
    userName: "Ahmet",
  },
});
```

## 🌍 Desteklenen Diller

- ✅ **Türkçe (tr)** - Tam destek
- ✅ **İngilizce (en)** - Tam destek
- 🔄 **Almanca (de)** - Placeholder (genişletilebilir)
- 🔄 **Fransızca (fr)** - Placeholder (genişletilebilir)
- 🔄 **İspanyolca (es)** - Placeholder (genişletilebilir)
- 🔄 **İtalyanca (it)** - Placeholder (genişletilebilir)
- 🔄 **Rusça (ru)** - Placeholder (genişletilebilir)
- 🔄 **Arapça (ar)** - Placeholder (genişletilebilir)

## 📝 Yeni Dil Ekleme

1. `templates.ts` dosyasında yeni dil şablonları ekleyin:

```typescript
de: {
  email_verification: (params?: { confirmationUrl: string; userName?: string }) => ({
    subject: "Bestätigen Sie Ihre E-Mail-Adresse - NapiFit",
    html: `...`,
    text: `...`,
  }),
  // ... diğer şablonlar
},
```

## 🔧 Supabase Auth Entegrasyonu

Supabase Auth, e-posta şablonlarını özelleştirmeyi destekler:

1. Supabase Dashboard > Authentication > Email Templates
2. Şablonları özelleştirin veya bu sistemden gelen HTML'i kullanın
3. `sender.ts` içinde Supabase Auth API'sini kullanın

### Supabase Custom SMTP

Supabase ile özel SMTP ayarları yapabilirsiniz:

1. Supabase Dashboard > Project Settings > Auth
2. Custom SMTP ayarlarını yapılandırın
3. E-posta şablonlarını bu sistemle entegre edin

## 🎨 Şablon Özelleştirme

Her şablon şu parametreleri destekler:

- `userName`: Kullanıcı adı (opsiyonel)
- `confirmationUrl`: Doğrulama bağlantısı
- `resetUrl`: Şifre sıfırlama bağlantısı
- `dashboardUrl`: Dashboard bağlantısı

## 📦 Gelecek Geliştirmeler

- [ ] Resend/SendGrid entegrasyonu
- [ ] E-posta queue sistemi
- [ ] E-posta açılma/ tıklama takibi
- [ ] A/B test desteği
- [ ] Daha fazla dil desteği
- [ ] E-posta şablonları için görsel editör

## 📞 İletişim

Sorularınız için: support@napifit.com

