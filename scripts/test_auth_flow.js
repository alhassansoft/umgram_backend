// Debug script to test authentication flow
const axios = require('axios');

const API_BASE = 'http://localhost:5001';

async function testAuthFlow() {
  try {
    console.log('🔍 Testing authentication flow...\n');

    // Test login
    console.log('1. Testing login...');
    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      identifier: 'user@local', // Using the seeded user credentials
      password: 'user'
    });

    console.log('✅ Login successful');
    console.log('Response keys:', Object.keys(loginResponse.data));
    
    const { accessToken, refreshToken, user } = loginResponse.data;
    
    if (!accessToken) {
      console.log('❌ No accessToken received');
      return;
    }
    
    if (!refreshToken) {
      console.log('❌ No refreshToken received');
      return;
    }
    
    console.log('✅ Both tokens received');
    console.log('Access token length:', accessToken.length);
    console.log('Refresh token length:', refreshToken.length);
    
    // Test API call with access token
    console.log('\n2. Testing API call with access token...');
    const apiResponse = await axios.get(`${API_BASE}/api/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ API call successful with access token');
    
    // Test refresh token
    console.log('\n3. Testing refresh token...');
    const refreshResponse = await axios.post(`${API_BASE}/api/auth/refresh`, {
      refreshToken
    });
    
    console.log('✅ Token refresh successful');
    console.log('New tokens received:', Object.keys(refreshResponse.data));
    
    const { accessToken: newAccessToken } = refreshResponse.data;
    
    // Test API call with new access token
    console.log('\n4. Testing API call with refreshed access token...');
    const apiResponse2 = await axios.get(`${API_BASE}/api/me`, {
      headers: { Authorization: `Bearer ${newAccessToken}` }
    });
    console.log('✅ API call successful with refreshed access token');
    
    console.log('\n🎉 All authentication flow tests passed!');
    
  } catch (error) {
    console.error('❌ Authentication flow test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testAuthFlow();
