-- CreateEnum
CREATE TYPE "public"."MatchCandidateStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');

-- CreateEnum
CREATE TYPE "public"."MatchRequestStatus" AS ENUM ('PENDING', 'MATCHED', 'NOT_FOUND', 'CANCELED');

-- DropForeignKey
ALTER TABLE "public"."direct_conversation_participants" DROP CONSTRAINT "direct_conversation_participants_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."direct_conversation_participants" DROP CONSTRAINT "direct_conversation_participants_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."direct_messages" DROP CONSTRAINT "direct_messages_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."direct_messages" DROP CONSTRAINT "direct_messages_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."extraction_terms" DROP CONSTRAINT "extraction_terms_extraction_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."memory_columns" DROP CONSTRAINT "memory_columns_table_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."memory_rows" DROP CONSTRAINT "memory_rows_table_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_circle_messages" DROP CONSTRAINT "user_circle_messages_circle_id_fkey";

-- DropTable
DROP TABLE "public"."action_synonyms";

-- DropTable
DROP TABLE "public"."diaries";

-- DropTable
DROP TABLE "public"."direct_conversation_participants";

-- DropTable
DROP TABLE "public"."direct_conversations";

-- DropTable
DROP TABLE "public"."direct_messages";

-- DropTable
DROP TABLE "public"."entity_extractions";

-- DropTable
DROP TABLE "public"."extraction_terms";

-- DropTable
DROP TABLE "public"."memory_columns";

-- DropTable
DROP TABLE "public"."memory_rows";

-- DropTable
DROP TABLE "public"."memory_tables";

-- DropTable
DROP TABLE "public"."notes";

-- DropTable
DROP TABLE "public"."query_expansions";

-- DropTable
DROP TABLE "public"."user_circle_messages";

-- DropTable
DROP TABLE "public"."user_circles";

-- DropTable
DROP TABLE "public"."users";

-- CreateTable
CREATE TABLE "public"."MatchRequest" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "mode" "public"."ChatMode",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "public"."MatchRequestStatus" NOT NULL DEFAULT 'PENDING',
    "approvedCandidateId" TEXT,

    CONSTRAINT "MatchRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MatchCandidate" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "candidateUserId" TEXT NOT NULL,
    "sourceDocId" TEXT,
    "snippet" TEXT,
    "status" "public"."MatchCandidateStatus" NOT NULL DEFAULT 'PENDING',
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MatchRequest_requesterId_idx" ON "public"."MatchRequest"("requesterId");

-- CreateIndex
CREATE INDEX "MatchCandidate_candidateUserId_idx" ON "public"."MatchCandidate"("candidateUserId");

-- CreateIndex
CREATE INDEX "MatchCandidate_requestId_status_idx" ON "public"."MatchCandidate"("requestId", "status");

-- AddForeignKey
ALTER TABLE "public"."MatchCandidate" ADD CONSTRAINT "MatchCandidate_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "public"."MatchRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

