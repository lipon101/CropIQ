/**
 * WFP (World Food Programme) — Bangladesh district-level price scraper.
 *
 * Source: the WFP price database mirror published on HDX (Humanitarian Data
 * Exchange): https://data.humdata.org/dataset/wfp-food-prices-for-bangladesh
 *
 * A single ~4.5MB CSV holds ~34k monthly retail/wholesale observations across
 * 152 markets in 62 of Bangladesh's 64 districts, updated monthly and sourced
 * in part from DAM itself. This is the closest thing to a working
 * per-district DAM report: DAM's own district report is a legacy JSP/BIRT
 * backend that is unreachable from outside Bangladesh and whose
 * division → district AJAX cascade fails server-side, so we aggregate the WFP
 * market observations per district instead.
 *
 * The refresh job calls fetchWfpPrices() and stores the result in Supabase,
 * dated with the observation month (WFP publishes ~mid-month), so the board's
 * district filter shows REAL per-district prices while the DAM national
 * ticker still provides the fresh daily national averages.
 */

const WFP_CSV_URL =
  "https://data.humdata.org/dataset/c76eabb7-fdb5-43b7-a5c4-09091bb8acde/resource/966ab7ac-56d6-4dac-8eba-dfe815d59a52/download/wfp_food_prices_bgd.csv"

export interface WfpPrice {
  /** App district name_en (normalized from WFP's admin2). */
  district: string
  /** App commodity name_en (matches COMMODITIES[].name_en so Bengali labels show). */
  commodity: string
  /** Display unit for the app's price board. */
  unit: string
  /** Average retail price across the district's markets, in taka. */
  pricePerKg: number
  /** Most common market name in the district, kept for the board's বাজার column. */
  market: string
  /** Observation date of the price (WFP publishes monthly, ~mid-month). */
  date: string
  /** Original WFP commodity name, kept for debugging. */
  sourceName: string
}

/** WFP admin2 name → app district name_en (only the ~9 that differ). */
const DISTRICT_MAP: Record<string, string> = {
  Brahamanbaria: "Brahmanbaria",
  Barisal: "Barishal",
  Chittagong: "Chattogram",
  "Cox'S Bazar": "Cox's Bazar",
  Jessore: "Jashore",
  Jhalokati: "Jhalokathi",
  Maulvibazar: "Moulvibazar",
  Nawabganj: "Chapainawabganj",
  Netrakona: "Netrokona",
}

/**
 * WFP commodity name → app commodity.
 * Only commodities the app's COMMODITIES list knows are mapped, so the price
 * board keeps its Bengali labels and district/commodity filters.
 *
 * Unit notes:
 *  - WFP sells eggs and bananas per piece, so ×12 converts to the app's
 *    "dozen" unit (Egg (Farm), Banana).
 */
const COMMODITY_MAP: { wfpName: string; commodity: string; unit: string; multiplier?: number }[] = [
  { wfpName: "Wheat flour", commodity: "Wheat Flour", unit: "kg" },
  { wfpName: "Potatoes (Holland, white)", commodity: "Potato", unit: "kg" },
  { wfpName: "Onions (imported, China)", commodity: "Onion (Imported)", unit: "kg" },
  { wfpName: "Garlic (imported, China)", commodity: "Garlic", unit: "kg" },
  { wfpName: "Chili (green)", commodity: "Green Chili", unit: "kg" },
  { wfpName: "Lentils (masur)", commodity: "Lentil (Local)", unit: "kg" },
  { wfpName: "Bananas (ripe)", commodity: "Banana", unit: "dozen", multiplier: 12 },
  { wfpName: "Papaya (green)", commodity: "Papaya", unit: "kg" },
  { wfpName: "Eggs (brown)", commodity: "Egg (Farm)", unit: "dozen", multiplier: 12 },
  { wfpName: "Meat (chicken, broiler)", commodity: "Chicken (Broiler)", unit: "kg" },
  { wfpName: "Milk (cow, pasteurized)", commodity: "Milk", unit: "liter" },
  { wfpName: "Sugar", commodity: "Sugar", unit: "kg" },
  { wfpName: "Oil (soybean, fortified)", commodity: "Soybean Oil", unit: "liter" },
  { wfpName: "Oil (palm)", commodity: "Palm Oil", unit: "liter" },
  { wfpName: "Rice (coarse)", commodity: "Rice (Atop)", unit: "kg" },
  { wfpName: "Fish (live, pangasius)", commodity: "Fish (Pangasius)", unit: "kg" },
  { wfpName: "Snake gourd", commodity: "Snake Gourd", unit: "kg" },
  { wfpName: "Gourd (bottle)", commodity: "Bottle Gourd", unit: "pcs" },
  { wfpName: "Spinach (malabar)", commodity: "Spinach", unit: "kg" },
  { wfpName: "Spinach (red)", commodity: "Spinach", unit: "kg" },
]

const COMMODITY_BY_WFP = new Map(COMMODITY_MAP.map((m) => [m.wfpName, m]))

/** Dependency-free RFC-4180-ish CSV parser (handles quoted fields/commas). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else inQuotes = false
      } else field += c
    } else if (c === '"') inQuotes = true
    else if (c === ",") {
      row.push(field)
      field = ""
    } else if (c === "\n") {
      row.push(field)
      rows.push(row)
      row = []
      field = ""
    } else if (c !== "\r") field += c
  }
  if (field !== "" || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

// The CSV is ~4.5MB — cache the parsed rows briefly so the stale-data guard
// (which may fire every 30 min while a source is down) doesn't re-download it.
let csvCache: { fetchedAt: number; rows: Record<string, string>[] } | null = null
const CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6 hours

async function fetchWfpRows(): Promise<Record<string, string>[]> {
  if (csvCache && Date.now() - csvCache.fetchedAt < CACHE_TTL_MS) return csvCache.rows

  let res: Response
  try {
    res = await fetch(WFP_CSV_URL, {
      cache: "no-store",
      headers: { "User-Agent": "Mozilla/5.0 (CropIQ market-price refresh bot)" },
      signal: AbortSignal.timeout(30000),
    })
  } catch {
    console.error("WFP fetch failed (network/timeout)")
    return []
  }
  if (!res.ok) {
    console.error(`WFP fetch failed: HTTP ${res.status}`)
    return []
  }

  const text = await res.text()
  const parsed = parseCsv(text)
  if (parsed.length < 2) {
    console.error("WFP CSV parse: no rows — file format may have changed")
    return []
  }

  const header = parsed[0].map((h) => h.trim())
  const idx: Record<string, number> = {}
  header.forEach((h, i) => (idx[h] = i))
  const required = ["date", "admin2", "market", "commodity", "unit", "pricetype", "currency", "price", "priceflag"]
  if (!required.every((r) => idx[r] != null)) {
    console.error("WFP CSV parse: missing expected columns", header)
    return []
  }

  const rows = parsed.slice(1).map((cells) => {
    const r: Record<string, string> = {}
    header.forEach((h, i) => (r[h] = (cells[i] ?? "").trim()))
    return r
  })

  csvCache = { fetchedAt: Date.now(), rows }
  return rows
}

/**
 * Fetch the latest month's district-level retail prices from WFP.
 * Returns [] when the source is unreachable or unparseable — callers should
 * keep whatever data they already have instead of treating this as an error.
 */
export async function fetchWfpPrices(): Promise<WfpPrice[]> {
  const rows = await fetchWfpRows()
  if (rows.length === 0) return []

  let latest = ""
  for (const r of rows) if (r.date > latest) latest = r.date
  if (!latest) {
    console.error("WFP CSV parse: no dates found")
    return []
  }

  // Aggregate per (district, commodity): mean price across the district's
  // markets, plus the most common market name for the board's বাজার column.
  const groups = new Map<string, { meta: (typeof COMMODITY_MAP)[number]; total: number; count: number; markets: Map<string, number> }>()
  for (const r of rows) {
    if (r.date !== latest) continue
    if (r.pricetype !== "Retail") continue
    if (r.priceflag && r.priceflag !== "actual") continue
    if (r.currency !== "BDT") continue

    const meta = COMMODITY_BY_WFP.get(r.commodity)
    if (!meta) continue
    const district = DISTRICT_MAP[r.admin2] ?? r.admin2
    const price = parseFloat(r.price)
    if (!isFinite(price) || price <= 0) continue

    const key = `${district}\u0000${meta.commodity}`
    let g = groups.get(key)
    if (!g) {
      g = { meta, total: 0, count: 0, markets: new Map() }
      groups.set(key, g)
    }
    g.total += price
    g.count++
    g.markets.set(r.market, (g.markets.get(r.market) ?? 0) + 1)
  }

  const prices: WfpPrice[] = []
  for (const [key, g] of groups.entries()) {
    const sep = key.indexOf("\u0000")
    const market = [...g.markets.entries()].sort((a, b) => b[1] - a[1])[0][0]
    prices.push({
      district: key.slice(0, sep),
      commodity: key.slice(sep + 1),
      unit: g.meta.unit,
      pricePerKg: Math.round(((g.total / g.count) * (g.meta.multiplier ?? 1)) * 100) / 100,
      market,
      date: latest,
      sourceName: g.meta.wfpName,
    })
  }

  return prices
}
