import "dotenv/config";
import { query } from "../db";
import { es } from "../lib/es";

const DIARY_INDEX = process.env.ES_DIARY_INDEX || "umgram_diarys";

async function main() {
  if (!es) {
    console.log("Elastic client not configured.");
    process.exit(0);
  }

  // اجلب من جدول diarys (اسم جدولك الحالي)
  const { rows } = await query<{
    id: number; title: string; content: string | null;
    user_id: string; created_at: Date | string; updated_at: Date | string;
  }>(`SELECT id, title, content, user_id, created_at, updated_at FROM diarys ORDER BY id ASC`);

  console.log(`Indexing ${rows.length} diaries ...`);
  const body = rows.flatMap((r) => ([
    { index: { _index: DIARY_INDEX, _id: String(r.id) } },
    {
      id: String(r.id),
      userId: r.user_id,
      title: r.title,
      content: r.content ?? "",
      createdAt: new Date(r.created_at).toISOString(),
      updatedAt: new Date(r.updated_at).toISOString(),
    },
  ]));

  const resp = await es.bulk({ refresh: true, body });
  // @ts-ignore
  const hasErrors = resp?.errors;
  if (hasErrors) {
    // @ts-ignore
    const errs = (resp.items || []).filter((i: any) => i.index?.error).slice(0, 5);
    console.error("Bulk errors (first 5):", errs);
  } else {
    console.log("Reindex done ✅");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
