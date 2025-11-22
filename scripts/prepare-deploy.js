/**
 * Deploy Hazırlık Script'i
 * Bu script deploy öncesi tüm kontrol ve hazırlıkları yapar
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 NapiFit Deploy Hazırlık Başlatılıyor...\n');

try {
  // 1. Versiyon güncelle
  console.log('📦 1. Versiyon güncelleniyor...');
  const versionScript = require('./version-update.js');
  const { oldVersion, newVersion } = versionScript;
  console.log(`   ✅ ${oldVersion} -> ${newVersion}\n`);

  // 2. Package.json kontrolü
  console.log('📋 2. Package.json kontrol ediliyor...');
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'));
  console.log(`   ✅ Versiyon: ${packageJson.version}\n`);

  // 3. Version.ts kontrolü
  console.log('📋 3. Version.ts kontrol ediliyor...');
  const versionTs = fs.readFileSync(path.join(process.cwd(), 'src', 'config', 'version.ts'), 'utf-8');
  if (versionTs.includes(packageJson.version)) {
    console.log(`   ✅ Versiyon eşleşiyor: ${packageJson.version}\n`);
  } else {
    console.log(`   ⚠️  Versiyon eşleşmiyor!\n`);
  }

  // 4. .env.example kontrolü
  console.log('📋 4. .env.example kontrol ediliyor...');
  if (fs.existsSync(path.join(process.cwd(), '.env.example'))) {
    console.log('   ✅ .env.example mevcut\n');
  } else {
    console.log('   ⚠️  .env.example bulunamadı\n');
  }

  // 5. Prisma schema kontrolü
  console.log('📋 5. Prisma schema kontrol ediliyor...');
  if (fs.existsSync(path.join(process.cwd(), 'prisma', 'schema.prisma'))) {
    const schema = fs.readFileSync(path.join(process.cwd(), 'prisma', 'schema.prisma'), 'utf-8');
    if (schema.includes('provider = "sqlite"')) {
      console.log('   ✅ SQLite (D1) provider doğru\n');
    } else {
      console.log('   ⚠️  SQLite provider bulunamadı\n');
    }
  }

  // 6. Wrangler.toml kontrolü
  console.log('📋 6. Wrangler.toml kontrol ediliyor...');
  if (fs.existsSync(path.join(process.cwd(), 'wrangler.toml'))) {
    const wrangler = fs.readFileSync(path.join(process.cwd(), 'wrangler.toml'), 'utf-8');
    if (wrangler.includes('d1_databases')) {
      console.log('   ✅ D1 database binding mevcut\n');
    } else {
      console.log('   ⚠️  D1 database binding bulunamadı\n');
    }
  }

  // 7. Git kontrolü
  console.log('📋 7. Git kontrol ediliyor...');
  try {
    execSync('git --version', { stdio: 'ignore' });
    const isGitRepo = fs.existsSync(path.join(process.cwd(), '.git'));
    
    if (isGitRepo) {
      console.log('   ✅ Git repository mevcut\n');
      
      // Remote kontrolü
      try {
        const remote = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
        console.log(`   ✅ Remote repository: ${remote}\n`);
      } catch (error) {
        console.log('   ⚠️  Remote repository yok. Eklemek için:');
        console.log('      git remote add origin <repository-url>\n');
      }
    } else {
      console.log('   ⚠️  Git repository yok. Başlatmak için:');
      console.log('      git init\n');
    }
  } catch (error) {
    console.log('   ⚠️  Git bulunamadı. Git kurulumu gerekli.\n');
    console.log('      Detaylar için: GIT_SETUP.md\n');
  }

  // 8. Build testi (opsiyonel)
  console.log('📋 8. Build testi (opsiyonel)...');
  console.log('   ℹ️  Build testini atlıyorum. Manuel test için:');
  console.log('      npm run cloudflare:build\n');

  console.log('✅ Deploy hazırlığı tamamlandı!\n');
  
  console.log('📝 Sonraki adımlar:');
  console.log('   1. Git kurulumu yapılmadıysa: GIT_SETUP.md dosyasına bakın');
  console.log('   2. Git kurulumundan sonra: node scripts/git-setup.js');
  console.log('   3. Cloudflare Pages deploy: DEPLOY.md dosyasına bakın\n');

} catch (error) {
  console.error('❌ Hata:', error.message);
  process.exit(1);
}

