/**
 * GitHub Secrets Ekleme Script'i
 * .env dosyasından değerleri okuyup GitHub Secrets olarak ekler
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// GitHub repository bilgileri
const REPO_OWNER = 'NapiBaseCEOs';
const REPO_NAME = 'napifit';
const REPO_FULL_NAME = `${REPO_OWNER}/${REPO_NAME}`;

console.log('🔐 GitHub Secrets Ekleme Script\'i Başlatılıyor...\n');
console.log(`📦 Repository: ${REPO_FULL_NAME}\n`);

// .env dosyasını oku
const envPath = path.join(process.cwd(), '.env');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env dosyası bulunamadı!');
  console.error('💡 .env dosyası oluşturun ve değerleri ekleyin.\n');
  process.exit(1);
}

console.log('📄 .env dosyası okunuyor...\n');

const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

// .env dosyasını parse et
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      
      // Tırnak işaretlerini kaldır
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      envVars[key] = value;
    }
  }
});

// GitHub Secrets için gerekli değişkenler
const requiredSecrets = {
  'AUTH_SECRET': envVars.AUTH_SECRET,
  'GOOGLE_CLIENT_ID': envVars.GOOGLE_CLIENT_ID,
  'GOOGLE_CLIENT_SECRET': envVars.GOOGLE_CLIENT_SECRET,
  'NEXTAUTH_URL': envVars.NEXTAUTH_URL || 'https://napifit.pages.dev', // Default değer
  'CLOUDFLARE_API_TOKEN': envVars.CLOUDFLARE_API_TOKEN,
  'CLOUDFLARE_ACCOUNT_ID': envVars.CLOUDFLARE_ACCOUNT_ID,
};

// Eksik değişkenleri kontrol et
const missing = [];
Object.entries(requiredSecrets).forEach(([key, value]) => {
  if (!value || value === '' || value.includes('your-') || value.includes('YOUR_')) {
    missing.push(key);
  }
});

if (missing.length > 0) {
  console.error('❌ Eksik veya geçersiz değişkenler:\n');
  missing.forEach(key => {
    console.error(`   - ${key}`);
  });
  console.error('\n💡 .env dosyasında bu değişkenleri doldurun.\n');
  process.exit(1);
}

// GitHub CLI kontrolü
let useGitHubCLI = false;
try {
  execSync('gh --version', { stdio: 'ignore' });
  useGitHubCLI = true;
  console.log('✅ GitHub CLI bulundu\n');
} catch (error) {
  console.log('⚠️  GitHub CLI bulunamadı, GitHub API kullanılacak\n');
  console.log('💡 GitHub CLI kurmak için: https://cli.github.com/\n');
}

// GitHub CLI ile secrets ekle
if (useGitHubCLI) {
  console.log('📤 GitHub Secrets ekleniyor...\n');
  
  Object.entries(requiredSecrets).forEach(([key, value]) => {
    try {
      // GitHub CLI ile secret ekle
      execSync(`gh secret set ${key} --repo ${REPO_FULL_NAME} --body "${value}"`, {
        stdio: 'inherit'
      });
      console.log(`   ✅ ${key} eklendi\n`);
    } catch (error) {
      console.error(`   ❌ ${key} eklenemedi: ${error.message}\n`);
    }
  });
  
  console.log('\n✅ GitHub Secrets ekleme tamamlandı!\n');
  
  // Secrets'leri listele
  console.log('📋 Eklenen Secrets:\n');
  try {
        execSync(`gh secret list --repo ${REPO_FULL_NAME}`, {
      stdio: 'inherit'
    });
  } catch (error) {
    console.log('⚠️  Secrets listelenemedi\n');
  }
} else {
  // GitHub API ile secrets ekle (alternatif)
  console.log('📋 GitHub Secrets (Manuel Ekleme)\n');
  console.log('GitHub repository\'nizde şu secrets\'ları ekleyin:\n');
  console.log('Repository: https://github.com/' + REPO_FULL_NAME + '/settings/secrets/actions\n');
  
  Object.entries(requiredSecrets).forEach(([key, value]) => {
    console.log(`${key}:`);
    console.log(`  ${value.substring(0, 20)}${value.length > 20 ? '...' : ''}`);
    console.log('');
  });
  
  console.log('💡 GitHub API ile otomatik eklemek için GitHub Personal Access Token gerekir.');
  console.log('   Token oluşturmak için: https://github.com/settings/tokens');
  console.log('   Gerekli permissions: repo, admin:repo_hook\n');
}

