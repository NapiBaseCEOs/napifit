/**
 * Supabase Storage Bucket Oluşturma Script'i (REST API ile)
 */

require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eaibfqnjgkflvxdxfbw.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhaWJmcW5qZ2tmbHZ4ZHhmYmx3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMxMDU0NCwiZXhwIjoyMDc4ODg2NTQ0fQ.YwfYQdotQ_osNoDP6qm-JSuj-b6oJf-TlIKpQL8pBY0';

console.log('🚀 Supabase Storage bucket oluşturuluyor...\n');
console.log(`📡 Supabase URL: ${supabaseUrl}\n`);

async function createBucket() {
  try {
    // Supabase Management API kullanarak bucket oluştur
    const response = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
        name: 'meals',
        public: true,
        file_size_limit: 5242880, // 5MB
        allowed_mime_types: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      })
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.message && data.message.includes('already exists')) {
        console.log('✅ "meals" bucket zaten mevcut!\n');
      } else {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }
    } else {
      console.log('✅ "meals" bucket başarıyla oluşturuldu!\n');
    }

    console.log('📝 Şimdi policy\'leri oluşturmanız gerekiyor:');
    console.log('   Supabase Dashboard > SQL Editor > New Query\n');
    console.log('Aşağıdaki SQL\'i çalıştırın:\n');
    console.log(`-- Storage Policies
CREATE POLICY IF NOT EXISTS "Kullanıcılar kendi fotoğraflarını yükleyebilir"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'meals' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY IF NOT EXISTS "Herkes public fotoğrafları okuyabilir"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'meals');

CREATE POLICY IF NOT EXISTS "Kullanıcılar kendi fotoğraflarını güncelleyebilir"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'meals' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'meals' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY IF NOT EXISTS "Kullanıcılar kendi fotoğraflarını silebilir"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'meals' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
`);

    console.log('\n✅ Bucket oluşturma tamamlandı!');
    
  } catch (error) {
    console.error('\n❌ Hata:', error.message);
    if (error.cause) {
      console.error('   Neden:', error.cause.message);
    }
    console.error('\n💡 Alternatif: Supabase Dashboard > Storage > New bucket');
    console.error('   - Name: meals');
    console.error('   - Public: ✅ Açık');
    process.exit(1);
  }
}

createBucket();


