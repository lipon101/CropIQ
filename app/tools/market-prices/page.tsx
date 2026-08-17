"use client"

import { useState, useMemo } from "react"
import { DISTRICTS } from "@/lib/constants/districts"
import { COMMODITIES } from "@/lib/constants/crops"
import { Loader2, Search, MapPin, Store, CalendarDays, Sprout, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { ToolPageLayout } from "@/components/tools/ToolPageLayout"
import PriceHistoryChart from "@/components/tools/PriceHistoryChart"
import { formatPrice, formatDateBN } from "@/lib/utils"

interface PriceRecord {
  id: string
  commodity: string
  market: string
  district: string
  price_per_kg: number
  unit?: string
  date: string
}

// Product emoji for a friendly, modern card look (falls back to 🌾)
const PRODUCT_EMOJI: Record<string, string> = {
  "Rice (Atop)": "🍚", "Rice (Miniket)": "🍚", "Rice (Nazirshail)": "🍚",
  "Wheat Flour": "🌾", "Potato": "🥔", "Onion (Local)": "🧅", "Onion (Imported)": "🧅",
  "Garlic": "🧄", "Green Chili": "🌶️", "Dried Chili": "🌶️", "Ginger": "🫚", "Turmeric": "🟡",
  "Lentil (Local)": "🫘", "Eggplant": "🍆", "Tomato": "🍅", "Cabbage": "🥬", "Cauliflower": "🥦",
  "Okra": "🌿", "Pumpkin": "🎃", "Bitter Gourd": "🥒", "Ridge Gourd": "🥒", "Cucumber": "🥒",
  "Banana": "🍌", "Mango": "🥭", "Papaya": "🧡", "Egg (Farm)": "🥚", "Chicken (Broiler)": "🍗",
  "Beef": "🥩", "Fish (Rui)": "🐟", "Milk": "🥛", "Sugar": "🍬", "Soybean Oil": "🛢️", "Palm Oil": "🛢️",
  "Rice (Aman Medium)": "🍚", "Rice (Aman Coarse)": "🍚", "Rice (Boro Medium)": "🍚", "Rice (Boro Coarse)": "🍚",
  "Garlic (Imported)": "🧄", "Ginger (Imported)": "🫚", "Iodized Salt": "🧂", "Mung": "🫘",
  "Gram (Chhola)": "🫘", "Soybean": "🫛", "Mutton": "🍖", "Fish (Pangasius)": "🐟",
  "Spinach": "🥬", "Snake Gourd": "🥒", "Bottle Gourd": "🎃",
}

const UNIT_BN: Record<string, string> = {
  kg: "প্রতি কেজি", dozen: "প্রতি ডজন", liter: "প্রতি লিটার", pcs: "প্রতি পিস",
}

export default function MarketPricesPage() {
  const [prices, setPrices] = useState<PriceRecord[]>([])
  const [history, setHistory] = useState<PriceRecord[]>([])
  const [source, setSource] = useState<"dam" | "wfp" | "">("")
  const [updatedAt, setUpdatedAt] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [district, setDistrict] = useState("জাতীয় বাজার")
  const [commodity, setCommodity] = useState("")
  const [error, setError] = useState("")
  const [page, setPage] = useState(0)

  const NATIONAL_MARKET = "জাতীয় বাজার"
  const isNational = district === NATIONAL_MARKET

  const districtBn = isNational
    ? "জাতীয় বাজার (সারাদেশ)"
    : DISTRICTS.find(d => d.name_en === district)?.name_bn || district
  const commodityBn = commodity ? COMMODITIES.find(c => c.name_en === commodity)?.name_bn || commodity : ""

  const fetchPrices = async () => {
    setLoading(true); setHasSearched(true); setError(""); setPage(0)
    try {
      const p = new URLSearchParams()
      if (district) p.set("district", district)
      if (commodity) p.set("commodity", commodity)
      const historyUrl = commodity
        ? `/api/prices?district=${encodeURIComponent(district)}&commodity=${encodeURIComponent(commodity)}&history=1`
        : null
      const [r, hr] = await Promise.all([
        fetch(`/api/prices?${p}`),
        historyUrl ? fetch(historyUrl) : Promise.resolve(null),
      ])
      const d = r.ok ? await r.json() : { prices: [], source: "", updatedAt: "" }
      setPrices(d.prices || [])
      setSource(d.source === "dam" ? "dam" : d.source === "wfp" ? "wfp" : "")
      setUpdatedAt(d.updatedAt || "")
      if (r.status === 429 || (r.status >= 500 && d.prices.length === 0)) setError("দামের উৎসে পৌঁছানো যায়নি — একটু পরে আবার চেষ্টা করুন।")
      if (historyUrl && hr && hr.ok) {
        const hd = await hr.json()
        setHistory(hd.prices || [])
      } else setHistory([])
    } catch {
      setPrices([]); setHistory([]); setSource(""); setUpdatedAt("")
      setError("দামের উৎসে পৌঁছানো যায়নি — ইন্টারনেট সংযোগ দেখুন।")
    } finally { setLoading(false) }
  }

  const downloadCsv = () => {
    if (prices.length === 0) return
    const rows = [
      ["পণ্য", "বাজার", "জেলা", "খুচরা মূল্য (টাকা)", "একক", "তারিখ"],
      ...prices.map(p => [
        COMMODITIES.find(c => c.name_en === p.commodity)?.name_bn || p.commodity,
        p.market,
        DISTRICTS.find(d => d.name_en === p.district)?.name_bn || p.district,
        p.price_per_kg.toFixed(2),
        p.unit || "kg",
        p.date,
      ]),
    ]
    const csv = "\uFEFF" + rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `cropiq-prices-${(district === NATIONAL_MARKET ? "sara-desh" : district).toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Sort prices: highest to lowest for a clear "top item" feel
  const sorted = useMemo(() => [...prices].sort((a, b) => b.price_per_kg - a.price_per_kg), [prices])

  // Pagination: 6 per page with prev/next navigation
  const PAGE_SIZE = 6
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages - 1)
  const pageItems = sorted.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  return (
    <ToolPageLayout title="বাজার মূল্য বোর্ড" icon={<Sprout className="w-4 h-4 text-white" />} currentIndex={2}>
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden max-w-2xl mx-auto w-full pt-1">

        {/* ── Selectors ── */}
        <div className="flex flex-col gap-2 mb-4 shrink-0">
          <div className="flex gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[130px]">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select value={district} onChange={e => setDistrict(e.target.value)} className="w-full pl-9 pr-8 py-2.5 rounded-2xl border-2 border-gray-100 text-sm font-semibold text-gray-700 focus:border-amber-400 outline-none bg-white shadow-sm hover:border-amber-200 transition-colors appearance-none">
                <option value={NATIONAL_MARKET}>জাতীয় বাজার (সারাদেশ)</option>
                {DISTRICTS.map(d => <option key={d.name_en} value={d.name_en}>{d.name_bn}</option>)}
              </select>
            </div>
            <div className="relative flex-1 min-w-[130px]">
              <Store className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select value={commodity} onChange={e => setCommodity(e.target.value)} className="w-full pl-9 pr-8 py-2.5 rounded-2xl border-2 border-gray-100 text-sm font-semibold text-gray-700 focus:border-amber-400 outline-none bg-white shadow-sm hover:border-amber-200 transition-colors appearance-none">
                <option value="">সব পণ্য</option>
                {COMMODITIES.map(c => <option key={c.name_en} value={c.name_en}>{c.name_bn}</option>)}
              </select>
            </div>
          </div>
          <button onClick={fetchPrices} disabled={loading} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-3 rounded-2xl text-sm font-bold shadow-md shadow-amber-200/40 active:scale-[0.99] transition-all disabled:shadow-none flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> দাম নিচ্ছে…</> : <><Search className="w-4 h-4" /> বাজারদর দেখুন</>}
          </button>
        </div>

        {/* ── Content ── */}
        <div className={`flex-1 ${hasSearched && prices.length > 0 ? 'overflow-y-auto' : 'flex items-center justify-center'}`}>

          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-xs text-gray-400">সর্বশেষ বাজারদর নেওয়া হচ্ছে…</p>
            </div>
          )}

          {!hasSearched && !loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-xs">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-3xl">🌾</div>
                <h2 className="text-lg font-bold text-gray-800 mb-1">বাজার মূল্য দেখুন</h2>
                <p className="text-sm text-gray-500 mb-5">জেলা ও পণ্য সিলেক্ট করে দেখুন বাংলাদেশের সর্বশেষ বাজারদর</p>
                <button onClick={fetchPrices} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-md shadow-amber-200/40 hover:shadow-lg active:scale-95 transition-all">দাম দেখুন</button>
              </div>
            </div>
          )}

          {hasSearched && !loading && prices.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-xs px-4">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-sm font-semibold text-gray-700">কোন মূল্য তথ্য পাওয়া যায়নি</p>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{error || "এই এলাকা ও পণ্যের জন্য এখন কোনো তথ্য নেই। অন্য জেলা বা পণ্য বাছাই করে দেখুন।"}</p>
              </div>
            </div>
          )}

          {hasSearched && !loading && prices.length > 0 && (
            <div className="space-y-3 pb-2">
              {/* ── Header summary ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-sm font-extrabold text-gray-800">{districtBn}</h3>
                  {commodity && <span className="text-sm font-bold text-amber-600">· {commodityBn}</span>}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    খুচরা মূল্য
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>সর্বশেষ আপডেট: {updatedAt ? formatDateBN(updatedAt) : "—"}</span>
                  <span className="text-gray-300">|</span>
                  <span className="font-semibold text-gray-500">{prices.length} টি পণ্য</span>
                  <button onClick={downloadCsv} className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 text-[11px] font-bold transition-colors">
                    <Download className="w-3.5 h-3.5" /> CSV ডাউনলোড
                  </button>
                </div>

              </div>

              {/* ── Product cards ── */}
              <div className="grid grid-cols-1 gap-2">
                {pageItems.map(p => {
                  const bengali = COMMODITIES.find(c => c.name_en === p.commodity)?.name_bn || p.commodity
                  const unitBn = UNIT_BN[p.unit || "kg"] || "প্রতি কেজি"
                  const isDaily = p.id.startsWith("dam-")
                  const periodLabel = isDaily ? "আজকের দাম" : "মাসিক দাম"
                  const periodStyle = isDaily
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-sky-50 text-sky-700 border-sky-200"
                  return (
                    <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all px-4 py-3 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center text-xl shrink-0">
                        {PRODUCT_EMOJI[p.commodity] || "🌾"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-gray-800 truncate">{bengali}</p>
                          <span className={`inline-flex items-center px-1.5 py-px rounded-full border text-[9px] font-bold shrink-0 ${periodStyle}`}>{periodLabel}</span>
                        </div>
                        <p className="text-[11px] text-gray-400 truncate">
                          {isNational ? unitBn : `${p.market} · ${unitBn}`}
                        </p>
                        <p className="text-[10px] text-gray-300 mt-0.5">{formatDateBN(p.date)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-base font-extrabold text-emerald-600">{formatPrice(p.price_per_kg)}</p>
                        <p className="text-[10px] text-gray-300 font-semibold">{unitBn}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={safePage === 0}
                    className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-amber-50 hover:border-amber-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                    aria-label="আগের পেজ"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        i === safePage
                          ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-200/40"
                          : "bg-white border border-gray-200 text-gray-500 hover:bg-amber-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={safePage === totalPages - 1}
                    className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-amber-50 hover:border-amber-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                    aria-label="পরের পেজ"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Price history chart ── */}
          {hasSearched && !loading && prices.length > 0 && commodity && history.length >= 2 && (
            <PriceHistoryChart data={history.map(h => ({ date: h.date, price: h.price_per_kg }))} commodityBn={commodityBn} districtBn={districtBn} />
          )}
          {hasSearched && !loading && prices.length > 0 && commodity && history.length === 1 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 text-center mt-3">
              <p className="text-xs font-bold text-gray-700">📈 {commodityBn} — দামের ইতিহাস</p>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">এখন পর্যন্ত মাত্র ১টি রেকর্ড আছে — পরবর্তী হালনাগাদে ইতিহাস দেখাবে।</p>
            </div>
          )}
        </div>

        {/* ── Source attribution (removed — no sources shown) ── */}
      </div>
    </ToolPageLayout>
  )
}
