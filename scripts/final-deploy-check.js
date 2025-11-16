/**
 * Final Deploy Kontrol Script'i
 * Migration, Database, Deploy ve Site testlerini birleştirir
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const https = require('https');
const { execSync } = require('child_process');

const SITE_URL = 'https://napibase.com';

console.log('🔍 Final Deploy Kontrol Başlatılıyor...\n');

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
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers, raw: body });
        } catch {
          resolve({ status: res.statusCode, data: body, headers: res.headers, raw: body });
        }
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
  console.log('📊 1. Database Migration Kontrolü...\n');
  
  try {
    execSync('node scripts/check-and-migrate-turso.js', { 
      stdio: 'inherit',
      encoding: 'utf-8',
      env: { ...process.env }
    });
    console.log('✅ Database migration tamamlandı\n');
    return true;
  } catch (error) {
    console.log('❌ Database migration hatası\n');
    return false;
  }
}

async function checkSite() {
  console.log('🌐 2. Site Kontrolü...\n');
  
  const results = {
    siteAvailable: false,
    registerApi: false,
    googleOAuth: false,
    providers: false,
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
    const statusText = response.status === 400 ? 'Validation OK' : 
                      response.status === 409 ? 'Email exists OK' : 
                      response.status === 201 ? 'Success' : 
                      `Status: ${response.status}`;
    console.log(`   Register API: ${results.registerApi ? '✅' : '❌'} ${statusText}\n`);
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
  
  // NextAuth Providers test
  try {
    const response = await makeRequest(`${SITE_URL}/api/auth/providers`);
    if (response.status === 200 && response.data) {
      const providers = Object.keys(response.data || {});
      results.providers = providers.includes('google') && providers.includes('credentials');
      console.log(`   NextAuth Providers: ${results.providers ? '✅' : '❌'} (${providers.join(', ')})\n`);
    }
  } catch (error) {
    console.log(`   NextAuth Providers: ❌ (${error.message})\n`);
  }
  
  return results;
}

async function main() {
  const dbCheck = await checkDatabase();
  const siteCheck = await checkSite();
  
  console.log('\n📊 Final Özet:\n');
  console.log(`   Database Migration: ${dbCheck ? '✅' : '❌'}`);
  console.log(`   Site Erişilebilirlik: ${siteCheck.siteAvailable ? '✅' : '❌'}`);
  console.log(`   Register API: ${siteCheck.registerApi ? '✅' : '❌'}`);
  console.log(`   Google OAuth: ${siteCheck.googleOAuth ? '✅' : '❌'}`);
  console.log(`   NextAuth Providers: ${siteCheck.providers ? '✅' : '❌'}\n`);
  
  const allPassed = dbCheck && siteCheck.siteAvailable && siteCheck.registerApi && 
                    siteCheck.googleOAuth && siteCheck.providers;
  
  if (allPassed) {
    console.log('✅ Tüm kontroller başarılı! Site hazır.\n');
    process.exit(0);
  } else {
    console.log('⚠️  Bazı kontroller başarısız\n');
    process.exit(1);
  }
}

main();

