// src/models/diaryModel.ts
// NOTE: No schema changes are required here for the new extraction fields (time/polarity).
// Those live in entity_extractions / extraction_terms, not in the diaries table.

import { query } from "../db";

export interface Diary {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

type DiaryRow = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
};

function mapRow(r: DiaryRow): Diary {
  return {
    id: r.id,
    title: r.title,
    content: r.content,
    userId: r.user_id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// مساعد للتحقق من وجود أول صف (آمن مع noUncheckedIndexedAccess)
function first<T>(rows: T[], errMsg: string): T {
  const r = rows[0];
  if (!r) throw new Error(errMsg);
  return r;
}

export const DiaryModel = {
  // إنشاء سجل جديد
  async create(args: { title: string; content: string; userId: string }): Promise<Diary> {
    const title = args.title?.trim() ?? "";
    const content = args.content?.trim() ?? "";
    const userId = args.userId;

    const { rows } = await query<DiaryRow>(
      `
      INSERT INTO diaries (title, content, user_id)
      VALUES ($1, $2, $3)
      RETURNING id, title, content, user_id, created_at, updated_at
      `,
      [title, content, userId],
    );
    return mapRow(first(rows, "Insert diary failed: no row returned"));
  },

  // جلب سجل واحد بالمعرّف
  async findById(id: string): Promise<Diary | null> {
    const { rows } = await query<DiaryRow>(
      `
      SELECT id, title, content, user_id, created_at, updated_at
      FROM diaries
      WHERE id = $1
      `,
      [id],
    );
    return rows[0] ? mapRow(rows[0]) : null;
  },

  // كل السجلات الخاصة بمستخدم
  async findAllByUser(userId: string): Promise<Diary[]> {
    const { rows } = await query<DiaryRow>(
      `
      SELECT id, title, content, user_id, created_at, updated_at
      FROM diaries
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId],
    );
    return rows.map(mapRow);
  },

  // تحديث جزئي لحقول العنوان/المحتوى
  async update(
    id: string,
    data: Partial<{ title: string; content: string }>
  ): Promise<Diary | null> {
    const sets: string[] = [];
    const values: any[] = [];
    let i = 1;

    if (data.title !== undefined) {
      sets.push(`title = $${i++}`);
      values.push(data.title.trim());
    }
    if (data.content !== undefined) {
      sets.push(`content = $${i++}`);
      values.push(data.content.trim());
    }

    // لو ما في تغييرات، رجّع السجل كما هو
    if (sets.length === 0) {
      return this.findById(id);
    }

    // حدّث دائمًا حقل updated_at
    sets.push(`updated_at = now()`);

    values.push(id);
    const { rows } = await query<DiaryRow>(
      `
      UPDATE diaries
      SET ${sets.join(", ")}
      WHERE id = $${i}
      RETURNING id, title, content, user_id, created_at, updated_at
      `,
      values,
    );
    return rows[0] ? mapRow(rows[0]) : null;
  },

  // حذف السجل وإرجاع true لو تم
  async delete(id: string): Promise<boolean> {
    const { rows } = await query<{ id: string }>(
      `DELETE FROM diaries WHERE id = $1 RETURNING id`,
      [id],
    );
    return rows.length > 0;
  },
};

export default DiaryModel;
