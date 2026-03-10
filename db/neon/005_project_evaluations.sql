-- Project Evaluation Results Storage
CREATE TABLE IF NOT EXISTS application_project_evaluations (
  id BIGSERIAL PRIMARY KEY,
  application_id BIGINT NOT NULL REFERENCES applicant_applications(id) ON DELETE CASCADE,
  global_score INTEGER NOT NULL CHECK (global_score >= 0 AND global_score <= 100),
  verdict_key TEXT NOT NULL CHECK (verdict_key IN ('excellent', 'strong', 'solid', 'improve', 'rework')),
  summary TEXT NOT NULL,
  strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  improvements JSONB NOT NULL DEFAULT '[]'::jsonb,
  jury_tip TEXT NOT NULL,
  self_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  pdf_path TEXT,
  pdf_extracted_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS application_project_evaluations_application_id_created_at_idx
  ON application_project_evaluations (application_id, created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS application_project_evaluations_verdict_key_idx
  ON application_project_evaluations (verdict_key);
