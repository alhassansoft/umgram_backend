-- Optional: only if you need raw SQL (Prisma migrate preferred)
-- Enum types
DO $$ BEGIN
  CREATE TYPE chat_source AS ENUM ('DIARY', 'NOTE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE chat_mode AS ENUM ('WIDE', 'STRICT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- chat_conversations
CREATE TABLE IF NOT EXISTS chat_conversations (
  id text PRIMARY KEY,
  user_id text NULL,
  title text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user ON chat_conversations(user_id);

-- chat_messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id text PRIMARY KEY,
  conversation_id text NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role text NOT NULL,
  text text NOT NULL,
  source chat_source NULL,
  mode chat_mode NULL,
  answers_count int NULL,
  final_type text NULL,
  meta jsonb NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conv_created ON chat_messages(conversation_id, created_at);

-- trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION chat_conversations_touch()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_chat_conversations_touch ON chat_conversations;
CREATE TRIGGER trg_chat_conversations_touch
BEFORE UPDATE ON chat_conversations
FOR EACH ROW EXECUTE FUNCTION chat_conversations_touch();
