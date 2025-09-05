import { prisma } from "../lib/prisma";

export type NewAlbum = { title: string };

export async function listAlbums(userId: string) {
  return prisma.mediaAlbum.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, createdAt: true, updatedAt: true, _count: { select: { assets: true } } },
  });
}

export async function createAlbum(userId: string, input: NewAlbum) {
  return prisma.mediaAlbum.create({ data: { userId, title: input.title } });
}

export async function getAlbumWithAssets(userId: string, albumId: string) {
  const album = await prisma.mediaAlbum.findFirst({ where: { id: albumId, userId } });
  if (!album) return null;
  const assets = await prisma.mediaAsset.findMany({ where: { albumId }, orderBy: { createdAt: "desc" } });
  return { ...album, assets };
}

export async function deleteAlbum(userId: string, albumId: string) {
  // Ensure ownership
  const album = await prisma.mediaAlbum.findFirst({ where: { id: albumId, userId }, include: { assets: true } });
  if (!album) return false;
  // Delete DB rows (files removal should be handled by controller)
  await prisma.mediaAlbum.delete({ where: { id: albumId } });
  return album.assets as { id: string; uri: string }[];
}

export async function addAsset(albumId: string, meta: { uri: string; mime?: string | null; size?: number | null; width?: number | null; height?: number | null; }) {
  return prisma.mediaAsset.create({ data: { albumId, uri: meta.uri, mime: meta.mime ?? null, size: meta.size ?? null, width: meta.width ?? null, height: meta.height ?? null } });
}

export async function deleteAsset(userId: string, assetId: string) {
  const asset = await prisma.mediaAsset.findFirst({ where: { id: assetId, album: { userId } } });
  if (!asset) return null;
  await prisma.mediaAsset.delete({ where: { id: assetId } });
  return asset;
}

// -------------------------------
// Diary-specific helpers (album)
// -------------------------------

/**
 * Returns a deterministic title used to map a diary entry to its media album.
 * Using a title avoids schema changes while keeping assets grouped per-diary.
 */
export function diaryAlbumTitle(diaryId: string) {
  return `diary:${diaryId}`;
}

/**
 * Find or create the album for a given diary (by diaryId) owned by the user.
 */
export async function getOrCreateDiaryAlbum(userId: string, diaryId: string) {
  const title = diaryAlbumTitle(diaryId);
  let album = await prisma.mediaAlbum.findFirst({ where: { userId, title } });
  if (!album) {
    album = await prisma.mediaAlbum.create({ data: { userId, title } });
  }
  return album;
}

/**
 * Fetch the album (if exists) for a given diary. Returns null if not found.
 */
export async function getDiaryAlbum(userId: string, diaryId: string) {
  const title = diaryAlbumTitle(diaryId);
  return prisma.mediaAlbum.findFirst({ where: { userId, title } });
}
