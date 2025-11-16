/**
 * Local Authentication Test
 * Vercel'i taklit ederek local'de test eder
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { queryOne, execute, testConnection } = require('../src/lib/turso');
const { hash, compare } = require('bcryptjs');

async function testLocalAuth() {
  console.log('🧪 Local Authentication Test Başlatılıyor...\n');

  // 1. Turso bağlantı testi
  console.log('1. Turso Bağlantı Testi...');
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error('   ❌ Turso bağlantısı başarısız!');
    console.error('   💡 .env dosyasında TURSO_DATABASE_URL ve TURSO_AUTH_TOKEN kontrol edin\n');
    process.exit(1);
  }
  console.log('   ✅ Turso bağlantısı başarılı\n');

  // 2. Test kullanıcısı oluştur
  console.log('2. Test Kullanıcısı Oluşturma...');
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'Test123456!';
  const passwordHash = await hash(testPassword, 10);
  const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const now = new Date().toISOString();

  try {
    const success = await execute(
      `INSERT INTO User (id, email, password, name, firstName, lastName, dateOfBirth, createdAt, updatedAt, onboardingCompleted) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        testEmail.toLowerCase(),
        passwordHash,
        'Test User',
        'Test',
        'User',
        new Date('2000-01-01').toISOString(),
        now,
        now,
        0
      ]
    );

    if (!success) {
      console.error('   ❌ Kullanıcı oluşturulamadı\n');
      process.exit(1);
    }
    console.log(`   ✅ Test kullanıcısı oluşturuldu: ${testEmail}\n`);
  } catch (error) {
    console.error('   ❌ Kullanıcı oluşturma hatası:', error.message);
    process.exit(1);
  }

  // 3. Kullanıcı sorgulama testi
  console.log('3. Kullanıcı Sorgulama Testi...');
  try {
    const user = await queryOne(
      'SELECT id, email, password, name FROM User WHERE email = ?',
      [testEmail.toLowerCase()]
    );

    if (!user) {
      console.error('   ❌ Kullanıcı bulunamadı\n');
      process.exit(1);
    }
    console.log(`   ✅ Kullanıcı bulundu: ${user.email}\n`);
  } catch (error) {
    console.error('   ❌ Kullanıcı sorgulama hatası:', error.message);
    process.exit(1);
  }

  // 4. Şifre doğrulama testi
  console.log('4. Şifre Doğrulama Testi...');
  try {
    const user = await queryOne(
      'SELECT password FROM User WHERE email = ?',
      [testEmail.toLowerCase()]
    );

    if (!user || !user.password) {
      console.error('   ❌ Kullanıcı veya şifre bulunamadı\n');
      process.exit(1);
    }

    const valid = await compare(testPassword, user.password);
    if (!valid) {
      console.error('   ❌ Şifre doğrulama başarısız\n');
      process.exit(1);
    }
    console.log('   ✅ Şifre doğrulama başarılı\n');
  } catch (error) {
    console.error('   ❌ Şifre doğrulama hatası:', error.message);
    process.exit(1);
  }

  // 5. Test kullanıcısını temizle
  console.log('5. Test Kullanıcısını Temizleme...');
  try {
    await execute('DELETE FROM User WHERE email = ?', [testEmail.toLowerCase()]);
    console.log('   ✅ Test kullanıcısı temizlendi\n');
  } catch (error) {
    console.warn('   ⚠️  Test kullanıcısı temizlenemedi:', error.message);
  }

  console.log('✅ Tüm testler başarılı! Authentication sistemi çalışıyor.\n');
  console.log('💡 Şimdi local\'de Next.js dev server\'ı başlatıp test edebilirsiniz:');
  console.log('   npm run dev\n');
}

testLocalAuth().catch((error) => {
  console.error('❌ Test hatası:', error);
  process.exit(1);
});

