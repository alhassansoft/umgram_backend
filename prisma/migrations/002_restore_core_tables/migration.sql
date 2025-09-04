-- 002_restore_core_tables
-- Restores core application tables that were accidentally dropped by 001_match_flow.
-- Uses CREATE TABLE IF NOT EXISTS and CREATE INDEX IF NOT EXISTS for idempotency.

-- Note: This migration intentionally recreates tables unmanaged by Prisma models.
-- Prisma should continue to manage only Chat/Confession/Media/Match* models.

-- Required extension for gen_random_uuid(); enable if not already present
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- action_synonyms ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "public"."action_synonyms" (
    "action_canonical" TEXT NOT NULL,
    "en" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ar" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "action_synonyms_pkey" PRIMARY KEY ("action_canonical")
);

-- users ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "display_name" TEXT,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "status" TEXT NOT NULL DEFAULT 'active',
    "email_verified_at" TIMESTAMPTZ(6),
    "last_login_at" TIMESTAMPTZ(6),
    "meta" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "public"."users" ("email");
CREATE UNIQUE INDEX IF NOT EXISTS "users_username_key" ON "public"."users" ("username");

-- diaries -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "public"."diaries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "diaries_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "diaries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_diaries_user" ON "public"."diaries" ("user_id");

-- notes ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "public"."notes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notes_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_notes_user" ON "public"."notes" ("user_id");

-- entity_extractions --------------------------------------------------------
CREATE TABLE IF NOT EXISTS "public"."entity_extractions" (
    "id" SERIAL NOT NULL,
    "content_type" TEXT NOT NULL,
    "content_id" TEXT NOT NULL,
    "user_id" UUID,
    "entities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "actions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "attributes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "inquiry_ar" TEXT,
    "time_label" TEXT,
    "polarity" TEXT,
    "raw" JSONB,
    "model" TEXT,
    "prompt_version" TEXT,
    "input_hash" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "entity_extractions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "entity_extractions_content_type_content_id_key"
  ON "public"."entity_extractions" ("content_type", "content_id");
CREATE INDEX IF NOT EXISTS "idx_entity_extractions_user" ON "public"."entity_extractions" ("user_id");

-- extraction_terms -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS "public"."extraction_terms" (
    "id" SERIAL NOT NULL,
    "extraction_id" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    CONSTRAINT "extraction_terms_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "extraction_terms_extraction_id_fkey" FOREIGN KEY ("extraction_id") REFERENCES "public"."entity_extractions"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "extraction_terms_extraction_id_kind_token_key"
  ON "public"."extraction_terms" ("extraction_id", "kind", "token");
CREATE INDEX IF NOT EXISTS "idx_extraction_terms_extraction" ON "public"."extraction_terms" ("extraction_id");
CREATE INDEX IF NOT EXISTS "idx_extraction_terms_token" ON "public"."extraction_terms" ("token");

-- memory tables --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "public"."memory_tables" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "memory_tables_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "idx_memory_tables_user" ON "public"."memory_tables" ("user_id");

CREATE TABLE IF NOT EXISTS "public"."memory_columns" (
    "id" TEXT NOT NULL,
    "table_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "memory_columns_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "memory_columns_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "public"."memory_tables"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "idx_memory_columns_table" ON "public"."memory_columns" ("table_id");

CREATE TABLE IF NOT EXISTS "public"."memory_rows" (
    "id" TEXT NOT NULL,
    "table_id" TEXT NOT NULL,
    "values" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "memory_rows_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "memory_rows_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "public"."memory_tables"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "idx_memory_rows_table" ON "public"."memory_rows" ("table_id");

-- query_expansions -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS "public"."query_expansions" (
    "id" SERIAL NOT NULL,
    "user_id" UUID,
    "raw_query" TEXT NOT NULL,
    "entities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "actions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "attributes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "time_label" TEXT,
    "polarity" TEXT,
    "expansions" JSONB,
    "model" TEXT,
    "mode" TEXT,
    "query_hash" TEXT,
    "client_ip" TEXT,
    "user_agent" TEXT,
    "latency_ms" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "query_expansions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "idx_query_expansions_user" ON "public"."query_expansions" ("user_id");

-- DMs (direct conversations/messages) ---------------------------------------
CREATE TABLE IF NOT EXISTS "public"."direct_conversations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "direct_conversations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."direct_conversation_participants" (
    "conversation_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "direct_conversation_participants_pkey" PRIMARY KEY ("conversation_id", "user_id"),
    CONSTRAINT "direct_conversation_participants_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."direct_conversations"("id") ON DELETE CASCADE,
    CONSTRAINT "direct_conversation_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "idx_dcp_user" ON "public"."direct_conversation_participants" ("user_id", "conversation_id");

CREATE TABLE IF NOT EXISTS "public"."direct_messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "conversation_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivered_at" TIMESTAMPTZ(6),
    "read_at" TIMESTAMPTZ(6),
    CONSTRAINT "direct_messages_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "direct_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."direct_conversations"("id") ON DELETE CASCADE,
    CONSTRAINT "direct_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "idx_dm_conv_created" ON "public"."direct_messages" ("conversation_id", "created_at");

-- Circles -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "public"."user_circles" (
    "id" BIGSERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "radius" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_circles_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "idx_user_circles_user" ON "public"."user_circles" ("user_id");

CREATE TABLE IF NOT EXISTS "public"."user_circle_messages" (
    "id" BIGSERIAL NOT NULL,
    "circle_id" BIGINT NOT NULL,
    "user_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_circle_messages_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "user_circle_messages_circle_id_fkey" FOREIGN KEY ("circle_id") REFERENCES "public"."user_circles"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "idx_circle_messages_circle" ON "public"."user_circle_messages" ("circle_id");
CREATE INDEX IF NOT EXISTS "idx_circle_messages_created" ON "public"."user_circle_messages" ("created_at");
