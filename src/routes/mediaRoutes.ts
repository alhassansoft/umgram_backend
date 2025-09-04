import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getAlbums, postAlbum, getAlbum, removeAlbum, postAsset, removeAsset, uploadCompressedAsset, uploadSingle } from "../controllers/mediaController";

const r = Router();

r.get('/albums', requireAuth, getAlbums);
r.post('/albums', requireAuth, postAlbum);
r.get('/albums/:albumId', requireAuth, getAlbum);
r.delete('/albums/:albumId', requireAuth, removeAlbum);

r.post('/albums/:albumId/assets', requireAuth, postAsset);
r.post('/albums/:albumId/upload', requireAuth, uploadSingle, uploadCompressedAsset);
r.delete('/assets/:assetId', requireAuth, removeAsset);

export default r;
