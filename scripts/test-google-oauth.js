#!/usr/bin/env node

const https = require('https');

const BASE_URL = 'https://napibase.com';

async function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const opts = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      maxRedirects: 0,
    };

    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({ 
          status: res.statusCode, 
          headers: res.headers, 
          data,
          location: res.headers.location 
        });
      });
    });

    req.on('error', reject);
    req.setMaxListeners(0);
    req.end();
  });
}

async function testGoogleOAuth() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   GOOGLE OAUTH TAM KONTROL TEST                  ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  let passed = 0;
  let failed = 0;

  // Test 1: NextAuth Providers
  console.log('[1/8] NextAuth Providers kontrolü...');
  try {
    const res = await request(`${BASE_URL}/api/auth/providers`);
    if (res.status === 200 && res.data.includes('google')) {
      console.log('  ✓ Google Provider bulundu');
      passed++;
    } else {
      console.log('  ✗ Google Provider bulunamadı');
      failed++;
    }
  } catch (err) {
    console.log('  ✗ Providers endpoint hatası:', err.message);
    failed++;
  }

  // Test 2: Auth Test Endpoint
  console.log('\n[2/8] Auth Test endpoint kontrolü...');
  try {
    const res = await request(`${BASE_URL}/api/auth/test`);
    if (res.status === 200) {
      const data = JSON.parse(res.data);
      console.log('  ✓ NEXTAUTH_URL:', data.nextAuthUrl || 'NOT_SET');
      console.log('  ✓ GOOGLE_CLIENT_ID:', data.googleClientId);
      console.log('  ✓ GOOGLE_CLIENT_SECRET:', data.googleClientSecret);
      console.log('  ✓ AUTH_SECRET:', data.authSecret);
      console.log('  ✓ Expected Callback:', data.providers?.google?.callbackUrl);
      if (data.googleClientId === 'SET (hidden)' && data.googleClientSecret === 'SET (hidden)') {
        console.log('  ✓ Tüm environment variables SET');
        passed++;
      } else {
        console.log('  ✗ Environment variables eksik');
        failed++;
      }
    } else {
      console.log('  ✗ Test endpoint hatası:', res.status);
      failed++;
    }
  } catch (err) {
    console.log('  ✗ Test endpoint erişim hatası:', err.message);
    failed++;
  }

  // Test 3: CSRF Token
  console.log('\n[3/8] CSRF Token kontrolü...');
  try {
    const res = await request(`${BASE_URL}/api/auth/csrf`);
    if (res.status === 200) {
      const data = JSON.parse(res.data);
      if (data.csrfToken && data.csrfToken.length > 10) {
        console.log('  ✓ CSRF Token alındı');
        passed++;
      } else {
        console.log('  ✗ CSRF Token geçersiz');
        failed++;
      }
    } else {
      console.log('  ✗ CSRF Token hatası:', res.status);
      failed++;
    }
  } catch (err) {
    console.log('  ✗ CSRF Token erişim hatası:', err.message);
    failed++;
  }

  // Test 4: Google OAuth Signin URL
  console.log('\n[4/8] Google OAuth Signin URL testi...');
  try {
    const callbackUrl = encodeURIComponent(`${BASE_URL}/onboarding`);
    const res = await request(`${BASE_URL}/api/auth/signin/google?callbackUrl=${callbackUrl}`);
    
    if (res.status === 302) {
      const location = res.location || '';
      if (location.includes('accounts.google.com')) {
        console.log('  ✓ Google OAuth redirect URL doğru');
        console.log('    Location:', location.substring(0, 100) + '...');
        passed++;
      } else if (location.includes('error=')) {
        const match = location.match(/error=([^&]+)/);
        console.log('  ✗ OAuth error:', match ? match[1] : 'unknown');
        console.log('    Location:', location);
        failed++;
      } else {
        console.log('  ✗ Beklenmeyen redirect:', location);
        failed++;
      }
    } else {
      console.log('  ✗ Beklenmeyen status:', res.status);
      failed++;
    }
  } catch (err) {
    if (err.message.includes('302')) {
      // 302 redirect is expected
      console.log('  ✓ Redirect (302) - Beklenen');
      passed++;
    } else {
      console.log('  ✗ Signin URL hatası:', err.message);
      failed++;
    }
  }

  // Test 5: Session Endpoint
  console.log('\n[5/8] Session endpoint kontrolü...');
  try {
    const res = await request(`${BASE_URL}/api/auth/session`);
    if (res.status === 200) {
      const data = JSON.parse(res.data);
      console.log('  ✓ Session endpoint çalışıyor');
      passed++;
    } else {
      console.log('  ✗ Session endpoint hatası:', res.status);
      failed++;
    }
  } catch (err) {
    console.log('  ✗ Session endpoint erişim hatası:', err.message);
    failed++;
  }

  // Test 6: Login Page
  console.log('\n[6/8] Login page kontrolü...');
  try {
    const res = await request(`${BASE_URL}/login`);
    if (res.status === 200 && res.data.includes('NapiFit')) {
      console.log('  ✓ Login page yükleniyor');
      passed++;
    } else {
      console.log('  ✗ Login page hatası:', res.status);
      failed++;
    }
  } catch (err) {
    console.log('  ✗ Login page erişim hatası:', err.message);
    failed++;
  }

  // Test 7: Homepage
  console.log('\n[7/8] Homepage kontrolü...');
  try {
    const res = await request(`${BASE_URL}/`);
    if (res.status === 200 && res.data.includes('NapiFit')) {
      console.log('  ✓ Homepage yükleniyor');
      passed++;
    } else {
      console.log('  ✗ Homepage hatası:', res.status);
      failed++;
    }
  } catch (err) {
    console.log('  ✗ Homepage erişim hatası:', err.message);
    failed++;
  }

  // Test 8: Error Handling
  console.log('\n[8/8] Error handling testi...');
  try {
    const res = await request(`${BASE_URL}/api/auth/signin/google?error=test`);
    if (res.status === 302 || res.status === 200) {
      console.log('  ✓ Error handling çalışıyor');
      passed++;
    } else {
      console.log('  ✗ Error handling hatası:', res.status);
      failed++;
    }
  } catch (err) {
    console.log('  ✗ Error handling erişim hatası:', err.message);
    failed++;
  }

  // Özet
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   SONUÇLAR                                        ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`✓ Passed: ${passed}`);
  console.log(`✗ Failed: ${failed}`);
  console.log(`Total: ${passed + failed}\n`);

  if (failed === 0) {
    console.log('🎉 TÜM TESTLER BAŞARILI!\n');
    process.exit(0);
  } else {
    console.log('⚠️ BAZI TESTLER BAŞARISIZ - Sorunlar var.\n');
    process.exit(1);
  }
}

testGoogleOAuth().catch(console.error);

