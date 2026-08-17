"use client"

import { useState } from "react"
import { DISTRICTS } from "@/lib/constants/districts"
import { COMMODITIES } from "@/lib/constants/crops"
import { DollarSign, TrendingUp, TrendingDown, Minus, Loader2, Search, BarChart3 } from "lucide-react"
import { ToolPageLayout, TOOLS } from "@/components/tools/ToolPageLayout"
import PriceHistoryChart from "@/components/tools/PriceHistoryChart"
import { formatPrice, formatDate, formatDateBN } from "@/lib/utils"

interface PriceRecord { id: string; commodity: string; market: string; district: string; price_per_kg: number; date: string }

export default function MarketPricesPage() {
  const [prices, setPrices] = useState<PriceRecord[]>([])
  const [history, setHistory] = useState<PriceRecord[]>([])
  const [source, setSource] = useState<"dam" | "wfp" | "">("")
  const [updatedAt, setUpdatedAt] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [district, setDistrict] = useState("Dhaka")
  const [commodity, setCommodity] = useState("")
  const [date, setDate] = useState("")

  const NATIONAL_MARKET = "জাতীয় বাজার"
  const districtBn = district === NATIONAL_MARKET
    ? "জাতীয় বাজার (সারাদেশ)"
    : DISTRICTS.find(d => d.name_en === district)?.name_bn || district
  const commodityBn = commodity ? COMMODITIES.find(c => c.name_en === commodity)?.name_bn || commodity : ""

  const fetchPrices = async () => {
    setLoading(true); setHasSearched(true)
    try {
      const p = new URLSearchParams()
      if (district) p.set("district", district)
      if (commodity) p.set("commodity", commodity)
      if (date) p.set("date", date)
      // Price history for the selected commodity (daily rows the refresh job accumulates)
      const historyUrl = commodity
        ? `/api/prices?district=${encodeURIComponent(district)}&commodity=${encodeURIComponent(commodity)}&history=1`
        : null
      const [r, hr] = await Promise.all([
        fetch(`/api/prices?${p}`),
        historyUrl ? fetch(historyUrl) : Promise.resolve(null),
      ])
      if (r.ok) {
        const d = await r.json()
        setPrices(d.prices || [])
        setSource(d.source === "dam" ? "dam" : d.source === "wfp" ? "wfp" : "")
        setUpdatedAt(d.updatedAt || "")
      } else {
        setPrices([])
        setSource("")
        setUpdatedAt("")
      }
      if (historyUrl) {
        if (hr && hr.ok) { const hd = await hr.json(); setHistory(hd.prices || []) } else setHistory([])
      } else {
        setHistory([])
      }
    } catch { setPrices([]); setHistory([]); setSource(""); setUpdatedAt("") }
    finally { setLoading(false) }
  }

  const trend = (px: PriceRecord[], c: string) => {
    const cp = px.filter(x => x.commodity === c).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    if (cp.length < 2) return null
    return cp[0].price_per_kg > cp[1].price_per_kg ? "up" : cp[0].price_per_kg < cp[1].price_per_kg ? "down" : "stable"
  }

  return (
    <ToolPageLayout title="বাজার মূল্য বোর্ড" icon={<BarChart3 className="w-4 h-4 text-white" />} currentIndex={2}>
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden max-w-lg mx-auto w-full pt-2">

        {/* ── Selectors ── */}
        <div className="flex flex-wrap items-end gap-2 mb-3 shrink-0">
          <div className="flex gap-1.5 flex-1 flex-wrap">
            <select value={district} onChange={e => setDistrict(e.target.value)} className="flex-1 min-w-[80px] px-2.5 py-2 rounded-xl border-2 border-gray-100 text-xs font-semibold text-gray-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none bg-white shadow-sm hover:border-amber-200 transition-colors">
              <option value={NATIONAL_MARKET}>জাতীয় বাজার (সারাদেশ)</option>
              {DISTRICTS.map(d => <option key={d.name_en} value={d.name_en}>{d.name_bn}</option>)}
            </select>
            <select value={commodity} onChange={e => setCommodity(e.target.value)} className="flex-1 min-w-[80px] px-2.5 py-2 rounded-xl border-2 border-gray-100 text-xs font-semibold text-gray-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none bg-white shadow-sm hover:border-amber-200 transition-colors">
              <option value="">সব পণ্য</option>
              {COMMODITIES.map(c => <option key={c.name_en} value={c.name_en}>{c.name_bn}</option>)}
            </select>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="flex-1 min-w-[80px] px-2.5 py-2 rounded-xl border-2 border-gray-100 text-xs font-semibold text-gray-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none bg-white shadow-sm hover:border-amber-200 transition-colors" />
          </div>
          <button onClick={fetchPrices} disabled={loading} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md shadow-amber-200/30 active:scale-95 transition-all disabled:shadow-none flex items-center gap-1.5 shrink-0">
            {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> নিচ্ছে</> : <><Search className="w-3.5 h-3.5" /> দেখুন</>}
          </button>
        </div>

        {/* ── Content ── */}
        <div className={`flex-1 ${hasSearched && prices.length > 0 ? 'overflow-y-auto' : 'flex items-center justify-center'}`}>
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
          )}

          {!hasSearched && !loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-xs">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <DollarSign className="w-7 h-7 text-amber-600" />
                </div>
                <h2 className="text-base font-bold text-gray-800 mb-1">বাজার মূল্য দেখুন</h2>
                <p className="text-xs text-gray-500 mb-4">জেলা ও পণ্য সিলেক্ট করে "দেখুন" বাটনে ক্লিক করুন</p>
                <button onClick={fetchPrices} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-amber-200/30 hover:shadow-lg active:scale-95 transition-all">
                  দাম দেখুন
                </button>
              </div>
            </div>
          )}

          {hasSearched && !loading && prices.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-xs px-4">
                <DollarSign className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-600">কোন মূল্য তথ্য পাওয়া যায়নি</p>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">এই এলাকা ও পণ্যের জন্য এখন কোনো তথ্য নেই। অন্য জেলা বা পণ্য বাছাই করে দেখুন।</p>
              </div>
            </div>
          )}

          {hasSearched && !loading && prices.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-extrabold text-gray-700">
                  {districtBn}
                  {commodity && <> · {commodityBn}</>}
                </span>
                <span className="ml-auto text-[10px] font-bold text-amber-500">{prices.length} টি রেকর্ড</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-xs">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                      <th className="text-left px-3 py-2 text-[10px] font-bold text-gray-400 uppercase">পণ্য</th>
                      <th className="text-left px-3 py-2 text-[10px] font-bold text-gray-400 uppercase">বাজার</th>
                      <th className="text-left px-3 py-2 text-[10px] font-bold text-gray-400 uppercase">জেলা</th>
                      <th className="text-right px-3 py-2 text-[10px] font-bold text-gray-400 uppercase">মূল্য</th>
                      <th className="text-center px-3 py-2 text-[10px] font-bold text-gray-400 uppercase">প্রবণতা</th>
                      <th className="text-right px-3 py-2 text-[10px] font-bold text-gray-400 uppercase">তারিখ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {prices.map(p => {
                      const tr = trend(prices, p.commodity)
                      return (
                        <tr key={p.id} className="hover:bg-amber-50/30 transition-colors">
                          <td className="px-3 py-2 font-bold text-gray-900">{COMMODITIES.find(c => c.name_en === p.commodity)?.name_bn || p.commodity}</td>
                          <td className="px-3 py-2 text-gray-600">{p.market}</td>
                          <td className="px-3 py-2 text-gray-500">{DISTRICTS.find(d => d.name_en === p.district)?.name_bn || p.district}</td>
                          <td className="px-3 py-2 font-extrabold text-right text-emerald-600">{formatPrice(p.price_per_kg)}</td>
                          <td className="px-3 py-2 text-center">
                            {tr === "up" ? <TrendingUp className="w-3.5 h-3.5 text-red-500 inline" /> : tr === "down" ? <TrendingDown className="w-3.5 h-3.5 text-green-500 inline" /> : <Minus className="w-3.5 h-3.5 text-gray-300 inline" />}
                          </td>
                          <td className="px-3 py-2 text-[10px] text-gray-400 text-right">{formatDate(p.date)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Price history chart (30 days daily / 12 months monthly) ── */}
          {hasSearched && !loading && prices.length > 0 && commodity && history.length >= 2 && (
            <PriceHistoryChart
              data={history.map(h => ({ date: h.date, price: h.price_per_kg }))}
              commodityBn={commodityBn}
              districtBn={districtBn}
            />
          )}

          {hasSearched && !loading && prices.length > 0 && commodity && history.length === 1 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 text-center">
              <p className="text-xs font-bold text-gray-700">📈 {commodityBn} — দামের ইতিহাস</p>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                এখন পর্যন্ত মাত্র ১টি দামের রেকর্ড আছে। প্রতিটি হালনাগাদে নতুন দাম যোগ হয় — কিছুদিন পর আবার দেখুন।
              </p>
            </div>
          )}
        </div>

        {/* ── Source attribution ── */}
        <div className="shrink-0 pt-2.5 pb-1 text-center">
          {source === "wfp" ? (
            <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
              দামের উৎস: বিশ্ব খাদ্য কর্মসূচি (WFP) — জেলা পর্যায়ের মাসিক বাজারদর (কৃষি বিপণন অধিদপ্তর সূত্রে)
              {updatedAt ? <> · সর্বশেষ আপডেট: {formatDateBN(updatedAt)}</> : null}
            </p>
          ) : source === "dam" ? (
            <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
              দামের উৎস: কৃষি বিপণন অধিদপ্তর (DAM) — জাতীয় দৈনিক বাজারদর
              {updatedAt ? <> · সর্বশেষ আপডেট: {formatDateBN(updatedAt)}</> : null}
            </p>
          ) : null}
        </div>
      </div>
    </ToolPageLayout>
  )
}
