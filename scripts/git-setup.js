/**
 * Git Setup ve Deploy Script'i
 * Bu script git repository'yi başlatır, commit yapar ve push eder
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('🚀 NapiFit Git Setup ve Deploy\n');

  // Versiyon bilgisini al
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'));
  const version = packageJson.version;

  console.log(`📦 Mevcut Versiyon: ${version}\n`);

  try {
    // Git kontrolü
    let gitExists = false;
    try {
      execSync('git --version', { stdio: 'ignore' });
      gitExists = true;
    } catch (error) {
      console.log('⚠️  Git bulunamadı. Lütfen Git kurulumu yapın:');
      console.log('   https://git-scm.com/download/win\n');
      process.exit(1);
    }

    // Git repository kontrolü
    const isGitRepo = fs.existsSync(path.join(process.cwd(), '.git'));

    if (!isGitRepo) {
      console.log('📁 Git repository başlatılıyor...');
      execSync('git init', { stdio: 'inherit' });
      execSync('git branch -M main', { stdio: 'ignore' });
    }

    // Remote kontrolü
    let hasRemote = false;
    try {
      execSync('git remote get-url origin', { stdio: 'ignore' });
      hasRemote = true;
    } catch (error) {
      hasRemote = false;
    }

    if (!hasRemote) {
      const repoUrl = await question('🔗 GitHub repository URL\'si girin (örn: https://github.com/kullanici/napifit.git): ');
      
      if (repoUrl.trim()) {
        try {
          execSync(`git remote add origin ${repoUrl.trim()}`, { stdio: 'inherit' });
          console.log('✅ Remote repository eklendi\n');
        } catch (error) {
          console.log('⚠️  Remote eklenemedi. Manuel olarak ekleyebilirsiniz.\n');
        }
      } else {
        console.log('⚠️  Remote URL girilmedi. Daha sonra manuel ekleyebilirsiniz.\n');
      }
    }

    // Değişiklikleri stage'e ekle
    console.log('📝 Değişiklikler stage\'e ekleniyor...');
    execSync('git add .', { stdio: 'inherit' });

    // Commit mesajı
    const commitMessage = `feat: Versiyon ${version} - Modern tasarım güncellemesi

- Fitness temalı modern renk paleti (yeşil/turuncu/mor)
- Ana sayfa hero section ve özellik kartları
- Login/Register sayfaları modernleştirildi
- Dashboard kartları hover efektleri ile güncellendi
- DEPLOY.md, CONTRIBUTING.md ve PR template eklendi
- README badges ve açıklamalar güncellendi
- Versiyon: ${version}`;

    // Commit yap
    console.log('💾 Commit yapılıyor...');
    try {
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
      console.log('✅ Commit başarılı!\n');
    } catch (error) {
      if (error.message.includes('nothing to commit')) {
        console.log('✅ Zaten commit edilmiş değişiklik yok.\n');
      } else {
        throw error;
      }
    }

    // Push yap
    try {
      execSync('git remote get-url origin', { stdio: 'ignore' });
      
      const pushNow = await question('📤 Şimdi GitHub\'a push yapılsın mı? (e/h): ');
      
      if (pushNow.toLowerCase() === 'e' || pushNow.toLowerCase() === 'evet') {
        console.log('\n📤 GitHub\'a push yapılıyor...');
        try {
          execSync('git push -u origin main', { stdio: 'inherit' });
          console.log('\n✅ Push başarılı!');
        } catch (error) {
          if (error.message.includes('branch')) {
            execSync('git push -u origin main --force', { stdio: 'inherit' });
            console.log('\n✅ Push başarılı (force)!');
          } else {
            console.log('\n⚠️  Push hatası. Manuel olarak push yapabilirsiniz:');
            console.log('   git push -u origin main');
          }
        }
      } else {
        console.log('\n📝 Daha sonra push yapmak için:');
        console.log('   git push -u origin main');
      }
    } catch (error) {
      console.log('\n⚠️  Remote repository bulunamadı.');
      console.log('   Daha sonra remote ekleyip push yapabilirsiniz:');
      console.log('   git remote add origin <repository-url>');
      console.log('   git push -u origin main');
    }

    console.log('\n✅ Git setup tamamlandı!');
    console.log(`\n📦 Versiyon: ${version}`);
    console.log('\n🚀 Cloudflare Pages deploy için:');
    console.log('   1. Cloudflare Dashboard > Pages > Create project');
    console.log('   2. GitHub repository\'nizi bağlayın');
    console.log('   3. Build command: npm run cloudflare:build');
    console.log('   4. Build output: .open-next');
    console.log('\n   Detaylı rehber için: DEPLOY.md');

  } catch (error) {
    console.error('\n❌ Hata:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();

