import { createClient } from "@supabase/supabase-js";

// Load from environment variables (supports both .env and direct env vars)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://eaibfqnjgkflvxdxfblw.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhaWJmcW5qZ2tmbHZ4ZHhmYmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMTA1NDQsImV4cCI6MjA3ODg4NjU0NH0.PQfYaHk8aF04Lbh1q2RhpaMfs46OZuFPtbwtNhAnhbc";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhaWJmcW5qZ2tmbHZ4ZHhmYmx3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMxMDU0NCwiZXhwIjoyMDc4ODg2NTQ0fQ.YwfYQdotQ_osNoDP6qm-JSuj-b6oJf-TlIKpQL8pBY0";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Regular client (for user operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (for admin operations)
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export const hasSupabaseServiceRole = !!supabaseServiceRoleKey;

