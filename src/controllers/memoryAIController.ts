import { Request, Response } from "express";
import MemoryModel from "../models/memoryModels";
import { planMemoryActions, MemoryAIPlan, MemoryAIAction } from "../services/memoryAI";
import { indexMemoryRow } from "../search/memoryIndex";

function normalizeName(s: string) { return (s || "").trim(); }
function isEmptyRow(row: Record<string, string> | null | undefined): boolean {
  if (!row) return true;
  for (const [k, v] of Object.entries(row)) {
    if (typeof v === 'string' && v.trim() !== '') return false;
  }
  return true;
}
function cleanRow(row: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(row || {})) {
    const kk = String(k || '').trim();
    const vv = typeof v === 'string' ? v.trim() : String(v ?? '').trim();
    if (!kk) continue;
    if (vv === '') continue;
    out[kk] = vv;
  }
  return out;
}

async function mapRowKeysToColumnIds(tableId: string, row: Record<string, string>, columnsCache?: {
  byId: Set<string>;
  byName: Map<string, string>;
}): Promise<{ mapped: Record<string, string>; cache: { byId: Set<string>; byName: Map<string, string> } }> {
  let cache = columnsCache;
  if (!cache) {
    const t = await MemoryModel.getTableWithData(tableId);
    const byId = new Set<string>();
    const byName = new Map<string, string>();
    for (const c of (t?.columns || [])) { byId.add(c.id); byName.set(c.name, c.id); }
    cache = { byId, byName };
  }
  const out: Record<string, string> = {};
  for (const [kRaw, v] of Object.entries(row)) {
    const k = String(kRaw || '').trim();
    if (!k) continue;
    // Already an id
    if (cache.byId.has(k)) { out[k] = v; continue; }
    // Name -> id
    const idExisting = cache.byName.get(k);
    if (idExisting) { out[idExisting] = v; continue; }
    // Create missing column with this name
    const created = await MemoryModel.addColumn(tableId, k);
    cache.byId.add(created.id);
    cache.byName.set(created.name, created.id);
    out[created.id] = v;
  }
  return { mapped: out, cache: cache! };
}

export async function memoryPrompt(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.sub as string;
    if (!userId) return res.status(401).json({ error: "unauthorized" });
    const { prompt, tableId, apply, clientContext } = req.body as {
      prompt: string;
      tableId?: string;
      apply?: boolean;
      clientContext?: {
        currentTable?: { name: string; columns: string[]; sampleRows?: Record<string, string>[] } | null;
        existingTables?: { name: string; columns: string[] }[];
      };
    };
    if (!prompt || typeof prompt !== "string") return res.status(400).json({ error: "prompt required" });

    // Load context
    const tables = await MemoryModel.findTablesByUser(userId);
    const current = tableId ? await MemoryModel.getTableWithData(tableId) : null;

    const plan = await planMemoryActions(prompt, {
      userLocale: "ar",
      currentTable: clientContext?.currentTable ?? (current ? { name: current.name, columns: current.columns.map(c => c.name), sampleRows: current.rows?.slice(0, 3).map(r => r.values) } : null),
      existingTables: clientContext?.existingTables ?? tables.map(t => ({ name: t.name, columns: t.columns.map(c => c.name) })),
    });

  const result: { applied: any[]; plan: MemoryAIPlan } = { applied: [], plan };
  // Track the last table created in this plan so subsequent actions target it by default
  let lastCreated: { id: string; name: string } | null = null;

    if (apply) {
      for (const action of plan.actions) {
        const a = action as MemoryAIAction;
        switch (a.type) {
          case "create_table": {
            const desiredName = normalizeName(a.tableName);
            const created = await MemoryModel.createTable(userId, desiredName, a.columns.map(normalizeName));
            result.applied.push({ type: a.type, tableId: created.id });
            lastCreated = { id: created.id, name: created.name };
            if (a.items && a.items.length) {
              // Build column maps from created table
              const colByName = new Map<string, string>();
              const colById = new Set<string>();
              for (const c of created.columns || []) { colByName.set(c.name, c.id); colById.add(c.id); }
              let cache = { byId: colById, byName: colByName };
              for (const raw of a.items) {
                const row = cleanRow(raw);
                if (isEmptyRow(row)) continue;
                const { mapped, cache: newCache } = await mapRowKeysToColumnIds(created.id, row, cache);
                cache = newCache;
                const r = await MemoryModel.addRow(created.id, mapped);
                await indexMemoryRow({
                  id: r.id,
                  tableId: created.id,
                  userId,
                  tableName: created.name,
                  values: mapped,
                  createdAt: r.createdAt,
                  updatedAt: r.updatedAt,
                });
              }
            }
            break;
          }
          case "add_columns": {
            const targetId = tableId || current?.id || lastCreated?.id;
            if (!targetId) { result.applied.push({ type: a.type, error: "no target table" }); break; }
            for (const col of a.columns) await MemoryModel.addColumn(targetId, normalizeName(col));
            result.applied.push({ type: a.type, tableId: targetId, count: a.columns.length });
            break;
          }
          case "add_rows": {
            let targetId = tableId || current?.id || lastCreated?.id;
            let tableMeta: { id: string; name: string } | null = lastCreated ? { id: lastCreated.id, name: lastCreated.name } : null;
            if (!targetId) {
              // No target: create a table using union of keys as columns
              const colSet = new Set<string>();
              const cleanedRows = (a.rows || []).map(cleanRow).filter(r => !isEmptyRow(r));
              for (const row of cleanedRows) Object.keys(row || {}).forEach((k) => colSet.add(k));
              const columns = Array.from(colSet);
              // If no columns after cleaning, use a single generic column
              if (columns.length === 0) columns.push('بند');
              // Default base name in Arabic; avoid exact duplicates by suffixing a number if needed
              const base = 'مقترحات الذكاء';
              let guessName = base;
              const existingSame = tables.filter(t => t.name === base);
              if (existingSame.length > 0) {
                let idx = existingSame.length + 1;
                // ensure unique among all current names
                const names = new Set(tables.map(t => t.name));
                while (names.has(guessName)) { guessName = `${base} ${idx++}`; }
              }
              const created = await MemoryModel.createTable(userId, guessName, columns);
              tableMeta = { id: created.id, name: created.name };
              result.applied.push({ type: "create_table", tableId: created.id, tableName: created.name, columns });
              targetId = created.id;
              lastCreated = { id: created.id, name: created.name };
            }
            const t = tableMeta
              ? { id: tableMeta.id, name: tableMeta.name }
              : lastCreated
              ? { id: lastCreated.id, name: lastCreated.name }
              : current
              ? { id: current.id, name: current.name }
              : { id: targetId!, name: (await MemoryModel.getTableWithData(targetId!))?.name || "" };
            const cleanedRows = (a.rows || []).map(cleanRow).filter(r => !isEmptyRow(r));
            // Cache columns for mapping
            let cache: { byId: Set<string>; byName: Map<string, string> } | undefined;
            if (tableMeta) {
              // We just created the table, fetch columns once to seed cache
              const full = await MemoryModel.getTableWithData(targetId!);
              const byId = new Set<string>();
              const byName = new Map<string, string>();
              for (const c of (full?.columns || [])) { byId.add(c.id); byName.set(c.name, c.id); }
              cache = { byId, byName };
            }
            for (const row of cleanedRows) {
              const { mapped, cache: newCache } = await mapRowKeysToColumnIds(targetId!, row, cache);
              cache = newCache;
              const r = await MemoryModel.addRow(targetId!, mapped);
              await indexMemoryRow({
                id: r.id,
                tableId: targetId!,
                userId,
                tableName: t.name,
                values: mapped,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
              });
            }
            result.applied.push({ type: a.type, tableId: targetId, count: cleanedRows.length });
            break;
          }
          case "rename_table": {
            const targetId = tableId || current?.id || lastCreated?.id;
            if (!targetId) { result.applied.push({ type: a.type, error: "no target table" }); break; }
            await MemoryModel.renameTable(targetId, normalizeName(a.newName));
            result.applied.push({ type: a.type, tableId: targetId, newName: a.newName });
            break;
          }
          case "rename_column": {
            const t = current
              || (tableId ? await MemoryModel.getTableWithData(tableId) : null)
              || (lastCreated ? await MemoryModel.getTableWithData(lastCreated.id) : null);
            if (!t) { result.applied.push({ type: a.type, error: "no target table" }); break; }
            const col = t.columns.find(c => c.name === a.oldName);
            if (!col) { result.applied.push({ type: a.type, error: "column not found" }); break; }
            await MemoryModel.renameColumn(t.id, col.id, normalizeName(a.newName));
            result.applied.push({ type: a.type, tableId: t.id, colId: col.id });
            break;
          }
          default:
            result.applied.push({ type: (a as any).type || "unknown", error: "unsupported" });
        }
      }
    }

    res.json(result);
  } catch (e: any) {
    console.error("/api/memory/ai/prompt error", e);
    res.status(500).json({ error: e?.message || "server_error" });
  }
}
