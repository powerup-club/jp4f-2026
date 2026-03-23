DO $migration$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
  ) THEN
    RAISE EXCEPTION 'Table public.applicant_applications does not exist. Run db/neon/001_applicant_portal.sql first.';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
      AND column_name = 'account_email'
  ) THEN
    EXECUTE $sql$ALTER TABLE public.applicant_applications ADD COLUMN account_email TEXT$sql$;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
      AND column_name = 'account_name'
  ) THEN
    EXECUTE $sql$ALTER TABLE public.applicant_applications ADD COLUMN account_name TEXT$sql$;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
      AND column_name = 'locale'
  ) THEN
    EXECUTE $sql$ALTER TABLE public.applicant_applications ADD COLUMN locale TEXT$sql$;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
      AND column_name = 'sheet_sync_status'
  ) THEN
    EXECUTE $sql$ALTER TABLE public.applicant_applications ADD COLUMN sheet_sync_status TEXT DEFAULT 'pending'$sql$;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
      AND column_name = 'sheet_sync_message'
  ) THEN
    EXECUTE $sql$ALTER TABLE public.applicant_applications ADD COLUMN sheet_sync_message TEXT$sql$;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
      AND column_name = 'participation_type'
  ) THEN
    EXECUTE $sql$ALTER TABLE public.applicant_applications ADD COLUMN participation_type TEXT$sql$;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
      AND column_name = 'contact_full_name'
  ) THEN
    EXECUTE $sql$ALTER TABLE public.applicant_applications ADD COLUMN contact_full_name TEXT$sql$;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
      AND column_name = 'contact_email'
  ) THEN
    EXECUTE $sql$ALTER TABLE public.applicant_applications ADD COLUMN contact_email TEXT$sql$;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
      AND column_name = 'team_members'
  ) THEN
    EXECUTE $sql$ALTER TABLE public.applicant_applications ADD COLUMN team_members JSONB NOT NULL DEFAULT '[]'::jsonb$sql$;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
      AND column_name = 'project_title'
  ) THEN
    EXECUTE $sql$ALTER TABLE public.applicant_applications ADD COLUMN project_title TEXT$sql$;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
      AND column_name = 'project_domain'
  ) THEN
    EXECUTE $sql$ALTER TABLE public.applicant_applications ADD COLUMN project_domain TEXT$sql$;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
      AND column_name = 'project_desc'
  ) THEN
    EXECUTE $sql$ALTER TABLE public.applicant_applications ADD COLUMN project_desc TEXT$sql$;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
      AND column_name = 'file_name'
  ) THEN
    EXECUTE $sql$ALTER TABLE public.applicant_applications ADD COLUMN file_name TEXT$sql$;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
      AND column_name = 'file_type'
  ) THEN
    EXECUTE $sql$ALTER TABLE public.applicant_applications ADD COLUMN file_type TEXT$sql$;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
      AND column_name = 'file_size_bytes'
  ) THEN
    EXECUTE $sql$ALTER TABLE public.applicant_applications ADD COLUMN file_size_bytes INTEGER$sql$;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
      AND column_name = 'file_url'
  ) THEN
    EXECUTE $sql$ALTER TABLE public.applicant_applications ADD COLUMN file_url TEXT$sql$;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
      AND column_name = 'file_storage'
  ) THEN
    EXECUTE $sql$ALTER TABLE public.applicant_applications ADD COLUMN file_storage TEXT NOT NULL DEFAULT 'none'$sql$;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
      AND column_name = 'raw_payload'
  ) THEN
    EXECUTE $sql$ALTER TABLE public.applicant_applications ADD COLUMN raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb$sql$;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
      AND column_name = 'last_synced_at'
  ) THEN
    EXECUTE $sql$ALTER TABLE public.applicant_applications ADD COLUMN last_synced_at TIMESTAMPTZ$sql$;
  END IF;

  EXECUTE $sql$ALTER TABLE public.applicant_applications ALTER COLUMN created_at SET DEFAULT NOW()$sql$;
  EXECUTE $sql$ALTER TABLE public.applicant_applications ALTER COLUMN updated_at SET DEFAULT NOW()$sql$;
  EXECUTE $sql$ALTER TABLE public.applicant_applications ALTER COLUMN status SET DEFAULT 'draft'$sql$;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
      AND column_name = 'user_email'
  ) THEN
    EXECUTE $sql$
      UPDATE public.applicant_applications
      SET
        account_email = COALESCE(NULLIF(lower(account_email), ''), NULLIF(lower(user_email), '')),
        account_name = COALESCE(NULLIF(account_name, ''), NULLIF(user_name, '')),
        contact_email = COALESCE(NULLIF(lower(contact_email), ''), NULLIF(lower(user_email), '')),
        contact_full_name = COALESCE(NULLIF(contact_full_name, ''), NULLIF(full_name, '')),
        participation_type = COALESCE(
          NULLIF(participation_type, ''),
          CASE
            WHEN lower(COALESCE(type, '')) IN ('team', 'equipe', 'équipe') THEN 'team'
            WHEN lower(COALESCE(type, '')) IN ('individual', 'individuel') THEN 'individual'
            ELSE NULL
          END
        ),
        project_title = COALESCE(NULLIF(project_title, ''), NULLIF(proj_title, '')),
        project_domain = COALESCE(NULLIF(project_domain, ''), NULLIF(proj_domain, '')),
        project_desc = COALESCE(NULLIF(project_desc, ''), NULLIF(proj_desc, '')),
        file_url = COALESCE(NULLIF(file_url, ''), NULLIF(file_link, '')),
        file_storage = CASE
          WHEN COALESCE(file_storage, '') IN ('google_script_only', 'external') THEN file_storage
          WHEN COALESCE(NULLIF(file_url, ''), NULLIF(file_link, '')) IS NOT NULL THEN 'google_script_only'
          ELSE 'none'
        END,
        sheet_sync_status = CASE
          WHEN COALESCE(sheet_sync_status, '') IN ('pending', 'synced', 'skipped', 'failed') THEN sheet_sync_status
          WHEN lower(COALESCE(status, '')) = 'submitted' THEN 'synced'
          ELSE 'pending'
        END,
        submitted_at = CASE
          WHEN submitted_at IS NOT NULL THEN submitted_at
          WHEN lower(COALESCE(status, '')) = 'submitted' THEN COALESCE(updated_at, created_at, NOW())
          ELSE submitted_at
        END,
        created_at = COALESCE(created_at, submitted_at, NOW()),
        updated_at = COALESCE(updated_at, created_at, submitted_at, NOW()),
        last_synced_at = COALESCE(last_synced_at, submitted_at, updated_at, created_at)
    $sql$;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
      AND column_name = 'member2_name'
  ) THEN
    EXECUTE $sql$
      UPDATE public.applicant_applications AS app
      SET team_members = members.members
      FROM (
        SELECT
          legacy.id,
          COALESCE(jsonb_agg(legacy.member) FILTER (WHERE legacy.member IS NOT NULL), '[]'::jsonb) AS members
        FROM (
          SELECT
            id,
            CASE
              WHEN COALESCE(NULLIF(member2_name, ''), NULLIF(member2_email, '')) IS NULL THEN NULL
              ELSE jsonb_build_object('name', COALESCE(member2_name, ''), 'email', lower(COALESCE(member2_email, '')))
            END AS member
          FROM public.applicant_applications
          UNION ALL
          SELECT
            id,
            CASE
              WHEN COALESCE(NULLIF(member3_name, ''), NULLIF(member3_email, '')) IS NULL THEN NULL
              ELSE jsonb_build_object('name', COALESCE(member3_name, ''), 'email', lower(COALESCE(member3_email, '')))
            END AS member
          FROM public.applicant_applications
          UNION ALL
          SELECT
            id,
            CASE
              WHEN COALESCE(NULLIF(member4_name, ''), NULLIF(member4_email, '')) IS NULL THEN NULL
              ELSE jsonb_build_object('name', COALESCE(member4_name, ''), 'email', lower(COALESCE(member4_email, '')))
            END AS member
          FROM public.applicant_applications
        ) AS legacy
        GROUP BY legacy.id
      ) AS members
      WHERE app.id = members.id
        AND app.team_members = '[]'::jsonb
    $sql$;
  END IF;

  EXECUTE $sql$
    CREATE UNIQUE INDEX IF NOT EXISTS applicant_applications_account_email_key
    ON public.applicant_applications (account_email)
  $sql$;
END
$migration$;
