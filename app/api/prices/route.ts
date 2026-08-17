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

    // National view merges DAM (daily national averages) with WFP commodities
    // that DAM doesn't cover, so the board shows the full union of products.
    // Each WFP-only commodity is averaged across all districts into a national
    // figure; DAM wins wherever both sources have the same product.
    let rows: PriceRow[]
    let source: string
    if (isNational) {
      const wfpByCommodity = new Map<string, { total: number; count: number; unit: string; date: string }>()
      for (const r of wfp) {
        const g = wfpByCommodity.get(r.commodity) ?? { total: 0, count: 0, unit: r.unit, date: r.date }
        g.total += r.price_per_kg
        g.count += 1
        wfpByCommodity.set(r.commodity, g)
      }
      const damCommodities = new Set(dam.map((r) => r.commodity))
      const wfpNational: PriceRow[] = []
      let wi = 0
      for (const [commodity, g] of wfpByCommodity.entries()) {
        if (damCommodities.has(commodity)) continue // DAM already covers it
        wfpNational.push({
          id: `wfp-nat-${wi++}`,
          commodity,
          market: NATIONAL_MARKET,
          district: NATIONAL_MARKET,
          price_per_kg: Math.round((g.total / g.count) * 100) / 100,
          unit: g.unit,
          date: g.date,
        })
      }
      rows = [...dam, ...wfpNational].sort((a, b) => b.price_per_kg - a.price_per_kg)
      source = "dam"
    } else {
      rows = wfp.filter((r) => r.district === district)
      source = "wfp"
    }

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
