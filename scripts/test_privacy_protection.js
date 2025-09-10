#!/usr/bin/env node

// Test script for privacy protection in diary search
const axios = require('axios');

const API_BASE = 'http://localhost:5001';

async function testPrivacyProtection() {
  console.log('🔍 Testing privacy protection for diary search...\n');

  // Test case 1: Search with scope "others" - should return "لا أعرف"
  try {
    console.log('1️⃣ Testing scope="others" - should return generic response');
    const response = await axios.post(`${API_BASE}/api/search/diary/answer`, {
      question: "What time did the person come home?",
      scope: "others",
      userId: "test-user-123" // Any test user ID
    });

    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.final?.text === 'لا أعرف' && response.data.meta?.privacy_protected === true) {
      console.log('✅ Privacy protection WORKING! Generic response returned for others\' diaries');
    } else {
      console.log('❌ Privacy protection FAILED! Detailed response returned for others\' diaries');
    }
  } catch (error) {
    console.log('❌ Error testing scope="others":', error.response?.data || error.message);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Test case 2: Search with scope "mine" - should return detailed response
  try {
    console.log('2️⃣ Testing scope="mine" - should return detailed response');
    const response = await axios.post(`${API_BASE}/api/search/diary/answer`, {
      question: "What time did I come home?",
      scope: "mine",
      userId: "test-user-123"
    });

    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.final?.text !== 'لا أعرف' || !response.data.meta?.privacy_protected) {
      console.log('✅ Own diary search working normally - detailed responses allowed');
    } else {
      console.log('❌ Own diary search incorrectly blocked by privacy protection');
    }
  } catch (error) {
    console.log('❌ Error testing scope="mine":', error.response?.data || error.message);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Test case 3: Search with scope "all" - should work normally
  try {
    console.log('3️⃣ Testing scope="all" - should work normally');
    const response = await axios.post(`${API_BASE}/api/search/diary/answer`, {
      question: "What is the weather like?",
      scope: "all",
      userId: "test-user-123"
    });

    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (!response.data.meta?.privacy_protected) {
      console.log('✅ Scope "all" working normally - no privacy protection applied');
    } else {
      console.log('❌ Scope "all" incorrectly affected by privacy protection');
    }
  } catch (error) {
    console.log('❌ Error testing scope="all":', error.response?.data || error.message);
  }
}

testPrivacyProtection().catch(console.error);
