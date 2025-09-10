// Script to check last 10 entries in Elasticsearch diary index
import { es } from "./src/lib/es";
import { DIARY_INDEX } from "./src/search/diaryIndex";

async function checkLastElasticsearchEntries() {
  console.log("🔍 Checking last 10 entries in Elasticsearch...");
  
  if (!es) {
    console.log("❌ Elasticsearch client not available");
    return;
  }

  try {
    // Check if diary index exists
    const indexExists = await es.indices.exists({ index: DIARY_INDEX });
    
    if (!indexExists) {
      console.log(`❌ Index '${DIARY_INDEX}' does not exist`);
      return;
    }

    console.log(`✅ Index '${DIARY_INDEX}' exists`);

    // Get index stats
    const stats = await es.indices.stats({ index: DIARY_INDEX });
    const totalDocs = stats.indices?.[DIARY_INDEX]?.total?.docs?.count || 0;
    console.log(`📊 Total documents in index: ${totalDocs}`);

    // Search for last 10 entries (sorted by creation time)
    const response = await es.search({
      index: DIARY_INDEX,
      body: {
        query: {
          match_all: {}
        },
        sort: [
          {
            "createdAt": {
              order: "desc"
            }
          }
        ],
        size: 10
      }
    });

    const hits = response.hits.hits;
    console.log(`\n📋 Last ${hits.length} entries:`);
    console.log("=".repeat(80));

    hits.forEach((hit, index) => {
      const source = hit._source as any;
      const isChunk = source.isChunk || false;
      const contentPreview = source.content ? source.content.substring(0, 100) : "No content";
      
      console.log(`\n${index + 1}. Document ID: ${hit._id}`);
      console.log(`   Score: ${hit._score}`);
      console.log(`   Original ID: ${source.originalId || source.id || "N/A"}`);
      console.log(`   User ID: ${source.userId || "N/A"}`);
      console.log(`   Title: ${source.title || "No title"}`);
      console.log(`   Is Chunk: ${isChunk ? "✅ YES" : "❌ NO"}`);
      
      if (isChunk) {
        console.log(`   Chunk Info: ${source.chunkIndex + 1}/${source.totalChunks}`);
        console.log(`   Char Range: ${source.characterStart}-${source.characterEnd}`);
      }
      
      console.log(`   Content Length: ${source.content?.length || 0} chars`);
      console.log(`   Content Preview: "${contentPreview}${source.content?.length > 100 ? "..." : ""}"`);
      console.log(`   Created At: ${source.createdAt || "N/A"}`);
      console.log(`   Updated At: ${source.updatedAt || "N/A"}`);
      
      // Check extraction fields
      const hasExtractions = source.entities?.length > 0 || source.actions?.length > 0;
      console.log(`   Has Extractions: ${hasExtractions ? "✅" : "❌"}`);
      
      if (hasExtractions) {
        console.log(`   Entities: [${(source.entities || []).slice(0, 3).join(", ")}${source.entities?.length > 3 ? "..." : ""}]`);
        console.log(`   Actions: [${(source.actions || []).slice(0, 3).join(", ")}${source.actions?.length > 3 ? "..." : ""}]`);
      }
      
      // Check if it has vector embedding
      const hasVector = source.vec && Array.isArray(source.vec) && source.vec.length > 0;
      console.log(`   Has Vector: ${hasVector ? "✅" : "❌"} ${hasVector ? `(${source.vec.length} dims)` : ""}`);
      
      console.log("   " + "-".repeat(60));
    });

    // Check for chunk distribution
    console.log("\n📊 Chunk Analysis:");
    
    const chunkResponse = await es.search({
      index: DIARY_INDEX,
      body: {
        query: {
          term: { isChunk: true }
        },
        aggs: {
          chunks_by_original: {
            terms: {
              field: "originalId.keyword",
              size: 5
            },
            aggs: {
              chunk_count: {
                value_count: {
                  field: "chunkIndex"
                }
              }
            }
          }
        },
        size: 0
      }
    });

    const chunkAggs = chunkResponse.aggregations?.chunks_by_original as any;
    if (chunkAggs?.buckets?.length > 0) {
      console.log("   Top entries with chunks:");
      chunkAggs.buckets.forEach((bucket: any, index: number) => {
        console.log(`   ${index + 1}. ${bucket.key}: ${bucket.doc_count} chunks`);
      });
    } else {
      console.log("   No chunked documents found");
    }

    // Check for non-chunk entries
    const nonChunkResponse = await es.count({
      index: DIARY_INDEX,
      body: {
        query: {
          bool: {
            must_not: [
              { term: { isChunk: true } }
            ]
          }
        }
      }
    });

    console.log(`\n📈 Summary:`);
    console.log(`   Total Documents: ${totalDocs}`);
    console.log(`   Non-chunk entries: ${nonChunkResponse.count}`);
    console.log(`   Chunk entries: ${totalDocs - nonChunkResponse.count}`);
    
  } catch (error: any) {
    console.error("❌ Error checking Elasticsearch:", error);
    
    // Additional error details
    if (error.meta) {
      console.error("   Status Code:", error.meta.statusCode);
      console.error("   Error Body:", error.meta.body);
    }
  }
}

// Run the check
if (require.main === module) {
  checkLastElasticsearchEntries()
    .then(() => {
      console.log("\n🎉 Elasticsearch check completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Script failed:", error);
      process.exit(1);
    });
}

export { checkLastElasticsearchEntries };
