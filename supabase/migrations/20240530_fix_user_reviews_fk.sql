-- Fix user_reviews table to work with profiles
-- This adds the missing relationship

-- First, let's check if we need to add profile_id or use user_id differently
-- The issue is that user_reviews.user_id references auth.users
-- but we're trying to join with profiles table

-- Option 1: Add a direct foreign key to profiles (if profiles.id = auth.users.id)
-- This assumes profiles.id is the same as auth.users.id

-- Drop existing foreign key if it exists
ALTER TABLE public.user_reviews 
DROP CONSTRAINT IF EXISTS user_reviews_user_id_fkey;

-- Add foreign key to profiles instead of auth.users
-- This works because profiles.id should match auth.users.id
ALTER TABLE public.user_reviews
ADD CONSTRAINT user_reviews_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
