DO $migration$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicant_applications'
      AND column_name = 'user_email'
      AND is_nullable = 'NO'
  ) THEN
    EXECUTE $sql$
      ALTER TABLE public.applicant_applications
      ALTER COLUMN user_email DROP NOT NULL
    $sql$;
  END IF;
END
$migration$;
