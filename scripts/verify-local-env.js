const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load .env manually since we can't rely on next/cli loading it for a standalone script
// without dotnev package (which is in devDependencies)
try {
  require('dotenv').config();
} catch (e) {
  console.log('⚠️  dotenv package not found or failed to load. Trying manual parsing if .env exists.');
  if (fs.existsSync('.env')) {
    const envConfig = require('dotenv').parse(fs.readFileSync('.env'));
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
  }
}

const REQUIRED_KEYS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_APP_URL',
  'GEMINI_API_KEY'
];

async function verify() {
  console.log('🔍 Verifying Local Environment Configuration...\n');

  let missing = [];
  let found = [];

  // 1. Check for existence of keys
  REQUIRED_KEYS.forEach(key => {
    if (process.env[key] && process.env[key].length > 0) {
      found.push(key);
      // Mask key for display
      const val = process.env[key];
      const masked = val.substring(0, 5) + '...' + val.substring(val.length - 4);
      console.log(`✅ ${key}: Found (${masked})`);
    } else {
      missing.push(key);
      console.log(`❌ ${key}: MISSING`);
    }
  });

  console.log('');

  // 2. Test Supabase Connection if keys are present
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('🔌 Testing Supabase Connection...');
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      
      // Try to fetch a simple thing, e.g. check auth status or a public table
      // We use a simple query that should always work if connected
      const { data, error } = await supabase.from('feature_requests').select('count', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Supabase Connection Failed: ${error.message}`);
      } else {
        console.log(`✅ Supabase Connection Successful! (Response code: ${error ? 'Error' : 'OK'})`);
      }

      // Test Service Role if available
      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
         const admin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
         );
         // Try an admin operation or just existence check
         console.log('✅ Service Role Key is present (Not verified by request to avoid side effects)');
      }

    } catch (err) {
      console.log(`❌ Supabase Client Error: ${err.message}`);
    }
  } else {
    console.log('⚠️  Skipping Supabase connection test due to missing keys.');
  }

  console.log('');
  if (missing.length > 0) {
    console.log(`⚠️  Found ${missing.length} missing environment variables.`);
    process.exit(1);
  } else {
    console.log('✅ All required environment variables are present locally.');
  }
}

verify();


