#!/usr/bin/env node
require('dotenv').config();
const { Pool } = require('pg');

(async () => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL not found in .env');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: dbUrl });
  
  try {
    // Create test notification for admin2
    const result = await pool.query(`
      INSERT INTO "Notification" (id, "userId", type, "requestId", message, "createdAt")
      VALUES (
        gen_random_uuid(),
        '9a1be622-b327-48a2-9934-de0f28bb42a4',
        'CONSENT_REQUEST',
        'test-request-123',
        'هناك من يريد الإطلاع على يوميتك ضمن نتائج البحث، هل ترغب بالسماح بذلك؟',
        NOW()
      )
      RETURNING id;
    `);
    
    console.log('✅ Test CONSENT_REQUEST notification created successfully!');
    console.log('Notification ID:', result.rows[0].id);
    console.log('User ID: 9a1be622-b327-48a2-9934-de0f28bb42a4 (admin2)');
    console.log('Type: CONSENT_REQUEST');
    console.log('Request ID: test-request-123');
    console.log('\nNow log in as admin2 and check the notification bell to test the fix.');
    
  } catch (error) {
    console.error('Error creating test notification:', error.message);
  } finally {
    await pool.end();
  }
})();
