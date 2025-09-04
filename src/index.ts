// src/index.ts
import * as dotenv from "dotenv";
dotenv.config();

import { app } from "./app";
import { ensurePostsIndex } from "./lib/es";
import { ensureDiaryIndex } from "./search/diaryIndex";
import { ensureNoteIndex } from "./search/noteIndex";
import { ensureChatIndex } from "./search/chatIndex";
import { ensureMicroblogIndex } from "./search/microblogIndex";
import { scheduleChatExtraction } from "./jobs/chatExtractionJob";

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
}

start();
