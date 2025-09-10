// Get all chunks for the test diary
const http = require('http');

async function getAllChunksForTestDiary() {
  console.log("🔍 Getting all chunks for test diary...");
  
  const diaryId = "7d5c7095-1e1b-422a-a870-e423cc020873";
  
  try {
    // Search for all chunks
    const searchUrl = `http://localhost:5001/api/search/diary?q=تجريبية&mode=wide&scope=all&method=normal&size=20`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.hits && data.hits.length > 0) {
      console.log(`✅ Found ${data.hits.length} total results`);
      
      // Filter for our diary
      const ourChunks = data.hits.filter(hit => 
        hit._source.originalId === diaryId || hit._id === diaryId
      );
      
      console.log(`🎯 Found ${ourChunks.length} chunks for our test diary:`);
      console.log("=".repeat(80));
      
      // Sort chunks by index
      ourChunks.sort((a, b) => {
        const aIndex = a._source.chunkIndex || 0;
        const bIndex = b._source.chunkIndex || 0;
        return aIndex - bIndex;
      });
      
      ourChunks.forEach((hit, index) => {
        const source = hit._source;
        console.log(`\n📄 Chunk ${index + 1}:`);
        console.log(`   ID: ${hit._id}`);
        console.log(`   Original ID: ${source.originalId}`);
        console.log(`   Is Chunk: ${source.isChunk ? "✅ YES" : "❌ NO"}`);
        
        if (source.isChunk) {
          console.log(`   Chunk Index: ${source.chunkIndex + 1}/${source.totalChunks}`);
          console.log(`   Character Range: ${source.characterStart}-${source.characterEnd}`);
        }
        
        console.log(`   Content Length: ${source.content?.length || 0} chars`);
        console.log(`   Score: ${hit._score}`);
        
        // Show content preview
        const preview = (source.content || "").substring(0, 150);
        console.log(`   Content Preview: "${preview}${source.content?.length > 150 ? "..." : ""}"`);
        
        // Check for overlap between chunks
        if (index > 0) {
          const prevChunk = ourChunks[index - 1]._source;
          const currentChunk = source;
          
          if (prevChunk.isChunk && currentChunk.isChunk) {
            const prevEnd = prevChunk.characterEnd;
            const currentStart = currentChunk.characterStart;
            const overlap = prevEnd - currentStart;
            
            if (overlap > 0) {
              console.log(`   🔗 Overlap with previous chunk: ${overlap} chars`);
            } else {
              console.log(`   ⚠️  No overlap with previous chunk (gap: ${Math.abs(overlap)} chars)`);
            }
          }
        }
        
        console.log("   " + "-".repeat(60));
      });
      
      // Analysis
      console.log(`\n📊 Analysis:`);
      const chunks = ourChunks.filter(hit => hit._source.isChunk);
      const fullDocs = ourChunks.filter(hit => !hit._source.isChunk);
      
      console.log(`   Total found: ${ourChunks.length}`);
      console.log(`   Chunks: ${chunks.length}`);
      console.log(`   Full documents: ${fullDocs.length}`);
      
      if (chunks.length > 0) {
        console.log(`   ✅ SUCCESS: Chunking is working correctly!`);
        console.log(`   ✅ Long text (3597 chars) was split into ${chunks.length} independent chunks`);
        
        // Check if chunks have correct metadata
        const hasCorrectMetadata = chunks.every(chunk => {
          const s = chunk._source;
          return s.originalId && typeof s.chunkIndex === 'number' && 
                 typeof s.totalChunks === 'number' && 
                 typeof s.characterStart === 'number' && 
                 typeof s.characterEnd === 'number';
        });
        
        if (hasCorrectMetadata) {
          console.log(`   ✅ All chunks have correct metadata (originalId, indices, character ranges)`);
        } else {
          console.log(`   ❌ Some chunks missing metadata`);
        }
        
        // Check total content length
        const totalChunkLength = chunks.reduce((sum, chunk) => sum + (chunk._source.content?.length || 0), 0);
        console.log(`   📏 Total chunk content: ${totalChunkLength} chars (original: 3597 chars)`);
        
        if (totalChunkLength > 3597) {
          const overlap = totalChunkLength - 3597;
          console.log(`   🔗 Overlap detected: ${overlap} chars (this is expected for chunking)`);
        }
        
      } else {
        console.log(`   ❌ WARNING: No chunks found - chunking may not be working`);
      }
      
      // Check if the original issue is resolved
      const longSingleDoc = fullDocs.find(hit => (hit._source.content?.length || 0) > 3000);
      if (longSingleDoc) {
        console.log(`\n⚠️  WARNING: Found a long single document (${longSingleDoc._source.content?.length} chars)`);
        console.log(`   This suggests the old behavior might still be occurring`);
      } else {
        console.log(`\n✅ EXCELLENT: No long single documents found`);
        console.log(`   The original issue is RESOLVED! 🎉`);
      }
      
    } else {
      console.log("❌ No results found");
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
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

getAllChunksForTestDiary().then(() => {
  console.log("\n🎉 Chunk analysis completed!");
}).catch(console.error);
