import { neon } from "@neondatabase/serverless";
export const sql = neon(process.env.DATABASE_URL!);

export async function initDB() {
  await sql`CREATE TABLE IF NOT EXISTS applicant_applications (
    id SERIAL PRIMARY KEY, user_email TEXT NOT NULL UNIQUE,
    user_name TEXT, user_image TEXT, team_id TEXT UNIQUE,
    type TEXT DEFAULT 'individual', status TEXT DEFAULT 'draft',
    full_name TEXT, phone TEXT, university TEXT, branch TEXT,
    year_of_study TEXT, linkedin TEXT,
    team_name TEXT,
    member2_name TEXT, member2_email TEXT,
    member3_name TEXT, member3_email TEXT,
    member4_name TEXT, member4_email TEXT,
    proj_title TEXT, proj_domain TEXT, proj_desc TEXT,
    innovation TEXT, demo_format TEXT, heard_from TEXT, file_link TEXT,
    submitted_at TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS applicant_messages (
    id SERIAL PRIMARY KEY, user_email TEXT NOT NULL,
    role TEXT NOT NULL, content TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY, user_name TEXT, user_email TEXT,
    team_id TEXT, phone TEXT, message TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS quiz_leaderboard (
    id SERIAL PRIMARY KEY, user_email TEXT NOT NULL,
    user_name TEXT, user_image TEXT,
    score INTEGER NOT NULL, total INTEGER NOT NULL,
    percentage INTEGER NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS orientation_results (
    id SERIAL PRIMARY KEY, user_email TEXT NOT NULL UNIQUE,
    branch TEXT, profile TEXT, scores JSONB, updated_at TIMESTAMPTZ DEFAULT NOW()
  )`;
}

export function generateTeamId(): string {
  return `Innov'Industry-26-${Math.random().toString(36).substring(2,7).toUpperCase()}`;
}
