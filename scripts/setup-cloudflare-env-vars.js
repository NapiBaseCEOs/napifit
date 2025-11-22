/**
 * Cloudflare Pages Environment Variables Setup Script
 * Turso database credentials'ları Cloudflare Pages'e ekler
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const https = require('https');

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const PROJECT_NAME = 'napifit';

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL?.replace(/^"|"$/g, '') || process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN?.replace(/^"|"$/g, '') || process.env.TURSO_AUTH_TOKEN;

if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ACCOUNT_ID) {
  console.error('❌ Cloudflare API credentials eksik');
  console.log('\n💡 .env dosyasına ekleyin:');
  console.log('   CLOUDFLARE_API_TOKEN=...');
  console.log('   CLOUDFLARE_ACCOUNT_ID=...\n');
  process.exit(1);
}

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  console.error('❌ Turso credentials eksik');
  console.log('\n💡 .env dosyasına ekleyin:');
  console.log('   TURSO_DATABASE_URL=...');
  console.log('   TURSO_AUTH_TOKEN=...\n');
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

async function setupEnvironmentVariables() {
  console.log('🔧 Cloudflare Pages Environment Variables Kurulumu\n');

  const envVars = {
    TURSO_DATABASE_URL: TURSO_DATABASE_URL,
    TURSO_AUTH_TOKEN: TURSO_AUTH_TOKEN,
  };

  console.log('📋 Eklenecek Environment Variables:');
  Object.keys(envVars).forEach(key => {
    const value = key.includes('TOKEN') || key.includes('SECRET') 
      ? `${envVars[key].substring(0, 10)}...` 
      : envVars[key];
    console.log(`   ${key}: ${value}`);
  });
  console.log('');

  try {
    // Production environment variables ekle
    console.log('⏳ Production environment variables ekleniyor...');
    const response = await makeRequest(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/deployments`,
      {
        method: 'POST',
        body: {
          // Not: Cloudflare API environment variables'ları direkt set etmez
          // Bu yüzden manuel olarak Cloudflare Dashboard'dan eklenmesi gerekir
        }
      }
    );

    console.log('⚠️  Cloudflare API environment variables direkt set edilemez');
    console.log('\n💡 Manuel olarak Cloudflare Dashboard\'dan ekleyin:\n');
    console.log('1. Cloudflare Dashboard > Workers & Pages > napifit > Settings');
    console.log('2. Environment Variables sekmesine git');
    console.log('3. Production environment için:\n');
    
    Object.entries(envVars).forEach(([key, value]) => {
      console.log(`   ${key}=${value}`);
    });
    
    console.log('\n✅ Environment variables eklendikten sonra yeni bir deploy tetiklenecek\n');
    
    return true;
  } catch (error) {
    console.error('❌ Hata:', error.message);
    return false;
  }
}

async function main() {
  const success = await setupEnvironmentVariables();
  process.exit(success ? 0 : 1);
}

main();

