/**
 * Vercel Deployment Kontrol Script'i
 * Deployment durumunu, environment variables'ları ve database bağlantısını kontrol eder
 */

const https = require('https');

const SITE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : process.env.NEXT_PUBLIC_APP_URL || 'https://napifit.vercel.app';

console.log('🔍 Vercel Deployment Kontrolü Başlatılıyor...\n');
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

async function checkSiteAvailability() {
  console.log('📡 1. Site Erişilebilirlik Kontrolü...');
  try {
    const response = await makeRequest(SITE_URL, { timeout: 5000 });
    const success = response.status === 200;
    console.log(`   ${success ? '✅' : '❌'} Site: ${success ? 'Erişilebilir' : 'Erişilemiyor'} (${response.status})\n`);
    return success;
  } catch (error) {
    console.log(`   ❌ Site erişilemiyor: ${error.message}\n`);
    return false;
  }
}

async function checkAPIEndpoints() {
  console.log('🔌 2. API Endpoint Kontrolü...');
  
  const endpoints = [
    { name: 'Config API', path: '/api/config' },
    { name: 'Test Auth API', path: '/api/test-auth' },
    { name: 'NextAuth Providers', path: '/api/auth/providers' },
  ];

  let allOk = true;
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${SITE_URL}${endpoint.path}`, { timeout: 5000 });
      const success = response.status === 200;
      console.log(`   ${success ? '✅' : '❌'} ${endpoint.name}: ${success ? 'Çalışıyor' : 'Hata'} (${response.status})`);
      if (!success) allOk = false;
    } catch (error) {
      console.log(`   ❌ ${endpoint.name}: ${error.message}`);
      allOk = false;
    }
  }
  console.log('');
  return allOk;
}

async function checkRegisterAPI() {
  console.log('📝 3. Register API Kontrolü...');
  try {
    const response = await makeRequest(`${SITE_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        firstName: 'Test',
        lastName: 'User',
        dateOfBirth: '2000-01-01',
        email: `test_${Date.now()}@example.com`,
        password: 'test123456',
      },
      timeout: 10000,
    });
    
    // 200 = başarılı kayıt, 400 = validation hatası (normal), 503 = database hatası
    const success = response.status === 200 || response.status === 400;
    const dbError = response.status === 503;
    
    if (dbError) {
      console.log(`   ❌ Register API: Database bağlantı hatası (503)`);
      console.log(`   💡 Turso credentials veya migration kontrol edilmeli\n`);
      return false;
    } else if (success) {
      console.log(`   ✅ Register API: Çalışıyor (${response.status})\n`);
      return true;
    } else {
      console.log(`   ⚠️  Register API: Beklenmeyen durum (${response.status})\n`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Register API: ${error.message}\n`);
    return false;
  }
}

async function checkEnvironmentVariables() {
  console.log('🔐 4. Environment Variables Kontrolü (API üzerinden)...');
  try {
    const response = await makeRequest(`${SITE_URL}/api/test-auth`, { timeout: 5000 });
    if (response.status === 200 && response.data) {
      const env = response.data.environment || {};
      
      const checks = {
        'NEXTAUTH_URL': env.NEXTAUTH_URL,
        'GOOGLE_CLIENT_ID': env.GOOGLE_CLIENT_ID,
        'GOOGLE_CLIENT_SECRET': env.GOOGLE_CLIENT_SECRET,
        'AUTH_SECRET': env.AUTH_SECRET,
        'TURSO_DATABASE_URL': env.TURSO_DATABASE_URL ? 'SET' : 'MISSING',
        'TURSO_AUTH_TOKEN': env.TURSO_AUTH_TOKEN ? 'SET' : 'MISSING',
      };

      let allSet = true;
      Object.entries(checks).forEach(([key, value]) => {
        const isSet = value && value !== 'MISSING' && value !== '❌ MISSING';
        console.log(`   ${isSet ? '✅' : '❌'} ${key}: ${isSet ? (key.includes('TOKEN') || key.includes('SECRET') ? 'SET' : value) : 'MISSING'}`);
        if (!isSet) allSet = false;
      });
      
      console.log('');
      return allSet;
    } else {
      console.log('   ⚠️  Environment variables kontrol edilemedi\n');
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Environment variables kontrol hatası: ${error.message}\n`);
    return false;
  }
}

async function main() {
  const results = {
    siteAvailable: false,
    apiEndpoints: false,
    registerAPI: false,
    environmentVariables: false,
  };

  // 1. Site erişilebilirlik
  results.siteAvailable = await checkSiteAvailability();
  if (!results.siteAvailable) {
    console.log('❌ Site erişilemiyor, diğer kontroller atlanıyor.\n');
    return;
  }

  // 2. API endpoints
  results.apiEndpoints = await checkAPIEndpoints();

  // 3. Register API
  results.registerAPI = await checkRegisterAPI();

  // 4. Environment variables
  results.environmentVariables = await checkEnvironmentVariables();

  // Özet
  console.log('📊 Kontrol Özeti:');
  console.log(`   ${results.siteAvailable ? '✅' : '❌'} Site Erişilebilirlik`);
  console.log(`   ${results.apiEndpoints ? '✅' : '❌'} API Endpoints`);
  console.log(`   ${results.registerAPI ? '✅' : '❌'} Register API`);
  console.log(`   ${results.environmentVariables ? '✅' : '❌'} Environment Variables`);
  console.log('');

  const allOk = Object.values(results).every(v => v === true);
  
  if (allOk) {
    console.log('✅ Tüm kontroller başarılı! Deployment hazır.\n');
  } else {
    console.log('⚠️  Bazı kontroller başarısız. Lütfen yukarıdaki hataları kontrol edin.\n');
    
    if (!results.registerAPI) {
      console.log('💡 Register API hatası için:');
      console.log('   1. Vercel Dashboard > Settings > Environment Variables');
      console.log('   2. TURSO_DATABASE_URL ve TURSO_AUTH_TOKEN ekleyin');
      console.log('   3. Yeni deploy başlatın\n');
    }
    
    if (!results.environmentVariables) {
      console.log('💡 Environment Variables eksik:');
      console.log('   1. Vercel Dashboard > Settings > Environment Variables');
      console.log('   2. Tüm gerekli değişkenleri ekleyin\n');
    }
  }
}

main().catch((error) => {
  console.error('❌ Kontrol hatası:', error);
  process.exit(1);
});

