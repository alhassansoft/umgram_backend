import { KeywordNormalizationJobProcessor } from '../src/jobs/keywordNormalizationJobProcessor';
import { JobManager } from '../src/services/jobManager';

async function testValidJobCreation() {
  try {
    console.log('🔄 Testing valid job creation...');
    
    // Create a job with valid UUID
    const job = await KeywordNormalizationJobProcessor.createKeywordNormalizationJob(
      'هذا نص اختبار للتأكد من أن نظام الجوبات يعمل بشكل صحيح. نحن نختبر معالجة النصوص العربية والكلمات المفتاحية.',
      'diary',
      'test-diary-' + Date.now(),
      'e8f220a0-a02b-42c3-8b5e-16b5e4e91a13', // Valid UUID
      { priority: 2 }
    );
    
    console.log('✅ Job created with ID:', job.id);
    console.log('📝 Job details:', {
      type: job.type,
      status: job.status,
      content_type: job.content_type,
      content_id: job.content_id,
      user_id: job.user_id
    });
    
    // Get updated stats
    const stats = await JobManager.getJobStats();
    console.log('📊 Updated job stats:', stats);
    
    console.log('✅ Valid job creation test completed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testValidJobCreation();
