// src/controllers/diaryController.ts
import { Request, Response, NextFunction } from "express";
import { DiaryModel } from "../models/diaryModel";
import { indexDiary, removeDiaryFromIndex } from "../search/diaryIndex";

// إنشاء
export async function createDiary(
  req: Request<unknown, unknown, { title?: string; content?: string; userId?: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, content = "", userId } = req.body;
    if (!title || !userId) {
      return res.status(400).json({ error: "title و userId مطلوبان" });
    }

    const diary = await DiaryModel.create({ title, content, userId });

    // فهرسة في ES (لا تُفشل الطلب عند فشل ES)
    indexDiary(diary).catch((e) =>
      console.error("[Elastic] index create failed:", e)
    );

    return res.status(201).json(diary);
  } catch (err) {
    next(err);
  }
}

// جلب بالمعرّف
export async function getDiary(
  req: Request<{ id?: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "id مطلوب" });

    const diary = await DiaryModel.findById(id);
    if (!diary) return res.status(404).json({ error: "Not found" });

    return res.json(diary);
  } catch (err) {
    next(err);
  }
}

// كل يوميات مستخدم
export async function getUserDiaries(
  req: Request<{ userId?: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ error: "userId مطلوب" });

    const diaries = await DiaryModel.findAllByUser(userId);
    return res.json(diaries);
  } catch (err) {
    next(err);
  }
}

// تحديث
export async function updateDiary(
  req: Request<{ id?: string }, unknown, { title?: string; content?: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "id مطلوب" });

    // ابني كائن patch بدون حقول undefined (مهم مع exactOptionalPropertyTypes)
    const patch: Partial<{ title: string; content: string }> = {};
    if (typeof req.body.title !== "undefined") patch.title = req.body.title;
    if (typeof req.body.content !== "undefined") patch.content = req.body.content;

    const diary = await DiaryModel.update(id, patch);
    if (!diary) return res.status(404).json({ error: "Not found" });

    // إعادة فهرسة
    indexDiary(diary).catch((e) =>
      console.error("[Elastic] index update failed:", e)
    );

    return res.json(diary);
  } catch (err) {
    next(err);
  }
}

// حذف
export async function deleteDiary(
  req: Request<{ id?: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "id مطلوب" });

    const ok = await DiaryModel.delete(id);
    if (!ok) return res.status(404).json({ error: "Not found" });

    // حذف من الفهرس
    removeDiaryFromIndex(id).catch((e) =>
      console.error("[Elastic] delete failed:", e)
    );

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
