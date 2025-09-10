import { JobManager, Job } from '../services/jobManager';
import { extractKeywords, extractKeywordsChunked, DEFAULT_LLM_MODEL } from '../services/keywordExtractor';
import { saveExtraction } from '../services/extractions';
import { pool } from '../db';

export interface KeywordNormalizationJobPayload {
  text: string;
  contentType: string;
  contentId: string;
  userId?: string | null;
  model?: string;
  temperature?: number;
  maxTokensPerChunk?: number;
  mergeStrategy?: 'simple' | 'intelligent';
  promptVersion?: string;
}

export class KeywordNormalizationJobProcessor {
  /**
   * Create a new keyword normalization job
   */
  static async createKeywordNormalizationJob(
    text: string,
    contentType: string,
    contentId: string,
    userId?: string,
    options: {
      model?: string;
      temperature?: number;
      maxTokensPerChunk?: number;
      mergeStrategy?: 'simple' | 'intelligent';
      promptVersion?: string;
      priority?: number;
    } = {}
  ): Promise<Job> {
    const payload: KeywordNormalizationJobPayload = {
      text,
      contentType,
      contentId,
      userId: userId ?? null,
      model: options.model || DEFAULT_LLM_MODEL,
      temperature: options.temperature || 0,
      maxTokensPerChunk: options.maxTokensPerChunk || 1800,
      mergeStrategy: options.mergeStrategy || 'intelligent',
      promptVersion: options.promptVersion || 'v1'
    };

    return await JobManager.createJob({
      type: 'keyword_normalization',
      content_type: contentType,
      content_id: contentId,
      user_id: userId ?? undefined,
      payload,
      priority: options.priority || 0
    });
  }

  /**
   * Process a keyword normalization job
   */
  static async processKeywordNormalizationJob(job: Job): Promise<any> {
    const payload = job.payload as KeywordNormalizationJobPayload;
    
    if (!payload || !payload.text || !payload.contentType || !payload.contentId) {
      throw new Error('Invalid job payload: missing required fields');
    }

    const {
      text,
      contentType,
      contentId,
      userId,
      model = DEFAULT_LLM_MODEL,
      temperature = 0,
      maxTokensPerChunk = 1800,
      mergeStrategy = 'intelligent',
      promptVersion = 'v1'
    } = payload;

    console.log(`[KeywordNormalizationJob] Processing job ${job.id} for ${contentType}:${contentId} (${text.length} chars)`);

    try {
      // Choose extraction method based on text length
      const extractionResult = text.length > 3000 
        ? await extractKeywordsChunked(text, { 
            model, 
            temperature,
            maxTokensPerChunk,
            mergeStrategy
          })
        : await extractKeywords(text, { model, temperature });

      // Save extraction to database
      await saveExtraction({
        contentType: contentType as "diary" | "note" | "post" | "comment" | "other" | "chat",
        contentId,
        userId: userId || null,
        payload: extractionResult,
        model,
        promptVersion,
        inputTextForHash: text,
      });

      console.log(`[KeywordNormalizationJob] Successfully completed job ${job.id}`);
      
      return {
        success: true,
        extractionResult,
        textLength: text.length,
        processingMethod: text.length > 3000 ? 'chunked' : 'standard'
      };

    } catch (error: any) {
      console.error(`[KeywordNormalizationJob] Failed to process job ${job.id}:`, error);
      throw error;
    }
  }

  /**
   * Check if keyword normalization is already done for content
   */
  static async isAlreadyProcessed(contentType: string, contentId: string): Promise<boolean> {
    try {
      const result = await pool.query(`
        SELECT id FROM entity_extractions 
        WHERE content_type = $1 AND content_id = $2 
        LIMIT 1
      `, [contentType, contentId]);
      
      return result.rows.length > 0;
    } catch (error) {
      console.warn(`[KeywordNormalizationJob] Error checking if already processed:`, error);
      return false;
    }
  }

  /**
   * Create job only if not already processed
   */
  static async createJobIfNeeded(
    text: string,
    contentType: string,
    contentId: string,
    userId?: string,
    options: {
      model?: string;
      temperature?: number;
      maxTokensPerChunk?: number;
      mergeStrategy?: 'simple' | 'intelligent';
      promptVersion?: string;
      priority?: number;
      forceReprocess?: boolean;
    } = {}
  ): Promise<Job | null> {
    // Check if already processed (unless force reprocess)
    if (!options.forceReprocess) {
      const alreadyProcessed = await this.isAlreadyProcessed(contentType, contentId);
      if (alreadyProcessed) {
        console.log(`[KeywordNormalizationJob] Skipping ${contentType}:${contentId} - already processed`);
        return null;
      }
    }

    return await this.createKeywordNormalizationJob(text, contentType, contentId, userId, options);
  }
}
