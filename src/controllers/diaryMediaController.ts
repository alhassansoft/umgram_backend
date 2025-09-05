import { Request, Response } from "express";
import DiaryModel from "../models/diaryModel";
import { addAsset, deleteAsset, getAlbumWithAssets, getDiaryAlbum, getOrCreateDiaryAlbum } from "../models/mediaModels";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

// Reuse in-memory upload like mediaController
const memory = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });
export const uploadSingle = memory.single('file');

// Utility to assert diary belongs to the user
async function ensureDiaryOwner(userId: string, diaryId: string) {
  const d = await DiaryModel.findById(diaryId);
  if (!d || d.userId !== userId) return null;
  return d;
}

export async function listDiaryAssets(req: Request, res: Response) {
  const userId = (req as any).user?.sub as string;
  if (!userId) return res.status(401).json({ error: "unauthorized" });
  const diaryId = String(req.params.diaryId || "");
  if (!diaryId) return res.status(400).json({ error: 'diaryId required' });
  const owned = await ensureDiaryOwner(userId, diaryId);
  if (!owned) return res.status(404).json({ error: 'not found' });
  const album = await getDiaryAlbum(userId, diaryId);
  if (!album) return res.json({ album: null, assets: [] });
  const full = await getAlbumWithAssets(userId, album.id);
  return res.json({ albumId: album.id, assets: full?.assets ?? [] });
}

export async function uploadDiaryAsset(req: Request, res: Response) {
  const userId = (req as any).user?.sub as string;
  if (!userId) return res.status(401).json({ error: "unauthorized" });
  const diaryId = String(req.params.diaryId || "");
  if (!diaryId) return res.status(400).json({ error: 'diaryId required' });
  const owned = await ensureDiaryOwner(userId, diaryId);
  if (!owned) return res.status(404).json({ error: 'not found' });

  // Ensure album
  const album = await getOrCreateDiaryAlbum(userId, diaryId);

  // File handling
  const f = (req as any).file as { buffer: Buffer; mimetype: string; size: number } | undefined;
  if (!f) return res.status(400).json({ error: 'file required (field name: file)' });

  const uploadsRoot = path.resolve(process.cwd(), 'uploads');
  const mediaDir = path.join(uploadsRoot, 'media');
  try { fs.mkdirSync(mediaDir, { recursive: true }); } catch {}

  const ext = (f.mimetype || '').includes('png') ? 'jpg' : 'jpg';
  const base = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const outPath = path.join(mediaDir, base);

  let width: number | null = null;
  let height: number | null = null;
  try {
    const image = sharp(f.buffer).rotate();
    const meta = await image.metadata();
    width = meta.width ?? null;
    height = meta.height ?? null;
    const pipeline = image.resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true });
    await pipeline.toFile(outPath);
  } catch (e) {
    console.error('sharp-error', e);
    return res.status(400).json({ error: 'unsupported or corrupted image' });
  }

  const publicUri = `/uploads/media/${path.basename(outPath)}`;
  const asset = await addAsset(album.id, { uri: publicUri, mime: 'image/jpeg', size: f.size, width, height });
  return res.status(201).json({ albumId: album.id, asset });
}

export async function deleteDiaryAsset(req: Request, res: Response) {
  const userId = (req as any).user?.sub as string;
  if (!userId) return res.status(401).json({ error: "unauthorized" });
  const diaryId = String(req.params.diaryId || "");
  if (!diaryId) return res.status(400).json({ error: 'diaryId required' });
  const owned = await ensureDiaryOwner(userId, diaryId);
  if (!owned) return res.status(404).json({ error: 'not found' });
  const assetId = String(req.params.assetId || "");
  if (!assetId) return res.status(400).json({ error: 'assetId required' });
  const deleted = await deleteAsset(userId, assetId);
  if (!deleted) return res.status(404).json({ error: 'not found' });
  return res.json({ ok: true });
}
