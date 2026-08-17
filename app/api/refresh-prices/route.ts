export const dynamic = "force-dynamic"
export const maxDuration = 60

import { NextRequest, NextResponse } from "next/server"
import { runPriceRefresh } from "@/lib/refresh-prices"

/**
 * Market-price refresh job.
 *
 * Ingests both real price sources — DAM national daily retail averages and
 * WFP district-level monthly prices — into Supabase `market_prices` (see
 * lib/refresh-prices for the logic — the same code powers the stale-data
 * guard in /api/prices).
 *
 * Triggered daily by Vercel Cron (vercel.json) — cron requests carry the
 * `vercel-cron/1.0` user agent. Manual/self-hosted triggers must pass the
 * CRON_SECRET via the `x-cron-secret` header or `?secret=` query param.
 */

function isAuthorized(req: NextRequest): boolean {
  // Vercel cron jobs always send this user agent — no committed secret needed.
  if ((req.headers.get("user-agent") || "").toLowerCase().startsWith("vercel-cron")) {
    return true
  }

  const secret = process.env.CRON_SECRET
  if (!secret) return false
  if (req.headers.get("x-cron-secret") === secret) return true
  return new URL(req.url).searchParams.get("secret") === secret
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const result = await runPriceRefresh()
  if (!result.ok) {
    return NextResponse.json({ error: result.error || "Refresh failed" }, { status: 502 })
  }

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  return GET(req)
}
