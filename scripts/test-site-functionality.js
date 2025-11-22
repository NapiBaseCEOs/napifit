/**
 * Site Fonksiyonellik Test Script'i
 * Google OAuth ve Kayıt butonlarını test eder
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

async function testSiteFunctionality() {
  console.log('🧪 Site Fonksiyonellik Testi Başlatılıyor...\n');

  const results = {
    timestamp: new Date().toISOString(),
    siteUrl: SITE_URL,
    tests: [],
    summary: { total: 0, passed: 0, failed: 0 },
  };

  // 1. Ana sayfa kontrolü
  console.log('📄 1. Ana Sayfa Kontrolü...');
  try {
    const response = await makeRequest(SITE_URL);
    const hasGoogleButton = response.data.includes('Google ile') || 
                           response.data.includes('google') ||
                           response.data.includes('GoogleIcon');
    const hasRegisterButton = response.data.includes('Kayıt') || 
                             response.data.includes('register') ||
                             response.data.includes('Hemen Başla');
    
    results.tests.push({ 
      name: 'Ana Sayfa - Google Butonu', 
      success: hasGoogleButton,
      found: hasGoogleButton 
    });
    results.tests.push({ 
      name: 'Ana Sayfa - Kayıt Butonu', 
      success: hasRegisterButton,
      found: hasRegisterButton 
    });
    results.summary.total += 2;
    if (hasGoogleButton) results.summary.passed++; else results.summary.failed++;
    if (hasRegisterButton) results.summary.passed++; else results.summary.failed++;
    
    console.log(`   ${hasGoogleButton ? '✅' : '❌'} Google Butonu: ${hasGoogleButton ? 'Bulundu' : 'Bulunamadı'}`);
    console.log(`   ${hasRegisterButton ? '✅' : '❌'} Kayıt Butonu: ${hasRegisterButton ? 'Bulundu' : 'Bulunamadı'}\n`);
  } catch (error) {
    console.log(`   ❌ Ana sayfa hatası: ${error.message}\n`);
    results.tests.push({ name: 'Ana Sayfa', success: false, error: error.message });
    results.summary.total++;
    results.summary.failed++;
  }

  // 2. Login sayfası kontrolü
  console.log('🔐 2. Login Sayfası Kontrolü...');
  try {
    const response = await makeRequest(`${SITE_URL}/login`);
    const hasGoogleButton = response.data.includes('Google ile') || 
                           response.data.includes('google') ||
                           response.data.includes('GoogleIcon') ||
                           response.data.includes('Google ile devam et');
    const hasLoginForm = response.data.includes('email') && 
                        response.data.includes('password') &&
                        response.data.includes('Giriş Yap');
    
    results.tests.push({ 
      name: 'Login - Google Butonu', 
      success: hasGoogleButton,
      found: hasGoogleButton 
    });
    results.tests.push({ 
      name: 'Login - Form', 
      success: hasLoginForm,
      found: hasLoginForm 
    });
    results.summary.total += 2;
    if (hasGoogleButton) results.summary.passed++; else results.summary.failed++;
    if (hasLoginForm) results.summary.passed++; else results.summary.failed++;
    
    console.log(`   ${hasGoogleButton ? '✅' : '❌'} Google Butonu: ${hasGoogleButton ? 'Bulundu' : 'Bulunamadı'}`);
    console.log(`   ${hasLoginForm ? '✅' : '❌'} Login Formu: ${hasLoginForm ? 'Bulundu' : 'Bulunamadı'}\n`);
  } catch (error) {
    console.log(`   ❌ Login sayfası hatası: ${error.message}\n`);
    results.tests.push({ name: 'Login Sayfası', success: false, error: error.message });
    results.summary.total++;
    results.summary.failed++;
  }

  // 3. Register sayfası kontrolü
  console.log('📝 3. Register Sayfası Kontrolü...');
  try {
    const response = await makeRequest(`${SITE_URL}/register`);
    const hasGoogleButton = response.data.includes('Google ile') || 
                           response.data.includes('google') ||
                           response.data.includes('GoogleIcon') ||
                           response.data.includes('Google ile devam et');
    const hasRegisterForm = response.data.includes('email') && 
                           response.data.includes('password') &&
                           (response.data.includes('Kayıt Ol') || response.data.includes('Hesap Oluştur'));
    
    results.tests.push({ 
      name: 'Register - Google Butonu', 
      success: hasGoogleButton,
      found: hasGoogleButton 
    });
    results.tests.push({ 
      name: 'Register - Form', 
      success: hasRegisterForm,
      found: hasRegisterForm 
    });
    results.summary.total += 2;
    if (hasGoogleButton) results.summary.passed++; else results.summary.failed++;
    if (hasRegisterForm) results.summary.passed++; else results.summary.failed++;
    
    console.log(`   ${hasGoogleButton ? '✅' : '❌'} Google Butonu: ${hasGoogleButton ? 'Bulundu' : 'Bulunamadı'}`);
    console.log(`   ${hasRegisterForm ? '✅' : '❌'} Register Formu: ${hasRegisterForm ? 'Bulundu' : 'Bulunamadı'}\n`);
  } catch (error) {
    console.log(`   ❌ Register sayfası hatası: ${error.message}\n`);
    results.tests.push({ name: 'Register Sayfası', success: false, error: error.message });
    results.summary.total++;
    results.summary.failed++;
  }

  // 4. Google OAuth endpoint kontrolü
  console.log('🔗 4. Google OAuth Endpoint Kontrolü...');
  try {
    const response = await makeRequest(`${SITE_URL}/api/auth/signin/google`, { 
      method: 'GET',
      timeout: 5000 
    });
    // 302 redirect bekleniyor (Google'a yönlendirme)
    const isRedirect = response.status === 302 || response.status === 307 || 
                      response.headers.location?.includes('google.com') ||
                      response.headers.location?.includes('accounts.google.com');
    
    results.tests.push({ 
      name: 'Google OAuth Endpoint', 
      success: isRedirect,
      status: response.status,
      location: response.headers.location 
    });
    results.summary.total++;
    if (isRedirect) results.summary.passed++; else results.summary.failed++;
    
    console.log(`   ${isRedirect ? '✅' : '❌'} Google OAuth: ${isRedirect ? 'Çalışıyor' : 'Çalışmıyor'}`);
    if (response.headers.location) {
      console.log(`      Redirect: ${response.headers.location}`);
    }
    console.log(`      Status: ${response.status}\n`);
  } catch (error) {
    console.log(`   ❌ Google OAuth endpoint hatası: ${error.message}\n`);
    results.tests.push({ name: 'Google OAuth Endpoint', success: false, error: error.message });
    results.summary.total++;
    results.summary.failed++;
  }

  // 5. NextAuth providers kontrolü
  console.log('🔑 5. NextAuth Providers Kontrolü...');
  try {
    const response = await makeRequest(`${SITE_URL}/api/auth/providers`);
    const providers = JSON.parse(response.data);
    const hasGoogle = providers.google !== undefined;
    const hasCredentials = providers.credentials !== undefined;
    
    results.tests.push({ 
      name: 'NextAuth - Google Provider', 
      success: hasGoogle 
    });
    results.tests.push({ 
      name: 'NextAuth - Credentials Provider', 
      success: hasCredentials 
    });
    results.summary.total += 2;
    if (hasGoogle) results.summary.passed++; else results.summary.failed++;
    if (hasCredentials) results.summary.passed++; else results.summary.failed++;
    
    console.log(`   ${hasGoogle ? '✅' : '❌'} Google Provider: ${hasGoogle ? 'Aktif' : 'Pasif'}`);
    console.log(`   ${hasCredentials ? '✅' : '❌'} Credentials Provider: ${hasCredentials ? 'Aktif' : 'Pasif'}\n`);
  } catch (error) {
    console.log(`   ❌ Providers kontrolü hatası: ${error.message}\n`);
    results.tests.push({ name: 'NextAuth Providers', success: false, error: error.message });
    results.summary.total++;
    results.summary.failed++;
  }

  // 6. Register API endpoint kontrolü
  console.log('📝 6. Register API Endpoint Kontrolü...');
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
    
    // 400 (validation error) veya 201 (success) bekleniyor, 500 (server error) değil
    const isWorking = response.status !== 500 && response.status !== 503;
    
    results.tests.push({ 
      name: 'Register API Endpoint', 
      success: isWorking,
      status: response.status 
    });
    results.summary.total++;
    if (isWorking) results.summary.passed++; else results.summary.failed++;
    
    console.log(`   ${isWorking ? '✅' : '❌'} Register API: ${isWorking ? 'Çalışıyor' : 'Çalışmıyor'}`);
    console.log(`      Status: ${response.status}\n`);
  } catch (error) {
    console.log(`   ❌ Register API hatası: ${error.message}\n`);
    results.tests.push({ name: 'Register API', success: false, error: error.message });
    results.summary.total++;
    results.summary.failed++;
  }

  return results;
}

// Ana fonksiyon
async function main() {
  try {
    const results = await testSiteFunctionality();
    
    console.log('\n📊 Test Sonuçları Özeti:');
    console.log(`   Toplam: ${results.summary.total}`);
    console.log(`   ✅ Başarılı: ${results.summary.passed}`);
    console.log(`   ❌ Başarısız: ${results.summary.failed}`);
    console.log(`   Başarı Oranı: ${((results.summary.passed / results.summary.total) * 100).toFixed(1)}%\n`);

    // Sonuçları kaydet
    const fs = require('fs');
    fs.writeFileSync('site-functionality-test-results.json', JSON.stringify(results, null, 2));
    console.log('📄 Detaylı sonuçlar site-functionality-test-results.json dosyasına kaydedildi.\n');

    // Başarısız testler varsa uyarı ver
    if (results.summary.failed > 0) {
      console.log('⚠️  Bazı testler başarısız oldu. Veritabanı geçişi gerekebilir.\n');
      process.exit(1);
    } else {
      console.log('✅ Tüm testler başarılı!\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ Hata:', error.message);
    process.exit(1);
  }
}

main();

