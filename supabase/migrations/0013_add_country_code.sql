-- Add country_code column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS country_code VARCHAR(2) DEFAULT NULL;

-- Add index for country_code for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_country_code ON profiles(country_code);

-- Add comment
COMMENT ON COLUMN profiles.country_code IS 'ISO 3166-1 alpha-2 country code (e.g., TR, US, DE)';

