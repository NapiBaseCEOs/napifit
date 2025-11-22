/**
 * GitHub Secrets Ekleme Script'i (Basit Versiyon)
 * .env dosyasından değerleri okuyup GitHub Secrets olarak ekler
 * GitHub CLI veya GitHub API kullanır
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

// GitHub repository bilgileri
const REPO_OWNER = 'NapiBaseCEOs';
const REPO_NAME = 'napifit';
const REPO_FULL_NAME = `${REPO_OWNER}/${REPO_NAME}`;

console.log('🔐 GitHub Secrets Ekleme Script\'i\n');
console.log(`📦 Repository: ${REPO_FULL_NAME}\n`);

// .env dosyasını oku
const envPath = path.join(process.cwd(), '.env');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env dosyası bulunamadı!');
  process.exit(1);
}

console.log('📄 .env dosyası okunuyor...\n');

const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

// .env dosyasını parse et
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const match = trimmed.match(/^([^=]+)=["']?([^"']+)["']?$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      envVars[key] = value;
    }
  }
});

// GitHub Secrets için gerekli değişkenler
const secrets = {
  'AUTH_SECRET': envVars.AUTH_SECRET,
  'GOOGLE_CLIENT_ID': envVars.GOOGLE_CLIENT_ID,
  'GOOGLE_CLIENT_SECRET': envVars.GOOGLE_CLIENT_SECRET,
  'NEXTAUTH_URL': envVars.NEXTAUTH_URL || 'https://napifit.pages.dev',
};

// Eksik değişkenleri kontrol et ve göster
console.log('📋 Okunan Secrets:\n');
Object.entries(secrets).forEach(([key, value]) => {
  if (value && !value.includes('your-') && !value.includes('YOUR_')) {
    const displayValue = value.length > 30 ? value.substring(0, 30) + '...' : value;
    console.log(`✅ ${key}: ${displayValue}`);
  } else {
    console.log(`⚠️  ${key}: (değer yok veya geçersiz)`);
  }
});

console.log('\n📤 GitHub Secrets ekleniyor...\n');

// GitHub CLI kontrolü
let useGitHubCLI = false;
try {
  execSync('gh --version', { stdio: 'ignore' });
  useGitHubCLI = true;
  console.log('✅ GitHub CLI bulundu, CLI ile ekleniyor...\n');
} catch (error) {
  console.log('⚠️  GitHub CLI bulunamadı\n');
}

if (useGitHubCLI) {
  // GitHub CLI ile ekle
  Object.entries(secrets).forEach(([key, value]) => {
    if (value && !value.includes('your-') && !value.includes('YOUR_')) {
      try {
        execSync(`echo "${value}" | gh secret set ${key} --repo ${REPO_FULL_NAME}`, {
          stdio: 'inherit'
        });
        console.log(`✅ ${key} eklendi\n`);
      } catch (error) {
        console.error(`❌ ${key} eklenemedi\n`);
      }
    }
  });
  
  console.log('\n✅ GitHub Secrets ekleme tamamlandı!\n');
  
  // Secrets'leri listele
  console.log('📋 Eklenen Secrets:\n');
  try {
    execSync(`gh secret list --repo ${REPO_FULL_NAME}`, { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Secrets listelenemedi\n');
  }
} else {
  // Manuel ekleme talimatları
  console.log('📋 GitHub Secrets (Manuel Ekleme)\n');
  console.log(`Repository URL: https://github.com/${REPO_FULL_NAME}/settings/secrets/actions\n`);
  console.log('Aşağıdaki secrets\'ları GitHub repository\'nizde ekleyin:\n');
  
  Object.entries(secrets).forEach(([key, value]) => {
    if (value && !value.includes('your-') && !value.includes('YOUR_')) {
      console.log(`${key}:`);
      console.log(`  ${value}`);
      console.log('');
    }
  });
  
  console.log('💡 GitHub CLI kurmak için: https://cli.github.com/');
  console.log('   Kurulumdan sonra: gh auth login');
  console.log('   Sonra bu script\'i tekrar çalıştırın.\n');
}

