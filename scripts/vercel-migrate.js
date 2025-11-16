/**
 * Vercel Build Script - Supabase Migration
 * Bu script Vercel build sırasında otomatik çalışır
 */

const { execSync } = require('child_process');

console.log('🔄 Running Prisma migration...');

try {
  // Prisma generate
  console.log('📦 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Prisma db push (migration)
  console.log('🚀 Pushing database schema to Supabase...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  
  console.log('✅ Migration completed successfully!');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  // Build'i durdurma - sadece uyarı ver
  console.warn('⚠️ Continuing build despite migration error...');
}

