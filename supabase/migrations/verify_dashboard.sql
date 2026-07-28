-- ========================================
-- CropIQ: Verify Dashboard Data
-- Run in Supabase SQL Editor to check
-- ========================================

-- Check row counts per user
SELECT 
  'disease_scans' as table_name, user_id, count(*) 
FROM disease_scans GROUP BY user_id
UNION ALL
SELECT 'weather_advisories', user_id, count(*) 
FROM weather_advisories GROUP BY user_id
UNION ALL
SELECT 'saved_items', user_id, count(*) 
FROM saved_items GROUP BY user_id
UNION ALL
SELECT 'chat_sessions', user_id, count(*) 
FROM chat_sessions GROUP BY user_id
ORDER BY table_name;

-- Check RLS status
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename IN ('disease_scans','weather_advisories','saved_items','chat_sessions');

-- Check policies
SELECT tablename, policyname, cmd, permissive, qual, with_check
FROM pg_policies
WHERE tablename IN ('disease_scans','weather_advisories','saved_items','chat_sessions');
