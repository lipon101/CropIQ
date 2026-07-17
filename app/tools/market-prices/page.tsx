"use client"

import { useState, useEffect, useCallback } from "react"
import { DISTRICTS } from "@/lib/constants/districts"
import { COMMODITIES } from "@/lib/constants/crops"
import { DollarSign, TrendingUp, TrendingDown, Minus, Loader2, RefreshCw, BarChart3 } from "lucide-react"
import { ToolPageLayout, TOOLS } from "@/components/tools/ToolPageLayout"
import { formatPrice, formatDate } from "@/lib/utils"

interface PriceRecord { id: string; commodity: string; market: string; district: string; price_per_kg: number; date: string }

export default function MarketPricesPage() {
  const [prices, setPrices] = useState<PriceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [district, setDistrict] = useState("Dhaka")
  const [commodity, setCommodity] = useState("")
  const [date, setDate] = useState("")

  const fetchPrices = useCallback(async () => {
    setLoading(true)
    try { const p = new URLSearchParams(); if (district) p.set("district", district); if (commodity) p.set("commodity", commodity); if (date) p.set("date", date); const r = await fetch(`/api/prices?${p}`); if (r.ok) { const d = await r.json(); setPrices(d.prices || []) } } catch { }
    finally { setLoading(false) }
  }, [district, commodity, date])
  useEffect(() => { fetchPrices() }, [fetchPrices])

  const trend = (px: PriceRecord[], c: string) => { const cp = px.filter(x => x.commodity === c).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); if (cp.length < 2) return null; return cp[0].price_per_kg > cp[1].price_per_kg ? "up" : cp[0].price_per_kg < cp[1].price_per_kg ? "down" : "stable" }

  return (
    <ToolPageLayout
      title="বাজার মূল্য বোর্ড"
      icon={<BarChart3 className="w-4 h-4 text-white" />}
      currentIndex={2}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Filters */}
        <div className="flex flex-wrap items-end gap-2 mb-2 shrink-0">
        <div className="flex gap-2 flex-1 flex-wrap">
          <select value={district} onChange={e => setDistrict(e.target.value)} className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium focus:border-leaf-500 outline-none bg-gray-50">{DISTRICTS.map(d => <option key={d.name_en} value={d.name_en}>{d.name_bn}</option>)}</select>
          <select value={commodity} onChange={e => setCommodity(e.target.value)} className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium focus:border-leaf-500 outline-none bg-gray-50"><option value="">সব পণ্য</option>{COMMODITIES.map(c => <option key={c.name_en} value={c.name_en}>{c.name_bn}</option>)}</select>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium focus:border-leaf-500 outline-none bg-gray-50" />
        </div>
        <button onClick={fetchPrices} className="text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-4 py-2 rounded-xl shadow-md shadow-amber-200/30 flex items-center gap-1.5 transition-all active:scale-95 shrink-0">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />রিফ্রেশ
        </button>
      </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 text-leaf-600 animate-spin" /></div>
          : prices.length === 0 ? <div className="flex items-center justify-center h-full"><div className="text-center"><DollarSign className="w-8 h-8 text-gray-300 mx-auto mb-2" /><p className="text-xs text-gray-500">কোন মূল্য তথ্য নেই</p></div></div>
            : (<div className="p-3"><div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto"><table className="w-full min-w-[580px] text-xs"><thead><tr className="bg-gray-50 border-b border-gray-200"><th className="text-left px-2 py-2 text-[10px] font-bold text-gray-400 uppercase">পণ্য</th><th className="text-left px-2 py-2 text-[10px] font-bold text-gray-400 uppercase">বাজার</th><th className="text-left px-2 py-2 text-[10px] font-bold text-gray-400 uppercase">জেলা</th><th className="text-right px-3 py-2.5 text-[10px] font-bold text-gray-400 uppercase">মূল্য</th><th className="text-center px-3 py-2.5 text-[10px] font-bold text-gray-400 uppercase">প্রবণতা</th><th className="text-right px-3 py-2.5 text-[10px] font-bold text-gray-400 uppercase">তারিখ</th></tr></thead><tbody className="divide-y divide-gray-50">{prices.map(p => { const tr = trend(prices, p.commodity); return <tr key={p.id} className="hover:bg-leaf-50/30"><td className="px-2 py-1.5 font-bold text-gray-900">{COMMODITIES.find(c => c.name_en === p.commodity)?.name_bn || p.commodity}</td><td className="px-2 py-1.5 text-gray-600">{p.market}</td><td className="px-2 py-1.5 text-gray-500">{DISTRICTS.find(d => d.name_en === p.district)?.name_bn || p.district}</td><td className="px-2 py-1.5 font-extrabold text-right text-leaf-700">{formatPrice(p.price_per_kg)}</td><td className="px-2 py-1.5 text-center">{tr === "up" ? <TrendingUp className="w-3 h-3 text-red-500 inline" /> : tr === "down" ? <TrendingDown className="w-3 h-3 text-green-500 inline" /> : <Minus className="w-3 h-3 text-gray-300 inline" />}</td><td className="px-2 py-1.5 text-[10px] text-gray-400 text-right">{formatDate(p.date)}</td></tr> })}</tbody></table></div></div>)}
        </div>
      </div>
    </ToolPageLayout>
  )
}
