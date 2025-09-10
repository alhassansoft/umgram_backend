// Find all chunks for a specific diary
const http = require('http');

async function findDiaryChunks() {
  console.log("🔍 Searching for all chunks of diary ID: 34efdb9c-26f9-4be5-92fe-04fcce299f53");
  
  try {
    // Search for the original document
    console.log("\n1. Searching for original document...");
    let url = "http://localhost:5001/api/search/diary?q=34efdb9c-26f9-4be5-92fe-04fcce299f53&mode=wide&scope=all&method=normal&size=1";
    let response = await fetch(url);
    let data = await response.json();
    
    if (data.hits && data.hits.length > 0) {
      console.log("✅ Found original document:");
      const hit = data.hits[0];
      console.log(`   ID: ${hit._id}`);
      console.log(`   Is Chunk: ${hit._source.isChunk ? "YES" : "NO"}`);
      console.log(`   Content Length: ${hit._source.content?.length || 0} chars`);
      console.log(`   Title: ${hit._source.title || "No title"}`);
    } else {
      console.log("❌ Original document not found");
    }
    
    // Search for chunk pattern  
    console.log("\n2. Searching for chunks with pattern...");
    url = "http://localhost:5001/api/search/diary?q=chunk_&mode=wide&scope=all&method=normal&size=20";
    response = await fetch(url);
    data = await response.json();
    
    if (data.hits && data.hits.length > 0) {
      console.log(`✅ Found ${data.hits.length} potential chunks:`);
      
      const targetChunks = data.hits.filter(hit => 
        hit._id.includes("34efdb9c-26f9-4be5-92fe-04fcce299f53") || 
        hit._source.originalId === "34efdb9c-26f9-4be5-92fe-04fcce299f53"
      );
      
      if (targetChunks.length > 0) {
        console.log(`\n🎯 Found ${targetChunks.length} chunks for our target diary:`);
        
        targetChunks
          .sort((a, b) => (a._source.chunkIndex || 0) - (b._source.chunkIndex || 0))
          .forEach((hit, index) => {
            const source = hit._source;
            console.log(`\n   Chunk ${index + 1}:`);
            console.log(`   ID: ${hit._id}`);
            console.log(`   Original ID: ${source.originalId}`);
            console.log(`   Chunk Index: ${source.chunkIndex + 1}/${source.totalChunks}`);
            console.log(`   Content Length: ${source.content?.length || 0} chars`);
            console.log(`   Char Range: ${source.characterStart}-${source.characterEnd}`);
            console.log(`   Content Preview: "${(source.content || "").substring(0, 100)}..."`);
          });
      } else {
        console.log("❌ No chunks found for our target diary");
      }
      
      // Show all chunks found (for debugging)
      console.log(`\n📋 All chunks found in system:`);
      data.hits.forEach((hit, index) => {
        if (hit._source.isChunk) {
          console.log(`   ${index + 1}. ${hit._id} (Original: ${hit._source.originalId})`);
        }
      });
      
    } else {
      console.log("❌ No chunks found in system");
    }
    
    // Search for all documents with long content
    console.log("\n3. Searching for all long documents...");
    url = "http://localhost:5001/api/search/diary?q=*&mode=wide&scope=all&method=normal&size=50";
    response = await fetch(url);
    data = await response.json();
    
    if (data.hits && data.hits.length > 0) {
      console.log(`✅ Found ${data.hits.length} total documents:`);
      
      const longDocs = data.hits.filter(hit => (hit._source.content?.length || 0) > 3000);
      const chunks = data.hits.filter(hit => hit._source.isChunk);
      const fullDocs = data.hits.filter(hit => !hit._source.isChunk);
      
      console.log(`\n📊 Document Analysis:`);
      console.log(`   Total documents: ${data.hits.length}`);
      console.log(`   Full documents: ${fullDocs.length}`);
      console.log(`   Chunks: ${chunks.length}`);
      console.log(`   Long documents (>3000 chars): ${longDocs.length}`);
      
      if (longDocs.length > 0) {
        console.log(`\n📝 Long documents found:`);
        longDocs.forEach((hit, index) => {
          console.log(`   ${index + 1}. ID: ${hit._id}`);
          console.log(`      Length: ${hit._source.content?.length || 0} chars`);
          console.log(`      Is Chunk: ${hit._source.isChunk ? "YES" : "NO"}`);
          console.log(`      Title: ${hit._source.title || "No title"}`);
        });
      }
      
      if (chunks.length > 0) {
        console.log(`\n🧩 Chunks found:`);
        
        // Group chunks by original ID
        const chunkGroups = {};
        chunks.forEach(chunk => {
          const originalId = chunk._source.originalId || "unknown";
          if (!chunkGroups[originalId]) {
            chunkGroups[originalId] = [];
          }
          chunkGroups[originalId].push(chunk);
        });
        
        Object.entries(chunkGroups).forEach(([originalId, groupChunks]) => {
          console.log(`   Group: ${originalId}`);
          console.log(`   Chunks: ${groupChunks.length}`);
          groupChunks
            .sort((a, b) => (a._source.chunkIndex || 0) - (b._source.chunkIndex || 0))
            .forEach(chunk => {
              console.log(`     - Chunk ${chunk._source.chunkIndex + 1}/${chunk._source.totalChunks}: ${chunk._source.content?.length || 0} chars`);
            });
        });
      }
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Helper function for fetch
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

findDiaryChunks().then(() => {
  console.log("\n🎉 Chunk analysis completed!");
}).catch(console.error);
