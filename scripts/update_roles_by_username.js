const { Client } = require('pg');
require('dotenv').config();

async function updateUserRolesByUsername() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Get all users
    const allUsersResult = await client.query('SELECT id, username, email, role FROM users ORDER BY username');
    console.log(`Found ${allUsersResult.rows.length} users to process`);

    let updatedCount = 0;
    
    for (const user of allUsersResult.rows) {
      let newRole = null;
      
      // Determine role based on username
      if (user.username.toLowerCase().startsWith('admin')) {
        newRole = 'admin';
      } else if (user.username.toLowerCase().startsWith('user')) {
        newRole = 'user';
      } else if (user.username.toLowerCase().startsWith('supervisor')) {
        newRole = 'supervisor';
      }
      
      // Update if role needs to change
      if (newRole && newRole !== user.role) {
        await client.query(
          'UPDATE users SET role = $1 WHERE id = $2',
          [newRole, user.id]
        );
        
        console.log(`✅ Updated ${user.username} (${user.email}): ${user.role} → ${newRole}`);
        updatedCount++;
      } else if (newRole) {
        console.log(`➡️  ${user.username} (${user.email}): already ${user.role}`);
      } else {
        console.log(`⚠️  ${user.username} (${user.email}): no pattern match, keeping ${user.role}`);
      }
    }

    console.log(`\n📊 Summary: ${updatedCount} users updated`);

    // Show final role distribution
    const rolesResult = await client.query(`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role 
      ORDER BY role
    `);
    
    console.log('\n📋 Final role distribution:');
    console.table(rolesResult.rows);

    // Show all users with their final roles
    const finalUsersResult = await client.query(`
      SELECT username, email, role 
      FROM users 
      ORDER BY role, username
    `);
    
    console.log('\n👥 All users and their roles:');
    finalUsersResult.rows.forEach(user => {
      const roleIcon = user.role === 'admin' ? '👑' : user.role === 'supervisor' ? '👥' : '👤';
      console.log(`${roleIcon} ${user.username} (${user.email}) - ${user.role}`);
    });

  } catch (error) {
    console.error('❌ Failed to update user roles:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\nDatabase connection closed');
  }
}

// Run script
if (require.main === module) {
  updateUserRolesByUsername()
    .then(() => {
      console.log('User roles update completed successfully! 🎉');
      process.exit(0);
    })
    .catch(error => {
      console.error('User roles update failed:', error);
      process.exit(1);
    });
}

module.exports = { updateUserRolesByUsername };
