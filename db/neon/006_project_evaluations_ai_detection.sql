-- Add AI detection fields to project evaluations
ALTER TABLE application_project_evaluations
  ADD COLUMN IF NOT EXISTS ai_detection JSONB NOT NULL DEFAULT '{}'::jsonb;
