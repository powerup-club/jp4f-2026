CREATE TABLE IF NOT EXISTS applicant_applications (
  id BIGSERIAL PRIMARY KEY,
  account_email TEXT NOT NULL UNIQUE,
  account_name TEXT,
  locale TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
  sheet_sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sheet_sync_status IN ('pending', 'synced', 'skipped', 'failed')),
  sheet_sync_message TEXT,
  participation_type TEXT CHECK (participation_type IN ('individual', 'team')),
  contact_full_name TEXT,
  contact_email TEXT,
  phone TEXT,
  university TEXT,
  branch TEXT,
  year_of_study TEXT,
  linkedin TEXT,
  team_name TEXT,
  team_members JSONB NOT NULL DEFAULT '[]'::jsonb,
  project_title TEXT,
  project_domain TEXT,
  project_desc TEXT,
  innovation TEXT,
  demo_format TEXT,
  heard_from TEXT,
  file_name TEXT,
  file_type TEXT,
  file_size_bytes INTEGER,
  file_url TEXT,
  file_storage TEXT NOT NULL DEFAULT 'none' CHECK (file_storage IN ('none', 'google_script_only', 'external')),
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS application_messages (
  id BIGSERIAL PRIMARY KEY,
  application_id BIGINT NOT NULL REFERENCES applicant_applications(id) ON DELETE CASCADE,
  sender_email TEXT NOT NULL,
  sender_name TEXT,
  sender_role TEXT NOT NULL DEFAULT 'applicant' CHECK (sender_role IN ('applicant', 'admin', 'system')),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS application_messages_application_id_created_at_idx
  ON application_messages (application_id, created_at, id);
