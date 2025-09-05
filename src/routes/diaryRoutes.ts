import { Router } from 'express';
import {
  createDiary,
  getDiary,
  getUserDiaries,
  updateDiary,
  deleteDiary,
} from '../controllers/diaryController';
import { requireAuth } from '../middleware/auth';
import { deleteDiaryAsset, listDiaryAssets, uploadDiaryAsset, uploadSingle as uploadDiarySingle } from '../controllers/diaryMediaController';

const router = Router();

router.post('/', createDiary);
router.get('/user/:userId', getUserDiaries);
router.get('/:id', getDiary);
router.put('/:id', updateDiary);
router.delete('/:id', deleteDiary);

// Diary photos (attachments)
router.get('/:diaryId/assets', requireAuth, listDiaryAssets);
router.post('/:diaryId/assets/upload', requireAuth, uploadDiarySingle, uploadDiaryAsset);
router.delete('/:diaryId/assets/:assetId', requireAuth, deleteDiaryAsset);

export default router;
