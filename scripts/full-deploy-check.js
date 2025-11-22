/**
 * Tam Deploy Kontrol Script'i
 * Migration, Cloudflare API ve Site testlerini birleştirir
 */

const { execSync } = require('child_process');
const https = require('https');

const SITE_URL = 'https://napibase.com';

console.log('🔍 Tam Deploy Kontrol Başlatılıyor...\n');

// HTTP request helper
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || { 'User-Agent': 'Mozilla/5.0' },
      timeout: options.timeout || 10000,
    };

    const req = https.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data: body, headers: res.headers });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function checkDatabase() {
  console.log('📊 1. Database Kontrolü...\n');
  
  // Turso environment variables kontrolü
  const hasTursoUrl = !!process.env.TURSO_DATABASE_URL;
  const hasTursoToken = !!process.env.TURSO_AUTH_TOKEN;
  
  console.log(`   TURSO_DATABASE_URL: ${hasTursoUrl ? '✅ Set' : '❌ Not set'}`);
  console.log(`   TURSO_AUTH_TOKEN: ${hasTursoToken ? '✅ Set' : '❌ Not set'}\n`);
  
  if (hasTursoUrl && hasTursoToken) {
    try {
      console.log('   🔄 Migration script çalıştırılıyor...');
      execSync('node scripts/check-and-migrate-turso.js', { 
        stdio: 'inherit',
        encoding: 'utf-8' 
      });
      console.log('   ✅ Database migration tamamlandı\n');
      return true;
    } catch (error) {
      console.log('   ⚠️  Migration script çalıştırılamadı (local environment variables yok)\n');
      console.log('   💡 Cloudflare Pages\'de environment variables varsa production\'da çalışacak\n');
      return false;
    }
  } else {
    console.log('   ⚠️  Local environment variables yok\n');
    console.log('   💡 Cloudflare Pages\'de environment variables kontrol edilecek\n');
    return false;
  }
}

async function checkCloudflareDeploy() {
  console.log('☁️  2. Cloudflare Deploy Kontrolü...\n');
  
  const hasApiToken = !!process.env.CLOUDFLARE_API_TOKEN;
  const hasAccountId = !!process.env.CLOUDFLARE_ACCOUNT_ID;
  
  if (!hasApiToken || !hasAccountId) {
    console.log('   ⚠️  Cloudflare API credentials yok\n');
    console.log('   💡 CLOUDFLARE_API_TOKEN ve CLOUDFLARE_ACCOUNT_ID gerekli\n');
    return false;
  }
  
  try {
    execSync('node scripts/check-cloudflare-deploy-status.js', { 
      stdio: 'inherit',
      encoding: 'utf-8' 
    });
    return true;
  } catch (error) {
    console.log('   ❌ Cloudflare deploy kontrolü başarısız\n');
    return false;
  }
}

async function checkSite() {
  console.log('🌐 3. Site Kontrolü...\n');
  
  const results = {
    siteAvailable: false,
    registerApi: false,
    googleOAuth: false,
  };
  
  // Site erişilebilirlik
  try {
    const response = await makeRequest(SITE_URL);
    results.siteAvailable = response.status === 200;
    console.log(`   Site erişilebilirlik: ${results.siteAvailable ? '✅' : '❌'}\n`);
  } catch (error) {
    console.log(`   Site erişilebilirlik: ❌ (${error.message})\n`);
  }
  
  // Register API test
  try {
    const response = await makeRequest(`${SITE_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        email: 'test@example.com',
        password: 'test123456',
        firstName: 'Test',
        lastName: 'User',
        dateOfBirth: '2000-01-01'
      }
    });
    
    // 400 (validation) veya 409 (exists) bekleniyor, 503 (database error) değil
    results.registerApi = response.status !== 503 && response.status !== 500;
    console.log(`   Register API: ${results.registerApi ? '✅' : '❌'} (Status: ${response.status})\n`);
  } catch (error) {
    console.log(`   Register API: ❌ (${error.message})\n`);
  }
  
  // Google OAuth test
  try {
    const response = await makeRequest(`${SITE_URL}/api/auth/signin/google`);
    results.googleOAuth = response.status === 302 || response.status === 307;
    console.log(`   Google OAuth: ${results.googleOAuth ? '✅' : '❌'} (Status: ${response.status})\n`);
  } catch (error) {
    console.log(`   Google OAuth: ❌ (${error.message})\n`);
  }
  
  return results;
}

async function main() {
  const dbCheck = await checkDatabase();
  const deployCheck = await checkCloudflareDeploy();
  const siteCheck = await checkSite();
  
  console.log('\n📊 Özet:\n');
  console.log(`   Database: ${dbCheck ? '✅' : '⚠️'}`);
  console.log(`   Cloudflare Deploy: ${deployCheck ? '✅' : '⚠️'}`);
  console.log(`   Site: ${siteCheck.siteAvailable ? '✅' : '❌'}`);
  console.log(`   Register API: ${siteCheck.registerApi ? '✅' : '❌'}`);
  console.log(`   Google OAuth: ${siteCheck.googleOAuth ? '✅' : '❌'}\n`);
  
  if (siteCheck.registerApi && siteCheck.googleOAuth && siteCheck.siteAvailable) {
    console.log('✅ Tüm kontroller başarılı!\n');
    process.exit(0);
  } else {
    console.log('⚠️  Bazı kontroller başarısız\n');
    process.exit(1);
  }
}

main();

