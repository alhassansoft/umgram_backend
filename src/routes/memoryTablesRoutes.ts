import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { MemoryTablesController as C } from '../controllers/memoryTablesController';
import { searchMemory } from '../search/memorySearch';
import { ensureMemoryIndex, indexMemoryRow } from '../search/memoryIndex';
import { memoryPrompt } from '../controllers/memoryAIController';
import { MemoryModel } from '../models/memoryModels';

const router = Router();

// Tables
router.get('/tables', requireAuth, C.list);
router.post('/tables', requireAuth, C.createTable);
router.get('/tables/:id', requireAuth, C.getTable);
router.patch('/tables/:id', requireAuth, C.renameTable);
router.delete('/tables/:id', requireAuth, C.deleteTable);

// Columns
router.post('/tables/:id/columns', requireAuth, C.addColumn);
router.patch('/tables/:id/columns/:colId', requireAuth, C.renameColumn);
router.delete('/tables/:id/columns/:colId', requireAuth, C.deleteColumn);

// Rows
router.post('/tables/:id/rows', requireAuth, C.addRow);
router.patch('/tables/:id/rows/:rowId', requireAuth, C.updateRow);
router.delete('/tables/:id/rows/:rowId', requireAuth, C.deleteRow);

export default router;

// Extra endpoints mounted on the same router:
router.post('/ai/prompt', requireAuth, memoryPrompt);
router.get('/search', requireAuth, async (req, res, next) => {
	try {
		const userId = String(req.user?.sub || '');
		const q = String(req.query.q ?? '').trim();
		const tableId = req.query.tableId ? String(req.query.tableId) : undefined;
		if (!q) return res.json({ hits: [], total: 0 });
		const opts: any = {};
		if (tableId) opts.tableId = tableId;
		const hits = await searchMemory(userId, q, opts);
		res.json({ hits, total: hits.length });
	} catch (err) { next(err); }
});

router.post('/tables/:id/reindex', requireAuth, async (req, res, next) => {
	try {
		const tableId = String(req.params.id);
		const table = await MemoryModel.getTableWithData(tableId);
		if (!table) return res.status(404).json({ error: 'not found' });
		await ensureMemoryIndex();
		for (const row of table.rows || []) {
			await indexMemoryRow({ id: row.id, tableId, userId: table.userId, tableName: table.name, values: row.values, createdAt: row.createdAt, updatedAt: row.updatedAt }, { refresh: false });
		}
		res.json({ ok: true });
	} catch (err) { next(err); }
});

