"use client"

import { useState, useEffect, useCallback } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { DISTRICTS } from "@/lib/constants/districts"
import { COMMODITIES } from "@/lib/constants/crops"
import { DollarSign, TrendingUp, TrendingDown, Minus, Loader2, RefreshCw } from "lucide-react"
import { formatPrice, formatDate } from "@/lib/utils"

interface PriceRecord { id: string; commodity: string; market: string; district: string; price_per_kg: number; date: string }

export default function MarketPricesPage() {
  const { t, language } = useLanguage()
  const [prices, setPrices] = useState<PriceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [district, setDistrict] = useState("Dhaka")
  const [commodity, setCommodity] = useState("")
  const [date, setDate] = useState("")

  const fetchPrices = useCallback(async () => {
    setLoading(true)
    try {
      const p = new URLSearchParams()
      if (district) p.set("district", district)
      if (commodity) p.set("commodity", commodity)
      if (date) p.set("date", date)
      const r = await fetch(`/api/prices?${p}`)
      if (r.ok) { const d = await r.json(); setPrices(d.prices || []) }
    } catch {} finally { setLoading(false) }
  }, [district, commodity, date])
  useEffect(() => { fetchPrices() }, [fetchPrices])

  const getTrend = (px: PriceRecord[], c: string) => {
    const cp = px.filter(x => x.commodity === c).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    if (cp.length < 2) return null
    return cp[0].price_per_kg > cp[1].price_per_kg ? "up" : cp[0].price_per_kg < cp[1].price_per_kg ? "down" : "stable"
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm"><DollarSign className="w-4.5 h-4.5 text-white"/></div>
        <div className="flex-1"><h1 className="font-bold text-gray-900 text-sm">{language==="bn"?"লাইভ বাজার মূল্য":"Live Market Prices"}</h1><p className="text-[11px] text-gray-400">{language==="bn"?"বাংলাদেশের বাজার দর":"Bangladesh market rates"}</p></div>
        <button onClick={fetchPrices} className="text-xs font-medium text-leaf-600 hover:text-leaf-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-leaf-50"><RefreshCw className={`w-3.5 h-3.5 ${loading?"animate-spin":""}`}/>{language==="bn"?"রিফ্রেশ":"Refresh"}</button>
      </div>

      <div className="bg-white border-b border-gray-100 px-4 py-2.5 shrink-0">
        <div className="grid grid-cols-3 gap-2.5 max-w-3xl">
          <select value={district} onChange={e=>setDistrict(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium focus:border-leaf-500 focus:ring-2 focus:ring-leaf-50 outline-none bg-gray-50">{DISTRICTS.map(d=><option key={d.name_en} value={d.name_en}>{language==="bn"?d.name_bn:d.name_en}</option>)}</select>
          <select value={commodity} onChange={e=>setCommodity(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium focus:border-leaf-500 focus:ring-2 focus:ring-leaf-50 outline-none bg-gray-50"><option value="">{language==="bn"?"সব পণ্য":"All"}</option>{COMMODITIES.map(c=><option key={c.name_en} value={c.name_en}>{language==="bn"?c.name_bn:c.name_en}</option>)}</select>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium focus:border-leaf-500 focus:ring-2 focus:ring-leaf-50 outline-none bg-gray-50"/>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 text-leaf-600 animate-spin"/></div>
        : prices.length === 0 ? <div className="flex items-center justify-center h-full"><div className="text-center"><DollarSign className="w-10 h-10 text-gray-300 mx-auto mb-3"/><p className="text-gray-500 text-sm font-medium">{t("tools.market.noData")}</p></div></div>
        : (
          <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead><tr className="bg-gray-50 border-b border-gray-200"><th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase">{t("tools.market.commodity")}</th><th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase">{t("tools.market.market")}</th><th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase">{t("tools.market.district")}</th><th className="text-right px-4 py-3 text-[11px] font-bold text-gray-400 uppercase">{t("tools.market.price")}</th><th className="text-center px-4 py-3 text-[11px] font-bold text-gray-400 uppercase">TREND</th><th className="text-right px-4 py-3 text-[11px] font-bold text-gray-400 uppercase">{t("tools.market.date")}</th></tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {prices.map(p => { const tr = getTrend(prices, p.commodity)
                    return <tr key={p.id} className="hover:bg-leaf-50/20 transition-colors"><td className="px-4 py-3 text-xs font-bold text-gray-900">{language==="bn"?COMMODITIES.find(c=>c.name_en===p.commodity)?.name_bn||p.commodity:p.commodity}</td><td className="px-4 py-3 text-xs text-gray-600">{p.market}</td><td className="px-4 py-3 text-xs text-gray-600">{language==="bn"?DISTRICTS.find(d=>d.name_en===p.district)?.name_bn||p.district:p.district}</td><td className="px-4 py-3 text-xs font-extrabold text-right text-leaf-700">{formatPrice(p.price_per_kg)}</td><td className="px-4 py-3 text-center">{tr==="up"?<span className="inline-flex items-center gap-1 text-red-600 font-bold text-[11px]"><TrendingUp className="w-3.5 h-3.5"/></span>:tr==="down"?<span className="inline-flex items-center gap-1 text-green-600 font-bold text-[11px]"><TrendingDown className="w-3.5 h-3.5"/></span>:<Minus className="w-3.5 h-3.5 text-gray-300 inline"/>}</td><td className="px-4 py-3 text-[11px] text-gray-400 text-right">{formatDate(p.date)}</td></tr>
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
