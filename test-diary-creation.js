// Create a test diary with long content to verify chunking
const http = require('http');

async function createTestDiary() {
  console.log("📝 Creating test diary with long content...");
  
  // Create a long text (over 2500 characters to trigger chunking)
  const longText = `هذا نص تجريبي طويل جداً لاختبار نظام التقسيم. `.repeat(50) +
    `سنتأكد من أن هذا النص سيتم تقسيمه إلى أجزاء منفصلة في Elasticsearch. ` +
    `كل جزء يجب أن يكون قابلاً للبحث بشكل مستقل. ` +
    `هذا يحل مشكلة النصوص الطويلة التي كانت تُحفظ كوثيقة واحدة كبيرة. ` +
    `النظام الجديد سيقسم النص إلى chunks صغيرة ومفيدة للبحث. `.repeat(20);

  console.log(`📏 Test text length: ${longText.length} characters`);
  
  const testDiary = {
    title: "يومية تجريبية للتحقق من التقسيم",
    content: longText,
    userId: "e8f220a0-a02b-42c3-8b5e-16b5e4e91a13" // Using existing user ID
  };
  
  try {
    // Create the diary (this should trigger chunking)
    const postData = JSON.stringify(testDiary);
    
    const response = await makeRequest('POST', '/api/diary', postData, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    });
    
    if (response.statusCode === 201) {
      const diary = JSON.parse(response.data);
      console.log("✅ Test diary created successfully!");
      console.log(`   Diary ID: ${diary.id}`);
      console.log(`   Title: ${diary.title}`);
      console.log(`   Content Length: ${diary.content.length} chars`);
      
      // Wait a moment for indexing
      console.log("\n⏳ Waiting for Elasticsearch indexing...");
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Now search for the diary
      console.log("\n🔍 Searching for the created diary...");
      
      // Search by ID
      const searchUrl = `http://localhost:5001/api/search/diary?q=${diary.id}&mode=wide&scope=all&method=normal&size=20`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();
      
      if (searchData.hits && searchData.hits.length > 0) {
        console.log(`✅ Found ${searchData.hits.length} results for diary search:`);
        
        searchData.hits.forEach((hit, index) => {
          const source = hit._source;
          console.log(`\n   Result ${index + 1}:`);
          console.log(`   ID: ${hit._id}`);
          console.log(`   Is Chunk: ${source.isChunk ? "YES" : "NO"}`);
          console.log(`   Content Length: ${source.content?.length || 0} chars`);
          
          if (source.isChunk) {
            console.log(`   🧩 Chunk: ${source.chunkIndex + 1}/${source.totalChunks}`);
            console.log(`   Original ID: ${source.originalId}`);
            console.log(`   Char Range: ${source.characterStart}-${source.characterEnd}`);
          }
          
          const preview = (source.content || "").substring(0, 100);
          console.log(`   Content: "${preview}${source.content?.length > 100 ? "..." : ""}"`);
        });
        
        // Check if chunking worked
        const chunks = searchData.hits.filter(hit => hit._source.isChunk);
        const fullDocs = searchData.hits.filter(hit => !hit._source.isChunk);
        
        console.log(`\n📊 Analysis:`);
        console.log(`   Total results: ${searchData.hits.length}`);
        console.log(`   Chunks: ${chunks.length}`);
        console.log(`   Full documents: ${fullDocs.length}`);
        
        if (chunks.length > 0) {
          console.log("   ✅ SUCCESS: Chunking is working!");
          console.log("   ✅ Long text was split into independent searchable chunks");
        } else if (fullDocs.length > 0 && fullDocs[0]._source.content?.length > 2500) {
          console.log("   ❌ WARNING: Long text was stored as single document");
          console.log("   ❌ Chunking may not be working properly");
        } else {
          console.log("   ℹ️  Text was stored as single document (may be under threshold)");
        }
        
      } else {
        console.log("❌ No results found when searching for the created diary");
        console.log("   This might indicate an indexing issue");
      }
      
      // Also try searching by content
      console.log("\n🔍 Searching by content...");
      const contentSearchUrl = "http://localhost:5001/api/search/diary?q=تجريبي&mode=wide&scope=all&method=normal&size=10";
      const contentResponse = await fetch(contentSearchUrl);
      const contentData = await contentResponse.json();
      
      if (contentData.hits && contentData.hits.length > 0) {
        console.log(`✅ Content search found ${contentData.hits.length} results`);
      } else {
        console.log("❌ Content search found no results");
      }
      
      return diary.id;
      
    } else {
      console.log(`❌ Failed to create diary. Status: ${response.statusCode}`);
      console.log(`   Response: ${response.data}`);
    }
    
  } catch (error) {
    console.error("❌ Error creating test diary:", error.message);
  }
}

// Helper functions
function makeRequest(method, path, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: path,
      method: method,
      headers: headers
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: responseData
        });
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            json: () => Promise.resolve(JSON.parse(data)),
            status: res.statusCode
          });
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Run the test
createTestDiary().then((diaryId) => {
  console.log("\n🎉 Test completed!");
  if (diaryId) {
    console.log(`   Diary ID: ${diaryId}`);
    console.log("   You can now search for this diary to verify chunking works");
  }
}).catch(console.error);
