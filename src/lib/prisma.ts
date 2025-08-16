// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

/** استخدم Singleton لتجنّب إنشاء عميل جديد مع كل إعادة تشغيل أثناء التطوير */
const createPrisma = () =>
  new PrismaClient({
    log:
      (process.env.PRISMA_LOG?.split(",") as ("query" | "info" | "warn" | "error")[]) ??
      ["warn", "error"],
  });

declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

export const prisma: PrismaClient = globalThis.__prisma__ ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma__ = prisma;
}
