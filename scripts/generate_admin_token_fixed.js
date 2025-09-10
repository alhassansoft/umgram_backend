require('dotenv').config();
const jwt = require('jsonwebtoken');

const payload = {
  userId: 'ff3f4487-2c9d-4f58-b076-d972f9ad2f30', // admin2 user id
  email: 'admin2@local',
  role: 'admin'
};

const secret = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET;
if (!secret) {
  console.error('❌ JWT_SECRET or JWT_ACCESS_SECRET not found in environment variables!');
  process.exit(1);
}

const token = jwt.sign(payload, secret, { expiresIn: '24h' });

console.log('🔐 Admin Token Generated Successfully!');
console.log('================================');
console.log(token);
console.log('================================');
console.log('\n📋 Copy this token and use it in the admin interface:');
console.log(`Bearer ${token}`);

// Test the token
try {
  const decoded = jwt.verify(token, secret);
  console.log('\n✅ Token verification successful!');
  console.log('👤 User:', decoded.email);
  console.log('🔑 Role:', decoded.role);
  console.log('⏰ Expires:', new Date(decoded.exp * 1000).toLocaleString());
} catch (error) {
  console.error('❌ Token verification failed:', error.message);
}
