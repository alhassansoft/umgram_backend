-- Restore core tables for the app (users, diaries, notes, entity_extractions,
-- extraction_terms, query_expansions, action_synonyms)
-- Safe to run multiple times.

-- Ensure UUID generator is available (requires privileges)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============== users ====================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin','editor','reviewer','member')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','suspended')),
  email_verified_at TIMESTAMPTZ NULL,
  last_login_at TIMESTAMPTZ NULL,
  meta JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION set_updated_at_users()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'users_set_updated_at') THEN
    CREATE TRIGGER users_set_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at_users();
  END IF;
END $$;

-- =============== diaries ====================
CREATE TABLE IF NOT EXISTS diaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_diaries_user ON diaries(user_id);

CREATE OR REPLACE FUNCTION set_updated_at_diaries()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'diaries_set_updated_at') THEN
    CREATE TRIGGER diaries_set_updated_at
    BEFORE UPDATE ON diaries
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at_diaries();
  END IF;
END $$;

-- =============== notes ====================
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_id);

CREATE OR REPLACE FUNCTION set_updated_at_notes()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'notes_set_updated_at') THEN
    CREATE TRIGGER notes_set_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at_notes();
  END IF;
END $$;

-- =============== entity_extractions ====================
CREATE TABLE IF NOT EXISTS entity_extractions (
  id SERIAL PRIMARY KEY,
  content_type TEXT NOT NULL CHECK (content_type IN ('diary','note','post','comment','other')),
  content_id TEXT NOT NULL,
  user_id UUID NULL,
  entities TEXT[] NOT NULL DEFAULT '{}',
  actions TEXT[] NOT NULL DEFAULT '{}',
  attributes TEXT[] NOT NULL DEFAULT '{}',
  inquiry_ar TEXT NULL,
  time_label TEXT NULL CHECK (time_label IN ('past','present','future','unspecified')),
  polarity TEXT NULL CHECK (polarity IN ('affirmative','negative','unspecified')),
  raw JSONB NULL,
  model TEXT NULL,
  prompt_version TEXT NULL,
  input_hash TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (content_type, content_id)
);
CREATE INDEX IF NOT EXISTS idx_entity_extractions_user ON entity_extractions(user_id);

CREATE OR REPLACE FUNCTION set_updated_at_entity_extractions()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'entity_extractions_set_updated_at') THEN
    CREATE TRIGGER entity_extractions_set_updated_at
    BEFORE UPDATE ON entity_extractions
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at_entity_extractions();
  END IF;
END $$;

-- =============== extraction_terms ====================
CREATE TABLE IF NOT EXISTS extraction_terms (
  id SERIAL PRIMARY KEY,
  extraction_id INTEGER NOT NULL REFERENCES entity_extractions(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('entity','action','attribute','time','polarity')),
  token TEXT NOT NULL,
  UNIQUE (extraction_id, kind, token)
);
CREATE INDEX IF NOT EXISTS idx_extraction_terms_extraction ON extraction_terms(extraction_id);
CREATE INDEX IF NOT EXISTS idx_extraction_terms_token ON extraction_terms(token);

-- =============== query_expansions ====================
CREATE TABLE IF NOT EXISTS query_expansions (
  id SERIAL PRIMARY KEY,
  user_id UUID NULL,
  raw_query TEXT NOT NULL,
  entities TEXT[] NOT NULL DEFAULT '{}',
  actions TEXT[] NOT NULL DEFAULT '{}',
  attributes TEXT[] NOT NULL DEFAULT '{}',
  time_label TEXT NULL CHECK (time_label IN ('past','present','future','unspecified')),
  polarity TEXT NULL CHECK (polarity IN ('affirmative','negative','unspecified')),
  expansions JSONB NULL,
  model TEXT NULL,
  mode TEXT NULL,
  query_hash TEXT NULL,
  client_ip TEXT NULL,
  user_agent TEXT NULL,
  latency_ms INTEGER NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_query_expansions_user ON query_expansions(user_id);

CREATE OR REPLACE FUNCTION set_updated_at_query_expansions()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'query_expansions_set_updated_at') THEN
    CREATE TRIGGER query_expansions_set_updated_at
    BEFORE UPDATE ON query_expansions
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at_query_expansions();
  END IF;
END $$;

-- =============== action_synonyms ====================
CREATE TABLE IF NOT EXISTS action_synonyms (
  action_canonical TEXT PRIMARY KEY,
  en TEXT[] NOT NULL DEFAULT '{}',
  ar TEXT[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


