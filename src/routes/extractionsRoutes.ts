// src/routes/extractionsRoutes.ts
import { Router } from "express";
import {
  getDiaryExtraction,
  rebuildDiaryExtraction,
  syncDiaryExtractionToES,
  debugExtract,
  getDiaryFromES, // ⬅️ جديد
} from "../controllers/extractionsController";

const router = Router();

router.get("/diary/:id", getDiaryExtraction);
router.post("/diary/:id/rebuild", rebuildDiaryExtraction);
router.post("/diary/:id/sync-es", syncDiaryExtractionToES);

// Debug: جرّب استخراج/توسعات على نص حر
router.get("/debug", debugExtract);

// ⬅️ جديد: وثيقة اليوميّة من Elasticsearch (تشوف فيها sensitive_en/sensitive_ar)
router.get("/diary/:id/es", getDiaryFromES);

export default router;
