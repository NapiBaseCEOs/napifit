/**
 * Optimize Edilmiş Site Test Script'i
 * Hızlı ve kapsamlı testler
 */

const https = require('https');
const fs = require('fs');

const SITE_URL = 'https://napibase.com';
const TIMEOUT = 5000; // 5 saniye timeout

// Hızlı HTTP request helper
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: TIMEOUT,
    };

    const startTime = Date.now();
    const req = https.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        const duration = Date.now() - startTime;
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed, duration, headers: res.headers });
        } catch {
          resolve({ status: res.statusCode, data: body, duration, headers: res.headers });
        }
      });
    });

    req.on('error', (err) => {
      reject({ error: err.message, duration: Date.now() - startTime });
    });
    req.on('timeout', () => {
      req.destroy();
      reject({ error: 'Request timeout', duration: TIMEOUT });
    });

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runOptimizedTests() {
  console.log('🚀 Optimize Edilmiş Site Testleri Başlatılıyor...\n');
  
  const results = {
    timestamp: new Date().toISOString(),
    siteUrl: SITE_URL,
    tests: [],
    performance: { avgResponseTime: 0, slowEndpoints: [] },
    summary: { total: 0, passed: 0, failed: 0 },
  };

  const responseTimes = [];

  // 1. Temel Sayfa Testleri (Paralel)
  console.log('📄 1. Temel Sayfa Testleri (Paralel)...');
  const pages = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/register' },
    { name: 'Community', path: '/community' },
  ];

  const pagePromises = pages.map(async (page) => {
    try {
      const response = await makeRequest(`${SITE_URL}${page.path}`);
      responseTimes.push(response.duration);
      const success = response.status === 200 || response.status === 307 || response.status === 302;
      results.tests.push({ 
        name: page.name, 
        path: page.path, 
        status: response.status, 
        duration: response.duration,
        success 
      });
      results.summary.total++;
      if (success) results.summary.passed++;
      else results.summary.failed++;
      console.log(`   ${success ? '✅' : '❌'} ${page.name}: ${response.status} (${response.duration}ms)`);
      if (response.duration > 2000) {
        results.performance.slowEndpoints.push({ name: page.name, duration: response.duration });
      }
    } catch (error) {
      results.tests.push({ name: page.name, path: page.path, success: false, error: error.error || error.message });
      results.summary.total++;
      results.summary.failed++;
      console.log(`   ❌ ${page.name}: ${error.error || error.message}`);
    }
  });

  await Promise.all(pagePromises);
  console.log('');

  // 2. API Endpoint Testleri (Paralel)
  console.log('🔌 2. API Endpoint Testleri (Paralel)...');
  const apiEndpoints = [
    { name: 'Feature Requests', path: '/api/feature-requests', expectedStatus: [200, 401] },
    { name: 'Notifications', path: '/api/notifications', expectedStatus: [200, 401] },
    { name: 'Stats', path: '/api/stats', expectedStatus: [200, 401] },
    { name: 'Ping', path: '/api/ping', expectedStatus: [200] },
  ];

  const apiPromises = apiEndpoints.map(async (endpoint) => {
    try {
      const response = await makeRequest(`${SITE_URL}${endpoint.path}`);
      responseTimes.push(response.duration);
      const success = endpoint.expectedStatus.includes(response.status);
      results.tests.push({ 
        name: endpoint.name, 
        path: endpoint.path, 
        status: response.status, 
        duration: response.duration,
        success 
      });
      results.summary.total++;
      if (success) results.summary.passed++;
      else results.summary.failed++;
      console.log(`   ${success ? '✅' : '❌'} ${endpoint.name}: ${response.status} (${response.duration}ms)`);
      if (response.duration > 1500) {
        results.performance.slowEndpoints.push({ name: endpoint.name, duration: response.duration });
      }
    } catch (error) {
      results.tests.push({ name: endpoint.name, path: endpoint.path, success: false, error: error.error || error.message });
      results.summary.total++;
      results.summary.failed++;
      console.log(`   ❌ ${endpoint.name}: ${error.error || error.message}`);
    }
  });

  await Promise.all(apiPromises);
  console.log('');

  // 3. Performans Analizi
  if (responseTimes.length > 0) {
    const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    results.performance.avgResponseTime = Math.round(avgTime);
    console.log('⚡ 3. Performans Analizi...');
    console.log(`   Ortalama Yanıt Süresi: ${Math.round(avgTime)}ms`);
    console.log(`   En Hızlı: ${Math.min(...responseTimes)}ms`);
    console.log(`   En Yavaş: ${Math.max(...responseTimes)}ms`);
    
    if (results.performance.slowEndpoints.length > 0) {
      console.log(`   ⚠️  Yavaş Endpoint'ler:`);
      results.performance.slowEndpoints.forEach(ep => {
        console.log(`      - ${ep.name}: ${ep.duration}ms`);
      });
    } else {
      console.log(`   ✅ Tüm endpoint'ler hızlı (< 2s)`);
    }
    console.log('');
  }

  // 4. Özet
  console.log('📊 Test Sonuçları Özeti:');
  console.log(`   Toplam Test: ${results.summary.total}`);
  console.log(`   ✅ Başarılı: ${results.summary.passed}`);
  console.log(`   ❌ Başarısız: ${results.summary.failed}`);
  console.log(`   Başarı Oranı: ${((results.summary.passed / results.summary.total) * 100).toFixed(1)}%`);
  console.log(`   Ortalama Yanıt Süresi: ${results.performance.avgResponseTime}ms\n`);

  // Sonuçları kaydet
  fs.writeFileSync('optimized-site-test-results.json', JSON.stringify(results, null, 2));
  console.log('📄 Detaylı sonuçlar optimized-site-test-results.json dosyasına kaydedildi.\n');

  return results;
}

// Ana fonksiyon
async function main() {
  try {
    const startTime = Date.now();
    const results = await runOptimizedTests();
    const totalTime = Date.now() - startTime;
    
    console.log(`⏱️  Toplam Test Süresi: ${(totalTime / 1000).toFixed(2)}s\n`);
    
    process.exit(results.summary.failed === 0 ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Hata:', error.message);
    process.exit(1);
  }
}

main();

