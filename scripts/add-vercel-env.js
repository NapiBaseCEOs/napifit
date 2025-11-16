/**
 * Vercel Environment Variables Ekleme Script
 * DATABASE_URL'i Vercel'e ekler
 */

const { execSync } = require('child_process');
const readline = require('readline');

const DATABASE_URL = 'postgresql://postgres:Sefatrtr178289*@db.eaibfqnjgkflvxdxfblw.supabase.co:5432/postgres';

console.log('🔧 Vercel Environment Variables Setup\n');
console.log('DATABASE_URL:', DATABASE_URL.replace(/:[^:@]+@/, ':****@')); // Şifreyi gizle
console.log('\n');

// PowerShell ile environment variable ekleme
const powershellScript = `
$env:VERCEL_ORG_ID = ""
$env:VERCEL_PROJECT_ID = ""
$url = "${DATABASE_URL}"

# Production
echo "Adding to production..."
echo $url | vercel env add DATABASE_URL production

# Preview  
echo "Adding to preview..."
echo $url | vercel env add DATABASE_URL preview

# Development
echo "Adding to development..."
echo $url | vercel env add DATABASE_URL development
`;

console.log('📝 Vercel CLI ile environment variable eklemek için:');
console.log('\n1. Vercel Dashboard\'a gidin: https://vercel.com/dashboard');
console.log('2. napifit projesini seçin');
console.log('3. Settings > Environment Variables');
console.log('4. Add New:');
console.log(`   Key: DATABASE_URL`);
console.log(`   Value: ${DATABASE_URL}`);
console.log('   Environment: Production, Preview, Development (hepsini seçin)');
console.log('5. Save');
console.log('\nVEYA terminal\'de:');
console.log(`vercel env add DATABASE_URL production`);
console.log(`(Value olarak: ${DATABASE_URL})`);

