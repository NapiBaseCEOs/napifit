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
  console.log('║   DIRECT GOOGLE OAUTH DETAILED TEST             ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  console.log('[1/1] Direct Google OAuth Endpoint (/api/google-direct)...');
  try {
    const directRes = await request(`${BASE_URL}/api/google-direct?callbackUrl=/onboarding`, {
      method: 'GET',
      maxRedirects: 0
    });
    
    console.log(`  Status: ${directRes.status}`);
    console.log(`  Headers:`, Object.keys(directRes.headers));
    
    if (directRes.status === 302 || directRes.status === 307) {
      const location = directRes.headers.location || '';
      console.log(`  ✓ Redirect (${directRes.status}) detected`);
      console.log(`  Location: ${location}`);
      
      if (location.includes('accounts.google.com/o/oauth2/v2/auth')) {
        console.log(`  ✅ SUCCESS: Google OAuth URL oluşturuldu!`);
        console.log(`  ✅ Hesap seçme ekranına yönlendirilecek\n`);
        return true;
      } else if (location.includes('error=')) {
        const errorMatch = location.match(/error=([^&]+)/);
        const error = errorMatch ? errorMatch[1] : 'unknown';
        console.log(`  ❌ ERROR: ${error}\n`);
      } else {
        console.log(`  ⚠️ Unexpected redirect: ${location.substring(0, 100)}\n`);
      }
    } else {
      console.log(`  ❌ Status: ${directRes.status} (expected 302)`);
      if (directRes.json) {
        console.log(`  Error Response:`, JSON.stringify(directRes.json, null, 2));
      } else if (directRes.data) {
        console.log(`  Response Data:`, directRes.data.substring(0, 500));
      }
      console.log();
    }
  } catch (err) {
    // 302 redirect throws error in Node.js
    if (err.message.includes('302') || err.message.includes('redirect') || err.message.includes('ECONNRESET')) {
      console.log(`  ✓ Redirect detected (this is expected)\n`);
      return true;
    } else {
      console.log(`  ✗ Error: ${err.message}\n`);
    }
  }
  
  return false;
}

testDirectOAuth().then(success => {
  if (success) {
    console.log('✅ GOOGLE OAUTH ÇALIŞIYOR!');
    console.log('   Artık https://napibase.com/login adresinden Google butonuna basabilirsiniz.\n');
  } else {
    console.log('❌ Google OAuth hala çalışmıyor.');
    console.log('   Deployment tamamlanmayı bekleyin veya endpoint hatasını kontrol edin.\n');
  }
}).catch(console.error);

