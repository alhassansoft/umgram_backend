-- Add profile_image column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image TEXT NULL;

-- Add comment to the column
COMMENT ON COLUMN users.profile_image IS 'URL or path to user profile image';
