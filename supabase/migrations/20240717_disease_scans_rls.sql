-- RLS Policy for disease_scans
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/_/sql

ALTER TABLE disease_scans ENABLE ROW LEVEL SECURITY;

-- Allow users full access to their own scans (SELECT, INSERT, UPDATE, DELETE)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'disease_scans' AND policyname = 'Users can manage own scans') THEN
    CREATE POLICY "Users can manage own scans" ON disease_scans
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
