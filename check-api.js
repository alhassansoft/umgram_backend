// Simple script to check Elasticsearch data via API
const https = require('https');
const http = require('http');

async function checkElasticsearchViaAPI() {
  console.log("🔍 Checking Elasticsearch data via API...");
  
  try {
    // Test basic search to see if we have any data
    console.log("\n1. Testing basic search...");
    const searchUrl = "http://localhost:5001/api/search/diary?q=*&mode=wide&scope=all&method=normal&size=10";
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (!data.hits) {
      console.log("❌ No hits found in response");
      console.log("Response:", JSON.stringify(data, null, 2));
      return;
    }
    
    console.log(`✅ Found ${data.hits.length} entries`);
    console.log("=".repeat(80));
    
    // Show details for each entry
    data.hits.forEach((hit, index) => {
      const source = hit._source || {};
      console.log(`\n${index + 1}. Entry Details:`);
      console.log(`   ID: ${hit._id}`);
      console.log(`   Score: ${hit._score}`);
      console.log(`   User ID: ${source.userId || "N/A"}`);
      console.log(`   Title: ${source.title || "No title"}`);
      console.log(`   Content Length: ${source.content?.length || 0} chars`);
      
      // Check if it's a chunk
      if (source.isChunk) {
        console.log(`   🧩 CHUNK: ${source.chunkIndex + 1}/${source.totalChunks}`);
        console.log(`   Original ID: ${source.originalId}`);
        console.log(`   Char Range: ${source.characterStart}-${source.characterEnd}`);
      } else {
        console.log(`   📄 FULL DOCUMENT (not chunked)`);
      }
      
      // Show content preview
      if (source.content) {
        const preview = source.content.substring(0, 100);
        console.log(`   Content: "${preview}${source.content.length > 100 ? "..." : ""}"`);
      }
      
      // Show extraction data
      if (source.entities?.length > 0) {
        console.log(`   Entities: [${source.entities.slice(0, 3).join(", ")}${source.entities.length > 3 ? "..." : ""}]`);
      }
      
      if (source.actions?.length > 0) {
        console.log(`   Actions: [${source.actions.slice(0, 3).join(", ")}${source.actions.length > 3 ? "..." : ""}]`);
      }
      
      console.log(`   Created: ${source.createdAt || "N/A"}`);
      console.log(`   Updated: ${source.updatedAt || "N/A"}`);
      console.log("   " + "-".repeat(60));
    });
    
    // Test chunked search specifically
    console.log("\n2. Testing search for long content (should show chunks)...");
    const longContentUrl = "http://localhost:5001/api/search/diary?q=نص طويل&mode=wide&scope=all&method=normal&size=5";
    
    const longResponse = await fetch(longContentUrl);
    const longData = await longResponse.json();
    
    if (longData.hits && longData.hits.length > 0) {
      console.log(`✅ Found ${longData.hits.length} results for long content search`);
      
      longData.hits.forEach((hit, index) => {
        const source = hit._source || {};
        console.log(`\n   Result ${index + 1}:`);
        console.log(`   ID: ${hit._id}`);
        console.log(`   Is Chunk: ${source.isChunk ? "YES" : "NO"}`);
        console.log(`   Content Length: ${source.content?.length || 0} chars`);
        
        if (source.isChunk) {
          console.log(`   Chunk: ${source.chunkIndex + 1}/${source.totalChunks}`);
          console.log(`   Original ID: ${source.originalId}`);
        }
      });
    } else {
      console.log("❌ No results found for long content search");
    }
    
    console.log("\n📊 Summary Analysis:");
    
    // Count chunks vs full documents
    const chunks = data.hits.filter(hit => hit._source?.isChunk);
    const fullDocs = data.hits.filter(hit => !hit._source?.isChunk);
    
    console.log(`   Total entries checked: ${data.hits.length}`);
    console.log(`   Chunked entries: ${chunks.length}`);
    console.log(`   Full documents: ${fullDocs.length}`);
    
    if (chunks.length > 0) {
      console.log("   ✅ Chunked indexing is working!");
      
      // Group chunks by original ID
      const chunkGroups = {};
      chunks.forEach(chunk => {
        const originalId = chunk._source.originalId;
        if (!chunkGroups[originalId]) {
          chunkGroups[originalId] = [];
        }
        chunkGroups[originalId].push(chunk);
      });
      
      console.log(`   Chunk groups: ${Object.keys(chunkGroups).length}`);
      Object.entries(chunkGroups).forEach(([originalId, groupChunks]) => {
        console.log(`     ${originalId}: ${groupChunks.length} chunks`);
      });
    } else {
      console.log("   ℹ️  No chunked entries found (this is normal if no long texts were indexed)");
    }
    
  } catch (error) {
    console.error("❌ Error checking data:", error.message);
  }
}

// Helper function for fetch (Node.js compatible)
function fetch(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    
    client.get(url, (res) => {
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

// Run the check
checkElasticsearchViaAPI()
  .then(() => {
    console.log("\n🎉 API check completed!");
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
  });
