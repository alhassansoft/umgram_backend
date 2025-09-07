-- Create test users with roles for testing
-- Run: psql -h localhost -U postgres -d umgram_db -f scripts/insert_test_users.sql

-- Insert admin user
INSERT INTO users (username, email, password, role, created_at, updated_at)
VALUES (
  'admin_test',
  'admin@local',
  '$2b$10$OuPMG8Zl6qYfyDSVtuxB7eVqAS.MiY9ImB4FXJ8bH7Un2sf6Wauvi', -- admin123
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  password = '$2b$10$OuPMG8Zl6qYfyDSVtuxB7eVqAS.MiY9ImB4FXJ8bH7Un2sf6Wauvi';

-- Insert regular user
INSERT INTO users (username, email, password, role, created_at, updated_at)
VALUES (
  'user_test',
  'user@local',
  '$2b$10$3ALE7JbrArIrYP2qN3..XetwypUDmGyYCYvd4Zmnrlu8uBXYS3PXC', -- password123
  'user',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = 'user',
  password = '$2b$10$3ALE7JbrArIrYP2qN3..XetwypUDmGyYCYvd4Zmnrlu8uBXYS3PXC';

-- Verify inserted users
SELECT username, email, role, created_at FROM users WHERE email IN ('admin@local', 'user@local');
