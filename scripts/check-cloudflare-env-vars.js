/**
 * Cloudflare Pages Environment Variables Kontrolü
 */

const https = require('https');

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const PROJECT_NAME = 'napifit';

if (!CLOUDFLARE_API_TOKEN) {
  console.error('❌ CLOUDFLARE_API_TOKEN environment variable not set');
  process.exit(1);
}

if (!CLOUDFLARE_ACCOUNT_ID) {
  console.error('❌ CLOUDFLARE_ACCOUNT_ID environment variable not set');
  process.exit(1);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      timeout: 10000,
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

async function checkEnvironmentVariables() {
  console.log('🔍 Cloudflare Pages Environment Variables Kontrol Ediliyor...\n');

  try {
    // Production environment variables
    console.log('📋 Production Environment Variables:');
    const prodResponse = await makeRequest(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/deployments?environment=production&per_page=1`
    );

    // Environment variables endpoint
    const envResponse = await makeRequest(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${PROJECT_NAME}`
    );

    if (envResponse.status !== 200) {
      console.error(`❌ Project bilgileri alınamadı: ${envResponse.status}`);
      return false;
    }

    const project = envResponse.data.result;
    
    // Environment variables'ları kontrol et
    const requiredVars = ['TURSO_DATABASE_URL', 'TURSO_AUTH_TOKEN', 'NEXTAUTH_URL', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'AUTH_SECRET'];
    
    console.log('\n📊 Environment Variables Durumu:\n');
    
    // Not: Cloudflare API environment variables'ları direkt göstermez, sadece varlığını kontrol edebiliriz
    // Bu yüzden site üzerinden test edeceğiz
    
    console.log('💡 Environment variables Cloudflare API ile direkt kontrol edilemez');
    console.log('💡 Site üzerinden test endpoint ile kontrol edilecek\n');
    
    return true;

  } catch (error) {
    console.error('❌ Hata:', error.message);
    return false;
  }
}

async function checkSiteEnvironment() {
  console.log('🌐 Site Environment Variables Testi...\n');
  
  try {
    const https = require('https');
    const response = await new Promise((resolve, reject) => {
      const req = https.request('https://napibase.com/api/test-auth', (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch {
            resolve({ status: res.statusCode, data: body });
          }
        });
      });
      req.on('error', reject);
      req.end();
    });

    if (response.status === 200 && response.data.environment) {
      const env = response.data.environment;
      console.log('📊 Environment Variables (Site Test):\n');
      console.log(`   NEXTAUTH_URL: ${env.NEXTAUTH_URL || '❌ Not set'}`);
      console.log(`   GOOGLE_CLIENT_ID: ${env.GOOGLE_CLIENT_ID || '❌ Not set'}`);
      console.log(`   GOOGLE_CLIENT_SECRET: ${env.GOOGLE_CLIENT_SECRET || '❌ Not set'}`);
      console.log(`   AUTH_SECRET: ${env.AUTH_SECRET || '❌ Not set'}\n`);
      
      console.log('📊 Database Durumu:\n');
      if (response.data.d1Database) {
        const db = response.data.d1Database;
        console.log(`   D1 Database: ${db.available ? '✅ Available' : '❌ Not available'}`);
        if (!db.available) {
          console.log(`   Error: ${db.error || 'N/A'}\n`);
        }
      }
      
      // Turso kontrolü için test endpoint'e ihtiyacımız var
      console.log('💡 Turso database kontrolü için Register API test edilecek\n');
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Site test hatası:', error.message);
    return false;
  }
}

async function main() {
  const apiCheck = await checkEnvironmentVariables();
  const siteCheck = await checkSiteEnvironment();
  
  if (apiCheck && siteCheck) {
    console.log('✅ Kontroller tamamlandı\n');
    process.exit(0);
  } else {
    console.log('⚠️  Bazı kontroller başarısız\n');
    process.exit(1);
  }
}

main();

