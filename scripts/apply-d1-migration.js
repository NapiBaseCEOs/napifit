/**
 * D1 Migration Uygulama Script'i
 * Bu script SQL migration dosyasını Cloudflare D1'e uygular
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const databaseName = 'napifit-db';
const databaseId = 'de758b90-9098-4b56-bbb5-f9782e9cc259';
const migrationFile = path.join(process.cwd(), 'prisma', 'migrations', 'init_schema.sql');

console.log('🚀 D1 Migration Uygulama Başlatılıyor...\n');
console.log(`📦 Database: ${databaseName}`);
console.log(`🆔 Database ID: ${databaseId}`);
console.log('🌐 Mode: Remote (Production)\n');

// Wrangler path kontrolü
const wranglerPath = path.join(process.cwd(), 'node_modules', '.bin', 'wrangler.cmd');
const wranglerCmd = fs.existsSync(wranglerPath) ? wranglerPath : 'npx wrangler';

try {
  // Migration dosyasını kontrol et
  if (!fs.existsSync(migrationFile)) {
    console.error(`❌ Migration dosyası bulunamadı: ${migrationFile}`);
    process.exit(1);
  }

  console.log(`📄 Migration dosyası: ${migrationFile}\n`);

  // D1'e migration uygula (remote)
  console.log('🔄 Migration production D1\'e uygulanıyor...');
  console.log('');

  try {
    // Wrangler ile SQL dosyasını D1'e uygula
    const command = `${wranglerCmd} d1 execute ${databaseName} --remote --file="${migrationFile}"`;
    
    console.log(`Komut: ${command}\n`);
    
    execSync(command, {
      stdio: 'inherit',
      env: {
        ...process.env,
        CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID || '',
        CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN || '',
      }
    });

    console.log('\n✅ Migration başarıyla uygulandı!');
    console.log('\n📋 Sonraki adımlar:');
    console.log('   1. Cloudflare Pages projesini oluşturun');
    console.log('   2. Environment variables ekleyin');
    console.log('   3. İlk deploy tetikleyin\n');

  } catch (error) {
    console.error('\n❌ Migration uygulanırken hata:', error.message);
    console.log('\n💡 Manuel olarak uygulamak için:');
    console.log(`   ${wranglerCmd} d1 execute ${databaseName} --remote --file="${migrationFile}"`);
    console.log('\n   Veya Cloudflare Dashboard\'dan:');
    console.log('   Storage > D1 > napifit-db > Execute SQL');
    console.log('   SQL dosyasını kopyalayıp yapıştırın\n');
    process.exit(1);
  }

} catch (error) {
  console.error('\n❌ Migration hatası:', error.message);
  process.exit(1);
}
