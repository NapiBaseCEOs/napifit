# 🚀 Hızlı Başlangıç - Migration'ları Çalıştırma

## ⚡ En Hızlı Yöntem (Önerilen)

**Supabase Dashboard SQL Editor kullanın:**

1. Supabase Dashboard'a gidin: https://supabase.com/dashboard/project/eaibfqnjgkflvxdxfbw
2. Sol menüden **SQL Editor**'ü açın
3. `run_migrations_and_add_request.sql` dosyasının **tüm içeriğini** kopyalayın
4. SQL Editor'e yapıştırın
5. **Run** (F5) butonuna tıklayın

✅ **Bu kadar!** Tüm migration'lar ve öneri tek seferde eklenecek.

---

## 🔧 CLI ile Çalıştırma (Alternatif)

### Adım 1: Access Token Alın

1. https://supabase.com/dashboard adresine gidin
2. Sağ üstteki **profil ikonuna** tıklayın
3. **Account Settings** > **Access Tokens** bölümüne gidin
4. **Generate New Token** butonuna tıklayın
5. Token'ı kopyalayın

### Adım 2: Token ile Çalıştırın

PowerShell'de:

```powershell
# Token'ı set edin
$env:SUPABASE_ACCESS_TOKEN = "YOUR_TOKEN_HERE"

# Projeyi link edin
npx supabase link --project-ref eaibfqnjgkflvxdxfbw

# Migration'ları push edin
npx supabase db push
```

### Adım 3: Öneriyi Ekleyin

`run_migrations_and_add_request.sql` dosyasını Supabase Dashboard SQL Editor'de çalıştırın.

---

## 📝 Notlar

- **En hızlı yöntem:** SQL Editor kullanmak (1-2 dakika)
- **CLI yöntemi:** Daha fazla adım gerektirir ama otomatikleştirilebilir
- **Öneri ekleme:** Her iki yöntemde de SQL dosyasını manuel çalıştırmanız gerekiyor
