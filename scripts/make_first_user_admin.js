const { Client } = require('pg');
require('dotenv').config();

async function makeFirstUserAdmin() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Find first user
    const firstUserResult = await client.query('SELECT id, username, email, role FROM users ORDER BY created_at ASC LIMIT 1');
    
    if (firstUserResult.rows.length === 0) {
      console.log('❌ No users found in database');
      return;
    }

    const firstUser = firstUserResult.rows[0];
    console.log('First user found:', {
      id: firstUser.id,
      username: firstUser.username,
      email: firstUser.email,
      currentRole: firstUser.role
    });

    if (firstUser.role === 'admin') {
      console.log('✅ First user is already an admin');
      return;
    }

    // Make first user admin
    await client.query('UPDATE users SET role = $1 WHERE id = $2', ['admin', firstUser.id]);
    
    console.log('✅ First user has been upgraded to admin role');

    // Show final role distribution
    const rolesResult = await client.query('SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY role');
    console.log('\nCurrent role distribution:');
    console.table(rolesResult.rows);

  } catch (error) {
    console.error('❌ Failed to make first user admin:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

// Run script
if (require.main === module) {
  makeFirstUserAdmin()
    .then(() => {
      console.log('Admin creation script completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Admin creation script failed:', error);
      process.exit(1);
    });
}

module.exports = { makeFirstUserAdmin };
