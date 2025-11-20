/**
 * Cloudflare Pages ve GitHub Deploy Kontrol Script'i
 * Environment variables, D1 database ve deploy durumunu kontrol eder
 */

const https = require('https');
const { execSync } = require('child_process');

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const PROJECT_NAME = 'napifit';

console.log('🔍 Cloudflare Pages ve GitHub Deploy Kontrolü Başlatılıyor...\n');

// 1. Cloudflare API Token kontrolü
if (!CLOUDFLARE_API_TOKEN) {
  console.log('❌ CLOUDFLARE_API_TOKEN environment variable bulunamadı');
  console.log('💡 Cloudflare Dashboard > My Profile > API Tokens > Create Token\n');
  process.exit(1);
}

if (!CLOUDFLARE_ACCOUNT_ID) {
  console.log('❌ CLOUDFLARE_ACCOUNT_ID environment variable bulunamadı');
  console.log('💡 Cloudflare Dashboard\'da sağ üstte account dropdown\'dan bulunur\n');
  process.exit(1);
}

// HTTP request helper
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${parsed.errors?.[0]?.message || body}`));
          }
        } catch (e) {
          resolve({ raw: body, statusCode: res.statusCode });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// 2. Cloudflare Pages projesini kontrol et
async function checkCloudflarePages() {
  console.log('📋 1. Cloudflare Pages Projesi Kontrolü...');
  
  try {
    const options = {
      hostname: 'api.cloudflare.com',
      path: `/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${PROJECT_NAME}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    const project = await makeRequest(options);
    console.log(`   ✅ Proje bulundu: ${project.result.name}`);
    console.log(`   📍 Production URL: ${project.result.production_branch || 'N/A'}`);
    console.log(`   🔗 Domains: ${project.result.domains?.join(', ') || 'N/A'}\n`);
    return project.result;
  } catch (error) {
    console.log(`   ❌ Proje bulunamadı: ${error.message}`);
    console.log('   💡 Cloudflare Dashboard > Pages > Create a project\n');
    return null;
  }
}

// 3. Environment Variables kontrolü
async function checkEnvironmentVariables(project) {
  console.log('🔐 2. Environment Variables Kontrolü...');
  
  try {
    const options = {
      hostname: 'api.cloudflare.com',
      path: `/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/deployments`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    // Environment variables için ayrı bir endpoint kullanmamız gerekiyor
    // Cloudflare API'de environment variables'ı direkt kontrol etmek için
    // Settings endpoint'ini kullanmalıyız
    
    const envOptions = {
      hostname: 'api.cloudflare.com',
      path: `/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${PROJECT_NAME}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    const projectData = await makeRequest(envOptions);
    
    // Environment variables API'den direkt alınamıyor, manuel kontrol gerekli
    console.log('   ⚠️  Environment variables API üzerinden kontrol edilemiyor');
    console.log('   💡 Manuel kontrol: Cloudflare Dashboard > Pages > napifit > Settings > Environment variables\n');
    console.log('   📋 Gerekli Environment Variables:');
    console.log('      - AUTH_SECRET');
    console.log('      - GOOGLE_CLIENT_ID');
    console.log('      - GOOGLE_CLIENT_SECRET');
    console.log('      - NEXTAUTH_URL (https://napibase.com)');
    console.log('      - NEXT_PUBLIC_APP_URL (https://napibase.com)\n');
    
  } catch (error) {
    console.log(`   ❌ Kontrol hatası: ${error.message}\n`);
  }
}

// 4. D1 Database kontrolü
async function checkD1Database() {
  console.log('💾 3. D1 Database Kontrolü...');
  
  try {
    const options = {
      hostname: 'api.cloudflare.com',
      path: `/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/de758b90-9098-4b56-bbb5-f9782e9cc259`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    const db = await makeRequest(options);
    console.log(`   ✅ D1 Database bulundu: ${db.result.name}`);
    console.log(`   📊 Database ID: ${db.result.uuid}\n`);
    return db.result;
  } catch (error) {
    console.log(`   ❌ D1 Database bulunamadı: ${error.message}`);
    console.log('   💡 Cloudflare Dashboard > Storage > D1 > napifit-db\n');
    return null;
  }
}

// 5. Son deployment kontrolü
async function checkLatestDeployment() {
  console.log('🚀 4. Son Deployment Kontrolü...');
  
  try {
    const options = {
      hostname: 'api.cloudflare.com',
      path: `/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/deployments?per_page=1`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    const deployments = await makeRequest(options);
    if (deployments.result && deployments.result.length > 0) {
      const latest = deployments.result[0];
      console.log(`   ✅ Son deployment: ${latest.id}`);
      console.log(`   📅 Tarih: ${new Date(latest.created_on).toLocaleString('tr-TR')}`);
      console.log(`   📊 Durum: ${latest.latest_stage?.name || 'N/A'}`);
      console.log(`   🔗 URL: ${latest.url || 'N/A'}\n`);
      return latest;
    } else {
      console.log('   ⚠️  Deployment bulunamadı\n');
      return null;
    }
  } catch (error) {
    console.log(`   ❌ Deployment kontrolü hatası: ${error.message}\n`);
    return null;
  }
}

// 6. GitHub Actions kontrolü
async function checkGitHubActions() {
  console.log('🔧 5. GitHub Actions Kontrolü...');
  
  try {
    // GitHub CLI kontrolü
    try {
      execSync('gh --version', { stdio: 'ignore' });
      console.log('   ✅ GitHub CLI yüklü');
      
      // Son workflow run'ı kontrol et
      try {
        const output = execSync('gh run list --limit 1 --json status,conclusion,name,createdAt', {
          encoding: 'utf-8',
          cwd: process.cwd(),
        });
        const runs = JSON.parse(output);
        if (runs.length > 0) {
          const run = runs[0];
          console.log(`   ✅ Son workflow: ${run.name}`);
          console.log(`   📊 Durum: ${run.status} (${run.conclusion || 'N/A'})`);
          console.log(`   📅 Tarih: ${new Date(run.createdAt).toLocaleString('tr-TR')}\n`);
        } else {
          console.log('   ⚠️  Workflow run bulunamadı\n');
        }
      } catch (error) {
        console.log('   ⚠️  GitHub Actions bilgisi alınamadı');
        console.log('   💡 Manuel kontrol: https://github.com/NapiBaseCEOs/napifit/actions\n');
      }
    } catch (error) {
      console.log('   ⚠️  GitHub CLI yüklü değil');
      console.log('   💡 Yükleme: https://cli.github.com/\n');
    }
  } catch (error) {
    console.log(`   ❌ Kontrol hatası: ${error.message}\n`);
  }
}

// 7. Production site test
async function testProductionSite() {
  console.log('🌐 6. Production Site Test...');
  
  const testUrls = [
    'https://napibase.com',
    'https://napibase.com/api/config',
    'https://napibase.com/api/db-test',
  ];

  for (const url of testUrls) {
    try {
      const options = new URL(url);
      const req = https.request({
        hostname: options.hostname,
        path: options.pathname + options.search,
        method: 'GET',
        timeout: 5000,
      }, (res) => {
        console.log(`   ${res.statusCode === 200 ? '✅' : '⚠️'} ${url} - ${res.statusCode}`);
      });
      
      req.on('error', () => {
        console.log(`   ❌ ${url} - Bağlantı hatası`);
      });
      
      req.on('timeout', () => {
        req.destroy();
        console.log(`   ⏱️  ${url} - Timeout`);
      });
      
      req.end();
      
      // Kısa bir bekleme
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(`   ❌ ${url} - ${error.message}`);
    }
  }
  console.log('');
}

// Ana fonksiyon
async function main() {
  try {
    const project = await checkCloudflarePages();
    await checkEnvironmentVariables(project);
    await checkD1Database();
    await checkLatestDeployment();
    await checkGitHubActions();
    await testProductionSite();
    
    console.log('✅ Kontrol tamamlandı!\n');
    console.log('📋 Özet:');
    console.log('   1. Cloudflare Pages projesi kontrol edildi');
    console.log('   2. Environment variables manuel kontrol gerekli');
    console.log('   3. D1 Database kontrol edildi');
    console.log('   4. Son deployment kontrol edildi');
    console.log('   5. GitHub Actions kontrol edildi');
    console.log('   6. Production site test edildi\n');
    
  } catch (error) {
    console.error('\n❌ Hata:', error.message);
    process.exit(1);
  }
}

main();

