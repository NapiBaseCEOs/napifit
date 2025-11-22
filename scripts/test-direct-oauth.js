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

async function testDirectOAuth() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   DIRECT GOOGLE OAUTH TEST - v0.1.32             ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  // Test 1: Direct OAuth Endpoint
  console.log('[1/3] Direct Google OAuth Endpoint (/api/auth/google-direct)...');
  try {
    const directRes = await request(`${BASE_URL}/api/auth/google-direct?callbackUrl=/onboarding`, {
      method: 'GET',
      maxRedirects: 0
    });
    
    if (directRes.status === 302 || directRes.status === 307) {
      const location = directRes.headers.location || '';
      console.log(`  ✓ Redirect (${directRes.status}) detected`);
      console.log(`  ✓ Location: ${location.substring(0, 100)}...`);
      
      if (location.includes('accounts.google.com/o/oauth2/v2/auth')) {
        console.log(`  ✅ SUCCESS: Google OAuth URL oluşturuldu!`);
        console.log(`  ✅ Hesap seçme ekranına yönlendirilecek`);
        
        // URL parametrelerini kontrol et
        try {
          const urlObj = new URL(location);
          const clientId = urlObj.searchParams.get('client_id');
          const redirectUri = urlObj.searchParams.get('redirect_uri');
          const state = urlObj.searchParams.get('state');
          
          console.log(`  ✓ Client ID: ${clientId ? clientId.substring(0, 15) + "..." : "MISSING"}`);
          console.log(`  ✓ Redirect URI: ${redirectUri}`);
          console.log(`  ✓ State: ${state ? state.substring(0, 30) + "..." : "MISSING"}`);
          
          if (redirectUri === 'https://napibase.com/api/auth/callback/google') {
            console.log(`  ✅ Redirect URI doğru!`);
          } else {
            console.log(`  ⚠️ Redirect URI farklı: ${redirectUri}`);
          }
        } catch (err) {
          console.log(`  ⚠️ URL parse error: ${err.message}`);
        }
      } else if (location.includes('error=')) {
        const errorMatch = location.match(/error=([^&]+)/);
        const error = errorMatch ? errorMatch[1] : 'unknown';
        console.log(`  ❌ ERROR: ${error}`);
      } else {
        console.log(`  ⚠️ Unexpected redirect location`);
      }
    } else {
      console.log(`  ⚠️ Status: ${directRes.status} (expected 302)`);
      if (directRes.json) {
        console.log(`  Response:`, directRes.json);
      }
    }
  } catch (err) {
    // 302 redirect throws error in Node.js
    if (err.message.includes('302') || err.message.includes('redirect')) {
      console.log(`  ✓ Redirect detected (this is expected)`);
    } else {
      console.log(`  ✗ Error: ${err.message}`);
    }
  }

  // Test 2: Environment Variables
  console.log('\n[2/3] Environment Variables...');
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

  // Test 3: NextAuth Providers
  console.log('\n[3/3] NextAuth Providers...');
  try {
    const providersRes = await request(`${BASE_URL}/api/auth/providers`);
    if (providersRes.status === 200 && providersRes.json?.google) {
      const google = providersRes.json.google;
      console.log(`  ✓ Google Provider: ${google.name}`);
      console.log(`  ✓ Callback: ${google.callbackUrl}`);
    }
  } catch (err) {
    console.log(`  ✗ Error: ${err.message}`);
  }

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   TEST TAMAMLANDI                                ║');
  console.log('╚══════════════════════════════════════════════════╝\n');
  
  console.log('📋 Sonuçlar:');
  console.log('  - Eğer "Google OAuth URL oluşturuldu!" mesajı görüyorsanız → ✅ ÇALIŞIYOR');
  console.log('  - Şimdi https://napibase.com/login adresinden Google butonuna basmayı deneyin');
  console.log('  - Google hesap seçme ekranı açılmalı\n');
}

testDirectOAuth().catch(console.error);

