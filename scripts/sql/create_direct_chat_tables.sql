-- Direct user-to-user chat tables (idempotent)
-- Requires main app DB (DATABASE_URL)

-- direct_conversations
CREATE TABLE IF NOT EXISTS direct_conversations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- direct_conversation_participants
CREATE TABLE IF NOT EXISTS direct_conversation_participants (
  conversation_id UUID NOT NULL REFERENCES direct_conversations(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);

-- direct_messages
CREATE TABLE IF NOT EXISTS direct_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES direct_conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text            TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivered_at    TIMESTAMPTZ,
  read_at         TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dm_conv_created ON direct_messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_dcp_user ON direct_conversation_participants(user_id, conversation_id);

-- Ensure helper function exists
CREATE OR REPLACE FUNCTION set_updated_at_direct_conversations() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Conditionally create trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_direct_conversations_updated_at'
  ) THEN
    CREATE TRIGGER trg_direct_conversations_updated_at
    BEFORE UPDATE ON direct_conversations
    FOR EACH ROW EXECUTE FUNCTION set_updated_at_direct_conversations();
  END IF;
END$$;
