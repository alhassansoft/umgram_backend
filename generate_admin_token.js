const jwt = require('jsonwebtoken');

const payload = {
  userId: 'ff3f4487-2c9d-4f58-b076-d972f9ad2f30', // admin2 user id
  email: 'admin2@local',
  role: 'admin'
};

const secret = process.env.JWT_SECRET || 'your-secret-key-here';
const token = jwt.sign(payload, secret, { expiresIn: '24h' });

console.log('Admin Token:');
console.log(token);
console.log('\nUse this token in Authorization header:');
console.log(`Authorization: Bearer ${token}`);
