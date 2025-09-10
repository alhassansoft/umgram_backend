import { pool } from '../db';

export interface Job {
  id: number;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  priority: number;
  content_type?: string;
  content_id?: string;
  user_id?: string;
  payload?: any;
  result?: any;
  error_message?: string;
  attempts: number;
  max_attempts: number;
  created_at: Date;
  started_at?: Date;
  completed_at?: Date;
  updated_at: Date;
}

export interface CreateJobOptions {
  type: string;
  content_type?: string;
  content_id?: string;
  user_id?: string | undefined;
  payload?: any;
  priority?: number;
  max_attempts?: number;
}

export class JobManager {
  /**
   * Create a new job
   */
  static async createJob(options: CreateJobOptions): Promise<Job> {
    const {
      type,
      content_type,
      content_id,
      user_id,
      payload,
      priority = 0,
      max_attempts = 3
    } = options;

    const result = await pool.query(`
      INSERT INTO jobs (type, content_type, content_id, user_id, payload, priority, max_attempts)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [type, content_type, content_id, user_id, JSON.stringify(payload), priority, max_attempts]);

    return result.rows[0];
  }

  /**
   * Get next job to process (highest priority, oldest first)
   */
  static async getNextJob(): Promise<Job | null> {
    const result = await pool.query(`
      UPDATE jobs 
      SET status = 'running', started_at = NOW(), attempts = attempts + 1
      WHERE id = (
        SELECT id FROM jobs 
        WHERE status = 'pending' AND attempts < max_attempts
        ORDER BY priority DESC, created_at ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      )
      RETURNING *
    `);

    return result.rows[0] || null;
  }

  /**
   * Mark job as completed
   */
  static async completeJob(jobId: number, result?: any): Promise<void> {
    await pool.query(`
      UPDATE jobs 
      SET status = 'completed', completed_at = NOW(), result = $2
      WHERE id = $1
    `, [jobId, JSON.stringify(result)]);
  }

  /**
   * Mark job as failed
   */
  static async failJob(jobId: number, errorMessage: string): Promise<void> {
    await pool.query(`
      UPDATE jobs 
      SET status = 'failed', completed_at = NOW(), error_message = $2
      WHERE id = $1
    `, [jobId, errorMessage]);
  }

  /**
   * Get job by ID
   */
  static async getJobById(jobId: number): Promise<Job | null> {
    const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
    return result.rows[0] || null;
  }

  /**
   * Get jobs with pagination and filtering
   */
  static async getJobs(options: {
    limit?: number;
    offset?: number;
    status?: string;
    type?: string;
    user_id?: string;
  } = {}): Promise<{ jobs: Job[], total: number }> {
    const {
      limit = 50,
      offset = 0,
      status,
      type,
      user_id
    } = options;

    let whereClause = '';
    const params: any[] = [];
    const conditions: string[] = [];

    if (status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }

    if (type) {
      conditions.push(`type = $${params.length + 1}`);
      params.push(type);
    }

    if (user_id) {
      conditions.push(`user_id = $${params.length + 1}`);
      params.push(user_id);
    }

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    // Get total count
    const countResult = await pool.query(`
      SELECT COUNT(*) as total FROM jobs ${whereClause}
    `, params);

    // Get jobs
    const jobsResult = await pool.query(`
      SELECT * FROM jobs ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `, [...params, limit, offset]);

    return {
      jobs: jobsResult.rows,
      total: parseInt(countResult.rows[0].total)
    };
  }

  /**
   * Get job statistics
   */
  static async getJobStats(): Promise<{
    total: number;
    pending: number;
    running: number;
    completed: number;
    failed: number;
  }> {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'running' THEN 1 ELSE 0 END) as running,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
      FROM jobs
    `);

    const row = result.rows[0];
    return {
      total: parseInt(row.total),
      pending: parseInt(row.pending),
      running: parseInt(row.running),
      completed: parseInt(row.completed),
      failed: parseInt(row.failed)
    };
  }

  /**
   * Retry failed job
   */
  static async retryJob(jobId: number): Promise<void> {
    await pool.query(`
      UPDATE jobs 
      SET status = 'pending', started_at = NULL, completed_at = NULL, error_message = NULL
      WHERE id = $1 AND status = 'failed'
    `, [jobId]);
  }

  /**
   * Delete old completed jobs (cleanup)
   */
  static async cleanupOldJobs(daysOld: number = 7): Promise<number> {
    const result = await pool.query(`
      DELETE FROM jobs 
      WHERE status IN ('completed', 'failed') 
      AND completed_at < NOW() - INTERVAL '${daysOld} days'
      RETURNING id
    `);

    return result.rows.length;
  }
}
