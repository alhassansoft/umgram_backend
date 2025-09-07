async function testAdminAPI() {
  try {
    console.log('🧪 Testing Admin Role System...');
    
    // 1. Login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identifier: 'admin@local',
        password: 'admin123'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    console.log('User:', loginData.user.username);
    console.log('Role:', loginData.user.role);
    
    const token = loginData.accessToken;
    
    // 2. Test admin endpoints
    console.log('\n2. Testing admin endpoints...');
    
    // Get all users
    console.log('📋 Getting all users:');
    const usersResponse = await fetch('http://localhost:5001/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!usersResponse.ok) {
      throw new Error(`Get users failed: ${usersResponse.status}`);
    }
    
    const usersData = await usersResponse.json();
    console.log(`Found ${usersData.users.length} users`);
    
    // Get admin users
    console.log('\n👑 Getting admin users:');
    const adminUsersResponse = await fetch('http://localhost:5001/api/admin/users/role/admin', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!adminUsersResponse.ok) {
      throw new Error(`Get admin users failed: ${adminUsersResponse.status}`);
    }
    
    const adminUsersData = await adminUsersResponse.json();
    console.log(`Found ${adminUsersData.users.length} admin users`);
    
    console.log('\n🎯 All tests passed! Role system is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminAPI();
