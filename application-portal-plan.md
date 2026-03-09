# Applicant Portal Plan

## Goal

Add a Google-authenticated candidate portal on top of the current JP4F site so applicants can:

- sign in before final submission
- access a personal workspace
- review and edit profile, team, project, and file information
- access a dedicated chat area

## Phase 1 - Foundation

- Allow verified Google sign-in for regular users
- Keep `/admin` restricted to `ADMIN_EMAILS`
- Add a generic Google login page
- Add protected candidate workspace routes:
  - `/[locale]/application`
  - `/[locale]/application/chat`

Status: started in this iteration

## Phase 2 - Draft Persistence

- Choose persistent storage for candidate records
- Recommended:
  - database: Vercel Postgres, Neon, or Supabase
  - file storage: Vercel Blob
- Introduce candidate/application entities:
  - user account
  - application draft
  - team members
  - project details
  - file metadata
- Save form drafts before final submission

Status: Neon selected and groundwork implemented

- `DATABASE_URL` added as the applicant persistence env var
- SQL schema added in `db/neon/001_applicant_portal.sql`
- `/api/register` now syncs successful submissions into Neon
- `/[locale]/application` now reads the applicant record from Neon
- `/[locale]/application/chat` now persists applicant messages in Neon

## Phase 3 - Workspace Editing

- Load saved application data inside `/[locale]/application`
- Allow editing and resubmitting profile, team, project, and files
- Add explicit draft and final-submission states
- Add applicant-facing submission history and status feedback

## Phase 4 - Chat

- Add authenticated chat threads linked to the candidate application
- Start with server-rendered messages plus fetch refresh/polling
- Add real-time updates only if needed after v1

## Immediate Next Steps

1. Run the Neon SQL schema in the target Neon database.
2. Add `DATABASE_URL` to Vercel and local `.env.local`.
3. Move uploaded file binaries to Vercel Blob or equivalent object storage.
4. Add editable draft forms inside `/[locale]/application` using `/api/application`.
5. Add admin-side replies for applicant chat.
