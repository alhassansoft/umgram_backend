require('dotenv').config();
const jwt = require('jsonwebtoken');

// Test the current token
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmZjNmNDQ4Ny0yYzlkLTRmNTgtYjA3Ni1kOTcyZjlhZDJmMzAiLCJlbWFpbCI6ImFkbWluMkBsb2NhbCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NzMyNTY0NywiZXhwIjoxNzU3NDEyMDQ3fQ.ML45U_-Od51DVawJ9Ghvg0I60jmu0GFzHLesrsMoL64';

console.log('🔍 Testing current token...');
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('JWT_ACCESS_SECRET:', process.env.JWT_ACCESS_SECRET);

// Test with JWT_SECRET
if (process.env.JWT_SECRET) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token valid with JWT_SECRET:', decoded);
  } catch (error) {
    console.log('❌ Token invalid with JWT_SECRET:', error.message);
  }
}

// Test with JWT_ACCESS_SECRET
if (process.env.JWT_ACCESS_SECRET) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    console.log('✅ Token valid with JWT_ACCESS_SECRET:', decoded);
  } catch (error) {
    console.log('❌ Token invalid with JWT_ACCESS_SECRET:', error.message);
  }
}

// Generate new token with JWT_ACCESS_SECRET
console.log('\n🔑 Generating new token with JWT_ACCESS_SECRET...');
const payload = {
  userId: 'ff3f4487-2c9d-4f58-b076-d972f9ad2f30',
  email: 'admin2@local', 
  role: 'admin'
};

const newToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '24h' });
console.log('New Token:');
console.log(newToken);
