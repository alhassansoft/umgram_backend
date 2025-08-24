import { Router } from "express";
import { searchDiariesSemantic } from "../search/diarySearch";

const r = Router();

r.get("/search", async (req, res) => {
  try {
    const q = (req.query.q ?? "").toString();
    if (!q.trim()) return res.status(400).json({ error: "Missing q" });
    const hits = await searchDiariesSemantic(q);
    res.json({ count: hits.length, hits });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e?.message ?? "search failed" });
  }
});

export default r;
