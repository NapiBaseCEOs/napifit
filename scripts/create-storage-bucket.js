/**
 * Supabase Storage Bucket Oluşturma Script'i
 * Bu script meals bucket'ını ve gerekli policy'leri oluşturur
 */

require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Hata: Supabase URL ve Service Role Key gerekli!');
  console.error('');
  console.error('📝 Lütfen .env.local veya .env dosyasına ekleyin:');
  console.error('');
  console.error('   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.error('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  console.error('');
  console.error('🔑 Service Role Key\'i almak için:');
  console.error('   1. Supabase Dashboard > Project Settings > API');
  console.error('   2. "service_role" key\'ini kopyalayın (secret key)');
  console.error('');
  console.error('💡 Alternatif: Supabase Dashboard > Storage > New bucket');
  console.error('   - Name: meals');
  console.error('   - Public: ✅ Açık');
  console.error('   Sonra migration dosyasını çalıştırın: supabase/migrations/0002_create_storage_bucket.sql');
  console.error('');
  process.exit(1);
}

// Admin client (service role key ile)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  },
  storage: {
    transform: {
      image: {}
    }
  }
});

async function createStorageBucket() {
  console.log('🚀 Supabase Storage bucket oluşturuluyor...\n');

  try {
    console.log(`📡 Supabase URL: ${supabaseUrl}`);
    console.log(`🔑 Service Role Key: ${supabaseServiceKey.substring(0, 20)}...`);
    console.log('');

    // 1. Bucket var mı kontrol et
    console.log('🔍 Mevcut bucket\'lar kontrol ediliyor...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Hata detayları:', listError);
      throw new Error(`Bucket listesi alınamadı: ${listError.message || JSON.stringify(listError)}`);
    }

    const existingBucket = buckets?.find(b => b.name === 'meals');
    
    if (existingBucket) {
      console.log('✅ "meals" bucket zaten mevcut!\n');
    } else {
      // 2. Bucket oluştur
      console.log('📦 "meals" bucket oluşturuluyor...');
      const { data: bucket, error: bucketError } = await supabase.storage.createBucket('meals', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      });

      if (bucketError) {
        throw new Error(`Bucket oluşturulamadı: ${bucketError.message}`);
      }

      console.log('✅ Bucket başarıyla oluşturuldu!\n');
    }

    // 3. Policy'leri oluştur (Supabase REST API ile)
    console.log('🔐 Storage policy\'leri oluşturuluyor...\n');

    // Policy SQL'leri
    const policies = [
      {
        name: 'Upload Policy - Kullanıcılar kendi fotoğraflarını yükleyebilir',
        sql: `
          CREATE POLICY IF NOT EXISTS "Kullanıcılar kendi fotoğraflarını yükleyebilir"
          ON storage.objects FOR INSERT
          TO authenticated
          WITH CHECK (
            bucket_id = 'meals' AND
            auth.uid()::text = (storage.foldername(name))[1]
          );
        `
      },
      {
        name: 'Read Policy - Herkes public fotoğrafları okuyabilir',
        sql: `
          CREATE POLICY IF NOT EXISTS "Herkes public fotoğrafları okuyabilir"
          ON storage.objects FOR SELECT
          TO public
          USING (bucket_id = 'meals');
        `
      },
      {
        name: 'Update Policy - Kullanıcılar kendi fotoğraflarını güncelleyebilir',
        sql: `
          CREATE POLICY IF NOT EXISTS "Kullanıcılar kendi fotoğraflarını güncelleyebilir"
          ON storage.objects FOR UPDATE
          TO authenticated
          USING (
            bucket_id = 'meals' AND
            auth.uid()::text = (storage.foldername(name))[1]
          );
        `
      },
      {
        name: 'Delete Policy - Kullanıcılar kendi fotoğraflarını silebilir',
        sql: `
          CREATE POLICY IF NOT EXISTS "Kullanıcılar kendi fotoğraflarını silebilir"
          ON storage.objects FOR DELETE
          TO authenticated
          USING (
            bucket_id = 'meals' AND
            auth.uid()::text = (storage.foldername(name))[1]
          );
        `
      }
    ];

    // Her policy'yi çalıştır
    for (const policy of policies) {
      try {
        const { error: policyError } = await supabase.rpc('exec_sql', {
          sql: policy.sql.trim()
        });

        if (policyError) {
          // RPC yoksa direkt SQL çalıştırmayı dene
          console.log(`⚠️  Policy oluşturulamadı (normal olabilir): ${policy.name}`);
          console.log(`   SQL: ${policy.sql.trim()}\n`);
        } else {
          console.log(`✅ ${policy.name} oluşturuldu`);
        }
      } catch (err) {
        console.log(`⚠️  Policy oluşturulamadı: ${policy.name}`);
        console.log(`   Hata: ${err.message}\n`);
      }
    }

    console.log('\n✅ Storage bucket kurulumu tamamlandı!\n');
    console.log('📝 Not: Policy\'lerin çalışması için SQL\'leri manuel olarak Supabase Dashboard\'dan çalıştırmanız gerekebilir.');
    console.log('   Supabase Dashboard > SQL Editor > New Query\n');
    
    for (const policy of policies) {
      console.log(`   ${policy.name}:`);
      console.log(`   ${policy.sql.trim()}\n`);
    }

  } catch (error) {
    console.error('\n❌ Hata:', error.message);
    console.error('\nDetaylar:', error);
    process.exit(1);
  }
}

// Çalıştır
createStorageBucket();

