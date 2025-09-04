-- Update check constraint to allow content_type = 'note'
BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints tc
    WHERE tc.constraint_name = 'entity_extractions_content_type_check'
      AND tc.table_name = 'entity_extractions'
  ) THEN
    ALTER TABLE entity_extractions DROP CONSTRAINT entity_extractions_content_type_check;
  END IF;
END$$;

ALTER TABLE entity_extractions
  ADD CONSTRAINT entity_extractions_content_type_check
  CHECK (content_type IN ('diary','note','post','comment','other'));

-- Ensure upsert target exists for (content_type, content_id)
CREATE UNIQUE INDEX IF NOT EXISTS entity_extractions_content_unique
  ON entity_extractions (content_type, content_id);

COMMIT;
