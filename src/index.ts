// src/server/index.ts
import * as dotenv from "dotenv";
dotenv.config();

import { app } from "./app";
import { ensurePostsIndex } from "./lib/es";
import { ensureDiaryIndex } from "./search/diaryIndex";
import { ensureNoteIndex } from "./search/noteIndex";
import { ensureChatIndex } from "./search/chatIndex";
import { ensureMicroblogIndex } from "./search/microblogIndex";
import { scheduleChatExtraction } from "./jobs/chatExtractionJob";
import { JobProcessor } from "./jobs/jobProcessor";

const PORT = Number(process.env.PORT ?? 5001);

async function start() {
  // Initialize Elasticsearch if enabled; don't crash API if it fails
  if (process.env.ENABLE_ELASTIC !== "false") {
    try {
      await ensurePostsIndex();
      await Promise.allSettled([
        ensureDiaryIndex(),
        ensureNoteIndex(),
  ensureChatIndex(),
  ensureMicroblogIndex(),
      ]);
      console.log("[elastic] ready");
    } catch (e: any) {
      console.warn("[elastic] skipping init:", e?.message || e);
    }
  } else {
    console.log("[elastic] disabled by ENABLE_ELASTIC=false");
  }

  app.listen(PORT, () => {
    console.log(`[backend] http://localhost:${PORT}`);
  });

  // Start background job to extract chat conversations every N hours (default 24)
  scheduleChatExtraction();
  
  // Start job processor for keyword normalization and other background tasks
  const jobIntervalMs = Number(process.env.JOB_PROCESSOR_INTERVAL_MS ?? 5000);
  JobProcessor.start(jobIntervalMs);
  console.log(`[jobs] processor started with ${jobIntervalMs}ms interval`);
}

start();
