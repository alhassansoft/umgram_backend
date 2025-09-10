// src/controllers/noteExtractionsController.ts
import { Request, Response, NextFunction } from "express";
import { NoteModel } from "../models/noteModel";
import { extractKeywords, extractKeywordsChunked, DEFAULT_LLM_MODEL } from "../services/keywordExtractor";
import { saveExtraction, getExtractionByContent } from "../services/extractions";
import { attachExtractionToNoteInES } from "../search/noteIndex";

export async function getNoteExtraction(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const x = await getExtractionByContent("note", id);
    if (!x) return res.status(404).json({ error: "Not found" });
    return res.json(x);
  } catch (err) { next(err); }
}

export async function rebuildNoteExtraction(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const note = await NoteModel.findById(id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    const text = `${note.title}\n\n${note.content ?? ""}`;
    
    // Use chunked extraction for long notes to avoid timeouts
    const payload = text.length > 3000 
      ? await extractKeywordsChunked(text, { 
          model: DEFAULT_LLM_MODEL, 
          temperature: 0,
          maxTokensPerChunk: 1800,
          mergeStrategy: 'intelligent'
        })
      : await extractKeywords(text, { model: DEFAULT_LLM_MODEL, temperature: 0 });

    const { id: extractionId } = await saveExtraction({
      contentType: "note",
      contentId: note.id,
      userId: note.userId,
      payload,
      model: DEFAULT_LLM_MODEL,
      promptVersion: "v1",
      inputTextForHash: text,
    });

    await attachExtractionToNoteInES(note, payload);

    return res.json({ ok: true, id: extractionId, payload, chunked: text.length > 3000 });
  } catch (err) { next(err); }
}

export async function syncNoteExtractionToES(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const note = await NoteModel.findById(id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    const payload = await getExtractionByContent("note", id);
    if (!payload) return res.status(404).json({ error: "No extraction stored for this note" });

    await attachExtractionToNoteInES(note, payload);
    return res.json({ ok: true, id, payload });
  } catch (err) { next(err); }
}
