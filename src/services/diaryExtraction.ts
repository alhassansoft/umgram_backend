// src/services/diaryExtraction.ts
// Helper to ensure a diary has an extraction generated and indexed with chunking support.
// This runs the same logic as rebuildDiaryExtraction but decoupled from Express
// so it can be called from create/update flows without blocking the request.

import { Diary } from "../models/diaryModel";
import { getExtractionByContent, saveExtraction } from "./extractions";
import { extractKeywords, extractKeywordsChunked, DEFAULT_LLM_MODEL } from "./keywordExtractor";
import { indexDiaryWithChunking } from "./diaryChunkedIndexing";

interface EnsureOptions { force?: boolean }

export async function ensureDiaryExtraction(diary: Diary, opts: EnsureOptions = {}): Promise<{ created: boolean; skipped: boolean; forced: boolean; chunks?: number }> {
  try {
    const force = !!opts.force;
    if (!force) {
      const existing = await getExtractionByContent("diary", diary.id);
      if (existing) return { created: false, skipped: true, forced: false };
    }

    const text = `${diary.title}\n\n${diary.content ?? ""}`;
    const useChunked = text.length > 3000;
    const payload = useChunked
      ? await extractKeywordsChunked(text, {
          model: DEFAULT_LLM_MODEL,
          temperature: 0,
          maxTokensPerChunk: 1800,
          mergeStrategy: "intelligent",
        })
      : await extractKeywords(text, { model: DEFAULT_LLM_MODEL, temperature: 0 });

    await saveExtraction({
      contentType: "diary",
      contentId: diary.id,
      userId: diary.userId,
      payload,
      model: DEFAULT_LLM_MODEL,
      promptVersion: "v1",
      inputTextForHash: text,
    });

    // Index with chunking support
    const indexResult = await indexDiaryWithChunking(diary, payload, { refresh: false });

    return { created: true, skipped: false, forced: force, chunks: indexResult.chunks };
  } catch (err) {
    console.error("[DiaryExtraction] ensure failed", err);
    return { created: false, skipped: false, forced: !!opts.force };
  }
}
