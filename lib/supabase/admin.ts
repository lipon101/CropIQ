import { createClient } from "@supabase/supabase-js"

/**
 * Server-only Supabase client using the service-role key.
 * Bypasses RLS — use ONLY in server-side jobs (e.g. the market-price refresh
 * cron), never in client components or user-facing API routes.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
