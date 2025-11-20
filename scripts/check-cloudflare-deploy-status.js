/**
 * Cloudflare API ile Deploy Durumu Kontrolü
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

async function checkDeployStatus() {
  console.log('🔍 Cloudflare Pages Deploy Durumu Kontrol Ediliyor...\n');

  try {
    // 1. Project bilgilerini al
    console.log('📋 1. Project bilgileri alınıyor...');
    const projectResponse = await makeRequest(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${PROJECT_NAME}`
    );

    if (projectResponse.status !== 200) {
      console.error(`❌ Project bulunamadı: ${projectResponse.status}`);
      console.error(projectResponse.data);
      return false;
    }

    const project = projectResponse.data.result;
    console.log(`   ✅ Project: ${project.name}`);
    console.log(`   📦 Production branch: ${project.production_branch || 'main'}`);
    console.log(`   🔗 URL: ${project.subdomain || 'N/A'}\n`);

    // 2. Son deployment'ları al
    console.log('📋 2. Son deploymentlar kontrol ediliyor...');
    const deploymentsResponse = await makeRequest(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/deployments?per_page=5`
    );

    if (deploymentsResponse.status !== 200) {
      console.error(`❌ Deployment'lar alınamadı: ${deploymentsResponse.status}`);
      return false;
    }

    const deployments = deploymentsResponse.data.result || [];
    console.log(`   ✅ ${deployments.length} deployment bulundu\n`);

    if (deployments.length === 0) {
      console.log('⚠️  Henüz deployment yok\n');
      return false;
    }

    // 3. Son deployment'ı kontrol et
    const latestDeployment = deployments[0];
    console.log('📊 3. Son Deployment Detayları:');
    console.log(`   ID: ${latestDeployment.id}`);
    console.log(`   Durum: ${latestDeployment.latest_stage?.status || 'N/A'}`);
    console.log(`   Environment: ${latestDeployment.environment || 'production'}`);
    console.log(`   Branch: ${latestDeployment.deployment_trigger?.metadata?.branch || 'N/A'}`);
    console.log(`   Commit: ${latestDeployment.deployment_trigger?.metadata?.commit_hash?.substring(0, 7) || 'N/A'}`);
    console.log(`   URL: ${latestDeployment.url || 'N/A'}`);
    console.log(`   Oluşturulma: ${new Date(latestDeployment.created_on).toLocaleString()}\n`);

    // 4. Deployment stage'lerini kontrol et
    if (latestDeployment.latest_stage) {
      console.log('📋 4. Deployment Stage\'leri:');
      const stages = latestDeployment.stages || [];
      stages.forEach((stage, index) => {
        const status = stage.status === 'success' ? '✅' : 
                      stage.status === 'failure' ? '❌' : 
                      stage.status === 'active' ? '⏳' : '⚠️';
        console.log(`   ${status} ${index + 1}. ${stage.name}: ${stage.status}`);
        if (stage.ended_on) {
          const duration = (new Date(stage.ended_on) - new Date(stage.started_on)) / 1000;
          console.log(`      Süre: ${duration.toFixed(1)}s`);
        }
      });
      console.log('');
    }

    // 5. Hata kontrolü
    const hasErrors = latestDeployment.latest_stage?.status === 'failure';
    if (hasErrors) {
      console.log('❌ Deployment başarısız!\n');
      if (latestDeployment.latest_stage?.name) {
        console.log(`   Hata stage: ${latestDeployment.latest_stage.name}`);
      }
      return false;
    }

    const isSuccess = latestDeployment.latest_stage?.status === 'success';
    if (isSuccess) {
      console.log('✅ Deployment başarılı!\n');
      return true;
    }

    console.log('⏳ Deployment devam ediyor...\n');
    return true;

  } catch (error) {
    console.error('❌ Hata:', error.message);
    return false;
  }
}

// Ana fonksiyon
async function main() {
  const success = await checkDeployStatus();
  process.exit(success ? 0 : 1);
}

main();

