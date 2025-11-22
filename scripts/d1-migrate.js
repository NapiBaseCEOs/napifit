/**
 * D1 Migration Helper Script
 * Bu script Prisma migration'larını D1 veritabanına uygular
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const isRemote = process.argv.includes('--remote');
const databaseName = process.env.D1_DATABASE_NAME || 'napifit-db';

console.log(`🚀 D1 Migration başlatılıyor...`);
console.log(`📦 Database: ${databaseName}`);
console.log(`🌐 Mode: ${isRemote ? 'Remote (Production)' : 'Local'}`);

try {
  // 1. Prisma migration'larını oluştur
  console.log('\n📝 Prisma migration'ları kontrol ediliyor...');
  execSync('npx prisma migrate dev --name d1_migration --create-only', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: 'file:./dev.db' }
  });

  // 2. Migration dosyalarını bul
  const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.error('❌ Migration klasörü bulunamadı!');
    process.exit(1);
  }

  const migrations = fs.readdirSync(migrationsDir)
    .filter(dir => {
      const migrationPath = path.join(migrationsDir, dir);
      return fs.statSync(migrationPath).isDirectory();
    })
    .sort();

  console.log(`\n📋 ${migrations.length} migration bulundu`);

  // 3. Her migration'ı D1'e uygula
  for (const migration of migrations) {
    const migrationPath = path.join(migrationsDir, migration, 'migration.sql');
    
    if (fs.existsSync(migrationPath)) {
      console.log(`\n🔄 Migration uygulanıyor: ${migration}`);
      
      const command = isRemote
        ? `wrangler d1 execute ${databaseName} --remote --file="${migrationPath}"`
        : `wrangler d1 execute ${databaseName} --local --file="${migrationPath}"`;
      
      try {
        execSync(command, { stdio: 'inherit' });
        console.log(`✅ ${migration} başarıyla uygulandı`);
      } catch (error) {
        console.error(`❌ ${migration} uygulanırken hata:`, error.message);
        // Devam et, bazı migration'lar zaten uygulanmış olabilir
      }
    }
  }

  console.log('\n✅ Tüm migration\'lar tamamlandı!');
  
  if (!isRemote) {
    console.log('\n💡 Production\'a deploy etmek için:');
    console.log('   npm run d1:migrate:remote');
  }

} catch (error) {
  console.error('❌ Migration hatası:', error.message);
  process.exit(1);
}

