/**
 * Turso Database Migration Script
 * Prisma migration SQL'ini Turso'ya uygular
 */

const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

const databaseUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!databaseUrl) {
  console.error('❌ TURSO_DATABASE_URL environment variable not set');
  process.exit(1);
}

async function applyMigration() {
  console.log('🚀 Turso Migration Başlatılıyor...\n');

  try {
    // Turso client oluştur
    const client = createClient({
      url: databaseUrl,
      authToken: authToken || undefined,
    });

    console.log('✅ Turso client oluşturuldu\n');

    // Migration SQL dosyasını oku
    const migrationPath = path.join(__dirname, '../prisma/migrations/init_schema.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error(`❌ Migration dosyası bulunamadı: ${migrationPath}`);
      process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    
    // SQL komutlarını ayır (; ile)
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 ${statements.length} SQL statement bulundu\n`);

    // Her statement'ı çalıştır
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.trim().length === 0) continue;

      try {
        console.log(`⏳ Statement ${i + 1}/${statements.length} çalıştırılıyor...`);
        await client.execute(statement);
        console.log(`   ✅ Başarılı\n`);
      } catch (error) {
        // Eğer tablo zaten varsa hata verme (idempotent)
        if (error.message && error.message.includes('already exists')) {
          console.log(`   ⚠️  Tablo zaten mevcut, atlanıyor\n`);
        } else {
          console.error(`   ❌ Hata: ${error.message}\n`);
          throw error;
        }
      }
    }

    console.log('✅ Migration tamamlandı!\n');

    // Test query
    console.log('🧪 Test query çalıştırılıyor...');
    const result = await client.execute('SELECT name FROM sqlite_master WHERE type="table"');
    console.log(`   ✅ ${result.rows.length} tablo bulundu:`);
    result.rows.forEach(row => {
      console.log(`      - ${row.name}`);
    });
    console.log('');

  } catch (error) {
    console.error('❌ Migration hatası:', error.message);
    process.exit(1);
  }
}

applyMigration();

