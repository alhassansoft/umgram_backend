// src/models/noteModel.ts
import { query } from "../db";

export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

type NoteRow = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
};

function mapRow(r: NoteRow): Note {
  return {
    id: r.id,
    title: r.title,
    content: r.content,
    userId: r.user_id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function first<T>(rows: T[], errMsg: string): T {
  const r = rows[0];
  if (!r) throw new Error(errMsg);
  return r;
}

export const NoteModel = {
  async create(args: { title: string; content: string; userId: string }): Promise<Note> {
    const title = args.title?.trim() ?? "";
    const content = args.content?.trim() ?? "";
    const userId = args.userId;

    const { rows } = await query<NoteRow>(
      `
      INSERT INTO notes (title, content, user_id)
      VALUES ($1, $2, $3)
      RETURNING id, title, content, user_id, created_at, updated_at
      `,
      [title, content, userId],
    );
    return mapRow(first(rows, "Insert note failed: no row returned"));
  },

  async findById(id: string): Promise<Note | null> {
    const { rows } = await query<NoteRow>(
      `
      SELECT id, title, content, user_id, created_at, updated_at
      FROM notes
      WHERE id = $1
      `,
      [id],
    );
    return rows[0] ? mapRow(rows[0]) : null;
  },

  async findAllByUser(userId: string): Promise<Note[]> {
    const { rows } = await query<NoteRow>(
      `
      SELECT id, title, content, user_id, created_at, updated_at
      FROM notes
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId],
    );
    return rows.map(mapRow);
  },

  async update(
    id: string,
    data: Partial<{ title: string; content: string }>
  ): Promise<Note | null> {
    const sets: string[] = [];
    const values: any[] = [];
    let i = 1;

    if (typeof data.title !== "undefined") {
      sets.push(`title = $${i++}`);
      values.push(data.title.trim());
    }
    if (typeof data.content !== "undefined") {
      sets.push(`content = $${i++}`);
      values.push(data.content.trim());
    }

    if (sets.length === 0) {
      return this.findById(id);
    }

    sets.push(`updated_at = now()`);

    values.push(id);
    const { rows } = await query<NoteRow>(
      `
      UPDATE notes
      SET ${sets.join(", ")}
      WHERE id = $${i}
      RETURNING id, title, content, user_id, created_at, updated_at
      `,
      values,
    );
    return rows[0] ? mapRow(rows[0]) : null;
  },

  async delete(id: string): Promise<boolean> {
    const { rows } = await query<{ id: string }>(
      `DELETE FROM notes WHERE id = $1 RETURNING id`,
      [id],
    );
    return rows.length > 0;
  },
};

export default NoteModel;
