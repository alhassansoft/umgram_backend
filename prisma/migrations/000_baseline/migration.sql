-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."ChatMode" AS ENUM ('WIDE', 'STRICT');

-- CreateEnum
CREATE TYPE "public"."ChatSource" AS ENUM ('DIARY', 'NOTE');

-- CreateTable
CREATE TABLE "public"."ChatConversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChatMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "source" "public"."ChatSource",
    "mode" "public"."ChatMode",
    "answersCount" INTEGER,
    "finalType" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ConfessionConversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfessionConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ConfessionMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConfessionMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MediaAlbum" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MediaAsset" (
    "id" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "mime" TEXT,
    "size" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."action_synonyms" (
    "action_canonical" TEXT NOT NULL,
    "en" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ar" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "action_synonyms_pkey" PRIMARY KEY ("action_canonical")
);

-- CreateTable
CREATE TABLE "public"."diaries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."direct_conversation_participants" (
    "conversation_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "direct_conversation_participants_pkey" PRIMARY KEY ("conversation_id","user_id")
);

-- CreateTable
CREATE TABLE "public"."direct_conversations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "direct_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."direct_messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "conversation_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivered_at" TIMESTAMPTZ(6),
    "read_at" TIMESTAMPTZ(6),

    CONSTRAINT "direct_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."entity_extractions" (
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

-- CreateTable
CREATE TABLE "public"."extraction_terms" (
    "id" SERIAL NOT NULL,
    "extraction_id" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "extraction_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."memory_columns" (
    "id" TEXT NOT NULL,
    "table_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memory_columns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."memory_rows" (
    "id" TEXT NOT NULL,
    "table_id" TEXT NOT NULL,
    "values" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memory_rows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."memory_tables" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memory_tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."query_expansions" (
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

-- CreateTable
CREATE TABLE "public"."user_circle_messages" (
    "id" BIGSERIAL NOT NULL,
    "circle_id" BIGINT NOT NULL,
    "user_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_circle_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_circles" (
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

-- CreateTable
CREATE TABLE "public"."users" (
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

-- CreateIndex
CREATE INDEX "ChatConversation_userId_idx" ON "public"."ChatConversation"("userId" ASC);

-- CreateIndex
CREATE INDEX "ChatMessage_conversationId_createdAt_idx" ON "public"."ChatMessage"("conversationId" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "ConfessionConversation_userId_idx" ON "public"."ConfessionConversation"("userId" ASC);

-- CreateIndex
CREATE INDEX "ConfessionMessage_conversationId_createdAt_idx" ON "public"."ConfessionMessage"("conversationId" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "MediaAlbum_userId_idx" ON "public"."MediaAlbum"("userId" ASC);

-- CreateIndex
CREATE INDEX "MediaAsset_albumId_createdAt_idx" ON "public"."MediaAsset"("albumId" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "idx_diaries_user" ON "public"."diaries"("user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_dcp_user" ON "public"."direct_conversation_participants"("user_id" ASC, "conversation_id" ASC);

-- CreateIndex
CREATE INDEX "idx_dm_conv_created" ON "public"."direct_messages"("conversation_id" ASC, "created_at" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "entity_extractions_content_type_content_id_key" ON "public"."entity_extractions"("content_type" ASC, "content_id" ASC);

-- CreateIndex
CREATE INDEX "idx_entity_extractions_user" ON "public"."entity_extractions"("user_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "extraction_terms_extraction_id_kind_token_key" ON "public"."extraction_terms"("extraction_id" ASC, "kind" ASC, "token" ASC);

-- CreateIndex
CREATE INDEX "idx_extraction_terms_extraction" ON "public"."extraction_terms"("extraction_id" ASC);

-- CreateIndex
CREATE INDEX "idx_extraction_terms_token" ON "public"."extraction_terms"("token" ASC);

-- CreateIndex
CREATE INDEX "idx_memory_columns_table" ON "public"."memory_columns"("table_id" ASC);

-- CreateIndex
CREATE INDEX "idx_memory_rows_table" ON "public"."memory_rows"("table_id" ASC);

-- CreateIndex
CREATE INDEX "idx_memory_tables_user" ON "public"."memory_tables"("user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_notes_user" ON "public"."notes"("user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_query_expansions_user" ON "public"."query_expansions"("user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_circle_messages_circle" ON "public"."user_circle_messages"("circle_id" ASC);

-- CreateIndex
CREATE INDEX "idx_circle_messages_created" ON "public"."user_circle_messages"("created_at" ASC);

-- CreateIndex
CREATE INDEX "idx_user_circles_user" ON "public"."user_circles"("user_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username" ASC);

-- AddForeignKey
ALTER TABLE "public"."ChatMessage" ADD CONSTRAINT "ChatMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."ChatConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConfessionMessage" ADD CONSTRAINT "ConfessionMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."ConfessionConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MediaAsset" ADD CONSTRAINT "MediaAsset_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "public"."MediaAlbum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."direct_conversation_participants" ADD CONSTRAINT "direct_conversation_participants_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."direct_conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."direct_conversation_participants" ADD CONSTRAINT "direct_conversation_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."direct_messages" ADD CONSTRAINT "direct_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."direct_conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."direct_messages" ADD CONSTRAINT "direct_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."extraction_terms" ADD CONSTRAINT "extraction_terms_extraction_id_fkey" FOREIGN KEY ("extraction_id") REFERENCES "public"."entity_extractions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."memory_columns" ADD CONSTRAINT "memory_columns_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "public"."memory_tables"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."memory_rows" ADD CONSTRAINT "memory_rows_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "public"."memory_tables"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."user_circle_messages" ADD CONSTRAINT "user_circle_messages_circle_id_fkey" FOREIGN KEY ("circle_id") REFERENCES "public"."user_circles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

