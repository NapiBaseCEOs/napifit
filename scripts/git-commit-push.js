/**
 * Git Commit ve Push Script'i
 * Bu script değişiklikleri commit eder ve GitHub'a push eder
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Versiyon bilgisini al
const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'));
const version = packageJson.version;

console.log('🚀 Git commit ve push başlatılıyor...');
console.log(`📦 Versiyon: ${version}\n`);

try {
  // Git init (eğer yoksa)
  try {
    execSync('git status', { stdio: 'ignore' });
  } catch (error) {
    console.log('📁 Git repository başlatılıyor...');
    execSync('git init', { stdio: 'inherit' });
    execSync('git branch -M main', { stdio: 'ignore' });
  }

  // Tüm değişiklikleri ekle
  console.log('📝 Değişiklikler stage\'e ekleniyor...');
  execSync('git add .', { stdio: 'inherit' });

  // Commit mesajı oluştur
  const commitMessage = `feat: Versiyon ${version} - Modern tasarım güncellemesi ve GitHub hazırlıkları

- Fitness temalı modern renk paleti (yeşil/turuncu)
- Ana sayfa hero section ve özellik kartları güncellendi
- Login/Register sayfaları modernleştirildi
- Dashboard kartları hover efektleri ile güncellendi
- DEPLOY.md, CONTRIBUTING.md ve PR template eklendi
- README badges ve açıklamalar güncellendi
- Versiyon: ${version}`;

  // Commit yap
  console.log('💾 Commit yapılıyor...');
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

  console.log('\n✅ Commit başarılı!');
  console.log('\n📤 Push için GitHub repository URL\'si gerekli.');
  console.log('   Komut: git remote add origin <repository-url>');
  console.log('   Sonra: git push -u origin main');
  
} catch (error) {
  console.error('❌ Hata:', error.message);
  
  if (error.message.includes('not a git repository')) {
    console.log('\n💡 Git repository başlatılamadı. Git kurulu olduğundan emin olun.');
  } else if (error.message.includes('nothing to commit')) {
    console.log('\n✅ Zaten commit edilmiş değişiklik yok.');
  } else {
    console.log('\n💡 Git komutları çalıştırılamadı. Git kurulu olduğundan emin olun.');
  }
  
  process.exit(1);
}

