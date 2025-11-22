/**
 * Vercel Otomatik Setup Script
 * Vercel deploy sonrası migration ve kontrolleri yapar
 */

const https = require('https');
const { execSync } = require('child_process');

const VERCEL_URL = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_APP_URL;
const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

console.log('🚀 Vercel Otomatik Setup Başlatılıyor...\n');

async function checkEnvironmentVariables() {
  console.log('📋 Environment Variables Kontrolü...\n');
  
  const required = {
    'TURSO_DATABASE_URL': TURSO_DATABASE_URL,
    'TURSO_AUTH_TOKEN': TURSO_AUTH_TOKEN ? 'SET' : 'MISSING',
    'AUTH_SECRET': process.env.AUTH_SECRET ? 'SET' : 'MISSING',
    'NEXTAUTH_URL': process.env.NEXTAUTH_URL || 'MISSING',
    'GOOGLE_CLIENT_ID': process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING',
    'GOOGLE_CLIENT_SECRET': process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING',
  };

  let allSet = true;
  Object.entries(required).forEach(([key, value]) => {
    const isSet = value && value !== 'MISSING';
    console.log(`   ${isSet ? '✅' : '❌'} ${key}: ${isSet ? (key.includes('TOKEN') || key.includes('SECRET') ? 'SET' : value) : 'MISSING'}`);
    if (!isSet) allSet = false;
  });
  
  console.log('');
  return allSet;
}

async function applyMigration() {
  if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
    console.log('⚠️  Turso credentials eksik, migration atlanıyor\n');
    return false;
  }

  console.log('🗄️  Turso Migration Uygulanıyor...\n');
  
  try {
    execSync('node scripts/apply-turso-migration.js', {
      stdio: 'inherit',
      env: {
        ...process.env,
        TURSO_DATABASE_URL,
        TURSO_AUTH_TOKEN,
      },
    });
    console.log('\n✅ Migration başarıyla tamamlandı!\n');
    return true;
  } catch (error) {
    console.error('\n❌ Migration hatası:', error.message);
    return false;
  }
}

async function testDatabaseConnection() {
  if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
    return false;
  }

  console.log('🧪 Database Bağlantı Testi...\n');
  
  try {
    const { testConnection } = require('../src/lib/turso');
    const connected = await testConnection();
    
    if (connected) {
      console.log('   ✅ Database bağlantısı başarılı\n');
      return true;
    } else {
      console.log('   ❌ Database bağlantısı başarısız\n');
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Database test hatası: ${error.message}\n`);
    return false;
  }
}

async function main() {
  // 1. Environment variables kontrolü
  const envOk = await checkEnvironmentVariables();
  if (!envOk) {
    console.log('⚠️  Bazı environment variables eksik. Lütfen Vercel Dashboard\'dan ekleyin.\n');
  }

  // 2. Migration uygula
  const migrationOk = await applyMigration();
  
  // 3. Database bağlantı testi
  if (migrationOk) {
    await testDatabaseConnection();
  }

  console.log('✅ Setup tamamlandı!\n');
  
  if (VERCEL_URL) {
    console.log(`🌐 Site URL: https://${VERCEL_URL}\n`);
  }
}

main().catch((error) => {
  console.error('❌ Setup hatası:', error);
  process.exit(1);
});

