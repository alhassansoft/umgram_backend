import { query } from "../db";

export interface MicroPost {
  id: string;
  text: string;
  userId: string;
  createdAt: Date;
}

type PostRow = {
  id: string;
  text: string;
  user_id: string;
  created_at: Date;
};

function mapPostRow(r: PostRow): MicroPost {
  return { id: r.id, text: r.text, userId: r.user_id, createdAt: r.created_at };
}

export const MicroblogModel = {
  async create(args: { text: string; userId: string }): Promise<MicroPost> {
    const text = args.text?.trim() ?? "";
    if (!text) throw new Error("text is required");
    const userId = args.userId;
    const { rows } = await query<PostRow>(
      `INSERT INTO microblog_posts (text, user_id)
       VALUES ($1, $2)
       RETURNING id, text, user_id, created_at`,
      [text, userId]
    );
    const row = rows[0];
    if (!row) throw new Error("Insert micro post failed");
    return mapPostRow(row);
  },

  async list(args: { limit?: number; sinceId?: string } = {}): Promise<MicroPost[]> {
    const limit = Math.min(Math.max(Number(args.limit ?? 50), 1), 200);
    if (args.sinceId) {
      const { rows } = await query<PostRow>(
        `SELECT id, text, user_id, created_at
         FROM microblog_posts
         WHERE id < $1::bigint
         ORDER BY created_at DESC
         LIMIT $2`,
        [args.sinceId, limit]
      );
      return rows.map(mapPostRow);
    }
    const { rows } = await query<PostRow>(
      `SELECT id, text, user_id, created_at
       FROM microblog_posts
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit]
    );
    return rows.map(mapPostRow);
  },

  async toggleLike(postId: string, userId: string): Promise<{ liked: boolean }> {
    // Try delete; if nothing deleted, insert
    const del = await query<{ id: string }>(
      `DELETE FROM microblog_likes
     WHERE post_id = $1::bigint AND user_id = $2
       RETURNING post_id as id`,
      [postId, userId]
    );
    if (del.rowCount && del.rows[0]) {
      return { liked: false };
    }
    await query(
      `INSERT INTO microblog_likes (post_id, user_id)
     VALUES ($1::bigint, $2)
       ON CONFLICT DO NOTHING`,
      [postId, userId]
    );
    return { liked: true };
  },

  async countsForPost(postId: string): Promise<{ likes: number; replies: number }> {
   const likesQ = query<{ c: string }>(`SELECT COUNT(*)::text as c FROM microblog_likes WHERE post_id = $1::bigint`, [postId]);
   const repliesQ = query<{ c: string }>(`SELECT COUNT(*)::text as c FROM microblog_replies WHERE post_id = $1::bigint`, [postId]);
    const [likesR, repliesR] = await Promise.all([likesQ, repliesQ]);
    const likes = Number(likesR.rows[0]?.c ?? 0);
    const replies = Number(repliesR.rows[0]?.c ?? 0);
    return { likes, replies };
  },
};

export default MicroblogModel;
