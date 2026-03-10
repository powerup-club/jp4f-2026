CREATE TABLE IF NOT EXISTS application_ai_messages (
  id BIGSERIAL PRIMARY KEY,
  application_id BIGINT NOT NULL REFERENCES applicant_applications(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS application_ai_messages_application_id_created_at_idx
  ON application_ai_messages (application_id, created_at, id);

CREATE TABLE IF NOT EXISTS application_quiz_attempts (
  id BIGSERIAL PRIMARY KEY,
  application_id BIGINT NOT NULL REFERENCES applicant_applications(id) ON DELETE CASCADE,
  locale TEXT,
  branch TEXT NOT NULL CHECK (branch IN ('GESI', 'MECA', 'MECATRONIQUE', 'GI')),
  profile TEXT NOT NULL,
  description TEXT NOT NULL,
  tagline TEXT NOT NULL,
  why TEXT NOT NULL,
  history JSONB NOT NULL DEFAULT '[]'::jsonb,
  rating INTEGER NOT NULL DEFAULT 0,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS application_quiz_attempts_application_id_created_at_idx
  ON application_quiz_attempts (application_id, created_at DESC, id DESC);

CREATE TABLE IF NOT EXISTS application_contact_requests (
  id BIGSERIAL PRIMARY KEY,
  application_id BIGINT NOT NULL REFERENCES applicant_applications(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  team_id TEXT NOT NULL,
  message TEXT NOT NULL,
  sheet_sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sheet_sync_status IN ('pending', 'synced', 'skipped', 'failed')),
  sheet_sync_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS application_contact_requests_application_id_created_at_idx
  ON application_contact_requests (application_id, created_at DESC, id DESC);

CREATE TABLE IF NOT EXISTS application_game_quiz_scores (
  id BIGSERIAL PRIMARY KEY,
  application_id BIGINT NOT NULL REFERENCES applicant_applications(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0),
  total INTEGER NOT NULL CHECK (total > 0),
  percentage INTEGER NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS application_game_quiz_scores_created_at_idx
  ON application_game_quiz_scores (created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS application_game_quiz_scores_application_id_created_at_idx
  ON application_game_quiz_scores (application_id, created_at DESC, id DESC);
