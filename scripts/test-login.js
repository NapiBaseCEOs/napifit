/**
 * Login Test Script
 * Login API'sini test eder
 */

const https = require('https');

const SITE_URL = 'https://napifit.vercel.app';

console.log('🧪 Login Test Başlatılıyor...\n');
console.log(`🌐 Site URL: ${SITE_URL}\n`);

// HTTP request helper
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: options.timeout || 10000,
    };

    const req = https.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
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

async function testLogin() {
  console.log('📝 1. Login Sayfası Kontrolü...');
  try {
    const response = await makeRequest(`${SITE_URL}/login`);
    const html = response.data;
    const hasLoginForm = html.includes('type="email"') && html.includes('type="password"');
    console.log(`   ${hasLoginForm ? '✅' : '❌'} Login Formu: ${hasLoginForm ? 'Bulundu' : 'Bulunamadı'}\n`);
  } catch (error) {
    console.log(`   ❌ Login sayfası kontrol hatası: ${error.message}\n`);
  }

  console.log('🔐 2. NextAuth Providers Kontrolü...');
  try {
    const response = await makeRequest(`${SITE_URL}/api/auth/providers`);
    const data = response.data;
    const googleProviderActive = data && data.google && data.google.id === 'google';
    const credentialsProviderActive = data && data.credentials && data.credentials.id === 'credentials';

    console.log(`   ${googleProviderActive ? '✅' : '❌'} Google Provider: ${googleProviderActive ? 'Aktif' : 'Pasif'}`);
    console.log(`   ${credentialsProviderActive ? '✅' : '❌'} Credentials Provider: ${credentialsProviderActive ? 'Aktif' : 'Pasif'}\n`);
  } catch (error) {
    console.log(`   ❌ Providers kontrol hatası: ${error.message}\n`);
  }

  console.log('🗄️  3. Database Bağlantı Kontrolü...');
  try {
    const response = await makeRequest(`${SITE_URL}/api/test-auth`);
    if (response.status === 200 && response.data) {
      const data = response.data;
      
      console.log('   Environment Variables:');
      const env = data.environment || {};
      console.log(`      ${env.TURSO_DATABASE_URL === '✅ SET' ? '✅' : '❌'} TURSO_DATABASE_URL: ${env.TURSO_DATABASE_URL || 'MISSING'}`);
      console.log(`      ${env.TURSO_AUTH_TOKEN === '✅ SET' ? '✅' : '❌'} TURSO_AUTH_TOKEN: ${env.TURSO_AUTH_TOKEN || 'MISSING'}`);
      
      if (data.tursoDatabase) {
        console.log('   Turso Database:');
        console.log(`      ${data.tursoDatabase.available ? '✅' : '❌'} Available: ${data.tursoDatabase.available}`);
        if (data.tursoDatabase.testQuery) {
          console.log(`      ${data.tursoDatabase.testQuery.includes('✅') ? '✅' : '❌'} Test Query: ${data.tursoDatabase.testQuery}`);
        }
        if (data.tursoDatabase.error) {
          console.log(`      ⚠️  Error: ${data.tursoDatabase.error}`);
        }
      }
      console.log('');
    }
  } catch (error) {
    console.log(`   ❌ Database kontrol hatası: ${error.message}\n`);
  }

  console.log('✅ Login test tamamlandı!\n');
  console.log('💡 Login testi için:');
  console.log('   1. https://napifit.vercel.app/login adresine git');
  console.log('   2. Email ve şifre ile giriş yap');
  console.log('   3. Veya Google ile giriş yap\n');
}

testLogin().catch((error) => {
  console.error('❌ Test hatası:', error);
  process.exit(1);
});

