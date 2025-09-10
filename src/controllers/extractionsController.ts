// src/controllers/extractionsController.ts
import { Request, Response, NextFunction } from "express";
import { DiaryModel } from "../models/diaryModel";
import { extractKeywords, extractKeywordsChunked, DEFAULT_LLM_MODEL } from "../services/keywordExtractor";
import { saveExtraction, getExtractionByContent } from "../services/extractions";
import { attachExtractionToDiaryInES } from "../search/diaryIndex";

// ⬇️ جديدان:
import { es } from "../lib/es";
import { DIARY_INDEX } from "../search/diaryIndex";

export async function getDiaryExtraction(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const x = await getExtractionByContent("diary", id);
    if (!x) return res.status(404).json({ error: "Not found" });
    return res.json(x);
  } catch (err) { next(err); }
}

export async function rebuildDiaryExtraction(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const diary = await DiaryModel.findById(id);
    if (!diary) return res.status(404).json({ error: "Diary not found" });

    const text = `${diary.title}\n\n${diary.content ?? ""}`;
    
    // Use chunked extraction for long diary entries to avoid timeouts
    const payload = text.length > 3000 
      ? await extractKeywordsChunked(text, { 
          model: DEFAULT_LLM_MODEL, 
          temperature: 0,
          maxTokensPerChunk: 1800,
          mergeStrategy: 'intelligent'
        })
      : await extractKeywords(text, { model: DEFAULT_LLM_MODEL, temperature: 0 });

    const { id: extractionId } = await saveExtraction({
      contentType: "diary",
      contentId: diary.id,
      userId: diary.userId,
      payload,
  model: DEFAULT_LLM_MODEL,
      promptVersion: "v1",
      inputTextForHash: text,
    });

    // دفع إلى Elasticsearch
    await attachExtractionToDiaryInES(diary, payload);

    return res.json({ ok: true, id: extractionId, payload, chunked: text.length > 3000 });
  } catch (err) { next(err); }
}

// مزامنة آخر استخراج محفوظ إلى ES بدون إعادة توليد
export async function syncDiaryExtractionToES(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const diary = await DiaryModel.findById(id);
    if (!diary) return res.status(404).json({ error: "Diary not found" });

    const payload = await getExtractionByContent("diary", id);
    if (!payload) return res.status(404).json({ error: "No extraction stored for this diary" });

    await attachExtractionToDiaryInES(diary, payload);
    return res.json({ ok: true, id, payload });
  } catch (err) { next(err); }
}

// ⬇️ جديد: Debug لاستخراج التوسعات من أي نص (وقت البحث)
export async function debugExtract(req: Request, res: Response, next: NextFunction) {
  try {
    const text = String(req.query.text ?? req.query.q ?? "").trim();
    if (!text) return res.status(400).json({ error: "text is required" });

  const payload = await extractKeywords(text, { model: DEFAULT_LLM_MODEL, temperature: 0 });
    return res.json({ text, payload });
  } catch (err) { next(err); }
}

// ⬇️ جديد: جلب وثيقة اليوميّة من Elasticsearch مع حقول التوسّعات (sensitive_en...إلخ)
export async function getDiaryFromES(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);

    // _source=title,content,... (اختياري)
    const fieldsParam = String(req.query._source ?? "").trim();
    const defaultFields = [
      "title", "content",
      "entities", "actions", "attributes",
      "entities_en", "entities_ar",
      "actions_en", "actions_ar",
      "attributes_en", "attributes_ar",
      "phrases_ar",
      "sensitive_en", "sensitive_ar",
      "inquiry_ar",
      "time_label", "polarity",
      "updatedAt", "createdAt", "userId"
    ];
    const fields =
      fieldsParam ? fieldsParam.split(",").map(s => s.trim()).filter(Boolean) : defaultFields;

    // نستخدم search + ids query عشان نتحكم بـ _source بسهولة
    const r = await es.search({
      index: DIARY_INDEX,
      _source: fields,
      query: { ids: { values: [id] } },
      size: 1,
    });

    const hit = (r.hits.hits ?? [])[0];
    if (!hit) return res.status(404).json({ error: "Not found in ES", id });

    return res.json({
      id: hit._id,
      _score: hit._score,
      _source: hit._source,
    });
  } catch (err) { next(err); }
}
