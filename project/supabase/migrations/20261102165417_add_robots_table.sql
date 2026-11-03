/*
# Add robots table and extend detections

1. New Tables
- `robots`
  - `id` (uuid, PK)
  - `user_id` (uuid, NOT NULL, DEFAULT auth.uid())
  - `name` (text, not null) e.g. "Robot-01"
  - `status` (text, default 'offline') — online | offline | charging
  - `battery` (integer, nullable) — 0-100
  - `field` (text, nullable) — assigned field name
  - `firmware` (text, nullable)
  - `last_seen` (timestamptz, nullable)
  - `created_at` (timestamptz, default now())

2. Modified Tables
- `detections` — add `job_id` (text), `robot_id` (uuid nullable FK to robots), `robot_name` (text)
  Note: robot_name is denormalized for display performance

3. Security
- Enable RLS on `robots`, owner-scoped to authenticated.
- New columns on `detections` are nullable and backward-compatible.
*/

CREATE TABLE IF NOT EXISTS robots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'offline',
  battery integer,
  field text,
  firmware text DEFAULT 'gw-0.4.2',
  last_seen timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE robots ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON robots TO authenticated;

DROP POLICY IF EXISTS "robots_select_own" ON robots;
CREATE POLICY "robots_select_own" ON robots FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "robots_insert_own" ON robots;
CREATE POLICY "robots_insert_own" ON robots FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "robots_update_own" ON robots;
CREATE POLICY "robots_update_own" ON robots FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "robots_delete_own" ON robots;
CREATE POLICY "robots_delete_own" ON robots FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Extend detections table with denormalized robot_name and job_id
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='detections' AND column_name='job_id') THEN
    ALTER TABLE detections ADD COLUMN job_id text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='detections' AND column_name='robot_name') THEN
    ALTER TABLE detections ADD COLUMN robot_name text;
  END IF;
END $$;
