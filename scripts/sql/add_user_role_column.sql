-- Add role column to users table if it doesn't exist
-- This migration adds role support for user,admin,supervisor system

-- Add role column with default value 'user'
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'supervisor'));

-- Update existing users to have 'user' role if null
UPDATE users 
SET role = 'user' 
WHERE role IS NULL;

-- Make role column NOT NULL after setting defaults
ALTER TABLE users 
ALTER COLUMN role SET NOT NULL;

-- Create index for efficient role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Grant admin role to first user (optional - remove if not needed)
-- UPDATE users SET role = 'admin' WHERE id = 1;

-- Display role distribution
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role 
ORDER BY role;
