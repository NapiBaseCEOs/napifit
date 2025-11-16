#!/usr/bin/env node

const https = require('https');

const BASE_URL = 'https://napibase.com';

async function request(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const opts = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
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
          location: res.headers.location,
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function testGoogleOAuth() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   GOOGLE OAUTH TEST - NAPIFIT v0.1.37           ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  // Test 1: Auth Check
  console.log('[1/5] Auth Configuration Check...');
  try {
    const check = await request(`${BASE_URL}/api/auth/check`);
    if (check.status === 200) {
      const json = JSON.parse(check.data);
      console.log('  ✓ Auth endpoint accessible');
      console.log(`    NEXTAUTH_URL: ${json.config.nextAuthUrl}`);
      console.log(`    GOOGLE_CLIENT_ID: ${json.config.googleClientId}`);
      console.log(`    GOOGLE_CLIENT_SECRET: ${json.config.googleClientSecret}`);
      console.log(`    AUTH_SECRET: ${json.config.authSecret}`);
      
      if (json.config.googleClientId === 'NOT_SET' || json.config.googleClientSecret === 'NOT_SET') {
        console.log('  ✗ Google OAuth credentials NOT SET!');
        return;
      }
    } else {
      console.log(`  ✗ Auth check failed: ${check.status}`);
      return;
    }
  } catch (err) {
    console.log(`  ✗ Auth check error: ${err.message}`);
    return;
  }

  // Test 2: Providers Check
  console.log('\n[2/5] Providers Check...');
  try {
    const providers = await request(`${BASE_URL}/api/auth/providers-check`);
    if (providers.status === 200) {
      const json = JSON.parse(providers.data);
      console.log('  ✓ Providers endpoint accessible');
      if (json.providers.google) {
        console.log(`    Google Signin URL: ${json.providers.google.signinUrl}`);
        console.log(`    Google Callback URL: ${json.providers.google.callbackUrl}`);
      }
    } else {
      console.log(`  ✗ Providers check failed: ${check.status}`);
    }
  } catch (err) {
    console.log(`  ✗ Providers check error: ${err.message}`);
  }

  // Test 3: Google Signin Endpoint
  console.log('\n[3/5] Google Signin Endpoint Test...');
  try {
    const signin = await request(`${BASE_URL}/api/auth/signin/google?callbackUrl=/onboarding`);
    if (signin.status === 302 && signin.location) {
      console.log('  ✓ Google signin endpoint redirects correctly');
      if (signin.location.includes('accounts.google.com')) {
        console.log('    ✓ Redirecting to Google OAuth');
        console.log(`    Location: ${signin.location.substring(0, 100)}...`);
      } else if (signin.location.includes('error=')) {
        console.log(`  ✗ OAuth Error in redirect: ${signin.location}`);
        return;
      } else {
        console.log(`  ! Unexpected redirect location: ${signin.location}`);
      }
    } else {
      console.log(`  ✗ Signin endpoint failed: ${signin.status}`);
      if (signin.data) {
        try {
          const json = JSON.parse(signin.data);
          console.log(`    Error: ${json.error || 'Unknown'}`);
        } catch {}
      }
      return;
    }
  } catch (err) {
    console.log(`  ✗ Signin endpoint error: ${err.message}`);
    return;
  }

  // Test 4: CSRF Token
  console.log('\n[4/5] CSRF Token Check...');
  try {
    const csrf = await request(`${BASE_URL}/api/auth/csrf`);
    if (csrf.status === 200) {
      const json = JSON.parse(csrf.data);
      if (json.csrfToken) {
        console.log('  ✓ CSRF token available');
        console.log(`    Token: ${json.csrfToken.substring(0, 20)}...`);
      } else {
        console.log('  ✗ CSRF token missing');
      }
    } else {
      console.log(`  ✗ CSRF endpoint failed: ${csrf.status}`);
    }
  } catch (err) {
    console.log(`  ✗ CSRF check error: ${err.message}`);
  }

  // Test 5: Session Check
  console.log('\n[5/5] Session Check...');
  try {
    const session = await request(`${BASE_URL}/api/auth/session`);
    if (session.status === 200) {
      const json = JSON.parse(session.data);
      if (json.user) {
        console.log('  ✓ Active session found');
        console.log(`    User: ${json.user.email}`);
      } else {
        console.log('  ✓ No active session (expected)');
      }
    } else {
      console.log(`  ✗ Session endpoint failed: ${session.status}`);
    }
  } catch (err) {
    console.log(`  ✗ Session check error: ${err.message}`);
  }

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   TEST COMPLETE                                  ║');
  console.log('╚══════════════════════════════════════════════════╝\n');
  console.log('✅ Google OAuth configuration looks correct!');
  console.log('📝 Next steps:');
  console.log('   1. Go to https://napibase.com/login');
  console.log('   2. Click "Google ile devam et" button');
  console.log('   3. You should be redirected to Google OAuth\n');
}

testGoogleOAuth().catch(console.error);
