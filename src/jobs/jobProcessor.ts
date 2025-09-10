import { JobManager, Job } from '../services/jobManager';
import { KeywordNormalizationJobProcessor } from './keywordNormalizationJobProcessor';

export class JobProcessor {
  private static isRunning = false;
  private static processingInterval: NodeJS.Timeout | null = null;

  /**
   * Start the job processor
   */
  static start(intervalMs: number = 5000): void {
    if (this.isRunning) {
      console.log('[JobProcessor] Already running');
      return;
    }

    this.isRunning = true;
    console.log(`[JobProcessor] Starting with ${intervalMs}ms interval`);

    // Process jobs immediately, then at intervals
    this.processNextJob();
    
    this.processingInterval = setInterval(() => {
      this.processNextJob();
    }, intervalMs);
  }

  /**
   * Stop the job processor
   */
  static stop(): void {
    if (!this.isRunning) {
      console.log('[JobProcessor] Not running');
      return;
    }

    this.isRunning = false;
    
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    
    console.log('[JobProcessor] Stopped');
  }

  /**
   * Process the next available job
   */
  private static async processNextJob(): Promise<void> {
    try {
      const job = await JobManager.getNextJob();
      
      if (!job) {
        // No jobs available
        return;
      }

      console.log(`[JobProcessor] Processing job ${job.id} (${job.type})`);

      try {
        let result: any;

        // Route to appropriate processor based on job type
        switch (job.type) {
          case 'keyword_normalization':
            result = await KeywordNormalizationJobProcessor.processKeywordNormalizationJob(job);
            break;
          
          default:
            throw new Error(`Unknown job type: ${job.type}`);
        }

        // Mark job as completed
        await JobManager.completeJob(job.id, result);
        console.log(`[JobProcessor] Completed job ${job.id}`);

      } catch (error: any) {
        // Mark job as failed
        const errorMessage = error?.message || String(error);
        await JobManager.failJob(job.id, errorMessage);
        console.error(`[JobProcessor] Failed job ${job.id}:`, errorMessage);
      }

    } catch (error) {
      console.error('[JobProcessor] Error processing jobs:', error);
    }
  }

  /**
   * Process multiple jobs in parallel (with concurrency limit)
   */
  static async processJobsBatch(concurrency: number = 3): Promise<void> {
    const activeJobs: Promise<void>[] = [];

    while (activeJobs.length < concurrency) {
      try {
        const job = await JobManager.getNextJob();
        if (!job) break; // No more jobs

        const jobPromise = this.processJob(job).finally(() => {
          // Remove from active jobs when done
          const index = activeJobs.indexOf(jobPromise);
          if (index > -1) {
            activeJobs.splice(index, 1);
          }
        });

        activeJobs.push(jobPromise);
      } catch (error) {
        console.error('[JobProcessor] Error getting next job:', error);
        break;
      }
    }

    // Wait for all active jobs to complete
    if (activeJobs.length > 0) {
      await Promise.allSettled(activeJobs);
    }
  }

  /**
   * Process a single job
   */
  private static async processJob(job: Job): Promise<void> {
    console.log(`[JobProcessor] Processing job ${job.id} (${job.type})`);

    try {
      let result: any;

      switch (job.type) {
        case 'keyword_normalization':
          result = await KeywordNormalizationJobProcessor.processKeywordNormalizationJob(job);
          break;
        
        default:
          throw new Error(`Unknown job type: ${job.type}`);
      }

      await JobManager.completeJob(job.id, result);
      console.log(`[JobProcessor] Completed job ${job.id}`);

    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      await JobManager.failJob(job.id, errorMessage);
      console.error(`[JobProcessor] Failed job ${job.id}:`, errorMessage);
    }
  }

  /**
   * Get processor status
   */
  static getStatus(): { isRunning: boolean; hasInterval: boolean } {
    return {
      isRunning: this.isRunning,
      hasInterval: this.processingInterval !== null
    };
  }
}
