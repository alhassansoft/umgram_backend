import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { createPost, likePost, listPosts, getPostAnalysis } from '../controllers/microblogController';

const router = Router();

// Timeline
router.get('/posts', requireAuth, listPosts);

// Create
router.post('/posts', requireAuth, createPost);

// Toggle like
router.post('/posts/:id/like', requireAuth, likePost);

// Per-post analysis (public to authenticated users)
router.get('/posts/:id/analysis', requireAuth, getPostAnalysis);

export default router;
