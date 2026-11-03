/*
# Create profiles, detections, and alerts tables for PaddyGuard AI

1. New Tables
- `profiles`: Extends auth.users with user-specific info (full name, phone, role, organization, location, bio, avatar_url).
  - `id` (uuid, PK, references auth.users ON DELETE CASCADE)
  - `full_name` (text, not null)
  - `phone` (text, nullable — for SMS alerts)
  - `role` (text, default 'farmer' — farmer, agronomist, or technician)
  - `organization` (text, nullable)
  - `location` (text, nullable)
  - `bio` (text, nullable)
  - `avatar_url` (text, nullable)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())
- `detections`: Stores paddy disease detection results per user.
  - `id` (uuid, PK)
  - `user_id` (uuid, NOT NULL, DEFAULT auth.uid(), references auth.users ON DELETE CASCADE)
  - `image_url` (text, not null)
  - `class_id` (integer, not null)
  - `class_name` (text, not null)
  - `healthy` (boolean, not null default false)
  - `robot` (text, nullable)
  - `field` (text, nullable)
  - `status` (text, default 'completed' — completed, queued, running, failed)
  - `source` (text, default 'Mock gateway')
  - `duration_ms` (integer, nullable)
  - `created_at` (timestamptz, default now())
- `alerts`: Stores disease/hardware/robot alerts per user.
  - `id` (uuid, PK)
  - `user_id` (uuid, NOT NULL, DEFAULT auth.uid(), references auth.users ON DELETE CASCADE)
  - `title` (text, not null)
  - `description` (text, not null)
  - `severity` (text, not null default 'info' — critical, warning, info)
  - `channels` (text, default 'In-app only')
  - `read` (boolean, default false)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on all tables.
- Grant CRUD to `authenticated` only (app requires sign-in).
- Owner-scoped policies: each user can only access their own rows.
- `profiles` table: user can read/update their own profile row (id = auth.uid()).
- A trigger auto-creates a profile row when a new auth.user is created.

3. Notes
- The `user_id` columns default to `auth.uid()` so client inserts that omit user_id succeed.
- A `handle_new_user` trigger function creates a profile row on signup.
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text,
  role text NOT NULL DEFAULT 'farmer',
  organization text,
  location text,
  bio text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, UPDATE ON profiles TO authenticated;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Detections table
CREATE TABLE IF NOT EXISTS detections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  class_id integer NOT NULL,
  class_name text NOT NULL,
  healthy boolean NOT NULL DEFAULT false,
  robot text,
  field text,
  status text NOT NULL DEFAULT 'completed',
  source text NOT NULL DEFAULT 'Mock gateway',
  duration_ms integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE detections ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON detections TO authenticated;

DROP POLICY IF EXISTS "detections_select_own" ON detections;
CREATE POLICY "detections_select_own" ON detections FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "detections_insert_own" ON detections;
CREATE POLICY "detections_insert_own" ON detections FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "detections_update_own" ON detections;
CREATE POLICY "detections_update_own" ON detections FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "detections_delete_own" ON detections;
CREATE POLICY "detections_delete_own" ON detections FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  severity text NOT NULL DEFAULT 'info',
  channels text DEFAULT 'In-app only',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON alerts TO authenticated;

DROP POLICY IF EXISTS "alerts_select_own" ON alerts;
CREATE POLICY "alerts_select_own" ON alerts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "alerts_insert_own" ON alerts;
CREATE POLICY "alerts_insert_own" ON alerts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "alerts_update_own" ON alerts;
CREATE POLICY "alerts_update_own" ON alerts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "alerts_delete_own" ON alerts;
CREATE POLICY "alerts_delete_own" ON alerts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
