import { fetchDamPrices, bdToday } from "@/lib/dam-prices"
import { fetchWfpPrices } from "@/lib/wfp-prices"
import { createAdminClient } from "@/lib/supabase/admin"
import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Shared market-price refresh logic.
 * Used by the cron endpoint (app/api/refresh-prices) and by the stale-data
 * guard in the prices API, which kicks off a best-effort background refresh
 * when the newest stored price is older than STALE_AGE_DAYS.
 *
 * Two sources are ingested on every run:
 *  - DAM national daily retail averages (fresh every day, stored under the
 *    জাতীয় বাজার national market).
 *  - WFP district-level retail prices from the latest monthly observation
 *    (62 of 64 districts — the real per-district prices the board shows).
 */

const NATIONAL_MARKET = "জাতীয় বাজার" // "National Market"

export interface RefreshResult {
  ok: boolean
  date: string
  commodities: string[]
  districts: number
  rows: number
  error?: string
}

/** Ingest both sources: DAM national daily averages + WFP district prices. */
export async function runPriceRefresh(): Promise<RefreshResult> {
  const [damPrices, wfpPrices] = await Promise.all([fetchDamPrices(), fetchWfpPrices()])

  if (damPrices.length === 0 && wfpPrices.length === 0) {
    return {
      ok: false,
      date: bdToday(),
      commodities: [],
      districts: 0,
      rows: 0,
      error: "Both price sources (DAM, WFP) unreachable or unparseable",
    }
  }

  const supabase = createAdminClient()
  const today = bdToday()
  const rows: Record<string, unknown>[] = []
  const commodities = new Set<string>()

  // DAM: national daily averages — one row per commodity under the national market
  for (const p of damPrices) {
    commodities.add(p.commodity)
    rows.push({
      commodity: p.commodity,
      variety: null,
      market: NATIONAL_MARKET,
      district: NATIONAL_MARKET,
      price_per_kg: p.pricePerKg,
      unit: p.unit,
      date: today,
    })
  }

  // WFP: real district-level prices for the latest observation month
  let wfpDistricts = 0
  if (wfpPrices.length > 0) {
    const obsDate = wfpPrices[0].date
    // Skip the upsert if this observation month is already stored — WFP only
    // publishes ~monthly, so re-ingesting the same month is pure waste.
    const { count, error: countErr } = await supabase
      .from("market_prices")
      .select("id", { count: "exact", head: true })
      .eq("date", obsDate)
    if (countErr) {
      console.error("WFP observation-month check failed:", countErr.message)
    } else if ((count ?? 0) === 0) {
      for (const p of wfpPrices) {
        commodities.add(p.commodity)
        rows.push({
          commodity: p.commodity,
          variety: null,
          market: p.market,
          district: p.district,
          price_per_kg: p.pricePerKg,
          unit: p.unit,
          date: obsDate,
        })
      }
      wfpDistricts = new Set(wfpPrices.map((p) => p.district)).size
    }
  }

  if (rows.length > 0) {
    const { error } = await supabase.from("market_prices").upsert(rows, {
      onConflict: "district, commodity, date",
    })
    if (error) {
      console.error("Market price upsert failed:", error)
      return {
        ok: false,
        date: today,
        commodities: [...commodities],
        districts: wfpDistricts,
        rows: rows.length,
        error: error.message,
      }
    }
  }

  // Legacy cleanup: the old refresh stored the national average under every
  // district (market = জাতীয় বাজার). District queries now use real WFP rows,
  // so drop those stale national copies (the national rows themselves stay).
  const { error: delErr } = await supabase
    .from("market_prices")
    .delete()
    .eq("market", NATIONAL_MARKET)
    .neq("district", NATIONAL_MARKET)
  if (delErr) console.error("Legacy national-copy cleanup failed:", delErr.message)

  return {
    ok: true,
    date: today,
    commodities: [...commodities],
    districts: wfpDistricts,
    rows: rows.length,
  }
}

// ── Stale-data guard ──────────────────────────────────────────────────────
// Refreshes when the newest stored price is more than 2 days old (e.g. the
// cron missed a run). Best-effort: deduped in-process, rate-limited, and never
// awaited by the calling request.

const STALE_AGE_DAYS = 2
const COOLDOWN_MS = 30 * 60 * 1000 // at most one attempt per 30 min
let refreshInFlight: Promise<void> | null = null
let lastRefreshAttempt = 0

function isStale(latest: string): boolean {
  // Both dates are "YYYY-MM-DD", so Date.parse compares them as UTC midnights.
  const days = Math.round((Date.parse(bdToday()) - Date.parse(latest)) / 86400000)
  return days > STALE_AGE_DAYS
}

/**
 * Kick off a background refresh when the market_prices table's newest date is
 * missing (empty table) or older than STALE_AGE_DAYS. Never blocks the caller.
 */
export function triggerRefreshIfStale(supabase: SupabaseClient): void {
  if (refreshInFlight) return
  const now = Date.now()
  if (now - lastRefreshAttempt < COOLDOWN_MS) return
  lastRefreshAttempt = now

  const task = (async () => {
    const { data, error } = await supabase
      .from("market_prices")
      .select("date")
      .order("date", { ascending: false })
      .limit(1)
    if (error) return // table missing / RLS — nothing to refresh against
    const latest = data && data.length > 0 ? data[0].date : null
    if (latest && !isStale(latest)) return
    const result = await runPriceRefresh()
    if (!result.ok) console.warn("Background price refresh did not complete:", result.error)
  })()

  refreshInFlight = task
    .catch((e) => console.error("Background price refresh failed:", e))
    .finally(() => {
      refreshInFlight = null
    })

  // On Vercel, keep the serverless function alive until the work settles;
  // elsewhere the Node event loop keeps it running anyway.
  const waitUntil = (globalThis as any).waitUntil as ((p: Promise<unknown>) => void) | undefined
  if (typeof waitUntil === "function") waitUntil(refreshInFlight)
}
