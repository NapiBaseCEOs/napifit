# Email Template Setup Guide

## Supabase Email Templates

NapiFit için özel tasarlanmış email şablonları `docs/email-templates/` klasöründe bulunmaktadır.

### Şablonlar

1. **reset-password.html** - Şifre sıfırlama emaili
2. **confirm-email.html** - Email doğrulama emaili

### Supabase Dashboard'da Kurulum

1. **Supabase Dashboard'a gidin**: https://app.supabase.com
2. **Project Settings > Authentication > Email Templates** bölümüne gidin
3. Her şablon için:
   - İlgili template'i seçin (Reset Password, Confirm Signup)
   - `docs/email-templates/` klasöründeki HTML içeriğini kopyalayın
   - Template editörüne yapıştırın
   - **Save** butonuna tıklayın

### Önemli Notlar

- **{{ .ConfirmationURL }}**: Supabase tarafından otomatik olarak değiştirilir
- **SITE_URL**: Project Settings > API > Site URL'i production domain'inize ayarlayın
- **Redirect URLs**: Authentication > URL Configuration'dan allowed redirect URLs ekleyin

### Test Etme

```bash
# Forgot password test
curl -X POST https://YOUR_PROJECT.supabase.co/auth/v1/recover \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Tasarım Özellikleri

- **Primary Color**: #22c55e (emerald-500)
- **Background**: Dark gradient (#0a0e1a → #1a1f35)
- **Font**: System fonts (Apple, Segoe UI, Roboto)
- **Responsive**: Mobile-friendly design
- **Language**: Turkish
