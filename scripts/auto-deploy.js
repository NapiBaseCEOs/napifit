/**
 * Otomatik Deploy Script'i
 * Bu script versiyonu günceller, commit yapar ve deploy eder
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 NapiFit Otomatik Deploy Başlatılıyor...\n');

try {
  // 1. Versiyonu güncelle
  console.log('📦 1. Versiyon güncelleniyor...');
  const { oldVersion, newVersion } = require('./version-update.js');
  console.log(`   ✅ ${oldVersion} -> ${newVersion}\n`);

  // 2. Git kontrolü (GitHub Desktop path ile)
  console.log('📋 2. Git kontrol ediliyor...');
  let gitExists = false;
  let gitPath = 'git';
  
  // GitHub Desktop path'ini kontrol et
  const gitHubDesktopPath = path.join(process.env.LOCALAPPDATA || '', 'GitHubDesktop');
  const possibleGitPaths = [
    path.join(gitHubDesktopPath, 'resources', 'app', 'git', 'cmd', 'git.exe'),
    path.join(gitHubDesktopPath, 'resources', 'app', 'git', 'mingw64', 'bin', 'git.exe'),
    'C:\\Users\\Administrator\\AppData\\Local\\GitHubDesktop\\resources\\app\\git\\cmd\\git.exe',
    'git.exe',
  ];
  
  for (const possiblePath of possibleGitPaths) {
    try {
      if (fs.existsSync(possiblePath)) {
        gitPath = possiblePath;
        gitExists = true;
        break;
      }
    } catch (error) {
      // Devam et
    }
  }
  
  // PATH'de Git var mı kontrol et
  if (!gitExists) {
    try {
      execSync('git --version', { stdio: 'ignore' });
      gitPath = 'git';
      gitExists = true;
    } catch (error) {
      // Git bulunamadı
    }
  }
  
  if (!gitExists) {
    console.log('   ⚠️  Git bulunamadı!\n');
    console.log('   💡 Git kurulumu için: GIT_SETUP.md\n');
    console.log('   ✅ Versiyon güncellendi: ' + newVersion);
    console.log('   ✅ Deploy scriptleri hazır');
    console.log('   ✅ Git kurulumundan sonra commit/push yapılacak\n');
    process.exit(0);
  } else {
    console.log(`   ✅ Git bulundu: ${gitPath === 'git' ? 'PATH' : gitPath}\n`);
  }

  // Git komutlarını çalıştırma fonksiyonu
  function runGit(command) {
    const fullCommand = gitPath === 'git' ? `git ${command}` : `"${gitPath}" ${command}`;
    return execSync(fullCommand, { 
      encoding: 'utf-8',
      stdio: command.includes('add') || command.includes('commit') || command.includes('push') ? 'inherit' : 'pipe',
      cwd: process.cwd()
    });
  }

  // 3. Git repository başlat (yoksa)
  const isGitRepo = fs.existsSync(path.join(process.cwd(), '.git'));
  if (!isGitRepo) {
    console.log('📁 3. Git repository başlatılıyor...');
    runGit('init');
    runGit('branch -M main');
    console.log('   ✅ Git repository başlatıldı\n');
  } else {
    console.log('📁 3. Git repository mevcut\n');
  }

  // 4. Değişiklikleri stage'e ekle
  console.log('📝 4. Değişiklikler stage\'e ekleniyor...');
  runGit('add .');
  console.log('   ✅ Değişiklikler eklendi\n');

  // 5. Commit yap
  console.log('💾 5. Commit yapılıyor...');
  const commitMessage = `feat: Versiyon ${newVersion} - Tam özellikli sağlık takip sistemi

- Egzersiz takibi API ve UI eklendi (CRUD işlemleri)
- Beslenme takibi API ve UI eklendi (çoklu yemek desteği)
- Sağlık metrikleri API ve UI eklendi
- Dashboard'a bugünkü egzersizler ve yakılan kalori eklendi
- HealthForms component'i ile kapsamlı form sistemi
- Tüm API route'larda error handling ve validation
- Dashboard UI iyileştirmeleri ve responsive tasarım
- Versiyon: ${newVersion}`;

  try {
    runGit(`commit -m "${commitMessage}"`);
    console.log('   ✅ Commit başarılı\n');
  } catch (error) {
    if (error.message.includes('nothing to commit')) {
      console.log('   ✅ Zaten commit edilmiş değişiklik yok\n');
    } else {
      throw error;
    }
  }

  // 6. Remote kontrolü
  console.log('🔗 6. Remote repository kontrol ediliyor...');
  let hasRemote = false;
  let remoteUrl = '';
  try {
    remoteUrl = runGit('remote get-url origin').trim();
    hasRemote = true;
    console.log(`   ✅ Remote: ${remoteUrl}\n`);
  } catch (error) {
    console.log('   ⚠️  Remote repository yok\n');
    console.log('   💡 Remote eklemek için:');
    console.log('      git remote add origin https://github.com/KULLANICI/napifit.git\n');
    console.log('   ✅ Commit tamamlandı');
    console.log('   ✅ Remote ekledikten sonra: git push -u origin main\n');
    process.exit(0);
  }

  // 7. Push yap
  if (hasRemote) {
    console.log('📤 7. GitHub\'a push yapılıyor...');
    try {
      runGit('push -u origin main');
      console.log('   ✅ Push başarılı\n');
      
      console.log('✅ Deploy tamamlandı!');
      console.log(`📦 Versiyon: ${newVersion}`);
      console.log('🚀 Cloudflare Pages otomatik deploy edecek (GitHub Actions)\n');
      
      // Otomatik test döngüsünü başlat
      console.log('🧪 Otomatik test döngüsü başlatılıyor...\n');
      try {
        const { spawn } = require('child_process');
        const testProcess = spawn('node', ['scripts/auto-deploy-test-loop.js'], {
          stdio: 'inherit',
          shell: true,
        });
        
        testProcess.on('close', (code) => {
          if (code === 0) {
            console.log('\n✅ Tüm testler başarılı! Deploy başarıyla tamamlandı.\n');
          } else {
            console.log(`\n❌ Testler başarısız oldu (exit code: ${code})\n`);
            process.exit(code);
          }
        });
        
        testProcess.on('error', (error) => {
          console.log(`\n⚠️  Test script'i çalıştırılamadı: ${error.message}`);
          console.log('💡 Manuel test için: npm run deploy:test\n');
        });
      } catch (error) {
        console.log(`\n⚠️  Test script'i çalıştırılamadı: ${error.message}`);
        console.log('💡 Manuel test için: npm run deploy:test\n');
      }
      
    } catch (error) {
      if (error.message.includes('branch')) {
        console.log('   ⚠️  Branch hatası, force push deneniyor...');
        try {
          runGit('push -u origin main --force');
          console.log('   ✅ Push başarılı (force)\n');
        } catch (forceError) {
          console.log('   ⚠️  Push hatası. Manuel push yapın:\n');
          console.log('      git push -u origin main\n');
        }
      } else {
        console.log('   ⚠️  Push hatası. Manuel push yapın:\n');
        console.log('      git push -u origin main\n');
      }
    }
  }

} catch (error) {
  console.error('\n❌ Hata:', error.message);
  console.log('\n💡 Manuel adımlar için: GIT_SETUP.md');
  process.exit(1);
}

