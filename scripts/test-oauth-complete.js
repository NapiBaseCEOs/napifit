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
      ...options
    };

    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, headers: res.headers, data, json });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, data });
        }
      });
    });

    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function testGoogleOAuth() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   GOOGLE OAUTH TAM TEST - v0.1.30                ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  // Test 1: Google Check Endpoint
  console.log('[1/6] Google OAuth Check Endpoint...');
  try {
    const checkRes = await request(`${BASE_URL}/api/auth/google-check`);
    if (checkRes.status === 200 && checkRes.json) {
      const info = checkRes.json;
      console.log(`  ✓ Status: ${checkRes.status}`);
      console.log(`  ✓ Has Google Provider: ${info.hasGoogleProvider}`);
      console.log(`  ✓ Client ID: ${info.clientId}`);
      console.log(`  ✓ Client Secret: ${info.clientSecret}`);
      console.log(`  ✓ NEXTAUTH_URL: ${info.nextAuthUrl}`);
      console.log(`  ✓ Callback URL: ${info.callbackUrl}`);
      
      if (info.testSigninEndpoint) {
        console.log(`  ✓ Signin Endpoint Test:`);
        console.log(`    Status: ${info.testSigninEndpoint.status}`);
        console.log(`    Has Redirect: ${info.testSigninEndpoint.hasRedirect}`);
        if (info.testSigninEndpoint.location) {
          console.log(`    Location: ${info.testSigninEndpoint.location.substring(0, 80)}...`);
          if (info.testSigninEndpoint.location.includes('accounts.google.com')) {
            console.log(`    ✅ Google OAuth URL oluşturuldu!`);
          } else if (info.testSigninEndpoint.location.includes('error=')) {
            console.log(`    ❌ Hata: ${info.testSigninEndpoint.location}`);
          }
        }
      }
    } else {
      console.log(`  ✗ Failed: Status ${checkRes.status}`);
    }
  } catch (err) {
    console.log(`  ✗ Error: ${err.message}`);
  }

  // Test 2: Providers Endpoint
  console.log('\n[2/6] NextAuth Providers...');
  try {
    const providersRes = await request(`${BASE_URL}/api/auth/providers`);
    if (providersRes.status === 200 && providersRes.json?.google) {
      const google = providersRes.json.google;
      console.log(`  ✓ Google Provider: ${google.name}`);
      console.log(`  ✓ Callback: ${google.callbackUrl}`);
      console.log(`  ✓ Signin URL: ${google.signinUrl || 'N/A'}`);
    } else {
      console.log(`  ✗ Google provider not found`);
    }
  } catch (err) {
    console.log(`  ✗ Error: ${err.message}`);
  }

  // Test 3: Test Endpoint
  console.log('\n[3/6] Auth Test Endpoint...');
  try {
    const testRes = await request(`${BASE_URL}/api/auth/test`);
    if (testRes.status === 200 && testRes.json) {
      const info = testRes.json;
      console.log(`  ✓ NEXTAUTH_URL: ${info.nextAuthUrl}`);
      console.log(`  ✓ Google Client ID: ${info.googleClientId}`);
      console.log(`  ✓ Google Client Secret: ${info.googleClientSecret}`);
      console.log(`  ✓ Expected Callback: ${info.expectedCallbackUrl}`);
    }
  } catch (err) {
    console.log(`  ✗ Error: ${err.message}`);
  }

  // Test 4: Signin Endpoint (Redirect Test)
  console.log('\n[4/6] Google Signin Endpoint (Redirect Test)...');
  try {
    const signinRes = await request(`${BASE_URL}/api/auth/signin/google?callbackUrl=/onboarding`, {
      method: 'GET',
      maxRedirects: 0
    });
    
    // 302 is expected for redirect
    if (signinRes.status === 302) {
      const location = signinRes.headers.location || '';
      console.log(`  ✓ Redirect (302) detected`);
      console.log(`  ✓ Location: ${location.substring(0, 100)}...`);
      
      if (location.includes('accounts.google.com')) {
        console.log(`  ✅ SUCCESS: Google OAuth URL oluşturuldu!`);
        console.log(`  ✅ Hesap seçme ekranına yönlendirilecek`);
      } else if (location.includes('error=')) {
        const errorMatch = location.match(/error=([^&]+)/);
        const error = errorMatch ? errorMatch[1] : 'unknown';
        console.log(`  ❌ ERROR: ${error}`);
      } else {
        console.log(`  ⚠️ Unexpected redirect location`);
      }
    } else {
      console.log(`  ⚠️ Status: ${signinRes.status} (expected 302)`);
    }
  } catch (err) {
    // 302 redirect throws error in Node.js
    if (err.message.includes('302') || err.message.includes('redirect')) {
      console.log(`  ✓ Redirect detected (this is expected)`);
    } else {
      console.log(`  ✗ Error: ${err.message}`);
    }
  }

  // Test 5: CSRF Token
  console.log('\n[5/6] CSRF Token...');
  try {
    const csrfRes = await request(`${BASE_URL}/api/auth/csrf`);
    if (csrfRes.status === 200 && csrfRes.json?.csrfToken) {
      console.log(`  ✓ CSRF Token: ${csrfRes.json.csrfToken.substring(0, 20)}...`);
    }
  } catch (err) {
    console.log(`  ✗ Error: ${err.message}`);
  }

  // Test 6: Session
  console.log('\n[6/6] Session...');
  try {
    const sessionRes = await request(`${BASE_URL}/api/auth/session`);
    if (sessionRes.status === 200) {
      if (sessionRes.json?.user) {
        console.log(`  ✓ Active session: ${sessionRes.json.user.email}`);
      } else {
        console.log(`  ✓ No active session (correct for test)`);
      }
    }
  } catch (err) {
    console.log(`  ✗ Error: ${err.message}`);
  }

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   TEST TAMAMLANDI                                ║');
  console.log('╚══════════════════════════════════════════════════╝\n');
  
  console.log('📋 Sonuçlar:');
  console.log('  - Eğer "Google OAuth URL oluşturuldu!" mesajı görüyorsanız → ✅ ÇALIŞIYOR');
  console.log('  - Eğer "ERROR:" mesajı görüyorsanız → ❌ Google Console ayarlarını kontrol edin');
  console.log('\n💡 Google Console kontrolü:');
  console.log('  1. https://console.cloud.google.com/apis/credentials');
  console.log('  2. Authorized redirect URIs: https://napibase.com/api/auth/callback/google');
  console.log('  3. OAuth consent screen test users ekleyin (testing modundaysa)\n');
}

testGoogleOAuth().catch(console.error);

