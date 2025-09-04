import { es } from "../lib/es";
import { createSchema } from "../schemas/posts.schema";
import { query } from "../db";
// ...
export async function createPost(req: any, res: any) {
  const { title, body } = createSchema.parse(req.body);
  const user = (req as any).user;
  // Store via SQL (since Prisma model for Post is not defined in schema)
  const inserted = await query<{ id: number; title: string; body: string; author_id: string; created_at: string }>(
    `INSERT INTO posts (title, body, author_id) VALUES ($1, $2, $3)
     RETURNING id, title, body, author_id, created_at`,
    [title, body, user.id]
  );
  if (!inserted.rowCount || !inserted.rows[0]) {
    return res.status(500).json({ error: 'Failed to create post' });
  }
  const row = inserted.rows[0];
  const post = {
    id: row.id,
    title: row.title,
    body: row.body,
    authorId: row.author_id,
    createdAt: row.created_at,
  };

  // فهرسة غير حرِجة (لا تُسقِط الاستجابة لو فشلت)
  es.index({
    index: 'umgram_posts',
    id: String(post.id),
    document: {
      title: post.title,
      body: post.body,
      authorId: post.authorId,
      createdAt: post.createdAt
    }
  }).then(() => es.indices.refresh({ index: 'umgram_posts' }))
    .catch((e) => console.warn("ES index failed:", e?.message));

  res.status(201).json(post);
}
