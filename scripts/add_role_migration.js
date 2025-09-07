const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function addRoleColumn() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Read SQL migration file
    const sqlFile = path.join(__dirname, 'sql', 'add_user_role_column.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Execute migration
    console.log('Adding role column to users table...');
    const result = await client.query(sql);
    
    console.log('✅ Role column migration completed successfully');
    
    // Display final role distribution
    console.log('\nCurrent role distribution:');
    console.table(result.rows || []);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

// Run migration
if (require.main === module) {
  addRoleColumn()
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { addRoleColumn };
