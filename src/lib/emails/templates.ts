import type { Locale } from "@/lib/i18n/locales";

export type EmailTemplateType = 
  | "email_verification"
  | "password_reset"
  | "welcome"
  | "password_change_confirmation";

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// E-posta şablonları - Çoklu dil desteği
export const emailTemplates: Record<Locale, Record<EmailTemplateType, (params?: any) => EmailTemplate>> = {
  tr: {
    email_verification: (params?: { confirmationUrl: string; userName?: string }) => ({
      subject: "E-posta Adresinizi Doğrulayın - NapiFit",
      html: `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>E-posta Doğrulama</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #f97316 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">NapiFit</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Merhaba${params?.userName ? ` ${params.userName}` : ""}! 👋</h2>
            <p style="color: #4b5563; font-size: 16px;">
              NapiFit'e hoş geldiniz! Hesabınızı aktifleştirmek için aşağıdaki butona tıklayarak e-posta adresinizi doğrulayın.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${params?.confirmationUrl || '#'}" 
                 style="background: linear-gradient(135deg, #7c3aed 0%, #f97316 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;">
                E-postamı Doğrula
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              Veya aşağıdaki bağlantıyı tarayıcınıza yapıştırabilirsiniz:<br>
              <a href="${params?.confirmationUrl || '#'}" style="color: #7c3aed; word-break: break-all;">${params?.confirmationUrl || ''}</a>
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              Bu e-postayı siz talep etmediyseniz, lütfen görmezden gelin.<br>
              © ${new Date().getFullYear()} NapiFit - Tüm hakları saklıdır.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `Merhaba${params?.userName ? ` ${params.userName}` : ""}!\n\nNapiFit'e hoş geldiniz! Hesabınızı aktifleştirmek için aşağıdaki bağlantıya tıklayın:\n\n${params?.confirmationUrl || ''}\n\nBu e-postayı siz talep etmediyseniz, lütfen görmezden gelin.\n\n© ${new Date().getFullYear()} NapiFit`,
    }),

    password_reset: (params?: { resetUrl: string; userName?: string }) => ({
      subject: "Şifre Sıfırlama - NapiFit",
      html: `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Şifre Sıfırlama</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #f97316 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">NapiFit</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Şifre Sıfırlama Talebi 🔐</h2>
            <p style="color: #4b5563; font-size: 16px;">
              Merhaba${params?.userName ? ` ${params.userName}` : ""},
            </p>
            <p style="color: #4b5563; font-size: 16px;">
              Hesabınız için şifre sıfırlama talebinde bulundunuz. Yeni şifrenizi oluşturmak için aşağıdaki butona tıklayın.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${params?.resetUrl || '#'}" 
                 style="background: linear-gradient(135deg, #7c3aed 0%, #f97316 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;">
                Şifremi Sıfırla
              </a>
            </div>
            <p style="color: #dc2626; font-size: 14px; background: #fee2e2; padding: 12px; border-radius: 6px;">
              ⚠️ <strong>Güvenlik Uyarısı:</strong> Bu bağlantı 1 saat içinde geçersiz olacaktır. Eğer bu talebi siz yapmadıysanız, lütfen görmezden gelin.
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              Veya aşağıdaki bağlantıyı tarayıcınıza yapıştırabilirsiniz:<br>
              <a href="${params?.resetUrl || '#'}" style="color: #7c3aed; word-break: break-all;">${params?.resetUrl || ''}</a>
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} NapiFit - Tüm hakları saklıdır.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `Merhaba${params?.userName ? ` ${params.userName}` : ""}!\n\nHesabınız için şifre sıfırlama talebinde bulundunuz. Yeni şifrenizi oluşturmak için aşağıdaki bağlantıya tıklayın:\n\n${params?.resetUrl || ''}\n\nBu bağlantı 1 saat içinde geçersiz olacaktır. Eğer bu talebi siz yapmadıysanız, lütfen görmezden gelin.\n\n© ${new Date().getFullYear()} NapiFit`,
    }),

    welcome: (params?: { userName?: string; dashboardUrl: string }) => ({
      subject: "NapiFit'e Hoş Geldiniz! 🎉",
      html: `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hoş Geldiniz</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #f97316 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">NapiFit</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hoş Geldiniz${params?.userName ? ` ${params.userName}` : ""}! 🎉</h2>
            <p style="color: #4b5563; font-size: 16px;">
              NapiFit ailesine katıldığınız için teşekkür ederiz! Artık sağlıklı yaşam yolculuğunuzda yanınızdayız.
            </p>
            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #1e40af; font-size: 14px;">
                <strong>Başlamak için:</strong><br>
                • Sağlık metriklerinizi girin<br>
                • Egzersiz planınızı oluşturun<br>
                • Beslenme takibinize başlayın<br>
                • Hedeflerinize ulaşın!
              </p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${params?.dashboardUrl || '#'}" 
                 style="background: linear-gradient(135deg, #7c3aed 0%, #f97316 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;">
                Kontrol Paneline Git
              </a>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} NapiFit - Tüm hakları saklıdır.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `Hoş Geldiniz${params?.userName ? ` ${params.userName}` : ""}!\n\nNapiFit ailesine katıldığınız için teşekkür ederiz! Artık sağlıklı yaşam yolculuğunuzda yanınızdayız.\n\nKontrol Paneline Git: ${params?.dashboardUrl || ''}\n\n© ${new Date().getFullYear()} NapiFit`,
    }),

    password_change_confirmation: (params?: { userName?: string }) => ({
      subject: "Şifreniz Başarıyla Değiştirildi - NapiFit",
      html: `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Şifre Değiştirildi</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #f97316 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">NapiFit</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Şifreniz Değiştirildi ✅</h2>
            <p style="color: #4b5563; font-size: 16px;">
              Merhaba${params?.userName ? ` ${params.userName}` : ""},
            </p>
            <p style="color: #4b5563; font-size: 16px;">
              Hesabınızın şifresi başarıyla değiştirildi. Bu işlemi siz yapmadıysanız, lütfen hemen bizimle iletişime geçin.
            </p>
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>Güvenlik Önerisi:</strong> Şifrenizi düzenli olarak değiştirmeyi unutmayın ve başka hiç kimseyle paylaşmayın.
              </p>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              Bu işlemi siz yapmadıysanız, lütfen hemen bizimle iletişime geçin.<br>
              © ${new Date().getFullYear()} NapiFit - Tüm hakları saklıdır.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `Merhaba${params?.userName ? ` ${params.userName}` : ""}!\n\nHesabınızın şifresi başarıyla değiştirildi. Bu işlemi siz yapmadıysanız, lütfen hemen bizimle iletişime geçin.\n\n© ${new Date().getFullYear()} NapiFit`,
    }),
  },

  en: {
    email_verification: (params?: { confirmationUrl: string; userName?: string }) => ({
      subject: "Verify Your Email Address - NapiFit",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #f97316 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">NapiFit</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hello${params?.userName ? ` ${params.userName}` : ""}! 👋</h2>
            <p style="color: #4b5563; font-size: 16px;">
              Welcome to NapiFit! Click the button below to verify your email address and activate your account.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${params?.confirmationUrl || '#'}" 
                 style="background: linear-gradient(135deg, #7c3aed 0%, #f97316 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;">
                Verify My Email
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              Or paste this link into your browser:<br>
              <a href="${params?.confirmationUrl || '#'}" style="color: #7c3aed; word-break: break-all;">${params?.confirmationUrl || ''}</a>
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              If you didn't request this email, please ignore it.<br>
              © ${new Date().getFullYear()} NapiFit - All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `Hello${params?.userName ? ` ${params.userName}` : ""}!\n\nWelcome to NapiFit! Click the link below to verify your email address:\n\n${params?.confirmationUrl || ''}\n\nIf you didn't request this email, please ignore it.\n\n© ${new Date().getFullYear()} NapiFit`,
    }),

    password_reset: (params?: { resetUrl: string; userName?: string }) => ({
      subject: "Password Reset - NapiFit",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #f97316 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">NapiFit</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Password Reset Request 🔐</h2>
            <p style="color: #4b5563; font-size: 16px;">
              Hello${params?.userName ? ` ${params.userName}` : ""},
            </p>
            <p style="color: #4b5563; font-size: 16px;">
              You requested to reset your password. Click the button below to create a new password.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${params?.resetUrl || '#'}" 
                 style="background: linear-gradient(135deg, #7c3aed 0%, #f97316 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;">
                Reset My Password
              </a>
            </div>
            <p style="color: #dc2626; font-size: 14px; background: #fee2e2; padding: 12px; border-radius: 6px;">
              ⚠️ <strong>Security Warning:</strong> This link will expire in 1 hour. If you didn't make this request, please ignore this email.
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              Or paste this link into your browser:<br>
              <a href="${params?.resetUrl || '#'}" style="color: #7c3aed; word-break: break-all;">${params?.resetUrl || ''}</a>
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} NapiFit - All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `Hello${params?.userName ? ` ${params.userName}` : ""}!\n\nYou requested to reset your password. Click the link below to create a new password:\n\n${params?.resetUrl || ''}\n\nThis link will expire in 1 hour. If you didn't make this request, please ignore this email.\n\n© ${new Date().getFullYear()} NapiFit`,
    }),

    welcome: (params?: { userName?: string; dashboardUrl: string }) => ({
      subject: "Welcome to NapiFit! 🎉",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #f97316 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">NapiFit</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Welcome${params?.userName ? ` ${params.userName}` : ""}! 🎉</h2>
            <p style="color: #4b5563; font-size: 16px;">
              Thank you for joining the NapiFit family! We're here to support you on your healthy living journey.
            </p>
            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #1e40af; font-size: 14px;">
                <strong>To get started:</strong><br>
                • Enter your health metrics<br>
                • Create your workout plan<br>
                • Start tracking your nutrition<br>
                • Reach your goals!
              </p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${params?.dashboardUrl || '#'}" 
                 style="background: linear-gradient(135deg, #7c3aed 0%, #f97316 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;">
                Go to Dashboard
              </a>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} NapiFit - All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `Welcome${params?.userName ? ` ${params.userName}` : ""}!\n\nThank you for joining the NapiFit family! We're here to support you on your healthy living journey.\n\nGo to Dashboard: ${params?.dashboardUrl || ''}\n\n© ${new Date().getFullYear()} NapiFit`,
    }),

    password_change_confirmation: (params?: { userName?: string }) => ({
      subject: "Your Password Has Been Changed - NapiFit",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Changed</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #f97316 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">NapiFit</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Your Password Has Been Changed ✅</h2>
            <p style="color: #4b5563; font-size: 16px;">
              Hello${params?.userName ? ` ${params.userName}` : ""},
            </p>
            <p style="color: #4b5563; font-size: 16px;">
              Your account password has been successfully changed. If you didn't make this change, please contact us immediately.
            </p>
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>Security Tip:</strong> Remember to change your password regularly and never share it with anyone.
              </p>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              If you didn't make this change, please contact us immediately.<br>
              © ${new Date().getFullYear()} NapiFit - All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `Hello${params?.userName ? ` ${params.userName}` : ""}!\n\nYour account password has been successfully changed. If you didn't make this change, please contact us immediately.\n\n© ${new Date().getFullYear()} NapiFit`,
    }),
  },

  // Diğer diller için placeholder (ihtiyaç oldukça genişletilebilir)
  de: {
    email_verification: () => ({ subject: "", html: "", text: "" }),
    password_reset: () => ({ subject: "", html: "", text: "" }),
    welcome: () => ({ subject: "", html: "", text: "" }),
    password_change_confirmation: () => ({ subject: "", html: "", text: "" }),
  },
  fr: {
    email_verification: () => ({ subject: "", html: "", text: "" }),
    password_reset: () => ({ subject: "", html: "", text: "" }),
    welcome: () => ({ subject: "", html: "", text: "" }),
    password_change_confirmation: () => ({ subject: "", html: "", text: "" }),
  },
  es: {
    email_verification: () => ({ subject: "", html: "", text: "" }),
    password_reset: () => ({ subject: "", html: "", text: "" }),
    welcome: () => ({ subject: "", html: "", text: "" }),
    password_change_confirmation: () => ({ subject: "", html: "", text: "" }),
  },
  it: {
    email_verification: () => ({ subject: "", html: "", text: "" }),
    password_reset: () => ({ subject: "", html: "", text: "" }),
    welcome: () => ({ subject: "", html: "", text: "" }),
    password_change_confirmation: () => ({ subject: "", html: "", text: "" }),
  },
  ru: {
    email_verification: () => ({ subject: "", html: "", text: "" }),
    password_reset: () => ({ subject: "", html: "", text: "" }),
    welcome: () => ({ subject: "", html: "", text: "" }),
    password_change_confirmation: () => ({ subject: "", html: "", text: "" }),
  },
  ar: {
    email_verification: () => ({ subject: "", html: "", text: "" }),
    password_reset: () => ({ subject: "", html: "", text: "" }),
    welcome: () => ({ subject: "", html: "", text: "" }),
    password_change_confirmation: () => ({ subject: "", html: "", text: "" }),
  },
};

// E-posta şablonu alma fonksiyonu
export function getEmailTemplate(
  locale: Locale,
  type: EmailTemplateType,
  params?: any
): EmailTemplate {
  const defaultLocale: Locale = "tr";
  const selectedLocale = emailTemplates[locale] ? locale : defaultLocale;
  return emailTemplates[selectedLocale][type](params);
}

