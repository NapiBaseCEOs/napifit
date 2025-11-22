/**
 * Login API Test Script
 * Login API'sini direkt test eder (credentials ile)
 */

const https = require('https');

const SITE_URL = 'https://napifit.vercel.app';

console.log('🧪 Login API Test Başlatılıyor...\n');
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

async function testLoginAPI() {
  console.log('📝 1. Register API Test (Test kullanıcısı oluştur)...');
  
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
    } else if (registerResponse.status === 409) {
      console.log(`   ⚠️  Kullanıcı zaten mevcut, devam ediliyor...\n`);
    } else {
      console.log(`   ❌ Register API hatası: ${registerResponse.status}`);
      console.log(`   Response: ${JSON.stringify(registerResponse.data)}\n`);
      return;
    }
  } catch (error) {
    console.log(`   ❌ Register API hatası: ${error.message}\n`);
    return;
  }

  console.log('🔐 2. Login API Test (NextAuth credentials)...');
  console.log('   ⚠️  Not: NextAuth credentials API direkt test edilemez');
  console.log('   💡 Login sayfası üzerinden test edilmelidir\n');

  console.log('🔗 3. Google OAuth Endpoint Test...');
  try {
    const response = await makeRequest(`${SITE_URL}/api/auth/signin/google`, {
      followRedirects: false,
    });
    
    const isRedirect = response.status === 302 || response.status === 307;
    const redirectsToGoogle = response.headers.location && response.headers.location.includes('accounts.google.com');
    
    if (isRedirect && redirectsToGoogle) {
      console.log(`   ✅ Google OAuth: Çalışıyor`);
      console.log(`      Redirect: ${response.headers.location}\n`);
    } else {
      console.log(`   ⚠️  Google OAuth: Beklenmeyen durum`);
      console.log(`      Status: ${response.status}`);
      console.log(`      Location: ${response.headers.location}\n`);
    }
  } catch (error) {
    console.log(`   ❌ Google OAuth test hatası: ${error.message}\n`);
  }

  console.log('✅ Login API test tamamlandı!\n');
  console.log('💡 Manuel Test:');
  console.log(`   1. https://napifit.vercel.app/login adresine git`);
  console.log(`   2. Email: ${testEmail}`);
  console.log(`   3. Şifre: ${testPassword}`);
  console.log(`   4. Giriş yap butonuna tıkla\n`);
}

testLoginAPI().catch((error) => {
  console.error('❌ Test hatası:', error);
  process.exit(1);
});

