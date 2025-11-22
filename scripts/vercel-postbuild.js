/**
 * Vercel Post-Build Script
 * Build sonrası Turso migration'ı otomatik uygular
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔧 Vercel Post-Build Script Başlatılıyor...\n');

// Turso environment variables kontrolü
const tursoDatabaseUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoDatabaseUrl || !tursoAuthToken) {
  console.log('⚠️  TURSO_DATABASE_URL veya TURSO_AUTH_TOKEN bulunamadı.');
  console.log('💡 Migration atlanıyor. Environment variables ayarlandıktan sonra manuel olarak çalıştırın:\n');
  console.log('   node scripts/apply-turso-migration.js\n');
  process.exit(0);
}

console.log('✅ Turso credentials bulundu\n');
console.log('🚀 Turso migration uygulanıyor...\n');

try {
  // Migration script'ini çalıştır
  const migrationScript = path.join(__dirname, 'apply-turso-migration.js');
  execSync(`node "${migrationScript}"`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      TURSO_DATABASE_URL: tursoDatabaseUrl,
      TURSO_AUTH_TOKEN: tursoAuthToken,
    },
  });
  
  console.log('\n✅ Migration başarıyla tamamlandı!\n');
} catch (error) {
  console.error('\n❌ Migration hatası:', error.message);
  console.log('\n⚠️  Build devam edecek, ancak migration uygulanamadı.');
  console.log('💡 Manuel olarak çalıştırın: node scripts/apply-turso-migration.js\n');
  // Build'i durdurmuyoruz, sadece uyarı veriyoruz
  process.exit(0);
}

