// Test script to simulate frontend token refresh behavior
const axios = require('axios');

const API_BASE = 'http://localhost:5001';

async function simulateFrontendFlow() {
  try {
    console.log('🔄 Simulating frontend authentication flow...\n');

    // Step 1: Login and get tokens
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      identifier: 'user@local',
      password: 'user'
    });

    let { accessToken, refreshToken } = loginResponse.data;
    console.log('✅ Login successful');
    
    // Step 2: Make some API calls with the access token
    console.log('\n2. Making API calls with access token...');
    
    const client = axios.create({ baseURL: API_BASE });
    
    // Set up interceptor like the frontend does
    let tokenRefreshInProgress = false;
    client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && !error.config._retry && !tokenRefreshInProgress) {
          console.log('   🔄 401 detected, attempting token refresh...');
          error.config._retry = true;
          tokenRefreshInProgress = true;
          
          try {
            const refreshResponse = await axios.post(`${API_BASE}/api/auth/refresh`, {
              refreshToken
            });
            
            const newAccessToken = refreshResponse.data.accessToken;
            const newRefreshToken = refreshResponse.data.refreshToken;
            
            if (newAccessToken) {
              accessToken = newAccessToken;
              if (newRefreshToken) refreshToken = newRefreshToken;
              
              error.config.headers.Authorization = `Bearer ${newAccessToken}`;
              console.log('   ✅ Token refreshed, retrying original request...');
              
              tokenRefreshInProgress = false;
              return client.request(error.config);
            }
          } catch (refreshError) {
            console.log('   ❌ Token refresh failed');
            tokenRefreshInProgress = false;
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );
    
    // Test API calls
    const testAPI = async (description) => {
      try {
        const response = await client.get('/api/me', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log(`   ✅ ${description}: ${response.data.email}`);
        return true;
      } catch (err) {
        console.log(`   ❌ ${description}: ${err.response?.status} ${err.response?.statusText}`);
        return false;
      }
    };
    
    await testAPI('First API call');
    await testAPI('Second API call');
    
    // Step 3: Simulate token expiry by using an invalid token
    console.log('\n3. Simulating expired token scenario...');
    accessToken = 'invalid_token_to_trigger_401';
    
    await testAPI('API call with expired token (should auto-refresh)');
    
    console.log('\n🎉 Frontend flow simulation completed!');
    
  } catch (error) {
    console.error('❌ Simulation failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

simulateFrontendFlow();
