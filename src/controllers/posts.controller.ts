import { es } from "../lib/es";
import { createSchema } from "../schemas/posts.schema";
import { prisma } from "../lib/prisma"; 
// ...
export async function createPost(req: any, res: any) {
  const { title, body } = createSchema.parse(req.body);
  const user = (req as any).user;
  const post = await prisma.post.create({
    data: { title, body, authorId: user.id }
  });

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
