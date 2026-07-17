"use client"

import { useState } from "react"
import { DISTRICTS } from "@/lib/constants/districts"
import { COMMODITIES } from "@/lib/constants/crops"
import { DollarSign, TrendingUp, TrendingDown, Minus, Loader2, Search, BarChart3 } from "lucide-react"
import { ToolPageLayout, TOOLS } from "@/components/tools/ToolPageLayout"
import { formatPrice, formatDate } from "@/lib/utils"

interface PriceRecord { id: string; commodity: string; market: string; district: string; price_per_kg: number; date: string }

export default function MarketPricesPage() {
  const [prices, setPrices] = useState<PriceRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [district, setDistrict] = useState("Dhaka")
  const [commodity, setCommodity] = useState("")
  const [date, setDate] = useState("")

  const fetchPrices = async () => {
    setLoading(true); setHasSearched(true)
    try {
      const p = new URLSearchParams()
      if (district) p.set("district", district)
      if (commodity) p.set("commodity", commodity)
      if (date) p.set("date", date)
      const r = await fetch(`/api/prices?${p}`)
      if (r.ok) { const d = await r.json(); setPrices(d.prices || []) } else { setPrices([]) }
    } catch { setPrices([]) }
    finally { setLoading(false) }
  }

  const trend = (px: PriceRecord[], c: string) => {
    const cp = px.filter(x => x.commodity === c).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    if (cp.length < 2) return null
    return cp[0].price_per_kg > cp[1].price_per_kg ? "up" : cp[0].price_per_kg < cp[1].price_per_kg ? "down" : "stable"
  }

  return (
    <ToolPageLayout title="বাজার মূল্য বোর্ড" icon={<BarChart3 className="w-4 h-4 text-white" />} currentIndex={2}>
      <div className="flex flex-col h-full overflow-hidden max-w-lg mx-auto w-full">

        {/* ── Selectors ── */}
        <div className="flex flex-wrap items-end gap-2 mb-3 shrink-0">
          <div className="flex gap-1.5 flex-1 flex-wrap">
            <select value={district} onChange={e => setDistrict(e.target.value)} className="flex-1 min-w-[80px] px-2.5 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 focus:border-amber-400 outline-none bg-white">
              {DISTRICTS.map(d => <option key={d.name_en} value={d.name_en}>{d.name_bn}</option>)}
            </select>
            <select value={commodity} onChange={e => setCommodity(e.target.value)} className="flex-1 min-w-[80px] px-2.5 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 focus:border-amber-400 outline-none bg-white">
              <option value="">সব পণ্য</option>
              {COMMODITIES.map(c => <option key={c.name_en} value={c.name_en}>{c.name_bn}</option>)}
            </select>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="flex-1 min-w-[80px] px-2.5 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 focus:border-amber-400 outline-none bg-white" />
          </div>
          <button onClick={fetchPrices} disabled={loading} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md shadow-amber-200/30 active:scale-95 transition-all disabled:shadow-none flex items-center gap-1.5 shrink-0">
            {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> নিচ্ছে</> : <><Search className="w-3.5 h-3.5" /> দেখুন</>}
          </button>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto">
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
              <div className="text-center">
                <DollarSign className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500">কোন মূল্য তথ্য পাওয়া যায়নি</p>
              </div>
            </div>
          )}

          {hasSearched && !loading && prices.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-extrabold text-gray-700">
                  {DISTRICTS.find(d => d.name_en === district)?.name_bn || district}
                  {commodity && <> · {COMMODITIES.find(c => c.name_en === commodity)?.name_bn || commodity}</>}
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
        </div>
      </div>
    </ToolPageLayout>
  )
}
