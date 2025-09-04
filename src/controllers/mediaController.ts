import { Request, Response } from "express";
import { addAsset, createAlbum, deleteAlbum, deleteAsset, getAlbumWithAssets, listAlbums } from "../models/mediaModels";
import multer from "multer";
import type { Multer } from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

export async function getAlbums(req: Request, res: Response) {
  const userId = (req as any).user?.sub as string;
  if (!userId) return res.status(401).json({ error: "unauthorized" });
  const data = await listAlbums(userId);
  res.json(data.map(a => ({ id: a.id, title: a.title, assetsCount: (a as any)._count?.assets ?? 0, createdAt: a.createdAt, updatedAt: a.updatedAt })));
}

export async function postAlbum(req: Request, res: Response) {
  const userId = (req as any).user?.sub as string;
  if (!userId) return res.status(401).json({ error: "unauthorized" });
  const title = String(req.body?.title || '').trim();
  if (!title) return res.status(400).json({ error: 'title required' });
  const created = await createAlbum(userId, { title });
  res.status(201).json(created);
}

export async function getAlbum(req: Request, res: Response) {
  const userId = (req as any).user?.sub as string;
  if (!userId) return res.status(401).json({ error: "unauthorized" });
  const albumId = String(req.params.albumId || "");
  if (!albumId) return res.status(400).json({ error: 'albumId required' });
  const full = await getAlbumWithAssets(userId, albumId);
  if (!full) return res.status(404).json({ error: 'not found' });
  res.json(full);
}

export async function removeAlbum(req: Request, res: Response) {
  const userId = (req as any).user?.sub as string;
  if (!userId) return res.status(401).json({ error: "unauthorized" });
  const albumId = String(req.params.albumId || "");
  if (!albumId) return res.status(400).json({ error: 'albumId required' });
  const assets = await deleteAlbum(userId, albumId);
  if (assets === false) return res.status(404).json({ error: 'not found' });
  // TODO: delete files on disk if applicable
  res.json({ ok: true, removedAssets: assets?.length ?? 0 });
}

export async function postAsset(req: Request, res: Response) {
  const userId = (req as any).user?.sub as string;
  if (!userId) return res.status(401).json({ error: "unauthorized" });
  const albumId = String(req.params.albumId || "");
  if (!albumId) return res.status(400).json({ error: 'albumId required' });
  const { uri, mime, size, width, height } = req.body || {};
  if (!uri) return res.status(400).json({ error: 'uri required' });
  // Optionally enforce ownership by reading the album first (omitted for perf)
  const created = await addAsset(albumId, { uri, mime, size, width, height });
  res.status(201).json(created);
}

export async function removeAsset(req: Request, res: Response) {
  const userId = (req as any).user?.sub as string;
  if (!userId) return res.status(401).json({ error: "unauthorized" });
  const assetId = String(req.params.assetId || "");
  if (!assetId) return res.status(400).json({ error: 'assetId required' });
  const deleted = await deleteAsset(userId, assetId);
  if (!deleted) return res.status(404).json({ error: 'not found' });
  // TODO: delete file on disk if applicable
  res.json({ ok: true });
}

// ===============================
// File upload (compressed images)
// ===============================
const memory = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });
export const uploadSingle = memory.single('file');

export async function uploadCompressedAsset(req: Request, res: Response) {
  const userId = (req as any).user?.sub as string;
  if (!userId) return res.status(401).json({ error: "unauthorized" });
  const albumId = String(req.params.albumId || "");
  if (!albumId) return res.status(400).json({ error: 'albumId required' });
  const file = (req as any).file as Parameters<Multer['single']>[0] extends string ? (multer.Multer & { file: any }) : any;
  // Narrow file type
  const f = (req as any).file as { buffer: Buffer; mimetype: string; size: number } | undefined;
  if (!f) return res.status(400).json({ error: 'file required (field name: file)' });
  if (!file) return res.status(400).json({ error: 'file required (field name: file)' });

  // Prepare output paths
  const uploadsRoot = path.resolve(process.cwd(), 'uploads');
  const mediaDir = path.join(uploadsRoot, 'media');
  try { fs.mkdirSync(mediaDir, { recursive: true }); } catch {}

  const ext = (f.mimetype || '').includes('png') ? 'jpg' : 'jpg';
  const base = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const outPath = path.join(mediaDir, base);

  let width: number | null = null;
  let height: number | null = null;
  try {
    // Compress to reasonable size for thumbnails/feed; keep good quality
  const image = sharp(f.buffer).rotate();
    const meta = await image.metadata();
    width = meta.width ?? null;
    height = meta.height ?? null;
    // Create a downscaled version if very large
    const maxW = 1920;
    const maxH = 1920;
    const pipeline = image.resize({ width: maxW, height: maxH, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true });
    await pipeline.toFile(outPath);
  } catch (e) {
    console.error('sharp-error', e);
    return res.status(400).json({ error: 'unsupported or corrupted image' });
  }

  const publicUri = `/uploads/media/${path.basename(outPath)}`;
  const asset = await addAsset(albumId, { uri: publicUri, mime: 'image/jpeg', size: f.size, width, height });
  res.status(201).json(asset);
}
