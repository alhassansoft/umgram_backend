// src/controllers/noteController.ts
import { Request, Response, NextFunction } from "express";
import { NoteModel } from "../models/noteModel";
import { indexNote } from "../search/noteIndex";

// إنشاء
export async function createNote(
  req: Request<unknown, unknown, { title?: string; content?: string; userId?: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, content = "", userId } = req.body;
    if (!title || !userId) {
      return res.status(400).json({ error: "title و userId مطلوبان" });
    }

  const note = await NoteModel.create({ title, content, userId });
  // index in ES (best-effort)
  indexNote(note).catch((e) => console.error("[Elastic] note index create failed:", e));
  return res.status(201).json(note);
  } catch (err) {
    next(err);
  }
}

// جلب بالمعرّف
export async function getNote(
  req: Request<{ id?: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "id مطلوب" });

    const note = await NoteModel.findById(id);
    if (!note) return res.status(404).json({ error: "Not found" });

    return res.json(note);
  } catch (err) {
    next(err);
  }
}

// كل ملاحظات مستخدم
export async function getUserNotes(
  req: Request<{ userId?: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ error: "userId مطلوب" });

    const notes = await NoteModel.findAllByUser(userId);
    return res.json(notes);
  } catch (err) {
    next(err);
  }
}

// تحديث
export async function updateNote(
  req: Request<{ id?: string }, unknown, { title?: string; content?: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "id مطلوب" });

    const patch: Partial<{ title: string; content: string }> = {};
    if (typeof req.body.title !== "undefined") patch.title = req.body.title;
    if (typeof req.body.content !== "undefined") patch.content = req.body.content;

  const note = await NoteModel.update(id, patch);
    if (!note) return res.status(404).json({ error: "Not found" });
  indexNote(note).catch((e) => console.error("[Elastic] note index update failed:", e));
  return res.json(note);
  } catch (err) {
    next(err);
  }
}

// حذف
export async function deleteNote(
  req: Request<{ id?: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "id مطلوب" });

    const ok = await NoteModel.delete(id);
    if (!ok) return res.status(404).json({ error: "Not found" });

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
