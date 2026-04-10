-- Add clean verification flag and enforced flow structural metadata

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS player_uid TEXT UNIQUE;

-- Auto-generate UID if missing
UPDATE users 
SET player_uid = gen_random_uuid()::text
WHERE player_uid IS NULL;
