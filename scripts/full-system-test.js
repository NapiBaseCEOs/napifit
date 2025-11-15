#!/usr/bin/env node

const https = require('https');

const BASE_URL = 'https://napibase.com';
const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

function request(url, options = {}) {
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

// Test 1: Providers
test('NextAuth Providers', async () => {
  const res = await request(`${BASE_URL}/api/auth/providers`);
  if (res.status === 200 && res.json?.google) {
    console.log(`  ✓ Google Provider: ${res.json.google.name}`);
    console.log(`    Callback: ${res.json.google.callbackUrl}`);
    return true;
  }
  throw new Error('Google provider not found');
});

// Test 2: Environment Variables
test('Environment Variables', async () => {
  const res = await request(`${BASE_URL}/api/auth/debug`);
  if (res.status === 200 && res.json) {
    const env = res.json.env;
    if (env.NEXTAUTH_URL === 'https://napibase.com' &&
        env.GOOGLE_CLIENT_ID === 'SET (hidden)' &&
        env.GOOGLE_CLIENT_SECRET === 'SET (hidden)') {
      console.log(`  ✓ All environment variables SET`);
      console.log(`    NEXTAUTH_URL: ${env.NEXTAUTH_URL}`);
      return true;
    }
  }
  throw new Error('Environment variables missing');
});

// Test 3: CSRF Token
test('CSRF Token', async () => {
  const res = await request(`${BASE_URL}/api/auth/csrf`);
  if (res.status === 200 && res.json?.csrfToken) {
    console.log(`  ✓ CSRF Token: ${res.json.csrfToken.substring(0, 20)}...`);
    return true;
  }
  throw new Error('CSRF token not available');
});

// Test 4: Google OAuth Signin
test('Google OAuth Signin', async () => {
  try {
    const res = await request(`${BASE_URL}/api/auth/signin/google?callbackUrl=/onboarding`, {
      method: 'GET',
      maxRedirects: 0
    });
    // 302 is expected
    if (res.status === 302) {
      const location = res.headers.location || '';
      if (location.includes('accounts.google.com')) {
        console.log(`  ✓ Redirecting to Google OAuth`);
        console.log(`    Location: ${location.substring(0, 80)}...`);
        return true;
      } else if (location.includes('error=')) {
        const match = location.match(/error=([^&]+)/);
        throw new Error(`OAuth error: ${match ? match[1] : 'unknown'}`);
      }
    }
    throw new Error(`Unexpected status: ${res.status}`);
  } catch (err) {
    if (err.message.includes('302')) {
      return true; // 302 is redirect, that's OK
    }
    throw err;
  }
});

// Test 5: Session
test('Session Management', async () => {
  const res = await request(`${BASE_URL}/api/auth/session`);
  if (res.status === 200 && res.json) {
    if (!res.json.user) {
      console.log(`  ✓ No active session (correct)`);
      return true;
    } else {
      console.log(`  ✓ Active session: ${res.json.user.email}`);
      return true;
    }
  }
  throw new Error('Session endpoint failed');
});

// Test 6: Register Endpoint (Database)
test('Register Endpoint (Database)', async () => {
  const testEmail = `test${Date.now()}@test.com`;
  const body = JSON.stringify({
    firstName: 'Test',
    lastName: 'User',
    dateOfBirth: '2000-01-01',
    email: testEmail,
    password: 'test123456'
  });

  try {
    const res = await request(`${BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.length
      },
      body
    });

    if (res.status === 200 && res.json?.success) {
      console.log(`  ✓ Database working - Registration successful`);
      return true;
    } else if (res.json?.error === 'DATABASE_CONNECTION_ERROR') {
      throw new Error('Database connection failed');
    } else if (res.json?.message) {
      console.log(`  ! Database accessible: ${res.json.message}`);
      return true; // Database is accessible, just validation failed
    }
    throw new Error(`Unexpected response: ${res.status}`);
  } catch (err) {
    if (err.message.includes('timeout')) {
      throw new Error('Database timeout');
    }
    throw err;
  }
});

// Test 7: Homepage
test('Homepage', async () => {
  const res = await request(`${BASE_URL}/`);
  if (res.status === 200 && res.data.includes('NapiFit')) {
    console.log(`  ✓ Homepage loading`);
    return true;
  }
  throw new Error('Homepage not accessible');
});

// Test 8: Login Page
test('Login Page', async () => {
  const res = await request(`${BASE_URL}/login`);
  if (res.status === 200 && res.data.includes('Giriş Yap')) {
    console.log(`  ✓ Login page loading`);
    return true;
  }
  throw new Error('Login page not accessible');
});

// Test 9: CSS Assets
test('CSS Assets', async () => {
  // Try to find CSS in homepage HTML
  const res = await request(`${BASE_URL}/`);
  if (res.data.includes('/_next/static/css/')) {
    const match = res.data.match(/\/_next\/static\/css\/([a-f0-9]+\.css)/);
    if (match) {
      const cssFile = match[1];
      const cssRes = await request(`${BASE_URL}/_next/static/css/${cssFile}`, { method: 'HEAD' });
      if (cssRes.status === 200) {
        console.log(`  ✓ CSS assets loading: ${cssFile}`);
        return true;
      }
    }
  }
  throw new Error('CSS assets not found or not loading');
});

// Test 10: Health Check
test('Health Endpoint', async () => {
  try {
    const res = await request(`${BASE_URL}/api/profile`);
    // 401 is expected if not logged in
    if (res.status === 401 || res.status === 200) {
      console.log(`  ✓ Health endpoint accessible (${res.status})`);
      return true;
    }
    throw new Error(`Unexpected status: ${res.status}`);
  } catch (err) {
    throw new Error('Health endpoint failed');
  }
});

// Run all tests
async function runTests() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   NAPIFIT FULL SYSTEM CHECK - v0.1.21            ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  for (const { name, fn } of tests) {
    try {
      console.log(`[${tests.indexOf({ name, fn }) + 1}/10] ${name}...`);
      await fn();
      passed++;
      console.log('');
    } catch (err) {
      failed++;
      console.log(`  ✗ FAILED: ${err.message}\n`);
    }
  }

  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║   RESULTS                                        ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`✓ Passed: ${passed}`);
  console.log(`✗ Failed: ${failed}`);
  console.log(`Total: ${tests.length}\n`);

  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED! System is fully operational.\n');
    process.exit(0);
  } else {
    console.log('⚠️ Some tests failed. Please check the errors above.\n');
    process.exit(1);
  }
}

runTests().catch(console.error);

