// src/services/diaryChunkedIndexing.ts
// Service for indexing diary content with chunking support

import { Diary } from "../models/diaryModel";
import { es } from "../lib/es";
import { embedText } from "./embeddings";
import { ensureDiaryIndex, DIARY_INDEX } from "../search/diaryIndex";
import { 
  chunkText, 
  needsChunking, 
  generateChunkId, 
  extractDiaryIdFromChunkId,
  type TextChunk 
} from "./textChunking";
import type { ClauseGraphPayload } from "./keywordExtractor";

interface ChunkedDiaryDoc {
  id: string;
  originalId: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isChunk: boolean;
  chunkIndex?: number;
  totalChunks?: number;
  characterStart?: number;
  characterEnd?: number;
  // Extraction fields
  entities?: string[];
  actions?: string[];
  attributes?: string[];
  inquiry_en?: string;
  time_label?: string;
  polarity?: string;
  entities_syn_en?: string[];
  actions_syn_en?: string[];
  attributes_syn_en?: string[];
  phrases_en?: string[];
  sensitive_en?: string[];
  negated_actions_en?: string[];
  affirmed_actions_en?: string[];
  vec?: number[];
}

/**
 * Index a diary with chunking if needed
 */
export async function indexDiaryWithChunking(
  diary: Diary, 
  extraction?: ClauseGraphPayload,
  opts: { refresh?: boolean } = {}
): Promise<{ chunks: number; chunkIds: string[] }> {
  if (!es) return { chunks: 0, chunkIds: [] };
  
  await ensureDiaryIndex();
  
  const fullText = `${diary.title}\n\n${diary.content ?? ""}`;
  const shouldChunk = needsChunking(fullText, 2500); // Slightly higher threshold for chunking
  
  // Remove any existing chunks for this diary first
  await removeAllChunksForDiary(diary.id);
  
  if (!shouldChunk) {
    // Index as single document
    const doc = await createSingleDiaryDoc(diary, extraction);
    await es.index({
      index: DIARY_INDEX,
      id: String(diary.id),
      document: doc,
      refresh: opts.refresh ? "wait_for" : false,
    });
    return { chunks: 1, chunkIds: [String(diary.id)] };
  }
  
  // Index as multiple chunks
  const chunks = chunkText(diary.title, diary.content ?? "", {
    maxChunkLength: 2000,
    overlapLength: 150,
    splitOnParagraphs: true,
    splitOnSentences: true,
  });
  
  const chunkIds: string[] = [];
  const bulkOps: any[] = [];
  
  for (const chunk of chunks) {
    const chunkId = generateChunkId(diary.id, chunk.chunkIndex);
    chunkIds.push(chunkId);
    
    const doc = await createChunkedDiaryDoc(diary, chunk, extraction);
    
    bulkOps.push(
      { index: { _index: DIARY_INDEX, _id: chunkId } },
      doc
    );
  }
  
  if (bulkOps.length > 0) {
    await es.bulk({
      operations: bulkOps,
      refresh: opts.refresh ? "wait_for" : false,
    });
  }
  
  return { chunks: chunks.length, chunkIds };
}

/**
 * Create a single document for non-chunked diary
 */
async function createSingleDiaryDoc(
  diary: Diary, 
  extraction?: ClauseGraphPayload
): Promise<ChunkedDiaryDoc> {
  const fullText = `${diary.title}\n\n${diary.content ?? ""}`;
  const vec = await embedText(fullText);
  
  const doc: ChunkedDiaryDoc = {
    id: String(diary.id),
    originalId: String(diary.id),
    userId: diary.userId,
    title: diary.title,
    content: diary.content ?? "",
    createdAt: new Date(diary.createdAt).toISOString(),
    updatedAt: new Date(diary.updatedAt).toISOString(),
    isChunk: false,
    vec,
  };
  
  if (extraction) {
    addExtractionToDoc(doc, extraction);
  }
  
  return doc;
}

/**
 * Create a document for a single chunk
 */
async function createChunkedDiaryDoc(
  diary: Diary, 
  chunk: TextChunk,
  extraction?: ClauseGraphPayload
): Promise<ChunkedDiaryDoc> {
  const vec = await embedText(`${chunk.title}\n\n${chunk.content}`);
  
  const doc: ChunkedDiaryDoc = {
    id: generateChunkId(diary.id, chunk.chunkIndex),
    originalId: String(diary.id),
    userId: diary.userId,
    title: chunk.title,
    content: chunk.content,
    createdAt: new Date(diary.createdAt).toISOString(),
    updatedAt: new Date(diary.updatedAt).toISOString(),
    isChunk: true,
    chunkIndex: chunk.chunkIndex,
    totalChunks: chunk.totalChunks,
    characterStart: chunk.characterStart,
    characterEnd: chunk.characterEnd,
    vec,
  };
  
  if (extraction) {
    // For chunks, we might want to apply extraction fields more selectively
    // For now, apply to all chunks but this could be optimized
    addExtractionToDoc(doc, extraction);
  }
  
  return doc;
}

/**
 * Add extraction fields to a document
 */
function addExtractionToDoc(doc: ChunkedDiaryDoc, extraction: ClauseGraphPayload) {
  // Basic extraction fields - reuse existing logic from diaryIndex.ts
  const uniqLower = (arr?: string[]) =>
    Array.from(new Set((arr ?? []).map((s) => String(s ?? "").toLowerCase()).filter(Boolean)));
  
  doc.entities = uniqLower(extraction.entities);
  doc.actions = collectActions(extraction);
  doc.attributes = [];
  doc.inquiry_en = String(extraction.text ?? "").trim();
  doc.time_label = selectTimeLabel(extraction);
  doc.polarity = selectPolarity(extraction);
  doc.entities_syn_en = [];
  doc.actions_syn_en = [];
  doc.attributes_syn_en = [];
  doc.phrases_en = collectEventSpans(extraction);
  doc.sensitive_en = Array.from(new Set(doc.actions));
  doc.negated_actions_en = uniqLower(extraction.negated_actions);
  doc.affirmed_actions_en = uniqLower(extraction.affirmed_actions);
}

/**
 * Remove all chunks for a diary
 */
export async function removeAllChunksForDiary(diaryId: string): Promise<void> {
  if (!es) return;
  
  await ensureDiaryIndex();
  
  try {
    // Remove the main document
    await es.delete({
      index: DIARY_INDEX,
      id: String(diaryId),
    }).catch(e => {
      if (e?.meta?.statusCode !== 404 && e?.statusCode !== 404) throw e;
    });
    
    // Remove all chunks
    await es.deleteByQuery({
      index: DIARY_INDEX,
      query: {
        bool: {
          must: [
            { term: { originalId: String(diaryId) } },
            { term: { isChunk: true } }
          ]
        }
      },
      refresh: true,
    });
  } catch (e: any) {
    if (e?.meta?.statusCode !== 404 && e?.statusCode !== 404) {
      console.error("[ChunkedIndexing] Failed to remove chunks:", e);
      throw e;
    }
  }
}

/**
 * Search with chunk aggregation - groups chunks back into original diaries
 */
export async function searchChunkedDiaries(
  query: any,
  options: {
    size?: number;
    from?: number;
    aggregateChunks?: boolean;
  } = {}
): Promise<{
  hits: any[];
  total: number;
  aggregated: boolean;
}> {
  if (!es) return { hits: [], total: 0, aggregated: false };
  
  const { size = 20, from = 0, aggregateChunks = true } = options;
  
  // Search with higher limit to account for multiple chunks per diary
  const searchSize = aggregateChunks ? size * 5 : size;
  
  const response = await es.search({
    index: DIARY_INDEX,
    size: searchSize,
    from: aggregateChunks ? 0 : from,
    query,
    highlight: {
      fields: {
        content: {},
        title: {},
        "phrases_en": {}
      }
    },
    sort: [
      { _score: { order: "desc" } },
      { updatedAt: { order: "desc" } }
    ]
  });
  
  if (!aggregateChunks) {
    return {
      hits: response.hits.hits,
      total: typeof response.hits.total === 'number' ? response.hits.total : response.hits.total?.value ?? 0,
      aggregated: false
    };
  }
  
  // Group chunks by originalId and take highest scoring chunk per diary
  const diaryGroups = new Map<string, any>();
  
  for (const hit of response.hits.hits) {
    const source = hit._source as ChunkedDiaryDoc;
    const originalId = source.originalId;
    
    if (!diaryGroups.has(originalId) || hit._score! > diaryGroups.get(originalId)._score!) {
      diaryGroups.set(originalId, {
        ...hit,
        _source: {
          ...source,
          // Mark if this is a chunk representation
          _isChunkResult: source.isChunk,
          _totalChunks: source.totalChunks || 1,
        }
      });
    }
  }
  
  // Apply pagination to aggregated results
  const aggregatedHits = Array.from(diaryGroups.values())
    .slice(from, from + size);
  
  return {
    hits: aggregatedHits,
    total: diaryGroups.size,
    aggregated: true
  };
}

// Helper functions (copied from diaryIndex.ts for consistency)
function collectActions(p: ClauseGraphPayload): string[] {
  const set = new Set<string>();
  for (const c of p.clauses ?? []) {
    if (c.kind !== "event") continue;
    const v = String(c.verb.lemma || c.verb.surface || "").toLowerCase().trim();
    if (v) set.add(v);
  }
  return Array.from(set);
}

function collectEventSpans(p: ClauseGraphPayload): string[] {
  const set = new Set<string>();
  for (const c of p.clauses ?? []) {
    if (c.kind !== "event") continue;
    const s = String(c.source_span || "").trim();
    if (s) set.add(s);
  }
  return Array.from(set);
}

function selectTimeLabel(p: ClauseGraphPayload): "past" | "present" | "future" | "unspecified" {
  const counts = { past: 0, present: 0, future: 0, unspecified: 0 };
  for (const c of p.clauses ?? []) {
    if (c.kind !== "event") continue;
    const t = (c.verb.tense || "unspecified") as keyof typeof counts;
    counts[t] = (counts[t] ?? 0) + 1;
  }
  const order: Array<keyof typeof counts> = ["past", "present", "future"];
  let best: keyof typeof counts = "unspecified";
  let bestCnt = 0;
  for (const k of order) {
    if (counts[k] > bestCnt) {
      best = k; bestCnt = counts[k];
    }
  }
  return bestCnt ? (best as any) : "unspecified";
}

function selectPolarity(p: ClauseGraphPayload): "affirmative" | "negative" | "unspecified" {
  let neg = 0, pos = 0;
  for (const c of p.clauses ?? []) {
    if (c.kind !== "event") continue;
    if (c.verb.negation) neg++; else pos++;
  }
  if (neg > 0 && pos === 0) return "negative";
  if (pos > 0 && neg === 0) return "affirmative";
  return "unspecified";
}
