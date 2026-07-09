-- Migration v3: Internationalization Consistency
-- Execute this in your Supabase SQL Editor

-- 1. Update profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS major_zone VARCHAR(50),
ADD COLUMN IF NOT EXISTS preferred_locale VARCHAR(10) DEFAULT 'fr-FR';

-- 2. Update job_offers table
ALTER TABLE job_offers 
ADD COLUMN IF NOT EXISTS major_zone VARCHAR(50);

-- 3. (Optional) Copy data from existing zone to major_zone if applicable
-- UPDATE profiles SET major_zone = zone WHERE major_zone IS NULL AND zone IS NOT NULL;

-- 4. Enable RLS or update policies if you have strict filtering by zone
-- (Generally not needed if using existing policy logic)

COMMENT ON COLUMN profiles.major_zone IS 'Ecosystem slot: CAR_FR, CAR_EN, CAR_ES, INT_DIASPORA';
COMMENT ON COLUMN job_offers.major_zone IS 'Target ecosystem for the mission';
