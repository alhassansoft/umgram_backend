// Simple test script to verify chunked indexing works
import { es } from "./src/lib/es";
import { chunkText } from "./src/services/textChunking";
import { indexDiaryWithChunking, searchChunkedDiaries } from "./src/services/diaryChunkedIndexing";

async function testChunkedIndexing() {
  console.log("🧪 Testing Chunked Indexing System...");
  
  // Create a long test text
  const longText = `هذا نص طويل جداً يحتوي على العديد من الجمل والفقرات. `.repeat(100) + 
    `يتحدث هذا النص عن الحياة اليومية والذكريات المهمة. ` +
    `نريد أن نتأكد من أن هذا النص سيتم تقسيمه إلى أجزاء صغيرة قابلة للبحث. ` +
    `كل جزء يجب أن يكون مستقلاً في فهرس البحث. ` +
    `هذا يحل المشكلة التي كانت تحفظ النصوص الطويلة بالكامل.`;

  console.log(`📏 Original text length: ${longText.length} characters`);
  
  // Test text chunking
  const chunks = chunkText("Test Title", longText);
  console.log(`✂️  Text split into ${chunks.length} chunks:`);
  chunks.forEach((chunk, index) => {
    console.log(`   Chunk ${index + 1}: ${chunk.content.length} chars - "${chunk.content.substring(0, 50)}..."`);
  });
  
  // Test indexing if ES is available
  if (es) {
    console.log("📝 Testing diary indexing with chunks...");
    
    const testDiary = {
      id: "test_chunked_diary_" + Date.now(),
      userId: "test_user",
      title: "Test Long Diary Entry",
      content: longText,
      createdAt: new Date(),
      updatedAt: new Date(),
      actions: ["write", "test"],
      entities: ["diary", "system"],
      phrases_en: ["test chunking", "long text"],
      inquiry_en: "testing chunked indexing system"
    };
    
    try {
      // Index the diary with chunking
      await indexDiaryWithChunking(testDiary);
      console.log("✅ Diary indexed successfully with chunks");
      
      // Test search
      const searchQuery = {
        bool: {
          must: [
            {
              multi_match: {
                query: "نص طويل",
                fields: ["content", "title"],
                type: "best_fields"
              }
            }
          ]
        }
      };
      
      const searchResult = await searchChunkedDiaries(searchQuery, {
        size: 10,
        aggregateChunks: true
      });
      
      console.log(`🔍 Search found ${searchResult.hits.length} results`);
      if (searchResult.hits.length > 0) {
        const firstHit = searchResult.hits[0];
        console.log(`   First result ID: ${firstHit._id}`);
        console.log(`   Content length: ${(firstHit._source as any).content?.length || 0} chars`);
        console.log(`   Is aggregated: ${!(firstHit._source as any).isChunk}`);
      }
      
    } catch (error) {
      console.error("❌ Test failed:", error);
    }
  } else {
    console.log("⚠️  Elasticsearch not available, skipping indexing test");
  }
  
  console.log("🎉 Chunked indexing test completed!");
}

// Run test if this file is executed directly
if (require.main === module) {
  testChunkedIndexing().catch(console.error);
}

export { testChunkedIndexing };
