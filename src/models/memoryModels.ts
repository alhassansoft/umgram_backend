import { query } from "../db";

export type MemoryColumn = { id: string; tableId: string; name: string; position: number; createdAt: Date };
export type MemoryRow = { id: string; tableId: string; values: Record<string, string>; createdAt: Date; updatedAt: Date };
export type MemoryTable = {
	id: string;
	userId: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	columns?: MemoryColumn[];
	rows?: MemoryRow[];
};

const makeId = (p = "") => `${p}${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

async function ensureSchema() {
	// Create tables if not exists (simple bootstrap; not a full migration system)
	await query(`
		CREATE TABLE IF NOT EXISTS memory_tables (
			id        TEXT PRIMARY KEY,
			user_id   TEXT NOT NULL,
			name      TEXT NOT NULL,
			created_at TIMESTAMPTZ DEFAULT now(),
			updated_at TIMESTAMPTZ DEFAULT now()
		);
		CREATE INDEX IF NOT EXISTS idx_memory_tables_user ON memory_tables(user_id);
	`);
	await query(`
		CREATE TABLE IF NOT EXISTS memory_columns (
			id        TEXT PRIMARY KEY,
			table_id  TEXT NOT NULL REFERENCES memory_tables(id) ON DELETE CASCADE,
			name      TEXT NOT NULL,
			position  INT DEFAULT 0,
			created_at TIMESTAMPTZ DEFAULT now()
		);
		CREATE INDEX IF NOT EXISTS idx_memory_columns_table ON memory_columns(table_id);
	`);
	await query(`
		CREATE TABLE IF NOT EXISTS memory_rows (
			id        TEXT PRIMARY KEY,
			table_id  TEXT NOT NULL REFERENCES memory_tables(id) ON DELETE CASCADE,
			values    JSONB NOT NULL DEFAULT '{}'::jsonb,
			created_at TIMESTAMPTZ DEFAULT now(),
			updated_at TIMESTAMPTZ DEFAULT now()
		);
		CREATE INDEX IF NOT EXISTS idx_memory_rows_table ON memory_rows(table_id);
	`);
}

ensureSchema().catch((e) => console.error("ensureSchema(memory) failed", e));

export const MemoryModel = {
	// Tables
	async createTable(userId: string, name: string, columns: string[]): Promise<MemoryTable & { columns: MemoryColumn[] }> {
		const id = makeId("tbl_");
		const { rows } = await query<{ id: string; user_id: string; name: string; created_at: Date; updated_at: Date }>(
			`INSERT INTO memory_tables (id, user_id, name) VALUES ($1, $2, $3)
			 RETURNING id, user_id, name, created_at, updated_at`,
			[id, userId, name.trim() || "جدول"],
		);
		const t = rows[0]!;
		const cols: MemoryColumn[] = [];
		let pos = 0;
		for (const cn of columns) {
			const cid = makeId("col_");
			const { rows: cr } = await query<{ id: string; table_id: string; name: string; position: number; created_at: Date }>(
				`INSERT INTO memory_columns (id, table_id, name, position) VALUES ($1,$2,$3,$4)
				 RETURNING id, table_id, name, position, created_at`,
				[cid, t.id, cn.trim() || "عمود", pos++],
			);
			cols.push({ id: cr[0]!.id, tableId: cr[0]!.table_id, name: cr[0]!.name, position: cr[0]!.position, createdAt: cr[0]!.created_at });
		}
		return { id: t.id, userId: t.user_id, name: t.name, createdAt: t.created_at, updatedAt: t.updated_at, columns: cols };
	},

	async renameTable(id: string, name: string): Promise<boolean> {
		const { rows } = await query<{ id: string }>(`UPDATE memory_tables SET name = $1, updated_at = now() WHERE id = $2 RETURNING id`, [name.trim(), id]);
		return rows.length > 0;
	},

	async deleteTable(id: string): Promise<boolean> {
		const { rows } = await query<{ id: string }>(`DELETE FROM memory_tables WHERE id = $1 RETURNING id`, [id]);
		return rows.length > 0;
	},

	async findTablesByUser(userId: string): Promise<Array<MemoryTable & { columns: MemoryColumn[]; rowsCount: number }>> {
		const { rows } = await query<{ id: string; user_id: string; name: string; created_at: Date; updated_at: Date }>(
			`SELECT id, user_id, name, created_at, updated_at
			 FROM memory_tables WHERE user_id = $1 ORDER BY updated_at DESC`,
			[userId],
		);
		const result: Array<MemoryTable & { columns: MemoryColumn[]; rowsCount: number }> = [];
		for (const r of rows) {
			const { rows: cols } = await query<{ id: string; table_id: string; name: string; position: number; created_at: Date }>(
				`SELECT id, table_id, name, position, created_at FROM memory_columns WHERE table_id = $1 ORDER BY position ASC, created_at ASC`,
				[r.id],
			);
			const { rows: cnt } = await query<{ c: string }>(`SELECT COUNT(1)::text as c FROM memory_rows WHERE table_id = $1`, [r.id]);
			result.push({
				id: r.id,
				userId: r.user_id,
				name: r.name,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				columns: cols.map((c) => ({ id: c.id, tableId: c.table_id, name: c.name, position: c.position, createdAt: c.created_at })),
				rowsCount: Number(cnt[0]?.c ?? 0),
			});
		}
		return result;
	},

	async getTableWithData(tableId: string): Promise<(MemoryTable & { columns: MemoryColumn[]; rows: MemoryRow[] }) | null> {
		const { rows } = await query<{ id: string; user_id: string; name: string; created_at: Date; updated_at: Date }>(
			`SELECT id, user_id, name, created_at, updated_at FROM memory_tables WHERE id = $1`,
			[tableId],
		);
		const t = rows[0];
		if (!t) return null;
		const { rows: cols } = await query<{ id: string; table_id: string; name: string; position: number; created_at: Date }>(
			`SELECT id, table_id, name, position, created_at FROM memory_columns WHERE table_id = $1 ORDER BY position ASC, created_at ASC`,
			[tableId],
		);
		const { rows: rws } = await query<{ id: string; table_id: string; values: any; created_at: Date; updated_at: Date }>(
			`SELECT id, table_id, values, created_at, updated_at FROM memory_rows WHERE table_id = $1 ORDER BY created_at DESC`,
			[tableId],
		);
		return {
			id: t.id,
			userId: t.user_id,
			name: t.name,
			createdAt: t.created_at,
			updatedAt: t.updated_at,
			columns: cols.map((c) => ({ id: c.id, tableId: c.table_id, name: c.name, position: c.position, createdAt: c.created_at })),
			rows: rws.map((r) => ({ id: r.id, tableId: r.table_id, values: r.values ?? {}, createdAt: r.created_at, updatedAt: r.updated_at })),
		};
	},

	// Columns
	async addColumn(tableId: string, name: string): Promise<MemoryColumn> {
		const id = makeId("col_");
		const { rows } = await query<{ id: string; table_id: string; name: string; position: number; created_at: Date }>(
			`INSERT INTO memory_columns (id, table_id, name, position) VALUES ($1,$2,$3,
				COALESCE((SELECT MAX(position)+1 FROM memory_columns WHERE table_id = $2), 0))
			 RETURNING id, table_id, name, position, created_at`,
			[id, tableId, name.trim() || "عمود"],
		);
		await query(`UPDATE memory_tables SET updated_at = now() WHERE id = $1`, [tableId]);
		const c = rows[0]!;
		return { id: c.id, tableId: c.table_id, name: c.name, position: c.position, createdAt: c.created_at };
	},

	async renameColumn(tableId: string, colId: string, name: string): Promise<boolean> {
		const { rows } = await query<{ id: string }>(`UPDATE memory_columns SET name = $1 WHERE id = $2 AND table_id = $3 RETURNING id`, [name.trim(), colId, tableId]);
		await query(`UPDATE memory_tables SET updated_at = now() WHERE id = $1`, [tableId]);
		return rows.length > 0;
	},

	async deleteColumn(tableId: string, colId: string): Promise<boolean> {
		// Remove column definition
		const { rows } = await query<{ id: string }>(`DELETE FROM memory_columns WHERE id = $1 AND table_id = $2 RETURNING id`, [colId, tableId]);
		// Remove key from all row JSON values
		await query(`UPDATE memory_rows SET values = values - $1, updated_at = now() WHERE table_id = $2`, [colId, tableId]);
		await query(`UPDATE memory_tables SET updated_at = now() WHERE id = $1`, [tableId]);
		return rows.length > 0;
	},

	// Rows
	async addRow(tableId: string, values: Record<string, string>): Promise<MemoryRow> {
		const id = makeId("row_");
		const { rows } = await query<{ id: string; table_id: string; values: any; created_at: Date; updated_at: Date }>(
			`INSERT INTO memory_rows (id, table_id, values) VALUES ($1,$2,$3::jsonb)
			 RETURNING id, table_id, values, created_at, updated_at`,
			[id, tableId, JSON.stringify(values || {})],
		);
		await query(`UPDATE memory_tables SET updated_at = now() WHERE id = $1`, [tableId]);
		const r = rows[0]!;
		return { id: r.id, tableId: r.table_id, values: r.values ?? {}, createdAt: r.created_at, updatedAt: r.updated_at };
	},

	async updateRow(tableId: string, rowId: string, values: Record<string, string>): Promise<boolean> {
		const { rows } = await query<{ id: string }>(
			`UPDATE memory_rows SET values = $1::jsonb, updated_at = now() WHERE id = $2 AND table_id = $3 RETURNING id`,
			[JSON.stringify(values || {}), rowId, tableId],
		);
		await query(`UPDATE memory_tables SET updated_at = now() WHERE id = $1`, [tableId]);
		return rows.length > 0;
	},

	async deleteRow(tableId: string, rowId: string): Promise<boolean> {
		const { rows } = await query<{ id: string }>(`DELETE FROM memory_rows WHERE id = $1 AND table_id = $2 RETURNING id`, [rowId, tableId]);
		await query(`UPDATE memory_tables SET updated_at = now() WHERE id = $1`, [tableId]);
		return rows.length > 0;
	},
};

export default MemoryModel;

