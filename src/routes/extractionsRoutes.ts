// src/routes/extractionsRoutes.ts
import { Router } from "express";
import {
  getDiaryExtraction,
  rebuildDiaryExtraction,
  syncDiaryExtractionToES,
  debugExtract,
  getDiaryFromES, // ⬅️ جديد
} from "../controllers/extractionsController";
import {
  getNoteExtraction,
  rebuildNoteExtraction,
  syncNoteExtractionToES,
} from "../controllers/noteExtractionsController";
import { searchChatExtractions, runChatExtractionNow, getChatExtractionByConversation, rebuildChatExtractionForConversation } from "../controllers/chatExtractionController";
import { getMicroblogExtraction, rebuildMicroblogExtraction, syncMicroblogExtractionToES } from "../controllers/microblogExtractionsController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/diary/:id", getDiaryExtraction);
// Alias to allow POST /api/extractions/diary/:id (maps to rebuild)
router.post("/diary/:id", rebuildDiaryExtraction);
router.post("/diary/:id/rebuild", rebuildDiaryExtraction);
router.post("/diary/:id/sync-es", syncDiaryExtractionToES);

// Debug: جرّب استخراج/توسعات على نص حر
router.get("/debug", debugExtract);

// ⬅️ جديد: وثيقة اليوميّة من Elasticsearch (تشوف فيها sensitive_en/sensitive_ar)
router.get("/diary/:id/es", getDiaryFromES);

// Notes extractions
router.get("/note/:id", getNoteExtraction);
router.post("/note/:id/rebuild", rebuildNoteExtraction);
router.post("/note/:id/sync-es", syncNoteExtractionToES);

// Chat extractions search
router.get("/chat/search", searchChatExtractions);

// Chat extractions: run scheduler now (test button)
router.post("/chat/run-now", requireAuth, runChatExtractionNow);

// Chat extraction per conversation: get + rebuild now
router.get("/chat/conversations/:id", requireAuth, getChatExtractionByConversation);
router.post("/chat/conversations/:id/rebuild", requireAuth, rebuildChatExtractionForConversation);

// Microblog extractions (parity with diary/note)
router.get("/microblog/:id", getMicroblogExtraction);
router.post("/microblog/:id/rebuild", rebuildMicroblogExtraction);
router.post("/microblog/:id/sync-es", syncMicroblogExtractionToES);

export default router;
