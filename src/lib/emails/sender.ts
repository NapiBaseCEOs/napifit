import type { Locale } from "@/lib/i18n/locales";
import { getEmailTemplate, type EmailTemplateType } from "./templates";

interface SendEmailOptions {
  to: string;
  locale: Locale;
  type: EmailTemplateType;
  params?: any;
}

/**
 * E-posta gönderme fonksiyonu
 * Bu fonksiyon Supabase Auth'un e-posta şablonlarını özelleştirmek için kullanılabilir
 * Veya harici bir e-posta servisi (Resend, SendGrid, vb.) ile entegre edilebilir
 */
export async function sendEmail({ to, locale, type, params }: SendEmailOptions): Promise<boolean> {
  try {
    const template = getEmailTemplate(locale, type, params);

    // TODO: Gerçek e-posta gönderme implementasyonu
    // Örnek: Resend, SendGrid, AWS SES, veya Supabase'in özelleştirilebilir e-posta şablonları
    
    // Şimdilik console'a logluyoruz
    console.log("Email gönderiliyor:", {
      to,
      locale,
      type,
      subject: template.subject,
    });

    // Gerçek implementasyon için:
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from: 'NapiFit <noreply@napifit.com>',
    //     to: [to],
    //     subject: template.subject,
    //     html: template.html,
    //     text: template.text,
    //   }),
    // });

    return true;
  } catch (error) {
    console.error("E-posta gönderme hatası:", error);
    return false;
  }
}

/**
 * Kullanıcının dilini tespit et
 * Öncelik sırası:
 * 1. Kullanıcı profili (preferred_locale)
 * 2. IP-based locale detection
 * 3. Browser locale
 * 4. Default locale (tr)
 */
export async function getUserLocale(_userId?: string, fallbackLocale?: Locale): Promise<Locale> {
  // TODO: Kullanıcı profilinden locale al
  // if (_userId) {
  //   const profile = await supabase.from('profiles').select('preferred_locale').eq('id', _userId).single();
  //   if (profile?.preferred_locale) {
  //     return profile.preferred_locale as Locale;
  //   }
  // }

  // Fallback locale kullan
  return fallbackLocale || "tr";
}

