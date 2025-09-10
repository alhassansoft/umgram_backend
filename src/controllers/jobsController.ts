import { Request, Response, NextFunction } from 'express';
import { JobManager } from '../services/jobManager';
import { JobProcessor } from '../jobs/jobProcessor';
import { KeywordNormalizationJobProcessor } from '../jobs/keywordNormalizationJobProcessor';

/**
 * Get all jobs with pagination and filtering (Admin only)
 */
export async function getJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      page = 1,
      limit = 50,
      status,
      type,
      user_id
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 50));
    const offset = (pageNum - 1) * limitNum;

    const result = await JobManager.getJobs({
      limit: limitNum,
      offset,
      status: status as string,
      type: type as string,
      user_id: user_id as string
    });

    res.json({
      ok: true,
      jobs: result.jobs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: result.total,
        pages: Math.ceil(result.total / limitNum)
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get job statistics (Admin only)
 */
export async function getJobStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await JobManager.getJobStats();
    const processorStatus = JobProcessor.getStatus();

    res.json({
      ok: true,
      stats,
      processor: processorStatus
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get specific job by ID (Admin only)
 */
export async function getJobById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const jobId = parseInt(req.params.id);
    
    if (isNaN(jobId)) {
      return res.status(400).json({ ok: false, error: 'Invalid job ID' });
    }

    const job = await JobManager.getJobById(jobId);
    
    if (!job) {
      return res.status(404).json({ ok: false, error: 'Job not found' });
    }

    res.json({ ok: true, job });
  } catch (err) {
    next(err);
  }
}

/**
 * Retry a failed job (Admin only)
 */
export async function retryJob(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const jobId = parseInt(req.params.id);
    
    if (isNaN(jobId)) {
      return res.status(400).json({ ok: false, error: 'Invalid job ID' });
    }

    const job = await JobManager.getJobById(jobId);
    
    if (!job) {
      return res.status(404).json({ ok: false, error: 'Job not found' });
    }

    if (job.status !== 'failed') {
      return res.status(400).json({ ok: false, error: 'Job is not in failed status' });
    }

    await JobManager.retryJob(jobId);
    
    res.json({ ok: true, message: 'Job queued for retry' });
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new keyword normalization job manually (Admin only)
 */
export async function createKeywordNormalizationJob(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      text,
      contentType,
      contentId,
      userId,
      priority = 0,
      forceReprocess = false,
      model,
      temperature,
      maxTokensPerChunk,
      mergeStrategy
    } = req.body;

    if (!text || !contentType || !contentId) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields: text, contentType, contentId'
      });
    }

    const job = await KeywordNormalizationJobProcessor.createJobIfNeeded(
      text,
      contentType,
      contentId,
      userId,
      {
        priority,
        forceReprocess,
        model,
        temperature,
        maxTokensPerChunk,
        mergeStrategy
      }
    );

    if (!job) {
      return res.json({
        ok: true,
        message: 'Job skipped - content already processed',
        job: null
      });
    }

    res.status(201).json({
      ok: true,
      message: 'Job created successfully',
      job
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Start job processor (Admin only)
 */
export async function startJobProcessor(req: Request, res: Response, next: NextFunction) {
  try {
    const { intervalMs = 5000 } = req.body;
    
    JobProcessor.start(intervalMs);
    
    res.json({
      ok: true,
      message: 'Job processor started',
      status: JobProcessor.getStatus()
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Stop job processor (Admin only)
 */
export async function stopJobProcessor(req: Request, res: Response, next: NextFunction) {
  try {
    JobProcessor.stop();
    
    res.json({
      ok: true,
      message: 'Job processor stopped',
      status: JobProcessor.getStatus()
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Clean up old jobs (Admin only)
 */
export async function cleanupOldJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const { daysOld = 7 } = req.body;
    
    const deletedCount = await JobManager.cleanupOldJobs(daysOld);
    
    res.json({
      ok: true,
      message: `Cleaned up ${deletedCount} old jobs`,
      deletedCount
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Process jobs batch manually (Admin only)
 */
export async function processJobsBatch(req: Request, res: Response, next: NextFunction) {
  try {
    const { concurrency = 3 } = req.body;
    
    // Run in background to avoid request timeout
    JobProcessor.processJobsBatch(concurrency)
      .then(() => console.log('[Jobs] Batch processing completed'))
      .catch((e) => console.error('[Jobs] Batch processing failed:', e));
    
    res.status(202).json({
      ok: true,
      message: 'Batch processing started',
      concurrency
    });
  } catch (err) {
    next(err);
  }
}
