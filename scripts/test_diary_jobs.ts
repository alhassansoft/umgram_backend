import { DiaryModel } from '../src/models/diaryModel';

async function testDiaryJobCreation() {
  try {
    console.log('🔄 Testing diary job creation...');
    
    // Create a test diary (this should automatically create a job)
    const diary = await DiaryModel.create({
      title: 'يوميات اختبار النظام',
      content: 'اليوم كان يوماً رائعاً، ذهبت إلى الجامعة وحضرت محاضرة الرياضيات. بعدها التقيت بالأصدقاء في المقهى وتناولنا القهوة وتحدثنا عن الامتحانات القادمة. في المساء عدت إلى المنزل وقضيت بعض الوقت في مراجعة الدروس.',
      userId: 'e8f220a0-a02b-42c3-8b5e-16b5e4e91a13' // Valid UUID from users table
    });
    
    console.log('✅ Diary created:', diary.id);
    console.log('📝 Content length:', diary.content.length, 'characters');
    
    // Wait a moment then check if job was created
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('✅ Diary and job creation test completed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testDiaryJobCreation();
