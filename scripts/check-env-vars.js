/**
 * Environment Variables Kontrol Script'i
 * .env dosyasındaki değişkenleri Cloudflare Pages'dekiyle karşılaştırır
 */

const https = require('https');

const BASE_URL = "https://napibase.com";

function request(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    }).on('error', reject);
  });
}

async function checkEnvVars() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   ENVIRONMENT VARIABLES CHECK                    ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  try {
    // Config endpoint'inden environment variables durumunu al
    const config = await request(`${BASE_URL}/api/config`);
    
    if (config.status === 200 && config.data.config) {
      const env = config.data.config;
      
      console.log('📋 Cloudflare Pages Environment Variables:\n');
      console.log(`  NEXTAUTH_URL: ${env.nextAuthUrl || 'NOT_SET'}`);
      console.log(`  GOOGLE_CLIENT_ID: ${env.googleClientId || 'NOT_SET'}`);
      console.log(`  GOOGLE_CLIENT_SECRET: ${env.googleClientSecret || 'NOT_SET'}`);
      console.log(`  AUTH_SECRET: ${env.authSecret || 'NOT_SET'}`);
      
      console.log('\n✅ Gerekli Environment Variables:');
      const required = {
        'NEXTAUTH_URL': env.nextAuthUrl,
        'GOOGLE_CLIENT_ID': env.googleClientId,
        'GOOGLE_CLIENT_SECRET': env.googleClientSecret,
        'AUTH_SECRET': env.authSecret,
      };
      
      let allSet = true;
      for (const [key, value] of Object.entries(required)) {
        const isSet = value && value !== 'NOT_SET';
        console.log(`  ${key}: ${isSet ? '✅ SET' : '❌ NOT SET'}`);
        if (!isSet) allSet = false;
      }
      
      if (!allSet) {
        console.log('\n⚠️  Eksik environment variables var!');
        console.log('   Cloudflare Pages > napifit > Settings > Environment variables');
        console.log('   Tüm değişkenleri ekleyin ve redeploy yapın.\n');
      } else {
        console.log('\n✅ Tüm environment variables ayarlanmış!\n');
      }
      
      // Google OAuth callback URL kontrolü
      if (env.expectedCallbackUrl) {
        console.log(`📡 Expected Callback URL: ${env.expectedCallbackUrl}`);
        console.log('   Bu URL Google Cloud Console > Authorized redirect URIs\'de olmalı!\n');
      }
    } else {
      console.log('❌ Config endpoint erişilemiyor veya hata veriyor.');
      console.log(`   Status: ${config.status}`);
      console.log(`   Response: ${JSON.stringify(config.data).substring(0, 200)}...\n`);
    }
  } catch (error) {
    console.error('❌ Hata:', error.message);
  }
}

checkEnvVars();
