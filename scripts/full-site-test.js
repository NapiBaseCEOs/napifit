/**
 * Tam Site Test Script'i
 * Tüm özellikleri test eder: Authentication, API endpoints, Database
 */

const https = require('https');

const SITE_URL = 'https://napibase.com';

// HTTP request helper
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || { 'Content-Type': 'application/json' },
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

async function runFullSiteTest() {
  console.log('🧪 Tam Site Test Başlatılıyor...\n');
  
  const results = {
    timestamp: new Date().toISOString(),
    siteUrl: SITE_URL,
    tests: [],
    summary: { total: 0, passed: 0, failed: 0, warnings: 0 },
  };

  // 1. Temel Sayfa Testleri
  console.log('📄 1. Temel Sayfa Testleri...');
  const pages = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/register' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Health', path: '/health' },
    { name: 'Profile', path: '/profile' },
  ];

  for (const page of pages) {
    try {
      const response = await makeRequest(`${SITE_URL}${page.path}`);
      const success = response.status === 200 || response.status === 307 || response.status === 302;
      results.tests.push({ name: page.name, path: page.path, status: response.status, success });
      results.summary.total++;
      if (success) results.summary.passed++;
      else results.summary.failed++;
      console.log(`   ${success ? '✅' : '❌'} ${page.name}: ${response.status}`);
    } catch (error) {
      results.tests.push({ name: page.name, path: page.path, success: false, error: error.message });
      results.summary.total++;
      results.summary.failed++;
      console.log(`   ❌ ${page.name}: ${error.message}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }
  console.log('');

  // 2. API Endpoint Testleri
  console.log('🔌 2. API Endpoint Testleri...');
  const apiEndpoints = [
    { name: 'Config', path: '/api/config', method: 'GET' },
    { name: 'Test Auth', path: '/api/test-auth', method: 'GET' },
    { name: 'DB Test', path: '/api/db-test', method: 'GET' },
    { name: 'DB Debug', path: '/api/db-debug', method: 'GET' },
    { name: 'NextAuth Providers', path: '/api/auth/providers', method: 'GET' },
    { name: 'NextAuth Signin', path: '/api/auth/signin', method: 'GET' },
    { name: 'Workouts List', path: '/api/workouts', method: 'GET' },
    { name: 'Meals List', path: '/api/meals', method: 'GET' },
    { name: 'Health Metrics List', path: '/api/health-metrics', method: 'GET' },
  ];

  for (const endpoint of apiEndpoints) {
    try {
      const response = await makeRequest(`${SITE_URL}${endpoint.path}`, { method: endpoint.method });
      // 200, 401, 403, 404, 503 gibi status kodları beklenebilir
      const success = response.status < 500; // 5xx hatalar gerçek hata
      results.tests.push({ 
        name: endpoint.name, 
        path: endpoint.path, 
        status: response.status, 
        success,
        data: typeof response.data === 'object' ? response.data : null,
      });
      results.summary.total++;
      if (success) results.summary.passed++;
      else results.summary.failed++;
      console.log(`   ${success ? '✅' : '❌'} ${endpoint.name}: ${response.status}`);
    } catch (error) {
      results.tests.push({ name: endpoint.name, path: endpoint.path, success: false, error: error.message });
      results.summary.total++;
      results.summary.failed++;
      console.log(`   ❌ ${endpoint.name}: ${error.message}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }
  console.log('');

  // 3. Authentication Detaylı Test
  console.log('🔐 3. Authentication Detaylı Test...');
  try {
    const authTest = await makeRequest(`${SITE_URL}/api/test-auth`);
    if (authTest.status === 200 && authTest.data) {
      const data = authTest.data;
      
      // Environment variables kontrolü
      const envCheck = {
        NEXTAUTH_URL: data.environment?.NEXTAUTH_URL === 'https://napibase.com',
        GOOGLE_CLIENT_ID: data.environment?.GOOGLE_CLIENT_ID === '✅ SET',
        GOOGLE_CLIENT_SECRET: data.environment?.GOOGLE_CLIENT_SECRET === '✅ SET',
        AUTH_SECRET: data.environment?.AUTH_SECRET === '✅ SET',
      };
      
      console.log('   Environment Variables:');
      Object.entries(envCheck).forEach(([key, value]) => {
        console.log(`      ${value ? '✅' : '❌'} ${key}`);
        results.tests.push({ name: `Env: ${key}`, success: value });
        results.summary.total++;
        if (value) results.summary.passed++;
        else { results.summary.failed++; results.summary.warnings++; }
      });
      
      // D1 Database kontrolü
      console.log('   D1 Database:');
      const dbAvailable = data.d1Database?.available === true;
      console.log(`      ${dbAvailable ? '✅' : '⚠️'} Available: ${dbAvailable}`);
      results.tests.push({ name: 'D1 Database Available', success: dbAvailable, warning: !dbAvailable });
      results.summary.total++;
      if (dbAvailable) results.summary.passed++;
      else { results.summary.warnings++; }
      
      if (data.d1Database?.error) {
        console.log(`      ⚠️  Error: ${data.d1Database.error}`);
      }
    }
  } catch (error) {
    console.log(`   ❌ Authentication test hatası: ${error.message}`);
    results.tests.push({ name: 'Authentication Test', success: false, error: error.message });
    results.summary.total++;
    results.summary.failed++;
  }
  console.log('');

  // 4. NextAuth Providers Test
  console.log('🔑 4. NextAuth Providers Test...');
  try {
    const providers = await makeRequest(`${SITE_URL}/api/auth/providers`);
    if (providers.status === 200 && providers.data) {
      const providerList = Object.keys(providers.data || {});
      const hasGoogle = providerList.includes('google');
      const hasCredentials = providerList.includes('credentials');
      
      console.log(`   ✅ Providers: ${providerList.join(', ') || 'None'}`);
      console.log(`   ${hasGoogle ? '✅' : '❌'} Google Provider: ${hasGoogle ? 'Available' : 'Missing'}`);
      console.log(`   ${hasCredentials ? '✅' : '❌'} Credentials Provider: ${hasCredentials ? 'Available' : 'Missing'}`);
      
      results.tests.push({ name: 'Google Provider', success: hasGoogle });
      results.tests.push({ name: 'Credentials Provider', success: hasCredentials });
      results.summary.total += 2;
      if (hasGoogle) results.summary.passed++; else results.summary.failed++;
      if (hasCredentials) results.summary.passed++; else results.summary.failed++;
    }
  } catch (error) {
    console.log(`   ❌ Providers test hatası: ${error.message}`);
    results.tests.push({ name: 'Providers Test', success: false, error: error.message });
    results.summary.total++;
    results.summary.failed++;
  }
  console.log('');

  // 5. API Endpoint Authentication Test (401 bekleniyor)
  console.log('🔒 5. Protected API Endpoint Testleri...');
  const protectedEndpoints = [
    { name: 'Profile API', path: '/api/profile' },
    { name: 'Workouts API', path: '/api/workouts' },
    { name: 'Meals API', path: '/api/meals' },
    { name: 'Health Metrics API', path: '/api/health-metrics' },
  ];

  for (const endpoint of protectedEndpoints) {
    try {
      const response = await makeRequest(`${SITE_URL}${endpoint.path}`);
      // 401 veya 403 bekleniyor (authenticated olmadığımız için)
      const success = response.status === 401 || response.status === 403;
      results.tests.push({ name: endpoint.name, path: endpoint.path, status: response.status, success });
      results.summary.total++;
      if (success) results.summary.passed++;
      else { results.summary.failed++; results.summary.warnings++; }
      console.log(`   ${success ? '✅' : '⚠️'} ${endpoint.name}: ${response.status} (401/403 bekleniyor)`);
    } catch (error) {
      results.tests.push({ name: endpoint.name, path: endpoint.path, success: false, error: error.message });
      results.summary.total++;
      results.summary.failed++;
      console.log(`   ❌ ${endpoint.name}: ${error.message}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }
  console.log('');

  // 6. Static Assets Test
  console.log('📦 6. Static Assets Test...');
  const assets = [
    { name: 'Manifest', path: '/manifest.webmanifest' },
  ];

  for (const asset of assets) {
    try {
      const response = await makeRequest(`${SITE_URL}${asset.path}`);
      const success = response.status === 200;
      results.tests.push({ name: asset.name, path: asset.path, status: response.status, success });
      results.summary.total++;
      if (success) results.summary.passed++;
      else results.summary.failed++;
      console.log(`   ${success ? '✅' : '❌'} ${asset.name}: ${response.status}`);
    } catch (error) {
      results.tests.push({ name: asset.name, path: asset.path, success: false, error: error.message });
      results.summary.total++;
      results.summary.failed++;
      console.log(`   ❌ ${asset.name}: ${error.message}`);
    }
  }
  console.log('');

  return results;
}

// Ana fonksiyon
async function main() {
  try {
    const results = await runFullSiteTest();
    
    console.log('\n📊 Test Sonuçları Özeti:');
    console.log(`   Toplam Test: ${results.summary.total}`);
    console.log(`   ✅ Başarılı: ${results.summary.passed}`);
    console.log(`   ❌ Başarısız: ${results.summary.failed}`);
    console.log(`   ⚠️  Uyarılar: ${results.summary.warnings}`);
    console.log(`   Başarı Oranı: ${((results.summary.passed / results.summary.total) * 100).toFixed(1)}%\n`);
    
    // Detaylı sonuçları kaydet
    const fs = require('fs');
    fs.writeFileSync('full-site-test-results.json', JSON.stringify(results, null, 2));
    console.log('📄 Detaylı sonuçlar full-site-test-results.json dosyasına kaydedildi.\n');
    
    // Önemli bulgular
    console.log('🔍 Önemli Bulgular:');
    const dbTest = results.tests.find(t => t.name === 'D1 Database Available');
    if (dbTest && !dbTest.success) {
      console.log('   ⚠️  D1 Database binding bulunamadı - JWT-only mode aktif');
      console.log('   💡 Bu normal olabilir, Cloudflare Pages runtime\'da binding inject edilmemiş olabilir');
    }
    
    const envTests = results.tests.filter(t => t.name?.startsWith('Env:'));
    const missingEnv = envTests.filter(t => !t.success);
    if (missingEnv.length > 0) {
      console.log(`   ⚠️  ${missingEnv.length} environment variable eksik veya yanlış`);
    } else {
      console.log('   ✅ Tüm environment variables ayarlı');
    }
    
    console.log('');
    
    process.exit(results.summary.failed === 0 ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Hata:', error.message);
    process.exit(1);
  }
}

main();

