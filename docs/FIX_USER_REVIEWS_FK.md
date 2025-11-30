# 🔧 Critical Fix Required: user_reviews Foreign Key

## ⚠️ Issue Detected
Production logs show error:
```
Could not find a relationship between 'user_reviews' and 'profiles' in the schema cache
```

## 🎯 Root Cause
`user_reviews` tablosu `auth.users`'a foreign key ile bağlı, ancak API `profiles` tablosu ile join yapmaya çalışıyor.

## ✅ Solution
Foreign key'i `auth.users` yerine `profiles` tablosuna yönlendir.

## 📋 Fix Steps

### Option 1: Supabase Dashboard (Recommended)
1. https://app.supabase.com → napifit projesi
2. SQL Editor → New Query
3. Aşağıdaki SQL'i çalıştır:

```sql
-- Drop existing foreign key
ALTER TABLE public.user_reviews 
DROP CONSTRAINT IF EXISTS user_reviews_user_id_fkey;

-- Add foreign key to profiles
ALTER TABLE public.user_reviews
ADD CONSTRAINT user_reviews_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';
```

### Option 2: Use Migration File
Migration file created: `supabase/migrations/20240530_fix_user_reviews_fk.sql`

Run in Supabase SQL Editor.

## 🧪 Verification
After running the SQL:

1. Check logs:
```bash
npx vercel logs https://napifit.vercel.app
```

2. Test API:
```bash
curl https://napifit.vercel.app/api/reviews/featured
```

3. Should see no more PGRST200 errors

## 📊 Impact
- **Current**: Reviews API returns fallback data ✅ (still works)
- **After Fix**: Reviews API can fetch real user reviews from database ✅

## ⏱️ Priority
**MEDIUM** - Site works with fallback, but real reviews won't show until fixed.

---
**Created**: 2025-11-30 14:50
**Status**: Awaiting manual SQL execution
