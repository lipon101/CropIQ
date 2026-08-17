/**
 * DAM (Department of Agricultural Marketing) — Bangladesh market price scraper.
 *
 * Source: the official national daily retail price ticker published on
 * https://market.dam.gov.bd — the government's market price portal.
 * The ticker is server-rendered HTML, so a single GET gives us the national
 * average retail price range for ~22 staple commodities, refreshed daily.
 *
 * Why not the per-market report? DAM's per-district report is a legacy JSP/BIRT
 * backend (plain-HTTP IP, unreachable from outside BD) and its AJAX cascade
 * (division → district → market) consistently fails. The national ticker is
 * HTTPS, stable, and the same authoritative government source.
 */

const DAM_URL = "https://market.dam.gov.bd/?L=E"

export interface DamPrice {
  /** App commodity name (matches COMMODITIES[].name_en so Bengali labels show). */
  commodity: string
  /** Display unit for the app's price board. */
  unit: string
  /** Midpoint of DAM's published min–max range, in taka. */
  pricePerKg: number
  /** Original DAM ticker name, kept for debugging. */
  sourceName: string
}

/**
 * DAM ticker name → app commodity.
 * Only commodities the app's COMMODITIES list knows are mapped, so the price
 * board keeps its Bengali labels and district/commodity filters.
 *
 * Unit notes:
 *  - "Egg Farm-Red" is published per 4 pieces by DAM, so ×3 converts to a dozen
 *    to match the app's "Egg (Farm)" unit.
 */
const DAM_MAP: { damName: string; commodity: string; unit: string; multiplier?: number }[] = [
  { damName: "Aman-Fine", commodity: "Rice (Atop)", unit: "kg" },
  { damName: "Boro-Fine", commodity: "Rice (Miniket)", unit: "kg" },
  { damName: "Ata (packet)", commodity: "Wheat Flour", unit: "kg" },
  { damName: "Onion-local", commodity: "Onion (Local)", unit: "kg" },
  { damName: "Garlic-local", commodity: "Garlic", unit: "kg" },
  { damName: "Green Chili", commodity: "Green Chili", unit: "kg" },
  { damName: "Ginger-local", commodity: "Ginger", unit: "kg" },
  { damName: "Beef", commodity: "Beef", unit: "kg" },
  { damName: "Farm-raised Hen", commodity: "Chicken (Broiler)", unit: "kg" },
  { damName: "Egg Farm-Red", commodity: "Egg (Farm)", unit: "dozen", multiplier: 3 },
]

// <span class="stockbox"><a href="#Aman-Fine">Aman-Fine</a>:&nbsp; 72.00 - 75.00 <span ...>▲0.00% </span></span>
const TICKER_ITEM = /<a href="#[^"]*">([^<]+)<\/a>:\s*(?:&nbsp;|\u00a0|&#160;)?\s*([\d.]+)\s*-\s*([\d.]+)/g

/**
 * Fetch today's national retail prices from DAM.
 * Returns [] when the source is unreachable or unparseable — callers should
 * keep whatever data they already have instead of treating this as an error.
 */
export async function fetchDamPrices(): Promise<DamPrice[]> {
  let res: Response
  try {
    res = await fetch(DAM_URL, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (CropIQ market-price refresh bot)",
      },
      signal: AbortSignal.timeout(15000),
    })
  } catch {
    console.error("DAM fetch failed (network/timeout)")
    return []
  }

  if (!res.ok) {
    console.error(`DAM fetch failed: HTTP ${res.status}`)
    return []
  }

  const html = await res.text()

  const found = new Map<string, { min: number; max: number }>()
  for (const match of html.matchAll(TICKER_ITEM)) {
    const name = match[1].trim()
    const min = parseFloat(match[2])
    const max = parseFloat(match[3])
    if (!name || !isFinite(min) || !isFinite(max)) continue
    found.set(name, { min, max })
  }

  if (found.size === 0) {
    console.error("DAM ticker parse: 0 items matched — page layout may have changed")
    return []
  }

  const prices: DamPrice[] = []
  for (const { damName, commodity, unit, multiplier = 1 } of DAM_MAP) {
    const range = found.get(damName)
    if (!range) continue
    const pricePerKg = Math.round(((range.min + range.max) / 2) * multiplier * 100) / 100
    prices.push({ commodity, unit, pricePerKg, sourceName: damName })
  }

  return prices
}

/** Current date in Bangladesh (UTC+6), formatted YYYY-MM-DD. */
export function bdToday(): string {
  return new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString().slice(0, 10)
}
