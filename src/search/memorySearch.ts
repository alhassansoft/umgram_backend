import { es } from "../lib/es";
import { MEMORY_INDEX, ensureMemoryIndex } from "./memoryIndex";
import type { estypes } from "@elastic/elasticsearch";

export async function searchMemory(
  userId: string,
  q: string,
  opts: { tableId?: string; size?: number; from?: number } = {}
) {
  if (!es) return [] as any[];
  await ensureMemoryIndex();

  const size = Math.max(1, Math.min(50, opts.size ?? 20));
  const from = Math.max(0, Math.min(10000, opts.from ?? 0));

  const fields = ["content", "tableName^0.5"] as string[];
  const engTokens = q.toLowerCase().match(/[a-z]+/g) ?? [];
  const hasShortToken = engTokens.some((t) => t.length < 3);

  const base: estypes.QueryDslQueryContainer = {
    multi_match: {
      query: q,
      fields: fields as string[],
      type: "best_fields",
      operator: "or",
      fuzziness: (hasShortToken ? 1 : ("AUTO" as any)),
    },
  };

  const filters: estypes.QueryDslQueryContainer[] = [{ term: { userId } }];
  if (opts.tableId) filters.push({ term: { tableId: opts.tableId } });

  const query: estypes.QueryDslQueryContainer = { bool: { must: [base, ...filters] } };

  const result = await es.search({ index: MEMORY_INDEX, from, size, query, highlight: { fields: { content: {} } } });
  const hits = (result.hits.hits ?? []).map((h: any) => ({ id: h._id, score: h._score, ...(h._source ?? {}), highlight: h.highlight }));
  return hits;
}
