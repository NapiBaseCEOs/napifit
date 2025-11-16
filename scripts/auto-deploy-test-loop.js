/**
 * Otomatik Deploy Bekleme, Kontrol ve Test Döngüsü
 * Deploy'u bekler, test eder, çalışmıyorsa tekrar eder
 */

const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');

const SITE_URL = 'https://napibase.com';
const GITHUB_REPO = 'NapiBaseCEOs/napifit';
const MAX_WAIT_TIME = 15 * 60 * 1000; // 15 dakika
const CHECK_INTERVAL = 30 * 1000; // 30 saniye
const MAX_RETRIES = 5; // Maksimum 5 kez tekrar dene
const MIN_SUCCESS_RATE = 0.95; // %95 başarı oranı minimum

let attemptCount = 0;
let lastDeploymentId = null;

console.log('🚀 Otomatik Deploy Test Döngüsü Başlatılıyor...\n');

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

// GitHub Actions durumunu kontrol et
async function checkGitHubActions() {
  try {
    const output = execSync(`gh run list --limit 1 --json status,conclusion,name,createdAt,url,id --repo ${GITHUB_REPO}`, {
      encoding: 'utf-8',
      stdio: 'pipe',
    });
    const runs = JSON.parse(output);
    if (runs.length > 0) {
      const run = runs[0];
      return {
        id: run.id,
        status: run.status,
        conclusion: run.conclusion,
        name: run.name,
        createdAt: run.createdAt,
        url: run.url,
      };
    }
  } catch (error) {
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

// Kritik endpoint testleri
const criticalEndpoints = [
  { name: 'Ana Sayfa', path: '/', expectedStatus: 200 },
  { name: 'Login', path: '/login', expectedStatus: 200 },
  { name: 'Register', path: '/register', expectedStatus: 200 },
  { name: 'Config API', path: '/api/config', expectedStatus: 200 },
  { name: 'Test Auth API', path: '/api/test-auth', expectedStatus: 200 },
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
      warnings: 0,
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

  // 2. Kritik endpoint testleri
  console.log('🔌 2. Kritik Endpoint Testleri...');
  for (const endpoint of criticalEndpoints) {
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
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  console.log('');

  // 3. Authentication detaylı test
  console.log('🔐 3. Authentication Detaylı Test...');
  try {
    const authTest = await makeRequest(`${SITE_URL}/api/test-auth`, { timeout: 5000 });
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
    }
  } catch (error) {
    console.log(`   ❌ Authentication test hatası: ${error.message}`);
    results.tests.push({ name: 'Authentication Test', success: false, error: error.message });
    results.summary.total++;
    results.summary.failed++;
  }
  console.log('');

  // 4. NextAuth Providers test
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

  return results;
}

// Test sonuçlarını değerlendir
function evaluateTestResults(results) {
  if (results.summary.total === 0) {
    return { success: false, reason: 'No tests run' };
  }

  const successRate = results.summary.passed / results.summary.total;
  const criticalFailures = results.tests.filter(t => 
    !t.success && 
    (t.name.includes('Site Erişilebilirlik') || 
     t.name.includes('Config API') || 
     t.name.includes('NextAuth Providers'))
  );

  if (criticalFailures.length > 0) {
    return { 
      success: false, 
      reason: `Critical failures: ${criticalFailures.map(f => f.name).join(', ')}`,
      criticalFailures: criticalFailures.map(f => f.name),
    };
  }

  if (successRate < MIN_SUCCESS_RATE) {
    return { 
      success: false, 
      reason: `Success rate ${(successRate * 100).toFixed(1)}% is below minimum ${(MIN_SUCCESS_RATE * 100)}%`,
      successRate,
    };
  }

  return { success: true, successRate };
}

// Deploy bekleme ve test döngüsü
async function waitAndTestLoop() {
  attemptCount++;
  console.log(`\n🔄 Deneme #${attemptCount}/${MAX_RETRIES}\n`);
  console.log('⏳ Deploy durumu kontrol ediliyor...\n');

  const startTime = Date.now();
  let lastStatus = null;
  let deploymentCompleted = false;

  // Deploy'u bekle
  while (Date.now() - startTime < MAX_WAIT_TIME && !deploymentCompleted) {
    const ghStatus = await checkGitHubActions();
    
    if (ghStatus) {
      // Yeni deployment kontrolü
      if (lastDeploymentId === null || ghStatus.id !== lastDeploymentId) {
        lastDeploymentId = ghStatus.id;
        console.log(`📊 Yeni Deployment Tespit Edildi: ${ghStatus.id}`);
        console.log(`   Workflow: ${ghStatus.name}`);
        console.log(`   Durum: ${ghStatus.status} (${ghStatus.conclusion || 'N/A'})`);
        if (ghStatus.url) {
          console.log(`   🔗 ${ghStatus.url}\n`);
        }
      }

      const statusStr = `${ghStatus.status} (${ghStatus.conclusion || 'N/A'})`;
      if (statusStr !== lastStatus) {
        console.log(`📊 GitHub Actions: ${ghStatus.name} - ${statusStr}`);
        lastStatus = statusStr;
      }

      // Deploy tamamlandı mı?
      if (ghStatus.status === 'completed') {
        if (ghStatus.conclusion === 'success') {
          console.log('✅ GitHub Actions deploy tamamlandı!\n');
          deploymentCompleted = true;
        } else {
          console.log(`❌ GitHub Actions deploy başarısız: ${ghStatus.conclusion}\n`);
          if (attemptCount < MAX_RETRIES) {
            console.log(`⏳ Yeni deploy bekleniyor... (${attemptCount + 1}/${MAX_RETRIES})\n`);
            await new Promise(resolve => setTimeout(resolve, 60000)); // 1 dakika bekle
            return waitAndTestLoop(); // Tekrar dene
          } else {
            throw new Error(`Deploy başarısız: ${ghStatus.conclusion}`);
          }
        }
      }
    } else {
      // GitHub CLI yoksa direkt site kontrolü yap
      const available = await checkSiteAvailability();
      if (available) {
        console.log('✅ Site erişilebilir, testler başlatılıyor...\n');
        deploymentCompleted = true;
      }
    }

    if (!deploymentCompleted) {
      await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
    }
  }

  if (!deploymentCompleted) {
    throw new Error('Deploy timeout - maksimum bekleme süresi doldu');
  }

  // Cloudflare Pages deploy'un tamamlanması için bekle
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

  // Test sonuçlarını değerlendir
  const evaluation = evaluateTestResults(testResults);

  // Sonuçları göster
  console.log('\n📊 Test Sonuçları Özeti:');
  console.log(`   Toplam: ${testResults.summary.total}`);
  console.log(`   ✅ Başarılı: ${testResults.summary.passed}`);
  console.log(`   ❌ Başarısız: ${testResults.summary.failed}`);
  console.log(`   ⚠️  Uyarılar: ${testResults.summary.warnings}`);
  console.log(`   Başarı Oranı: ${((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1)}%\n`);

  // Test sonuçlarını kaydet
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `test-results-${timestamp}.json`;
  fs.writeFileSync(filename, JSON.stringify(testResults, null, 2));
  console.log(`📄 Detaylı sonuçlar ${filename} dosyasına kaydedildi.\n`);

  // Başarılı mı kontrol et
  if (evaluation.success) {
    console.log('✅ Tüm testler başarılı! Deploy başarıyla tamamlandı.\n');
    return { success: true, testResults, evaluation };
  } else {
    console.log(`❌ Testler başarısız: ${evaluation.reason}\n`);
    
    if (attemptCount < MAX_RETRIES) {
      console.log(`🔄 Tekrar denenecek... (${attemptCount + 1}/${MAX_RETRIES})\n`);
      console.log('⏳ 60 saniye bekleniyor...\n');
      await new Promise(resolve => setTimeout(resolve, 60000));
      return waitAndTestLoop(); // Tekrar dene
    } else {
      console.log(`❌ Maksimum deneme sayısına ulaşıldı (${MAX_RETRIES}).\n`);
      return { success: false, testResults, evaluation, reason: 'Max retries reached' };
    }
  }
}

// Ana fonksiyon
async function main() {
  try {
    const result = await waitAndTestLoop();
    
    if (result.success) {
      console.log('🎉 Deploy ve testler başarıyla tamamlandı!\n');
      process.exit(0);
    } else {
      console.log('❌ Deploy veya testler başarısız oldu.\n');
      console.log(`Sebep: ${result.reason || result.evaluation?.reason || 'Unknown'}\n`);
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Hata:', error.message);
    console.error(error.stack);
    
    if (attemptCount < MAX_RETRIES) {
      console.log(`\n🔄 Hata nedeniyle tekrar denenecek... (${attemptCount + 1}/${MAX_RETRIES})\n`);
      await new Promise(resolve => setTimeout(resolve, 60000));
      return main(); // Tekrar dene
    } else {
      console.log(`\n❌ Maksimum deneme sayısına ulaşıldı (${MAX_RETRIES}).\n`);
      process.exit(1);
    }
  }
}

main();

