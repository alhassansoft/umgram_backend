# Text Chunking for Long Diary Entries

This document explains the new text chunking system implemented to solve GPT timeout and token consumption issues with long diary entries.

## Problem

Previously, when diary entries were very long (>3000 characters), the keywordNormalizer would:
- Take a long time to process
- Often timeout and fail to complete 
- Consume excessive tokens
- Provide poor user experience

## Solution

We've implemented an intelligent text chunking system that:
- Automatically detects when text is too long
- Splits text into smaller, manageable chunks
- Processes chunks independently with GPT
- Merges results intelligently while preserving semantic meaning

## How It Works

### 1. Text Analysis
```typescript
// Check if text needs chunking
if (shouldChunkText(text, maxTokensPerChunk)) {
  // Use chunked processing
} else {
  // Use regular processing
}
```

### 2. Intelligent Chunking
- **Smart boundaries**: Prioritizes sentence endings, paragraph breaks, then word boundaries
- **Overlap**: Maintains context between chunks with configurable overlap
- **Size limits**: Configurable max characters/tokens per chunk
- **Language support**: Works with Arabic and English text

### 3. Parallel Processing
- Processes multiple chunks in parallel with concurrency limits
- Handles failures gracefully
- Provides detailed logging

### 4. Intelligent Merging
- **Entity deduplication**: Removes duplicate entities across chunks
- **Clause coordination**: Renumbers clause IDs to avoid conflicts
- **Relation preservation**: Maintains relationships between clauses
- **Synonym consolidation**: Merges synonym sets intelligently

## API Endpoints

### 1. Test Chunked Normalizer
```bash
POST /api/normalize/chunked
Content-Type: application/json

{
  "text": "نص طويل جداً...",
  "maxTokensPerChunk": 1800,
  "mergeStrategy": "intelligent"
}
```

### 2. Response Format
```json
{
  "ok": true,
  "promptSha": "abc123...",
  "modelUsed": "gpt-4o",
  "processingTime": 5432,
  "chunked": true,
  "payload": {
    "text": "النص الأصلي",
    "entities": ["entity1", "entity2"],
    "clauses": [...],
    "relations": [...],
    "affirmed_actions": [...],
    "negated_actions": [...],
    "en_simple": {...}
  }
}
```

## Updated Controllers

The following controllers now automatically use chunked processing for long texts:

### 1. Diary Extraction
```typescript
// In extractionsController.ts
const payload = text.length > 3000 
  ? await extractKeywordsChunked(text, { 
      model: DEFAULT_LLM_MODEL, 
      temperature: 0,
      maxTokensPerChunk: 1800,
      mergeStrategy: 'intelligent'
    })
  : await extractKeywords(text, { model: DEFAULT_LLM_MODEL, temperature: 0 });
```

### 2. Note Extraction
- Same automatic chunking logic as diary extraction

### 3. Chat/Confession Extraction
- Handles long conversation histories
- Useful for confession sessions with many messages

## Configuration Options

### ChunkOptions
```typescript
{
  maxChars: 3000,          // Maximum characters per chunk
  maxWords: 600,           // Maximum words per chunk  
  overlap: 200,            // Character overlap between chunks
  preserveSentences: true  // Try to break at sentence boundaries
}
```

### Processing Options
```typescript
{
  maxTokensPerChunk: 1800,     // Token limit per chunk
  mergeStrategy: 'intelligent', // 'intelligent' or 'simple'
  model: 'gpt-4o',            // Model to use
  temperature: 0               // Temperature setting
}
```

## Performance Benefits

### Before Chunking
- ❌ Timeouts on texts >5000 characters
- ❌ High token consumption (up to 4000+ tokens)
- ❌ Processing time: 30-60+ seconds
- ❌ Frequent failures

### After Chunking
- ✅ Reliable processing of texts up to 50,000 characters
- ✅ Reduced token consumption per request
- ✅ Faster processing through parallelization
- ✅ Graceful handling of failures
- ✅ Better user experience

## Testing

Run the test script to verify functionality:
```bash
cd backend
npx ts-node scripts/test-chunking.ts
```

## Monitoring

The system provides detailed logging:
```
[normalizeKeywordsChunked] Text is long (15234 chars), splitting into chunks
[normalizeKeywordsChunked] Created 6 chunks
[normalizeKeywordsChunked] Processing chunk 1/6 (2845 chars)
[normalizeKeywordsChunked] Chunk 1 completed in 3421ms
[normalizeKeywordsChunked] Processed 6 chunks, merged into final result
```

## Best Practices

### 1. Chunk Size Selection
- **Short chunks**: Faster processing, less context
- **Long chunks**: Better context, risk of timeouts
- **Recommended**: 1800-2000 tokens per chunk

### 2. Merge Strategy
- **Intelligent**: Better quality, slightly slower
- **Simple**: Faster, may have some duplicates
- **Recommended**: Use intelligent for diary/note extraction

### 3. Error Handling
- Failed chunks are replaced with empty results
- Processing continues with successful chunks
- Final result includes all available data

## Migration Notes

### Existing Code
No changes needed for existing code. The system automatically:
- Detects long texts
- Falls back to regular processing for short texts
- Maintains backward compatibility

### New Features
To use chunked processing explicitly:
```typescript
import { extractKeywordsChunked } from './services/keywordExtractor';

const result = await extractKeywordsChunked(longText, {
  maxTokensPerChunk: 1800,
  mergeStrategy: 'intelligent'
});
```

## Future Improvements

1. **Dynamic chunk sizing** based on content complexity
2. **Semantic-aware chunking** using embeddings
3. **Cached chunk processing** for repeated content
4. **Streaming results** for real-time feedback
5. **Quality metrics** for chunk merge evaluation

## Troubleshooting

### Issue: Chunks are too small
- Increase `maxChars` or `maxTokensPerChunk`
- Reduce `overlap`

### Issue: Processing is slow
- Reduce chunk size
- Use 'simple' merge strategy
- Check concurrency limits

### Issue: Poor quality results
- Increase chunk overlap
- Use 'intelligent' merge strategy
- Check chunk boundary quality
