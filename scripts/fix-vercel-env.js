/**
 * Vercel Environment Variables Fix Script
 * NEXTAUTH_URL'i otomatik olarak düzeltir
 */

const https = require('https');

console.log('🔧 Vercel Environment Variables Fix\n');

console.log('⚠️  ÖNEMLİ: Bu script sadece bilgi verir.\n');
console.log('📝 Vercel Dashboard\'dan yapılması gerekenler:\n');
console.log('1. Vercel Dashboard > napifit > Settings > Environment Variables');
console.log('2. NEXTAUTH_URL değişkenini bul');
console.log('3. Eğer değer "https://napibase.com" ise:');
console.log('   - Değişkeni sil');
console.log('   - Yeni değişken ekle:');
console.log('     Name: NEXTAUTH_URL');
console.log('     Value: https://napifit.vercel.app');
console.log('     Environment: Production, Preview, Development (hepsini seç)');
console.log('4. Save butonuna tıkla');
console.log('5. Yeni deploy başlat\n');

console.log('💡 Alternatif: Kod zaten VERCEL_URL\'i otomatik algılıyor.');
console.log('   Yeni deploy sonrası NEXTAUTH_URL otomatik olarak düzelecek.\n');

console.log('🔗 Google OAuth Callback URL Kontrolü:\n');
console.log('1. Google Cloud Console > APIs & Services > Credentials');
console.log('2. OAuth 2.0 Client ID\'nizi seçin');
console.log('3. "Authorized redirect URIs" bölümünde şu URL\'ler olmalı:');
console.log('   - https://napifit.vercel.app/api/auth/callback/google');
console.log('   - https://napifit-*.vercel.app/api/auth/callback/google (preview için)');
console.log('4. Eğer "https://napibase.com/api/auth/callback/google" varsa, onu da ekleyin\n');

console.log('✅ Tüm ayarlar yapıldıktan sonra yeni deploy başlatın.\n');

