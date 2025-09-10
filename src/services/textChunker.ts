// Text chunking utilities for handling long diary entries
// Splits long texts into manageable chunks to prevent GPT timeouts and reduce token consumption

export interface ChunkOptions {
  maxChars?: number;         // Maximum characters per chunk (default: 3000)
  maxWords?: number;         // Maximum words per chunk (default: 600) 
  overlap?: number;          // Overlap between chunks in characters (default: 200)
  preserveSentences?: boolean; // Try to break at sentence boundaries (default: true)
}

export interface TextChunk {
  text: string;
  index: number;
  start: number;  // Start position in original text
  end: number;    // End position in original text
  isComplete: boolean; // Whether this chunk ends at a natural boundary
}

const DEFAULT_OPTIONS: Required<ChunkOptions> = {
  maxChars: 3000,
  maxWords: 600,
  overlap: 200,
  preserveSentences: true
};

/**
 * Splits long text into smaller chunks suitable for GPT processing
 * Uses intelligent splitting to preserve context and readability
 */
export function chunkText(text: string, options: ChunkOptions = {}): TextChunk[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // If text is short enough, return as single chunk
  if (text.length <= opts.maxChars) {
    return [{
      text: text.trim(),
      index: 0,
      start: 0,
      end: text.length,
      isComplete: true
    }];
  }

  const chunks: TextChunk[] = [];
  let currentPos = 0;
  let chunkIndex = 0;

  while (currentPos < text.length) {
    let chunkEnd = Math.min(currentPos + opts.maxChars, text.length);
    
    // If we're not at the end and preserveSentences is enabled, try to find a good break point
    if (chunkEnd < text.length && opts.preserveSentences) {
      chunkEnd = findOptimalBreakPoint(text, currentPos, chunkEnd);
    }
    
    const chunkText = text.slice(currentPos, chunkEnd).trim();
    
    if (chunkText.length > 0) {
      chunks.push({
        text: chunkText,
        index: chunkIndex++,
        start: currentPos,
        end: chunkEnd,
        isComplete: isAtNaturalBoundary(text, chunkEnd)
      });
    }
    
    // Move position forward, accounting for overlap if not the last chunk
    if (chunkEnd < text.length) {
      currentPos = Math.max(chunkEnd - opts.overlap, currentPos + 1);
    } else {
      break;
    }
  }

  return chunks;
}

/**
 * Finds the optimal break point for text chunking
 * Prioritizes sentence endings, then paragraph breaks, then word boundaries
 */
function findOptimalBreakPoint(text: string, start: number, maxEnd: number): number {
  const searchWindow = text.slice(start, maxEnd);
  
  // Look for sentence endings (Arabic and English)
  const sentenceEndings = /[.!?؟।]\s+/g;
  let lastSentenceEnd = -1;
  let match;
  
  while ((match = sentenceEndings.exec(searchWindow)) !== null) {
    lastSentenceEnd = match.index + match[0].length;
  }
  
  if (lastSentenceEnd > searchWindow.length * 0.7) { // Don't break too early
    return start + lastSentenceEnd;
  }
  
  // Look for paragraph breaks
  const paragraphBreaks = /\n\s*\n/g;
  let lastParagraphEnd = -1;
  
  while ((match = paragraphBreaks.exec(searchWindow)) !== null) {
    lastParagraphEnd = match.index + match[0].length;
  }
  
  if (lastParagraphEnd > searchWindow.length * 0.6) {
    return start + lastParagraphEnd;
  }
  
  // Look for line breaks
  const lineBreaks = /\n/g;
  let lastLineEnd = -1;
  
  while ((match = lineBreaks.exec(searchWindow)) !== null) {
    lastLineEnd = match.index + match[0].length;
  }
  
  if (lastLineEnd > searchWindow.length * 0.8) {
    return start + lastLineEnd;
  }
  
  // Fall back to word boundaries
  const wordBoundary = /\s+/g;
  let lastWordEnd = -1;
  
  while ((match = wordBoundary.exec(searchWindow)) !== null) {
    lastWordEnd = match.index;
  }
  
  if (lastWordEnd > searchWindow.length * 0.8) {
    return start + lastWordEnd;
  }
  
  // If no good break point found, use the max end
  return maxEnd;
}

/**
 * Checks if a position in text is at a natural boundary (sentence, paragraph, etc.)
 */
function isAtNaturalBoundary(text: string, position: number): boolean {
  if (position >= text.length) return true;
  
  const before = text.slice(Math.max(0, position - 3), position);
  const after = text.slice(position, Math.min(text.length, position + 3));
  
  // Check for sentence endings
  if (/[.!?؟।]\s*$/.test(before) && /^\s*[A-ZА-Яأ-ي]/.test(after)) {
    return true;
  }
  
  // Check for paragraph breaks
  if (/\n\s*\n\s*$/.test(before)) {
    return true;
  }
  
  return false;
}

/**
 * Estimates the number of tokens in text (rough approximation)
 * Useful for pre-filtering chunks that might be too large
 */
export function estimateTokenCount(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters for mixed Arabic/English text
  return Math.ceil(text.length / 4);
}

/**
 * Checks if text should be chunked based on length and token estimation
 */
export function shouldChunkText(text: string, maxTokens: number = 2000): boolean {
  return estimateTokenCount(text) > maxTokens || text.length > 3000;
}
