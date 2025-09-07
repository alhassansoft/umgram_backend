-- Add anonymous field to user_circle_messages table
ALTER TABLE "public"."user_circle_messages" 
ADD COLUMN "anonymous" BOOLEAN DEFAULT FALSE;
