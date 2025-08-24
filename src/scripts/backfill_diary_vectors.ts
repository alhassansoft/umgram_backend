import { pool } from "../db";
import DiaryModel from "../models/diaryModel";
import { getExtractionByContent } from "../services/extractions";
import { attachExtractionToDiaryInES, ensureDiaryIndex } from "../search/diaryIndex";

async function main() {
  await ensureDiaryIndex();

  const { rows } = await pool.query<{ id: string }>(`SELECT id FROM diaries ORDER BY created_at DESC`);
  for (const row of rows) {
    const d = await DiaryModel.findById(row.id);
    if (!d) continue;
    const x = await getExtractionByContent("diary", d.id);
    if (!x) continue; // لا يوجد استخراج بعد
    await attachExtractionToDiaryInES(d, x, { refresh: false });
    console.log("backfilled diary", d.id);
  }
  console.log("done.");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
