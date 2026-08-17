export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { fetchDamPrices, bdToday } from "@/lib/dam-prices"
import { fetchWfpPrices } from "@/lib/wfp-prices"

// The national market — DAM's daily averages are shown under this sentinel
// district; district-scoped queries read the real WFP per-district rows.
const NATIONAL_MARKET = "জাতীয় বাজার"

// ─── In-memory cache ────────────────────────────────────────────────────────
// DAM is a cheap daily national ticker; WFP is a ~4.5MB monthly CSV. Both are
// fetched live and cached briefly so the board is always real but not slow.
const CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6 hours

type PriceRow = {
  id: string
  commodity: string
  market: string
  district: string
  price_per_kg: number
  unit: string
  date: string
}

let cache: { fetchedAt: number; dam: PriceRow[]; wfp: PriceRow[] } | null = null

async function getLivePrices() {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) return cache

  const [damP, wfpP] = await Promise.allSettled([fetchDamPrices(), fetchWfpPrices()])

  const today = bdToday()
  const dam: PriceRow[] = (damP.status === "fulfilled" ? damP.value : []).map((p, i) => ({
    id: `dam-${i}`,
    commodity: p.commodity,
    market: NATIONAL_MARKET,
    district: NATIONAL_MARKET,
    price_per_kg: p.pricePerKg,
    unit: p.unit,
    date: today,
  }))

  const wfp: PriceRow[] = (wfpP.status === "fulfilled" ? wfpP.value : []).map((p, i) => ({
    id: `wfp-${i}`,
    commodity: p.commodity,
    market: p.market,
    district: p.district,
    price_per_kg: p.pricePerKg,
    unit: p.unit,
    date: p.date,
  }))

  cache = { fetchedAt: Date.now(), dam, wfp }
  return cache
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const district = searchParams.get("district") || ""
    const commodity = searchParams.get("commodity") || ""
    const date = searchParams.get("date") || ""
    // history=1 returns rows ascending by date (oldest first) for a price chart
    const history = searchParams.get("history") === "1"

    const isNational = !district || district === NATIONAL_MARKET

    const { dam, wfp } = await getLivePrices()

    // Pick the real source: national → DAM daily averages; district → WFP rows.
    let rows = isNational ? dam : wfp.filter((r) => r.district === district)
    const source = isNational ? "dam" : "wfp"

    if (commodity) {
      const lower = commodity.toLowerCase()
      rows = rows.filter((r) => r.commodity.toLowerCase().includes(lower))
    }
    if (date) rows = rows.filter((r) => r.date === date)

    // For a chart, oldest-first; otherwise newest-first.
    rows = [...rows].sort((a, b) => (history ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)))

    const updatedAt = rows.length > 0 ? (history ? rows[rows.length - 1].date : rows[0].date) : ""

    return NextResponse.json({ prices: rows, source, updatedAt })
  } catch (error: any) {
    console.error("Price board error:", error)
    return NextResponse.json({ prices: [], source: "", updatedAt: "" }, { status: 200 })
  }
}
