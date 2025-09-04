// src/lib/prisma.ts
// Import PrismaClient from the generated output path configured in prisma/schema.prisma
// generator client { output = "../src/generated/prisma" }
import { PrismaClient } from "../generated/prisma";

/** استخدم Singleton لتجنّب إنشاء عميل جديد مع كل إعادة تشغيل أثناء التطوير */
const createPrisma = () =>
  new PrismaClient({
    log:
      (process.env.PRISMA_LOG?.split(",") as ("query" | "info" | "warn" | "error")[]) ??
      ["warn", "error"],
    // Allow falling back to DATABASE_URL when the Prisma schema uses DATABASE_URL_CHAT
    datasources: {
      db: {
        url: process.env.DATABASE_URL_CHAT || process.env.DATABASE_URL || "",
      },
    },
  });

declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

export const prisma: PrismaClient = globalThis.__prisma__ ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma__ = prisma;
}
