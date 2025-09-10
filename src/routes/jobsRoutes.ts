import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { simpleAdminAuth } from '../middleware/simpleAdminAuth';
import {
  getJobs,
  getJobStats,
  getJobById,
  retryJob,
  createKeywordNormalizationJob,
  startJobProcessor,
  stopJobProcessor,
  cleanupOldJobs,
  processJobsBatch
} from '../controllers/jobsController';

const router = Router();

// All job routes require admin access - using simple admin auth for now
// router.use(requireAuth);
// router.use(requireRole('admin'));
router.use(simpleAdminAuth);

// Get jobs list with pagination and filtering
router.get('/', getJobs);

// Get job statistics and processor status
router.get('/stats', getJobStats);

// Get specific job by ID
router.get('/:id', getJobById);

// Retry a failed job
router.post('/:id/retry', retryJob);

// Create new keyword normalization job
router.post('/keyword-normalization', createKeywordNormalizationJob);

// Job processor control
router.post('/processor/start', startJobProcessor);
router.post('/processor/stop', stopJobProcessor);

// Process jobs batch manually
router.post('/process-batch', processJobsBatch);

// Cleanup old jobs
router.post('/cleanup', cleanupOldJobs);

export default router;
