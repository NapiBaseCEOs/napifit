/**
 * D1 Database Initialization Script
 * Bu script yeni bir D1 database oluşturur ve ilk migration'ı uygular
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 NapiFit D1 Database Kurulumu\n');

try {
  // 1. D1 Database oluştur
  console.log('📦 D1 Database oluşturuluyor...');
  try {
    const output = execSync('wrangler d1 create napifit-db', { encoding: 'utf-8' });
    console.log(output);
    
    // Database ID'yi çıkar (output'tan)
    const idMatch = output.match(/database_id = "([^"]+)"/);
    if (idMatch) {
      console.log(`\n✅ Database ID: ${idMatch[1]}`);
      console.log('⚠️  Bu ID\'yi wrangler.toml dosyasına eklemeyi unutmayın!\n');
    }
  } catch (error) {
    console.error('❌ Database oluşturma hatası:', error.message);
    console.log('💡 Database zaten var olabilir, devam ediliyor...\n');
  }

  // 2. Prisma client generate et
  console.log('🔧 Prisma Client generate ediliyor...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client hazır\n');

  // 3. İlk migration oluştur
  console.log('📝 İlk migration oluşturuluyor...');
  try {
    execSync('npx prisma migrate dev --name init --create-only', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: 'file:./dev.db' }
    });
    console.log('✅ Migration oluşturuldu\n');
  } catch (error) {
    console.error('⚠️  Migration oluşturma hatası:', error.message);
  }

  // 4. Local D1'e migration uygula
  console.log('🔄 Migration\'lar local D1\'e uygulanıyor...');
  try {
    execSync('node scripts/d1-migrate.js', { stdio: 'inherit' });
    console.log('✅ Local migration tamamlandı\n');
  } catch (error) {
    console.error('⚠️  Local migration hatası:', error.message);
  }

  console.log('🎉 Kurulum tamamlandı!\n');
  console.log('📝 Sonraki adımlar:');
  console.log('   1. wrangler.toml dosyasına database_id ekleyin');
  console.log('   2. Production\'a deploy etmek için: npm run d1:migrate:remote');
  console.log('   3. Development: npm run dev\n');

} catch (error) {
  console.error('❌ Kurulum hatası:', error.message);
  process.exit(1);
}

