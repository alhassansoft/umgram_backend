import { Router } from 'express';
import {
  createNote,
  getNote,
  getUserNotes,
  updateNote,
  deleteNote,
} from '../controllers/noteController';

const router = Router();

router.post('/', createNote);
router.get('/:id', getNote);
router.get('/user/:userId', getUserNotes);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
