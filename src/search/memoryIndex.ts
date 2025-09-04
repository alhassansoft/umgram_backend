import { es } from "../lib/es";

export const MEMORY_INDEX = process.env.ES_MEMORY_INDEX || "umgram_memory";

export async function ensureMemoryIndex() {
	if (!es) return;
	const exists = await es.indices.exists({ index: MEMORY_INDEX });
	if (!exists) {
		await es.indices.create({
			index: MEMORY_INDEX,
			settings: {
				analysis: {
					analyzer: {
						en_ascii: { type: "custom", tokenizer: "standard", filter: ["lowercase", "asciifolding"] },
					},
				},
			},
			mappings: {
				properties: {
					id: { type: "keyword" },
					tableId: { type: "keyword" },
					userId: { type: "keyword" },
					tableName: { type: "text", fields: { raw: { type: "keyword" } } },
					// store a concatenated text field to search across all cell values
					content: { type: "text", analyzer: "standard", fields: { ascii: { type: "text", analyzer: "en_ascii" } } },
					createdAt: { type: "date" },
					updatedAt: { type: "date" },
				},
			},
		});
	}
}

export async function indexMemoryRow(row: { id: string; tableId: string; userId: string; tableName: string; values: Record<string, string>; createdAt: Date; updatedAt: Date }, opts: { refresh?: boolean } = {}) {
	if (!es) return;
	await ensureMemoryIndex();
	const content = Object.values(row.values || {}).join(" \n ");
	await es.index({
		index: MEMORY_INDEX,
		id: String(row.id),
		document: {
			id: String(row.id),
			tableId: row.tableId,
			userId: row.userId,
			tableName: row.tableName,
			content,
			createdAt: new Date(row.createdAt).toISOString(),
			updatedAt: new Date(row.updatedAt).toISOString(),
		},
		refresh: opts.refresh ? "wait_for" : false,
	});
}

export async function deleteMemoryRowFromIndex(rowId: string) {
	if (!es) return;
	try { await es.delete({ index: MEMORY_INDEX, id: String(rowId) }); } catch (_) {}
}

