const { Client } = require('pg');
const argon2 = require('argon2');
require('dotenv').config();

async function createTestAdmin() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Hash the password
    const password = 'admin123';
    const hashedPassword = await argon2.hash(password);
    
    console.log('Password hash created for password:', password);

    // Update existing admin user with new password
    const result = await client.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, username, email, role',
      [hashedPassword, 'admin@local']
    );

    if (result.rows.length > 0) {
      console.log('✅ Admin user password updated:', result.rows[0]);
      console.log('📝 Login credentials:');
      console.log('  Email: admin@local');
      console.log('  Password: admin123');
    } else {
      console.log('❌ Admin user not found');
    }

  } catch (error) {
    console.error('❌ Failed to update admin password:', error.message);
  } finally {
    await client.end();
  }
}

createTestAdmin();
