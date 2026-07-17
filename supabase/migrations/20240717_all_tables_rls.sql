-- ========================================
-- CropIQ: Complete RLS + Schema Fix
-- Run in Supabase SQL Editor 
-- ========================================

-- 1. disease_scans — RLS policy
ALTER TABLE IF EXISTS disease_scans ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'disease_scans' AND policyname = 'Users manage own scans') THEN
    CREATE POLICY "Users manage own scans" ON disease_scans
      FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 2. weather_advisories — RLS policy (if not exists)
ALTER TABLE IF EXISTS weather_advisories ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'weather_advisories' AND policyname = 'Users manage own advisories') THEN
    CREATE POLICY "Users manage own advisories" ON weather_advisories
      FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 3. saved_items — RLS policy (if not exists)
ALTER TABLE IF EXISTS saved_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'saved_items' AND policyname = 'Users manage own saved') THEN
    CREATE POLICY "Users manage own saved" ON saved_items
      FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 4. chat_sessions — RLS policy (if not exists)
ALTER TABLE IF EXISTS chat_sessions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_sessions' AND policyname = 'Users manage own chats') THEN
    CREATE POLICY "Users manage own chats" ON chat_sessions
      FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Verify all tables have RLS
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('disease_scans', 'weather_advisories', 'saved_items', 'chat_sessions')
ORDER BY tablename;
