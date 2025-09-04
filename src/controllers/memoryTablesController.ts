import { Request, Response, NextFunction } from "express";
import { MemoryModel } from "../models/memoryModels";
import { ensureMemoryIndex, indexMemoryRow, deleteMemoryRowFromIndex } from "../search/memoryIndex";

export const MemoryTablesController = {
	async list(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = String(req.user?.sub || "");
			if (!userId) return res.status(401).json({ error: "unauthorized" });
			const list = await MemoryModel.findTablesByUser(userId);
			res.json(list);
		} catch (err) { next(err); }
	},

	async createTable(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = String(req.user?.sub || "");
			if (!userId) return res.status(401).json({ error: "unauthorized" });
			const name = String(req.body?.name ?? '').trim() || 'جدول';
			const columns = Array.isArray(req.body?.columns) ? req.body.columns.map((s: any) => String(s)) : [];
			const table = await MemoryModel.createTable(userId, name, columns);
			res.status(201).json(table);
		} catch (err) { next(err); }
	},

	async renameTable(req: Request, res: Response, next: NextFunction) {
		try {
			const id = String(req.params.id);
			const name = String(req.body?.name ?? '').trim();
			const ok = await MemoryModel.renameTable(id, name);
			res.json({ ok });
		} catch (err) { next(err); }
	},

	async deleteTable(req: Request, res: Response, next: NextFunction) {
		try {
			const id = String(req.params.id);
			const ok = await MemoryModel.deleteTable(id);
			res.json({ ok });
		} catch (err) { next(err); }
	},

	async getTable(req: Request, res: Response, next: NextFunction) {
		try {
			const id = String(req.params.id);
			const t = await MemoryModel.getTableWithData(id);
			if (!t) return res.status(404).json({ error: "not found" });
			res.json(t);
		} catch (err) { next(err); }
	},

	// Columns
	async addColumn(req: Request, res: Response, next: NextFunction) {
		try {
			const tableId = String(req.params.id);
			const name = String(req.body?.name ?? '').trim() || 'عمود';
			const col = await MemoryModel.addColumn(tableId, name);
			res.status(201).json(col);
		} catch (err) { next(err); }
	},
	async renameColumn(req: Request, res: Response, next: NextFunction) {
		try {
			const tableId = String(req.params.id);
			const colId = String(req.params.colId);
			const name = String(req.body?.name ?? '').trim();
			const ok = await MemoryModel.renameColumn(tableId, colId, name);
			res.json({ ok });
		} catch (err) { next(err); }
	},
	async deleteColumn(req: Request, res: Response, next: NextFunction) {
		try {
			const tableId = String(req.params.id);
			const colId = String(req.params.colId);
			const ok = await MemoryModel.deleteColumn(tableId, colId);
			res.json({ ok });
		} catch (err) { next(err); }
	},

	// Rows
	async addRow(req: Request, res: Response, next: NextFunction) {
		try {
			const tableId = String(req.params.id);
			const values = (req.body?.values && typeof req.body.values === 'object') ? req.body.values as Record<string,string> : {};
			const row = await MemoryModel.addRow(tableId, values);
			// ES index doc
			await ensureMemoryIndex();
			const table = await MemoryModel.getTableWithData(tableId);
			await indexMemoryRow({ id: row.id, tableId, userId: table?.userId || '', tableName: table?.name || '', values: row.values, createdAt: row.createdAt, updatedAt: row.updatedAt }, { refresh: true });
			res.status(201).json(row);
		} catch (err) { next(err); }
	},
	async updateRow(req: Request, res: Response, next: NextFunction) {
		try {
			const tableId = String(req.params.id);
			const rowId = String(req.params.rowId);
			const values = (req.body?.values && typeof req.body.values === 'object') ? req.body.values as Record<string,string> : {};
			const ok = await MemoryModel.updateRow(tableId, rowId, values);
			// ES update
			const table = await MemoryModel.getTableWithData(tableId);
			const updated = table?.rows?.find((r) => r.id === rowId);
			if (updated) {
				await ensureMemoryIndex();
				await indexMemoryRow({ id: updated.id, tableId, userId: table?.userId || '', tableName: table?.name || '', values: updated.values, createdAt: updated.createdAt, updatedAt: updated.updatedAt }, { refresh: true });
			}
			res.json({ ok });
		} catch (err) { next(err); }
	},
	async deleteRow(req: Request, res: Response, next: NextFunction) {
		try {
			const tableId = String(req.params.id);
			const rowId = String(req.params.rowId);
			const ok = await MemoryModel.deleteRow(tableId, rowId);
			await deleteMemoryRowFromIndex(rowId);
			res.json({ ok });
		} catch (err) { next(err); }
	},
};

export default MemoryTablesController;

