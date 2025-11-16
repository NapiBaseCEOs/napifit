/**
 * Supabase Database URL'i Vercel'e ekle
 */

const { execSync } = require('child_process');

const DATABASE_URL = 'postgresql://postgres:Sefatrtr178289*@db.eaibfqnjgkflvxdxfblw.supabase.co:5432/postgres';

console.log('🔧 Vercel Environment Variables Setup\n');

try {
  // Production environment variable ekle
  console.log('📝 Adding DATABASE_URL to Vercel production...');
  execSync(`vercel env add DATABASE_URL production <<< "${DATABASE_URL}"`, { 
    stdio: 'inherit',
    shell: true 
  });
  console.log('✅ DATABASE_URL added to production\n');

  // Preview environment variable ekle
  console.log('📝 Adding DATABASE_URL to Vercel preview...');
  execSync(`vercel env add DATABASE_URL preview <<< "${DATABASE_URL}"`, { 
    stdio: 'inherit',
    shell: true 
  });
  console.log('✅ DATABASE_URL added to preview\n');

  // Development environment variable ekle
  console.log('📝 Adding DATABASE_URL to Vercel development...');
  execSync(`vercel env add DATABASE_URL development <<< "${DATABASE_URL}"`, { 
    stdio: 'inherit',
    shell: true 
  });
  console.log('✅ DATABASE_URL added to development\n');

  console.log('✅ All environment variables added successfully!');
  console.log('\n💡 Next steps:');
  console.log('   1. Run: npx prisma generate');
  console.log('   2. Run: npx prisma db push');
  console.log('   3. Deploy to Vercel');
} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('\n💡 Manual setup:');
  console.log('   1. Go to Vercel Dashboard > napifit > Settings > Environment Variables');
  console.log(`   2. Add DATABASE_URL = ${DATABASE_URL}`);
  console.log('   3. Select all environments (Production, Preview, Development)');
  console.log('   4. Save');
}

