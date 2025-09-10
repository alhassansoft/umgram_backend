// src/services/textChunking.ts
// Service for splitting long diary content into chunks for independent indexing

export interface TextChunk {
  chunkIndex: number;
  content: string;
  title: string;
  isPartial: boolean;
  totalChunks: number;
  characterStart: number;
  characterEnd: number;
}

export interface ChunkingOptions {
  maxChunkLength?: number;
  overlapLength?: number;
  splitOnSentences?: boolean;
  splitOnParagraphs?: boolean;
}

const DEFAULT_CHUNK_LENGTH = 2000;
const DEFAULT_OVERLAP = 200;

/**
 * Split text into semantically meaningful chunks for indexing
 */
export function chunkText(
  title: string,
  content: string,
  options: ChunkingOptions = {}
): TextChunk[] {
  const {
    maxChunkLength = DEFAULT_CHUNK_LENGTH,
    overlapLength = DEFAULT_OVERLAP,
    splitOnParagraphs = true,
    splitOnSentences = true,
  } = options;

  // If content is short enough, return as single chunk
  if (content.length <= maxChunkLength) {
    return [{
      chunkIndex: 0,
      content,
      title,
      isPartial: false,
      totalChunks: 1,
      characterStart: 0,
      characterEnd: content.length,
    }];
  }

  const chunks: TextChunk[] = [];
  let currentPosition = 0;
  let chunkIndex = 0;

  while (currentPosition < content.length) {
    const remainingLength = content.length - currentPosition;
    const chunkEndTarget = Math.min(
      currentPosition + maxChunkLength,
      content.length
    );

    let chunkEnd = chunkEndTarget;

    // Try to find a good break point
    if (chunkEnd < content.length) {
      // First try paragraph breaks
      if (splitOnParagraphs) {
        const paragraphBreak = content.lastIndexOf('\n\n', chunkEnd);
        if (paragraphBreak > currentPosition + maxChunkLength * 0.5) {
          chunkEnd = paragraphBreak + 2;
        }
      }

      // If no good paragraph break, try sentence breaks
      if (splitOnSentences && chunkEnd === chunkEndTarget) {
        const sentenceBreak = findLastSentenceBreak(content, chunkEnd, currentPosition);
        if (sentenceBreak > currentPosition + maxChunkLength * 0.5) {
          chunkEnd = sentenceBreak;
        }
      }

      // Fallback to word boundary
      if (chunkEnd === chunkEndTarget) {
        const wordBreak = content.lastIndexOf(' ', chunkEnd);
        if (wordBreak > currentPosition + maxChunkLength * 0.7) {
          chunkEnd = wordBreak;
        }
      }
    }

    const chunkContent = content.substring(currentPosition, chunkEnd).trim();
    
    if (chunkContent.length > 0) {
      // Add contextual title for chunks
      const chunkTitle = chunks.length === 0 
        ? title 
        : `${title} (جزء ${chunkIndex + 1})`;

      chunks.push({
        chunkIndex,
        content: chunkContent,
        title: chunkTitle,
        isPartial: chunks.length > 0 || chunkEnd < content.length,
        totalChunks: -1, // Will be set after all chunks are created
        characterStart: currentPosition,
        characterEnd: chunkEnd,
      });

      chunkIndex++;
    }

    // Move to next position with overlap
    const nextStart = Math.max(
      chunkEnd - overlapLength,
      currentPosition + Math.floor(maxChunkLength * 0.5)
    );
    
    if (nextStart >= chunkEnd) {
      currentPosition = chunkEnd;
    } else {
      currentPosition = nextStart;
    }

    // Safety check to prevent infinite loops
    if (currentPosition >= content.length) break;
  }

  // Update totalChunks for all chunks
  chunks.forEach(chunk => {
    chunk.totalChunks = chunks.length;
  });

  return chunks;
}

/**
 * Find the last sentence break before the target position
 */
function findLastSentenceBreak(text: string, targetPos: number, minPos: number): number {
  // Arabic and English sentence endings
  const sentenceEnders = /[.!?؟](\s|$)/g;
  let lastMatch = -1;
  let match;

  sentenceEnders.lastIndex = 0;
  while ((match = sentenceEnders.exec(text.substring(0, targetPos))) !== null) {
    const pos = match.index + match[0].length;
    if (pos >= minPos && pos <= targetPos) {
      lastMatch = pos;
    }
  }

  return lastMatch > minPos ? lastMatch : targetPos;
}

/**
 * Generate a chunk ID for Elasticsearch
 */
export function generateChunkId(diaryId: string, chunkIndex: number): string {
  return `${diaryId}_chunk_${chunkIndex}`;
}

/**
 * Extract original diary ID from chunk ID
 */
export function extractDiaryIdFromChunkId(chunkId: string): string | null {
  const match = chunkId.match(/^(.+)_chunk_\d+$/);
  return match ? match[1] || null : null;
}

/**
 * Check if text needs chunking
 */
export function needsChunking(content: string, threshold = DEFAULT_CHUNK_LENGTH): boolean {
  return content.length > threshold;
}
