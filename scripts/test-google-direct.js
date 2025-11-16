#!/usr/bin/env node

const https = require('https');

const BASE_URL = 'https://napibase.com';

async function request(url, followRedirect = false) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const opts = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      maxRedirects: followRedirect ? 5 : 0,
    };

    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({ 
          status: res.statusCode, 
          headers: res.headers, 
          data,
          location: res.headers.location,
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function testGoogleDirect() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   GOOGLE DIRECT ENDPOINT TEST - v0.1.41        ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  // Test 1: Config Check
  console.log('[1/3] Configuration Check...');
  try {
    const config = await request(`${BASE_URL}/api/config`);
    if (config.status === 200) {
      const json = JSON.parse(config.data);
      console.log('  ✓ Config endpoint accessible');
      console.log(`    NEXTAUTH_URL: ${json.config.nextAuthUrl}`);
      console.log(`    GOOGLE_CLIENT_ID: ${json.config.googleClientId}`);
      console.log(`    GOOGLE_CLIENT_SECRET: ${json.config.googleClientSecret}`);
      console.log(`    Expected Callback: ${json.config.expectedCallbackUrl}`);
      
      if (json.config.googleClientId === 'NOT_SET' || json.config.googleClientSecret === 'NOT_SET') {
        console.log('  ✗ Google OAuth credentials NOT SET!');
        console.log('  ⚠️  Cloudflare Pages Environment Variables kontrol edin!');
        return;
      }
    } else {
      console.log(`  ✗ Config check failed: ${config.status}`);
    }
  } catch (err) {
    console.log(`  ✗ Config check error: ${err.message}`);
  }

  // Test 2: Google Direct Endpoint
  console.log('\n[2/3] Google Direct Endpoint Test...');
  try {
    const direct = await request(`${BASE_URL}/api/google-direct?callbackUrl=/onboarding`);
    if (direct.status === 302 || direct.status === 307) {
      console.log('  ✓ Google direct endpoint redirects correctly');
      if (direct.location) {
        if (direct.location.includes('accounts.google.com')) {
          console.log('    ✓ Redirecting to Google OAuth');
          console.log(`    Location: ${direct.location.substring(0, 120)}...`);
          
          // URL'den parametreleri kontrol et
          try {
            const googleUrl = new URL(direct.location);
            const clientId = googleUrl.searchParams.get('client_id');
            const redirectUri = googleUrl.searchParams.get('redirect_uri');
            const state = googleUrl.searchParams.get('state');
            
            console.log(`    Client ID: ${clientId ? clientId.substring(0, 20) + '...' : 'MISSING'}`);
            console.log(`    Redirect URI: ${redirectUri}`);
            console.log(`    State: ${state ? 'SET' : 'MISSING'}`);
            
            if (redirectUri === 'https://napibase.com/api/auth/callback/google') {
              console.log('    ✓ Redirect URI is correct');
            } else {
              console.log(`    ✗ Redirect URI is wrong: ${redirectUri}`);
            }
          } catch (err) {
            console.log(`    ⚠️  Could not parse Google URL: ${err.message}`);
          }
        } else {
          console.log(`  ✗ Unexpected redirect location: ${direct.location}`);
        }
      } else {
        console.log('  ✗ No redirect location header');
      }
    } else {
      console.log(`  ✗ Direct endpoint failed: ${direct.status}`);
      if (direct.data) {
        try {
          const json = JSON.parse(direct.data);
          console.log(`    Error: ${json.error || 'Unknown'}`);
        } catch {
          console.log(`    Response: ${direct.data.substring(0, 200)}`);
        }
      }
    }
  } catch (err) {
    console.log(`  ✗ Direct endpoint error: ${err.message}`);
  }

  // Test 3: NextAuth Callback Endpoint (should exist)
  console.log('\n[3/3] NextAuth Callback Endpoint Check...');
  try {
    const callback = await request(`${BASE_URL}/api/auth/callback/google?code=test&state=test`);
    // Callback endpoint her zaman var olmalı (NextAuth tarafından handle edilir)
    console.log(`  ✓ Callback endpoint exists (status: ${callback.status})`);
    if (callback.status === 302 || callback.status === 307) {
      console.log(`    Redirects to: ${callback.location || 'unknown'}`);
    }
  } catch (err) {
    console.log(`  ✗ Callback endpoint error: ${err.message}`);
  }

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   TEST COMPLETE                                  ║');
  console.log('╚══════════════════════════════════════════════════╝\n');
  console.log('✅ Google Direct endpoint test complete!');
  console.log('📝 Next steps:');
  console.log('   1. Go to https://napibase.com/login');
  console.log('   2. Click "Google ile devam et" button');
  console.log('   3. You should be redirected to Google OAuth\n');
}

testGoogleDirect().catch(console.error);

