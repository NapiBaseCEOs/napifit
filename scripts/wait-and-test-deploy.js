/**
 * Deploy Bekleme ve Tam Test Script'i
 * GitHub Actions ve Cloudflare Pages deploy durumunu kontrol eder
 * Deploy tamamlandıktan sonra siteyi tam teste sokar
 */

const https = require('https');
const { execSync } = require('child_process');

const SITE_URL = 'https://napibase.com';
const GITHUB_REPO = 'NapiBaseCEOs/napifit';
const MAX_WAIT_TIME = 10 * 60 * 1000; // 10 dakika
const CHECK_INTERVAL = 30 * 1000; // 30 saniye

console.log('⏳ Deploy Bekleniyor ve Test Ediliyor...\n');

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

// GitHub Actions durumunu kontrol et
async function checkGitHubActions() {
  try {
    const output = execSync(`gh run list --limit 1 --json status,conclusion,name,createdAt,url --repo ${GITHUB_REPO}`, {
      encoding: 'utf-8',
      stdio: 'pipe',
    });
    const runs = JSON.parse(output);
    if (runs.length > 0) {
      const run = runs[0];
      return {
        status: run.status,
        conclusion: run.conclusion,
        name: run.name,
        createdAt: run.createdAt,
        url: run.url,
      };
    }
  } catch (error) {
    // GitHub CLI yoksa veya hata varsa null döndür
    return null;
  }
  return null;
}

// Site erişilebilirliğini kontrol et
async function checkSiteAvailability() {
  try {
    const response = await makeRequest(SITE_URL, { timeout: 5000 });
    return response.status === 200;
  } catch {
    return false;
  }
}

// Test endpoint'leri
const testEndpoints = [
  { name: 'Ana Sayfa', path: '/', expectedStatus: 200 },
  { name: 'Login Sayfası', path: '/login', expectedStatus: 200 },
  { name: 'Register Sayfası', path: '/register', expectedStatus: 200 },
  { name: 'Config API', path: '/api/config', expectedStatus: 200 },
  { name: 'Test Auth API', path: '/api/test-auth', expectedStatus: 200 },
  { name: 'DB Test API', path: '/api/db-test', expectedStatus: [200, 503] },
  { name: 'NextAuth Providers', path: '/api/auth/providers', expectedStatus: 200 },
];

// Endpoint testi
async function testEndpoint(name, path, expectedStatus) {
  try {
    const url = `${SITE_URL}${path}`;
    const response = await makeRequest(url, { timeout: 5000 });
    const status = Array.isArray(expectedStatus) 
      ? expectedStatus.includes(response.status)
      : response.status === expectedStatus;
    
    return {
      name,
      path,
      status: response.status,
      success: status,
      data: response.data,
    };
  } catch (error) {
    return {
      name,
      path,
      status: 'ERROR',
      success: false,
      error: error.message,
    };
  }
}

// Tam test suite
async function runFullTest() {
  console.log('🧪 Tam Test Başlatılıyor...\n');
  
  const results = {
    timestamp: new Date().toISOString(),
    siteUrl: SITE_URL,
    tests: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
    },
  };

  // 1. Site erişilebilirlik testi
  console.log('📡 1. Site Erişilebilirlik Testi...');
  const siteAvailable = await checkSiteAvailability();
  results.tests.push({
    name: 'Site Erişilebilirlik',
    success: siteAvailable,
    message: siteAvailable ? 'Site erişilebilir' : 'Site erişilemiyor',
  });
  results.summary.total++;
  if (siteAvailable) results.summary.passed++;
  else results.summary.failed++;
  console.log(`   ${siteAvailable ? '✅' : '❌'} Site: ${siteAvailable ? 'Erişilebilir' : 'Erişilemiyor'}\n`);

  if (!siteAvailable) {
    console.log('❌ Site erişilemiyor, testler durduruluyor.\n');
    return results;
  }

  // 2. Endpoint testleri
  console.log('🔌 2. API Endpoint Testleri...');
  for (const endpoint of testEndpoints) {
    const result = await testEndpoint(endpoint.name, endpoint.path, endpoint.expectedStatus);
    results.tests.push(result);
    results.summary.total++;
    if (result.success) {
      results.summary.passed++;
      console.log(`   ✅ ${result.name} (${result.status})`);
    } else {
      results.summary.failed++;
      console.log(`   ❌ ${result.name} (${result.status || result.error})`);
    }
    
    // Kısa bir bekleme
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  console.log('');

  // 3. Authentication test endpoint detaylı analiz
  console.log('🔐 3. Authentication Detaylı Analiz...');
  try {
    const authTest = await makeRequest(`${SITE_URL}/api/test-auth`, { timeout: 5000 });
    if (authTest.status === 200 && authTest.data) {
      const data = authTest.data;
      
      console.log('   Environment Variables:');
      console.log(`      NEXTAUTH_URL: ${data.environment?.NEXTAUTH_URL || 'N/A'}`);
      console.log(`      GOOGLE_CLIENT_ID: ${data.environment?.GOOGLE_CLIENT_ID || 'N/A'}`);
      console.log(`      GOOGLE_CLIENT_SECRET: ${data.environment?.GOOGLE_CLIENT_SECRET || 'N/A'}`);
      console.log(`      AUTH_SECRET: ${data.environment?.AUTH_SECRET || 'N/A'}`);
      
      console.log('   D1 Database:');
      console.log(`      Available: ${data.d1Database?.available ? '✅' : '❌'}`);
      console.log(`      Binding: ${data.d1Database?.binding || 'N/A'}`);
      console.log(`      Test Query: ${data.d1Database?.testQuery || 'N/A'}`);
      if (data.d1Database?.error) {
        console.log(`      Error: ${data.d1Database.error}`);
      }
      
      results.tests.push({
        name: 'Authentication Detaylı Analiz',
        success: true,
        data: data,
      });
    }
  } catch (error) {
    console.log(`   ❌ Authentication test hatası: ${error.message}`);
    results.tests.push({
      name: 'Authentication Detaylı Analiz',
      success: false,
      error: error.message,
    });
  }
  console.log('');

  // 4. NextAuth providers kontrolü
  console.log('🔑 4. NextAuth Providers Kontrolü...');
  try {
    const providers = await makeRequest(`${SITE_URL}/api/auth/providers`, { timeout: 5000 });
    if (providers.status === 200 && providers.data) {
      const providerList = Object.keys(providers.data || {});
      console.log(`   ✅ Providers: ${providerList.join(', ') || 'None'}`);
      results.tests.push({
        name: 'NextAuth Providers',
        success: true,
        providers: providerList,
      });
    }
  } catch (error) {
    console.log(`   ❌ Providers kontrolü hatası: ${error.message}`);
    results.tests.push({
      name: 'NextAuth Providers',
      success: false,
      error: error.message,
    });
  }
  console.log('');

  return results;
}

// Deploy bekleme ve test
async function waitAndTest() {
  const startTime = Date.now();
  let lastStatus = null;

  console.log('⏳ Deploy durumu kontrol ediliyor...\n');

  while (Date.now() - startTime < MAX_WAIT_TIME) {
    // GitHub Actions kontrolü
    const ghStatus = await checkGitHubActions();
    if (ghStatus) {
      const statusStr = `${ghStatus.status} (${ghStatus.conclusion || 'N/A'})`;
      if (statusStr !== lastStatus) {
        console.log(`📊 GitHub Actions: ${ghStatus.name} - ${statusStr}`);
        if (ghStatus.url) {
          console.log(`   🔗 ${ghStatus.url}\n`);
        }
        lastStatus = statusStr;
      }

      // Deploy tamamlandı mı?
      if (ghStatus.status === 'completed' && ghStatus.conclusion === 'success') {
        console.log('✅ GitHub Actions deploy tamamlandı!\n');
        
        // Biraz bekle (Cloudflare Pages'in deploy'u tamamlaması için)
        console.log('⏳ Cloudflare Pages deploy bekleniyor (30 saniye)...\n');
        await new Promise(resolve => setTimeout(resolve, 30000));
        
        // Site erişilebilir mi kontrol et
        let retries = 0;
        while (retries < 10) {
          const available = await checkSiteAvailability();
          if (available) {
            console.log('✅ Site erişilebilir, testler başlatılıyor...\n');
            break;
          }
          retries++;
          console.log(`⏳ Site henüz hazır değil, tekrar deneniyor (${retries}/10)...`);
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
        
        // Tam test çalıştır
        const testResults = await runFullTest();
        
        // Sonuçları göster
        console.log('\n📊 Test Sonuçları Özeti:');
        console.log(`   Toplam: ${testResults.summary.total}`);
        console.log(`   ✅ Başarılı: ${testResults.summary.passed}`);
        console.log(`   ❌ Başarısız: ${testResults.summary.failed}`);
        console.log(`   Başarı Oranı: ${((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1)}%\n`);
        
        // Detaylı sonuçları JSON olarak kaydet
        const fs = require('fs');
        fs.writeFileSync('test-results.json', JSON.stringify(testResults, null, 2));
        console.log('📄 Detaylı sonuçlar test-results.json dosyasına kaydedildi.\n');
        
        return testResults;
      } else if (ghStatus.status === 'completed' && ghStatus.conclusion !== 'success') {
        console.log(`❌ GitHub Actions deploy başarısız: ${ghStatus.conclusion}\n`);
        return null;
      }
    } else {
      // GitHub CLI yoksa direkt site kontrolü yap
      const available = await checkSiteAvailability();
      if (available) {
        console.log('✅ Site erişilebilir, testler başlatılıyor...\n');
        const testResults = await runFullTest();
        
        console.log('\n📊 Test Sonuçları Özeti:');
        console.log(`   Toplam: ${testResults.summary.total}`);
        console.log(`   ✅ Başarılı: ${testResults.summary.passed}`);
        console.log(`   ❌ Başarısız: ${testResults.summary.failed}\n`);
        
        return testResults;
      }
    }

    // Bekle ve tekrar kontrol et
    await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
  }

  console.log('⏱️  Maksimum bekleme süresi doldu, testler başlatılıyor...\n');
  const testResults = await runFullTest();
  return testResults;
}

// Ana fonksiyon
async function main() {
  try {
    const results = await waitAndTest();
    if (results) {
      process.exit(results.summary.failed === 0 ? 0 : 1);
    } else {
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Hata:', error.message);
    process.exit(1);
  }
}

main();

