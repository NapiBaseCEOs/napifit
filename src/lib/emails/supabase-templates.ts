/**
 * Supabase Email Templates
 * 
 * Bu dosya Supabase Dashboard'da kullanılacak e-posta şablonlarını içerir.
 * Supabase'in template syntax'ını kullanır: {{ .VariableName }}
 * 
 * Kullanım:
 * 1. Supabase Dashboard > Authentication > Email Templates
 * 2. İlgili şablonu seçin (Confirm Signup, Reset Password, vb.)
 * 3. Aşağıdaki HTML'i "Body" alanına yapıştırın
 * 4. "Subject" alanını güncelleyin
 */

export const supabaseEmailTemplates = {
  // Türkçe E-posta Doğrulama
  tr_email_verification: {
    subject: "E-posta Adresinizi Doğrulayın - NapiFit",
    body: `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-posta Doğrulama</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 20px 0; text-align: center; background: linear-gradient(135deg, #7c3aed 0%, #f97316 100%); border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">NapiFit</h1>
      </td>
    </tr>
    <tr>
      <td style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1f2937; margin-top: 0; font-size: 24px; font-weight: 600;">Merhaba! 👋</h2>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 20px 0;">
          NapiFit'e hoş geldiniz! Hesabınızı aktifleştirmek için aşağıdaki butona tıklayarak e-posta adresinizi doğrulayın.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{ .ConfirmationURL }}" style="background: linear-gradient(135deg, #7c3aed 0%, #f97316 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            E-postamı Doğrula
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0;">
          Veya aşağıdaki bağlantıyı tarayıcınıza yapıştırabilirsiniz:<br>
          <a href="{{ .ConfirmationURL }}" style="color: #7c3aed; word-break: break-all; text-decoration: underline;">{{ .ConfirmationURL }}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
          Bu e-postayı siz talep etmediyseniz, lütfen görmezden gelin.<br>
          © ${new Date().getFullYear()} NapiFit - Tüm hakları saklıdır.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  },

  // Türkçe Şifre Sıfırlama
  tr_password_reset: {
    subject: "Şifre Sıfırlama - NapiFit",
    body: `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Şifre Sıfırlama</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 20px 0; text-align: center; background: linear-gradient(135deg, #7c3aed 0%, #f97316 100%); border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">NapiFit</h1>
      </td>
    </tr>
    <tr>
      <td style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1f2937; margin-top: 0; font-size: 24px; font-weight: 600;">Şifre Sıfırlama Talebi 🔐</h2>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 20px 0;">
          Merhaba,
        </p>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 20px 0;">
          Hesabınız için şifre sıfırlama talebinde bulundunuz. Yeni şifrenizi oluşturmak için aşağıdaki butona tıklayın.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{ .ConfirmationURL }}" style="background: linear-gradient(135deg, #7c3aed 0%, #f97316 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            Şifremi Sıfırla
          </a>
        </div>
        <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
            <strong>⚠️ Güvenlik Uyarısı:</strong> Bu bağlantı 1 saat içinde geçersiz olacaktır. Eğer bu talebi siz yapmadıysanız, lütfen görmezden gelin.
          </p>
        </div>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0;">
          Veya aşağıdaki bağlantıyı tarayıcınıza yapıştırabilirsiniz:<br>
          <a href="{{ .ConfirmationURL }}" style="color: #7c3aed; word-break: break-all; text-decoration: underline;">{{ .ConfirmationURL }}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
          © ${new Date().getFullYear()} NapiFit - Tüm hakları saklıdır.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  },

  // İngilizce E-posta Doğrulama
  en_email_verification: {
    subject: "Verify Your Email Address - NapiFit",
    body: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 20px 0; text-align: center; background: linear-gradient(135deg, #7c3aed 0%, #f97316 100%); border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">NapiFit</h1>
      </td>
    </tr>
    <tr>
      <td style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1f2937; margin-top: 0; font-size: 24px; font-weight: 600;">Hello! 👋</h2>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 20px 0;">
          Welcome to NapiFit! Click the button below to verify your email address and activate your account.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{ .ConfirmationURL }}" style="background: linear-gradient(135deg, #7c3aed 0%, #f97316 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            Verify My Email
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0;">
          Or paste this link into your browser:<br>
          <a href="{{ .ConfirmationURL }}" style="color: #7c3aed; word-break: break-all; text-decoration: underline;">{{ .ConfirmationURL }}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
          If you didn't request this email, please ignore it.<br>
          © ${new Date().getFullYear()} NapiFit - All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  },

  // İngilizce Şifre Sıfırlama
  en_password_reset: {
    subject: "Password Reset - NapiFit",
    body: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 20px 0; text-align: center; background: linear-gradient(135deg, #7c3aed 0%, #f97316 100%); border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">NapiFit</h1>
      </td>
    </tr>
    <tr>
      <td style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1f2937; margin-top: 0; font-size: 24px; font-weight: 600;">Password Reset Request 🔐</h2>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 20px 0;">
          Hello,
        </p>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 20px 0;">
          You requested to reset your password. Click the button below to create a new password.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{ .ConfirmationURL }}" style="background: linear-gradient(135deg, #7c3aed 0%, #f97316 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            Reset My Password
          </a>
        </div>
        <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
            <strong>⚠️ Security Warning:</strong> This link will expire in 1 hour. If you didn't make this request, please ignore this email.
          </p>
        </div>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0;">
          Or paste this link into your browser:<br>
          <a href="{{ .ConfirmationURL }}" style="color: #7c3aed; word-break: break-all; text-decoration: underline;">{{ .ConfirmationURL }}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
          © ${new Date().getFullYear()} NapiFit - All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  },
};

