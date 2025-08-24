import { Router } from 'express';
import {
  createDiary,
  getDiary,
  getUserDiaries,
  updateDiary,
  deleteDiary,
} from '../controllers/diaryController';

const router = Router();

router.post('/', createDiary);
router.get('/:id', getDiary);
router.get('/user/:userId', getUserDiaries);
router.put('/:id', updateDiary);
router.delete('/:id', deleteDiary);

export default router;
