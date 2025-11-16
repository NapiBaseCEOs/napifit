/**
 * Direct Login Test - Gerçek login işlemini test eder
 */

const https = require('https');

const SITE_URL = 'https://napifit.vercel.app';

console.log('🧪 Direct Login Test Başlatılıyor...\n');
console.log(`🌐 Site URL: ${SITE_URL}\n`);

// HTTP request helper
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      timeout: options.timeout || 15000,
    };

    const req = https.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
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

async function testLoginDirect() {
  console.log('📝 1. Test kullanıcısı oluştur...');
  
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'Test123456!';
  
  try {
    const registerResponse = await makeRequest(`${SITE_URL}/api/register`, {
      method: 'POST',
      body: {
        firstName: 'Test',
        lastName: 'User',
        dateOfBirth: '2000-01-01',
        email: testEmail,
        password: testPassword,
      },
    });
    
    if (registerResponse.status === 200) {
      console.log(`   ✅ Test kullanıcısı oluşturuldu: ${testEmail}\n`);
    } else {
      console.log(`   ❌ Register hatası: ${registerResponse.status}`);
      console.log(`   Response: ${JSON.stringify(registerResponse.data, null, 2)}\n`);
      return;
    }
  } catch (error) {
    console.log(`   ❌ Register API hatası: ${error.message}\n`);
    return;
  }

  console.log('🔐 2. NextAuth signin endpoint test...');
  try {
    // NextAuth signin endpoint'ine POST isteği gönder
    const signinResponse = await makeRequest(`${SITE_URL}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `email=${encodeURIComponent(testEmail)}&password=${encodeURIComponent(testPassword)}&csrfToken=test&callbackUrl=${encodeURIComponent(SITE_URL)}`,
    });
    
    console.log(`   Status: ${signinResponse.status}`);
    console.log(`   Headers: ${JSON.stringify(signinResponse.headers, null, 2)}`);
    console.log(`   Data: ${JSON.stringify(signinResponse.data, null, 2)}\n`);
  } catch (error) {
    console.log(`   ❌ Signin test hatası: ${error.message}\n`);
  }

  console.log('🔍 3. Turso database kontrolü...');
  try {
    const testAuthResponse = await makeRequest(`${SITE_URL}/api/test-auth`);
    if (testAuthResponse.status === 200 && testAuthResponse.data) {
      const turso = testAuthResponse.data.tursoDatabase;
      console.log(`   Turso Available: ${turso?.available}`);
      console.log(`   Turso Test Query: ${turso?.testQuery}`);
      if (turso?.error) {
        console.log(`   ⚠️  Turso Error: ${turso.error}`);
      }
      console.log('');
    }
  } catch (error) {
    console.log(`   ❌ Test auth hatası: ${error.message}\n`);
  }

  console.log('✅ Test tamamlandı!\n');
  console.log('💡 Manuel Test:');
  console.log(`   1. https://napifit.vercel.app/login`);
  console.log(`   2. Email: ${testEmail}`);
  console.log(`   3. Şifre: ${testPassword}`);
  console.log(`   4. Giriş yap butonuna tıkla\n`);
}

testLoginDirect().catch((error) => {
  console.error('❌ Test hatası:', error);
  process.exit(1);
});

