// src/schemas/posts.schema.ts
import { z } from "zod";

/**
 * إنشاء منشور جديد
 * يُستخدم في createPost
 */
export const createSchema = z.object({
  title: z
    .string()
    .min(1, "title is required")
    .max(200, "title too long"),
  body: z
    .string()
    .min(1, "body is required")
    .max(20000, "body too long"),
});
export type CreatePostInput = z.infer<typeof createSchema>;

/**
 * تحديث منشور
 * يمكن تمرير أي من الحقول اختياريًا، لكن ليس كلاهما فارغَين
 */
export const updateSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    body: z.string().min(1).max(20000).optional(),
  })
  .refine(
    (d) => typeof d.title !== "undefined" || typeof d.body !== "undefined",
    { message: "Provide at least one field to update" }
  );
export type UpdatePostInput = z.infer<typeof updateSchema>;

/**
 * معرّف رقمي للمسارات التي تستقبل :id
 */
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
export type IdParamInput = z.infer<typeof idParamSchema>;

/**
 * استعلامات قائمة/بحث (اختياري)
 */
export const listQuerySchema = z.object({
  q: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export type ListQueryInput = z.infer<typeof listQuerySchema>;
