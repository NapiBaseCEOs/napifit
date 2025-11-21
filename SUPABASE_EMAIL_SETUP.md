# 📧 Supabase E-posta Şablonları Kurulum Rehberi

Bu rehber, Supabase Dashboard'da kullanılacak e-posta şablonlarını nasıl ayarlayacağınızı gösterir.

## 🎯 Adımlar

### 1. Supabase Dashboard'a Giriş

1. [Supabase Dashboard](https://supabase.com/dashboard) → Projenizi seçin
2. Sol menüden **"Authentication"** → **"Emails"** seçin

### 2. E-posta Şablonunu Düzenleme

#### **Confirm Your Signup (E-posta Doğrulama)**

1. **"Confirm Your Signup"** şablonunu seçin
2. **"Subject"** alanına aşağıdaki metni yapıştırın:

```
E-posta Adresinizi Doğrulayın - NapiFit
```

3. **"Body"** sekmesine geçin ve **"Source"** tab'ına tıklayın
4. Aşağıdaki HTML'i yapıştırın (Türkçe):

```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
          © 2024 NapiFit - Tüm hakları saklıdır.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
```

5. **"Save"** butonuna tıklayın

#### **Reset Password (Şifre Sıfırlama)**

1. **"Reset Password"** şablonunu seçin
2. **"Subject"** alanına:

```
Şifre Sıfırlama - NapiFit
```

3. **"Body"** → **"Source"** tab'ına aşağıdaki HTML'i yapıştırın:

```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
          © 2024 NapiFit - Tüm hakları saklıdır.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
```

4. **"Save"** butonuna tıklayın

## 🔑 Önemli Notlar

### Supabase Template Syntax

Supabase, e-posta şablonlarında şu değişkenleri kullanır:

- `{{ .ConfirmationURL }}` - Doğrulama/şifre sıfırlama bağlantısı
- `{{ .Token }}` - Doğrulama token'ı (isteğe bağlı)
- `{{ .Email }}` - Kullanıcının e-posta adresi (isteğe bağlı)

### Görsel İyileştirmeler

✅ **Table-based layout** - E-posta client uyumluluğu için
✅ **Inline CSS** - E-posta client'ları external CSS desteklemez
✅ **Responsive design** - Mobil cihazlarda düzgün görünüm
✅ **Gradient header** - Marka kimliğini yansıtan görsel tasarım
✅ **Call-to-action button** - Belirgin ve tıklanabilir buton

### Test Etme

1. **Preview** sekmesini kullanarak görsel kontrol yapın
2. Test kullanıcısı oluşturun ve doğrulama e-postası gönderin
3. Farklı e-posta client'larında (Gmail, Outlook, vb.) test edin

## 📧 Diğer E-posta Şablonları

Diğer şablonlar için `src/lib/emails/supabase-templates.ts` dosyasına bakabilirsiniz:

- `tr_email_verification` - Türkçe e-posta doğrulama
- `tr_password_reset` - Türkçe şifre sıfırlama
- `en_email_verification` - İngilizce e-posta doğrulama
- `en_password_reset` - İngilizce şifre sıfırlama

## 🚀 Sonraki Adımlar

1. ✅ E-posta şablonlarını Supabase'e ekleyin
2. ✅ Test kullanıcısı ile doğrulama yapın
3. ✅ Görsel olarak kontrol edin
4. ✅ Production'da kullanıma alın

---

**Sorularınız için:** support@napifit.com

