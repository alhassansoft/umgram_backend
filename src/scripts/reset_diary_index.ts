import "dotenv/config";
import { es } from "../lib/es";
import { ensureDiaryIndex, DIARY_INDEX } from "../search/diaryIndex";

async function main() {
  if (!es) {
    console.log("Elastic client not configured.");
    process.exit(0);
  }

  try {
    const exists = await es.indices.exists({ index: DIARY_INDEX });
    if (exists) {
      console.log(`Deleting index ${DIARY_INDEX} ...`);
      await es.indices.delete({ index: DIARY_INDEX });
    }
  } catch (e: any) {
    if (e?.meta?.statusCode !== 404 && e?.statusCode !== 404) {
      console.error("Failed deleting index:", e);
      process.exit(1);
    }
  }

  console.log(`Creating index ${DIARY_INDEX} ...`);
  await ensureDiaryIndex();
  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
