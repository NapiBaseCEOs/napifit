/**
 * GitHub Secrets Ekleme Script'i (GitHub API ile)
 * .env dosyasından değerleri okuyup GitHub Secrets olarak ekler
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// GitHub repository bilgileri
const REPO_OWNER = 'NapiBaseCEOs';
const REPO_NAME = 'napifit';
const REPO_FULL_NAME = `${REPO_OWNER}/${REPO_NAME}`;

console.log('🔐 GitHub Secrets Ekleme Script\'i (GitHub API)\n');
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
  'NEXTAUTH_URL': envVars.NEXTAUTH_URL || 'https://napifit.pages.dev',
};

// GitHub API için gerekli olanlar (.env'den veya manuel)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || envVars.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN bulunamadı!\n');
  console.error('💡 GitHub Personal Access Token oluşturun:');
  console.error('   1. https://github.com/settings/tokens');
  console.error('   2. Generate new token (classic)');
  console.error('   3. Permissions: repo (Full control of private repositories)');
  console.error('   4. Token\'ı kopyalayın\n');
  console.error('📝 Token\'ı şu şekilde kullanın:\n');
  console.error('   PowerShell:');
  console.error('   $env:GITHUB_TOKEN="your-token"; node scripts/add-github-secrets-api.js\n');
  console.error('   Veya .env dosyasına ekleyin:');
  console.error('   GITHUB_TOKEN=your-token\n');
  
  // Manuel ekleme talimatları
  console.log('\n📋 GitHub Secrets (Manuel Ekleme)\n');
  console.log(`Repository: https://github.com/${REPO_FULL_NAME}/settings/secrets/actions\n`);
  
  Object.entries(requiredSecrets).forEach(([key, value]) => {
    if (value && !value.includes('your-') && !value.includes('YOUR_')) {
      console.log(`${key}:`);
      console.log(`  ${value.substring(0, 20)}${value.length > 20 ? '...' : ''}`);
      console.log('');
    }
  });
  
  process.exit(1);
}

// Eksik değişkenleri kontrol et
const missing = [];
Object.entries(requiredSecrets).forEach(([key, value]) => {
  if (!value || value === '' || value.includes('your-') || value.includes('YOUR_')) {
    missing.push(key);
  }
});

if (missing.length > 0) {
  console.error('⚠️  Eksik veya geçersiz değişkenler:\n');
  missing.forEach(key => {
    console.error(`   - ${key}`);
  });
  console.error('\n💡 .env dosyasında bu değişkenleri doldurun.\n');
}

// GitHub API ile secret ekleme fonksiyonu
async function addGitHubSecret(secretName, secretValue) {
  const publicKeyResponse = await fetch(
    `https://api.github.com/repos/${REPO_FULL_NAME}/actions/secrets/public-key`,
    {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    }
  );

  if (!publicKeyResponse.ok) {
    throw new Error(`Public key alınamadı: ${publicKeyResponse.statusText}`);
  }

  const { key_id, key } = await publicKeyResponse.json();

  // Secret'ı encrypt et (libsodium-wrappers kullanarak)
  // Node.js için sodium-native veya tweetnacl kullanabiliriz
  // Basit bir yaklaşım: crypto ile
  const secretBuffer = Buffer.from(secretValue, 'utf8');
  const keyBuffer = Buffer.from(key, 'base64');

  // GitHub'ın kullandığı NaCl box şifreleme
  // Basitleştirilmiş versiyon - gerçekte sodium-native gerekir
  // Şimdilik API çağrısı yapmayı deneyelim
  
  const sodium = require('sodium-native');
  const nonce = Buffer.alloc(24);
  sodium.randombytes_buf(nonce);
  
  const encrypted = Buffer.alloc(secretBuffer.length + sodium.crypto_box_SEALBYTES);
  sodium.crypto_box_seal(encrypted, secretBuffer, keyBuffer);
  
  const encryptedValue = encrypted.toString('base64');

  const response = await fetch(
    `https://api.github.com/repos/${REPO_FULL_NAME}/actions/secrets/${secretName}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        encrypted_value: encryptedValue,
        key_id: key_id,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Secret eklenemedi: ${response.statusText} - ${error}`);
  }

  return true;
}

// Ana işlem
(async () => {
  try {
    console.log('📤 GitHub Secrets ekleniyor...\n');

    for (const [key, value] of Object.entries(requiredSecrets)) {
      if (!value || value.includes('your-') || value.includes('YOUR_')) {
        console.log(`⏭️  ${key} atlandı (değer yok veya geçersiz)\n`);
        continue;
      }

      try {
        console.log(`🔄 ${key} ekleniyor...`);
        await addGitHubSecret(key, value);
        console.log(`✅ ${key} eklendi\n`);
      } catch (error) {
        console.error(`❌ ${key} eklenemedi: ${error.message}\n`);
      }
    }

    console.log('✅ GitHub Secrets ekleme tamamlandı!\n');
  } catch (error) {
    console.error('❌ Hata:', error.message);
    console.error('\n💡 GitHub CLI kullanmak için: https://cli.github.com/');
    console.error('   veya manuel olarak GitHub repository\'nizde secrets ekleyin.\n');
    process.exit(1);
  }
})();

