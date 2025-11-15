/**
 * Git Commit ve Push Script'i (GitHub Desktop Path ile)
 * Bu script GitHub Desktop'taki Git'i kullanır
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// GitHub Desktop Git path
const gitHubDesktopPath = 'C:\\Users\\Administrator\\AppData\\Local\\GitHubDesktop';
const possibleGitPaths = [
  path.join(gitHubDesktopPath, 'resources', 'app', 'git', 'cmd', 'git.exe'),
  path.join(gitHubDesktopPath, 'resources', 'app', 'git', 'mingw64', 'bin', 'git.exe'),
  path.join(process.env.LOCALAPPDATA || '', 'GitHubDesktop', 'resources', 'app', 'git', 'cmd', 'git.exe'),
  'git.exe', // PATH'de varsa
];

let gitPath = null;

// Git'i bul
for (const possiblePath of possibleGitPaths) {
  try {
    if (fs.existsSync(possiblePath)) {
      gitPath = possiblePath;
      break;
    }
  } catch (error) {
    // Devam et
  }
}

// PATH'de Git var mı kontrol et
if (!gitPath) {
  try {
    execSync('git --version', { stdio: 'ignore' });
    gitPath = 'git'; // PATH'de bulundu
  } catch (error) {
    // Git bulunamadı
  }
}

function gitCommand(command) {
  const fullCommand = gitPath === 'git' ? `git ${command}` : `"${gitPath}" ${command}`;
  return execSync(fullCommand, { 
    encoding: 'utf-8',
    cwd: process.cwd()
  });
}

console.log('🚀 NapiFit Git Commit ve Push\n');

if (!gitPath) {
  console.log('❌ Git bulunamadı!');
  console.log('   Lütfen Git\'i PATH\'e ekleyin veya manuel olarak çalıştırın.\n');
  process.exit(1);
}

console.log(`✅ Git bulundu: ${gitPath === 'git' ? 'PATH' : gitPath}\n`);

// Versiyon bilgisini al
const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'));
const version = packageJson.version;

console.log(`📦 Versiyon: ${version}\n`);

try {
  // Git repository kontrolü
  const isGitRepo = fs.existsSync(path.join(process.cwd(), '.git'));
  
  if (!isGitRepo) {
    console.log('📁 Git repository başlatılıyor...');
    gitCommand('init');
    gitCommand('branch -M main');
    console.log('✅ Git repository başlatıldı\n');
  }

  // Değişiklikleri stage'e ekle
  console.log('📝 Değişiklikler stage\'e ekleniyor...');
  gitCommand('add .');
  console.log('✅ Değişiklikler eklendi\n');

  // Commit mesajı
  const commitMessage = `feat: Versiyon ${version} - Tasarım iyileştirmeleri

- Arka plan kontrastı artırıldı (daha koyu, yazılar okunabilir)
- Header menü yeni tasarıma uyarlandı (yeşil/turuncu renkler)
- Gradient opacity değerleri düşürüldü (daha koyu arka plan)
- Tüm sayfalara koyu arka plan eklendi (#0a0a0a)
- Header hover efektleri ve modern butonlar
- Versiyon: ${version}`;

  // Commit yap
  console.log('💾 Commit yapılıyor...');
  try {
    gitCommand(`commit -m "${commitMessage}"`);
    console.log('✅ Commit başarılı!\n');
  } catch (error) {
    if (error.message.includes('nothing to commit')) {
      console.log('✅ Zaten commit edilmiş değişiklik yok.\n');
      process.exit(0);
    } else {
      throw error;
    }
  }

  // Remote kontrolü
  console.log('🔗 Remote repository kontrol ediliyor...');
  let hasRemote = false;
  let remoteUrl = '';
  
  try {
    remoteUrl = gitCommand('remote get-url origin').trim();
    hasRemote = true;
    console.log(`✅ Remote: ${remoteUrl}\n`);
  } catch (error) {
    console.log('⚠️  Remote repository yok.\n');
    console.log('   Remote eklemek için:');
    console.log('   git remote add origin https://github.com/KULLANICI/napifit.git\n');
    console.log('✅ Commit tamamlandı!');
    console.log('📤 Push için: git push -u origin main\n');
    process.exit(0);
  }

  // Push yap
  if (hasRemote) {
    console.log('📤 GitHub\'a push yapılıyor...');
    try {
      gitCommand('push -u origin main');
      console.log('\n✅ Push başarılı!');
      console.log(`📦 Versiyon: ${version}`);
      console.log('🚀 Cloudflare Pages otomatik deploy edecek (GitHub Actions)\n');
    } catch (error) {
      if (error.message.includes('branch')) {
        console.log('   ⚠️  Branch hatası, force push deneniyor...');
        try {
          gitCommand('push -u origin main --force');
          console.log('   ✅ Push başarılı (force)\n');
        } catch (forceError) {
          console.log('   ⚠️  Push hatası. Manuel push yapın:\n');
          console.log('      git push -u origin main\n');
        }
      } else {
        console.log('   ⚠️  Push hatası. Manuel push yapın:\n');
        console.log('      git push -u origin main\n');
        console.log('   Hata:', error.message);
      }
    }
  }

} catch (error) {
  console.error('\n❌ Hata:', error.message);
  process.exit(1);
}

