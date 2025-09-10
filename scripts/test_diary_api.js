const axios = require('axios');

async function testDiaryCreation() {
  try {
    console.log('🚀 Testing diary creation via API...');
    
    const diaryData = {
      title: 'يوم جميل في الحديقة',
      content: 'اليوم كان يوماً رائعاً! ذهبت إلى الحديقة ولعبت مع الأطفال. الطقس كان جميلاً والشمس ساطعة. شعرت بالسعادة والفرح.',
      userId: 'e8f220a0-a02b-42c3-8b5e-16b5e4e91a13',
      emotion: 'happy',
      location: { lat: 24.7136, lng: 46.6753 }
    };

    const response = await axios.post('http://localhost:5001/api/diary', diaryData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // قد نحتاج token صالح
      }
    });

    console.log('✅ Diary created successfully!');
    console.log('📝 Response:', response.data);
    console.log('🔄 This should have triggered a background job for keyword normalization');
    
  } catch (error) {
    console.error('❌ Error creating diary:', error.response?.data || error.message);
    
    // Let's try without auth token
    if (error.response?.status === 401) {
      console.log('🔄 Trying without authentication...');
      try {
        const responseNoAuth = await axios.post('http://localhost:5001/api/diary', {
          title: 'يوم جميل في الحديقة',
          content: 'اليوم كان يوماً رائعاً! ذهبت إلى الحديقة ولعبت مع الأطفال. الطقس كان جميلاً والشمس ساطعة.',
          userId: 'e8f220a0-a02b-42c3-8b5e-16b5e4e91a13',
          emotion: 'happy',
          location: { lat: 24.7136, lng: 46.6753 }
        });
        
        console.log('✅ Diary created without auth!');
        console.log('📝 Response:', responseNoAuth.data);
      } catch (noAuthError) {
        console.error('❌ Error without auth:', noAuthError.response?.data || noAuthError.message);
      }
    }
  }
}

testDiaryCreation();
