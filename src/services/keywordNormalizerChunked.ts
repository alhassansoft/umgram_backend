import { normalizeKeywordsFast, ClauseGraphPayload } from "./keywordNormalizerFast";
import { chunkText, shouldChunkText, ChunkOptions, TextChunk } from "./textChunker";
import type { ClauseGraphPayload as ExtractorPayload } from "./keywordExtractor";

export interface ChunkedNormalizationOptions {
  model?: string;
  temperature?: number;
  user?: string;
  strictInvariants?: boolean;
  maxOutputTokens?: number;
  
  // Chunking options
  chunkOptions?: ChunkOptions;
  maxTokensPerChunk?: number;
  mergeStrategy?: 'simple' | 'intelligent';
}

interface ChunkResult {
  chunk: TextChunk;
  result: ClauseGraphPayload;
  processingTime: number;
  error?: string;
}

/**
 * Normalizes keywords with automatic text chunking for long texts
 * Processes long diary entries in smaller chunks to avoid GPT timeouts
 */
export async function normalizeKeywordsChunked(
  text: string, 
  options: ChunkedNormalizationOptions = {}
): Promise<ClauseGraphPayload> {
  const { 
    chunkOptions = {}, 
    maxTokensPerChunk = 1800,
    mergeStrategy = 'intelligent',
    ...normalizerOptions 
  } = options;

  // Check if text needs chunking
  if (!shouldChunkText(text, maxTokensPerChunk)) {
    console.info('[normalizeKeywordsChunked] Text is short enough, processing as single chunk');
    return await normalizeKeywordsFast(text, normalizerOptions);
  }

  console.info(`[normalizeKeywordsChunked] Text is long (${text.length} chars), splitting into chunks`);
  
  // Split text into chunks
  const chunks = chunkText(text, chunkOptions);
  console.info(`[normalizeKeywordsChunked] Created ${chunks.length} chunks`);

  // Process chunks in parallel with concurrency limit
  const chunkResults = await processChunksWithConcurrencyLimit(chunks, normalizerOptions);

  // Merge results from all chunks
  const mergedResult = mergeStrategy === 'intelligent' 
    ? mergeChunkResultsIntelligent(chunkResults, text)
    : mergeChunkResultsSimple(chunkResults, text);

  console.info(`[normalizeKeywordsChunked] Processed ${chunks.length} chunks, merged into final result`);
  return mergedResult;
}

/**
 * Process chunks with concurrency limit to avoid overwhelming the API
 */
async function processChunksWithConcurrencyLimit(
  chunks: TextChunk[], 
  options: any,
  concurrencyLimit: number = 3
): Promise<ChunkResult[]> {
  const results: ChunkResult[] = [];
  
  // Process chunks in batches
  for (let i = 0; i < chunks.length; i += concurrencyLimit) {
    const batch = chunks.slice(i, i + concurrencyLimit);
    
    const batchPromises = batch.map(async (chunk): Promise<ChunkResult> => {
      const startTime = Date.now();
      try {
        console.info(`[normalizeKeywordsChunked] Processing chunk ${chunk.index + 1}/${chunks.length} (${chunk.text.length} chars)`);
        
        const result = await normalizeKeywordsFast(chunk.text, options);
        const processingTime = Date.now() - startTime;
        
        console.info(`[normalizeKeywordsChunked] Chunk ${chunk.index + 1} completed in ${processingTime}ms`);
        
        return {
          chunk,
          result,
          processingTime
        };
      } catch (error) {
        const processingTime = Date.now() - startTime;
        console.error(`[normalizeKeywordsChunked] Chunk ${chunk.index + 1} failed:`, error);
        
        return {
          chunk,
          result: createEmptyResult(chunk.text),
          processingTime,
          error: String(error)
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Small delay between batches to be respectful to the API
    if (i + concurrencyLimit < chunks.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
}

/**
 * Intelligent merging strategy that deduplicates and organizes results
 */
function mergeChunkResultsIntelligent(chunkResults: ChunkResult[], originalText: string): ClauseGraphPayload {
  const allEntities = new Set<string>();
  const allClauses: any[] = [];
  const allRelations: any[] = [];
  const allAffirmedActions = new Set<string>();
  const allNegatedActions = new Set<string>();
  
  // Collect en_simple data
  const allEnSimpleEntities = new Set<string>();
  const allEnSimpleActions = new Set<string>();
  const allEnSimplePhrases = new Set<string>();
  const allEntitySynsets: any[] = [];
  const allActionSynsets: any[] = [];
  
  let clauseIdCounter = 1;
  const clauseIdMap = new Map<string, string>(); // old ID -> new ID

  // Process each chunk result
  for (const chunkResult of chunkResults) {
    if (chunkResult.error) continue;
    
    const result = chunkResult.result;
    
    // Merge entities (deduplicate)
    if (result.entities) {
      result.entities.forEach(entity => allEntities.add(entity));
    }
    
    // Merge clauses with new IDs to avoid conflicts
    if (result.clauses) {
      for (const clause of result.clauses) {
        const oldId = clause.id;
        const newId = `c${clauseIdCounter++}`;
        clauseIdMap.set(oldId, newId);
        
        allClauses.push({
          ...clause,
          id: newId,
          // Add chunk context for debugging
          _chunkIndex: chunkResult.chunk.index
        });
      }
    }
    
    // Merge relations with updated IDs
    if (result.relations) {
      for (const relation of result.relations) {
        const newFromId = clauseIdMap.get(relation.from) || relation.from;
        const newToId = clauseIdMap.get(relation.to) || relation.to;
        
        allRelations.push({
          ...relation,
          from: newFromId,
          to: newToId
        });
      }
    }
    
    // Merge actions
    if (result.affirmed_actions) {
      result.affirmed_actions.forEach(action => allAffirmedActions.add(action));
    }
    if (result.negated_actions) {
      result.negated_actions.forEach(action => allNegatedActions.add(action));
    }
    
    // Merge en_simple data
    if (result.en_simple) {
      if (result.en_simple.entities) {
        result.en_simple.entities.forEach((entity: string) => allEnSimpleEntities.add(entity));
      }
      if (result.en_simple.actions) {
        result.en_simple.actions.forEach((action: string) => allEnSimpleActions.add(action));
      }
      if (result.en_simple.phrases_en) {
        result.en_simple.phrases_en.forEach((phrase: string) => allEnSimplePhrases.add(phrase));
      }
      if (result.en_simple.synsets) {
        if (result.en_simple.synsets.entity_synsets) {
          allEntitySynsets.push(...result.en_simple.synsets.entity_synsets);
        }
        if (result.en_simple.synsets.action_synsets) {
          allActionSynsets.push(...result.en_simple.synsets.action_synsets);
        }
      }
    }
  }

  // Deduplicate synsets by lemma
  const uniqueEntitySynsets = deduplicateSynsets(allEntitySynsets);
  const uniqueActionSynsets = deduplicateSynsets(allActionSynsets);

  // Create comprehensive paraphrase from all chunks
  const validChunks = chunkResults.filter(cr => !cr.error);
  const paraphrases = validChunks
    .map(cr => cr.result.en_simple?.paraphrase)
    .filter(Boolean)
    .join('. ');

  // For chunked processing, don't store the full original text
  // Instead store a summary indicating it was processed in chunks
  const textSummary = originalText.length > 1000 
    ? `${originalText.substring(0, 200)}... [نص طويل تم تقسيمه ومعالجته في ${validChunks.length} أجزاء، الطول الكامل: ${originalText.length} حرف]`
    : originalText;

  return {
    text: textSummary,
    entities: Array.from(allEntities),
    clauses: allClauses,
    relations: allRelations,
    affirmed_actions: Array.from(allAffirmedActions),
    negated_actions: Array.from(allNegatedActions),
    en_simple: {
      paraphrase: paraphrases || "processed in multiple chunks",
      entities: Array.from(allEnSimpleEntities),
      actions: Array.from(allEnSimpleActions),
      phrases_en: Array.from(allEnSimplePhrases),
      synsets: {
        entity_synsets: uniqueEntitySynsets,
        action_synsets: uniqueActionSynsets
      }
    }
  };
}

/**
 * Simple merging strategy that concatenates results
 */
function mergeChunkResultsSimple(chunkResults: ChunkResult[], originalText: string): ClauseGraphPayload {
  // For chunked processing, don't store the full original text
  // Instead store a summary indicating it was processed in chunks
  const validChunks = chunkResults.filter(cr => !cr.error);
  const textSummary = originalText.length > 1000 
    ? `${originalText.substring(0, 200)}... [نص طويل تم تقسيمه ومعالجته في ${validChunks.length} أجزاء، الطول الكامل: ${originalText.length} حرف]`
    : originalText;

  const merged: ClauseGraphPayload = {
    text: textSummary,
    entities: [],
    clauses: [],
    relations: [],
    affirmed_actions: [],
    negated_actions: [],
    en_simple: {
      paraphrase: "",
      entities: [],
      actions: [],
      phrases_en: [],
      synsets: {
        entity_synsets: [],
        action_synsets: []
      }
    }
  };

  let clauseIdCounter = 1;

  for (const chunkResult of chunkResults) {
    if (chunkResult.error) continue;
    
    const result = chunkResult.result;
    
    // Simple concatenation
    if (result.entities) merged.entities!.push(...result.entities);
    if (result.clauses) {
      // Renumber clause IDs to avoid conflicts
      const updatedClauses = result.clauses.map(clause => ({
        ...clause,
        id: `c${clauseIdCounter++}`
      }));
      merged.clauses!.push(...updatedClauses);
    }
    if (result.relations) merged.relations!.push(...result.relations);
    if (result.affirmed_actions) merged.affirmed_actions!.push(...result.affirmed_actions);
    if (result.negated_actions) merged.negated_actions!.push(...result.negated_actions);
    
    if (result.en_simple) {
      if (result.en_simple.entities) merged.en_simple!.entities!.push(...result.en_simple.entities);
      if (result.en_simple.actions) merged.en_simple!.actions!.push(...result.en_simple.actions);
      if (result.en_simple.phrases_en) merged.en_simple!.phrases_en!.push(...result.en_simple.phrases_en);
    }
  }

  // Remove duplicates
  merged.entities = Array.from(new Set(merged.entities));
  merged.affirmed_actions = Array.from(new Set(merged.affirmed_actions));
  merged.negated_actions = Array.from(new Set(merged.negated_actions));
  
  if (merged.en_simple) {
    merged.en_simple.entities = Array.from(new Set(merged.en_simple.entities));
    merged.en_simple.actions = Array.from(new Set(merged.en_simple.actions));
    merged.en_simple.phrases_en = Array.from(new Set(merged.en_simple.phrases_en));
  }

  return merged;
}

/**
 * Deduplicates synsets by lemma
 */
function deduplicateSynsets(synsets: any[]): any[] {
  const seenLemmas = new Set<string>();
  const unique: any[] = [];
  
  for (const synset of synsets) {
    if (synset && synset.lemma && !seenLemmas.has(synset.lemma)) {
      seenLemmas.add(synset.lemma);
      unique.push(synset);
    }
  }
  
  return unique;
}

/**
 * Creates an empty result for failed chunks
 */
function createEmptyResult(text: string): ClauseGraphPayload {
  return {
    text,
    entities: [],
    clauses: [],
    relations: [],
    affirmed_actions: [],
    negated_actions: [],
    en_simple: {
      paraphrase: "",
      entities: [],
      actions: [],
      phrases_en: [],
      synsets: {
        entity_synsets: [],
        action_synsets: []
      }
    }
  };
}
