-- Create jobs table for background processing
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  type VARCHAR(100) NOT NULL, -- 'keyword_normalization', 'chat_extraction', etc.
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  priority INTEGER DEFAULT 0, -- Higher number = higher priority
  content_type VARCHAR(50), -- 'diary', 'note', 'chat', 'confession', etc.
  content_id VARCHAR(255), -- ID of the content being processed
  user_id VARCHAR(255), -- User who triggered the job (optional)
  payload JSONB, -- Job-specific data (text to process, options, etc.)
  result JSONB, -- Result of processing (success or error data)
  error_message TEXT, -- Error details if failed
  attempts INTEGER DEFAULT 0, -- Number of retry attempts
  max_attempts INTEGER DEFAULT 3, -- Maximum retry attempts
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE, -- When job execution started
  completed_at TIMESTAMP WITH TIME ZONE, -- When job finished (success or failure)
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_content ON jobs(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_priority_created ON jobs(priority DESC, created_at ASC);

-- Create trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION update_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER jobs_updated_at_trigger
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_jobs_updated_at();
