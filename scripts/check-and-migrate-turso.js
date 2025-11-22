/**
 * Turso Database Kontrol ve Migration Script
 * Database'i kontrol eder, migration yapar ve test eder
 */

// .env dosyasını yükle
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

const databaseUrl = process.env.TURSO_DATABASE_URL?.replace(/^"|"$/g, '') || process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN?.replace(/^"|"$/g, '') || process.env.TURSO_AUTH_TOKEN;

console.log('🔍 Turso Database Kontrol ve Migration\n');

if (!databaseUrl) {
  console.error('❌ TURSO_DATABASE_URL environment variable not set');
  console.log('\n💡 Cloudflare Pages Settings > Environment Variables > Production:');
  console.log('   TURSO_DATABASE_URL=libsql://napifit-db-xxxxx.turso.io');
  console.log('   TURSO_AUTH_TOKEN=turso_xxxxx...\n');
  process.exit(1);
}

async function checkAndMigrate() {
  try {
    console.log('📡 Turso client oluşturuluyor...');
    const client = createClient({
      url: databaseUrl,
      authToken: authToken || undefined,
    });
    console.log('✅ Turso client oluşturuldu\n');

    // 1. Mevcut tabloları kontrol et
    console.log('🔍 Mevcut tablolar kontrol ediliyor...');
    const tablesResult = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);
    
    const existingTables = tablesResult.rows.map(row => row.name);
    console.log(`   Bulunan tablolar: ${existingTables.length}`);
    if (existingTables.length > 0) {
      existingTables.forEach(table => console.log(`      - ${table}`));
    } else {
      console.log('      (Henüz tablo yok)');
    }
    console.log('');

    // 2. Gerekli tabloları kontrol et
    const requiredTables = ['User', 'Account', 'Session', 'VerificationToken', 'HealthMetric', 'Workout', 'Meal'];
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));

    if (missingTables.length === 0) {
      console.log('✅ Tüm tablolar mevcut, migration gerekmiyor\n');
    } else {
      console.log(`⚠️  ${missingTables.length} tablo eksik: ${missingTables.join(', ')}\n`);
      console.log('📝 Migration başlatılıyor...\n');

      // Migration SQL dosyasını oku
      const migrationPath = path.join(__dirname, '../prisma/migrations/init_schema.sql');
      
      if (!fs.existsSync(migrationPath)) {
        console.error(`❌ Migration dosyası bulunamadı: ${migrationPath}`);
        process.exit(1);
      }

      const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
      
      // SQL komutlarını ayır - yorumları temizle ve ; ile ayır
      let cleanSQL = migrationSQL
        .split('\n')
        .map(line => {
          // Satır içi yorumları temizle
          const commentIndex = line.indexOf('--');
          if (commentIndex >= 0) {
            return line.substring(0, commentIndex).trim();
          }
          return line.trim();
        })
        .filter(line => line.length > 0)
        .join('\n');
      
      // ; ile ayır ve temizle
      const statements = cleanSQL
        .split(';')
        .map(s => s.trim().replace(/\n+/g, ' ').replace(/\s+/g, ' '))
        .filter(s => {
          if (s.length === 0) return false;
          if (s.toUpperCase().startsWith('--')) return false;
          // CREATE TABLE, CREATE INDEX, CREATE UNIQUE INDEX gibi komutları al
          const upper = s.toUpperCase();
          return upper.startsWith('CREATE') || upper.startsWith('ALTER') || upper.startsWith('INSERT');
        })
        .map(s => s.endsWith(';') ? s : s + ';');

      console.log(`📝 ${statements.length} SQL statement bulundu\n`);

      // Her statement'ı çalıştır
      let successCount = 0;
      let skipCount = 0;
      let errorCount = 0;

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        
        if (statement.trim().length === 0) continue;

        try {
          // Tablo oluşturma komutlarını kontrol et
          const isCreateTable = statement.toUpperCase().includes('CREATE TABLE');
          if (isCreateTable) {
            const tableMatch = statement.match(/CREATE TABLE\s+"?(\w+)"?/i);
            if (tableMatch && existingTables.includes(tableMatch[1])) {
              console.log(`⏭️  Statement ${i + 1}/${statements.length}: Tablo zaten mevcut, atlanıyor`);
              skipCount++;
              continue;
            }
          }

          console.log(`⏳ Statement ${i + 1}/${statements.length} çalıştırılıyor...`);
          await client.execute(statement);
          console.log(`   ✅ Başarılı\n`);
          successCount++;
        } catch (error) {
          // Eğer tablo zaten varsa hata verme (idempotent)
          if (error.message && (
            error.message.includes('already exists') ||
            error.message.includes('duplicate') ||
            error.message.includes('UNIQUE constraint')
          )) {
            console.log(`   ⚠️  Zaten mevcut, atlanıyor\n`);
            skipCount++;
          } else {
            console.error(`   ❌ Hata: ${error.message}\n`);
            errorCount++;
            // Kritik hatalar için durdurma
            if (error.message.includes('syntax error')) {
              throw error;
            }
          }
        }
      }

      console.log(`\n📊 Migration Özeti:`);
      console.log(`   ✅ Başarılı: ${successCount}`);
      console.log(`   ⏭️  Atlanan: ${skipCount}`);
      console.log(`   ❌ Hatalı: ${errorCount}\n`);
    }

    // 3. Final kontrol
    console.log('🔍 Final kontrol yapılıyor...');
    const finalTablesResult = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);
    
    const finalTables = finalTablesResult.rows.map(row => row.name);
    console.log(`   Toplam tablo sayısı: ${finalTables.length}`);
    finalTables.forEach(table => console.log(`      - ${table}`));
    console.log('');

    // 4. Test query
    console.log('🧪 Test query çalıştırılıyor...');
    try {
      const testResult = await client.execute('SELECT COUNT(*) as count FROM User');
      const userCount = testResult.rows[0]?.count || 0;
      console.log(`   ✅ User tablosu çalışıyor (${userCount} kullanıcı)\n`);
    } catch (error) {
      console.log(`   ⚠️  Test query hatası: ${error.message}\n`);
    }

    console.log('✅ Database kontrol ve migration tamamlandı!\n');
    return true;

  } catch (error) {
    console.error('❌ Hata:', error.message);
    console.error(error.stack);
    return false;
  }
}

// Ana fonksiyon
async function main() {
  const success = await checkAndMigrate();
  process.exit(success ? 0 : 1);
}

main();

