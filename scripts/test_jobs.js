#!/usr/bin/env node

// Simple test script for the job system
const { KeywordNormalizationJobProcessor } = require('./src/jobs/keywordNormalizationJobProcessor');
const { JobManager } = require('./src/services/jobManager');

async function testJobSystem() {
  try {
    console.log('🔄 Testing job system...');
    
    // Create a test job
    const job = await KeywordNormalizationJobProcessor.createKeywordNormalizationJob(
      'اليوم ذهبت إلى السوق واشتريت بعض الخضروات والفواكه',
      'diary',
      'test-diary-' + Date.now(),
      'test-user-1',
      { priority: 1 }
    );
    
    console.log('✅ Job created:', job.id);
    
    // Get job stats
    const stats = await JobManager.getJobStats();
    console.log('📊 Job stats:', stats);
    
    // Get jobs list
    const { jobs } = await JobManager.getJobs({ limit: 5 });
    console.log('📋 Recent jobs:', jobs.length);
    
    console.log('✅ Job system test completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Job system test failed:', error);
    process.exit(1);
  }
}

testJobSystem();
