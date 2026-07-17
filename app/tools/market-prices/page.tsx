"use client"

import { useState, useEffect, useCallback } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { DISTRICTS } from "@/lib/constants/districts"
import { COMMODITIES } from "@/lib/constants/crops"
import { DollarSign, TrendingUp, TrendingDown, Minus, Search, Filter, MapPin, Loader2, RefreshCw, Sparkles, Info } from "lucide-react"
import { formatPrice, formatDate } from "@/lib/utils"

interface PriceRecord {
  id: string; commodity: string; market: string; district: string; price_per_kg: number; date: string
}

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
      const params = new URLSearchParams()
      if (district) params.set("district", district)
      if (commodity) params.set("commodity", commodity)
      if (date) params.set("date", date)
      const response = await fetch(`/api/prices?${params}`)
      if (response.ok) { const data = await response.json(); setPrices(data.prices || []) }
    } catch (err) { console.error("Failed to fetch prices:", err) }
    finally { setLoading(false) }
  }, [district, commodity, date])

  useEffect(() => { fetchPrices() }, [fetchPrices])

  const getTrend = (prices: PriceRecord[], commodity: string) => {
    const commodityPrices = prices.filter((p) => p.commodity === commodity).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    if (commodityPrices.length < 2) return null
    const latest = commodityPrices[0].price_per_kg
    const prev = commodityPrices[1].price_per_kg
    if (latest > prev) return "up"
    if (latest < prev) return "down"
    return "stable"
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(202,138,4,0.05)_0%,transparent_50%)]" />
        <div className="container-cropiq relative py-12 md:py-16">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 rounded-full text-amber-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />{language === "bn" ? "লাইভ ডাটা" : "Live Data"}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                {language === "bn" ? <>লাইভ <span className="text-earth-600">বাজার মূল্য</span> বোর্ড</> : <>Live <span className="text-earth-600">Market Price</span> Board</>}
              </h1>
              <div className="space-y-2">
                <p className="text-gray-600 leading-relaxed">{language === "bn" ? "বাংলাদেশের বিভিন্ন বাজারের পণ্যের দাম দেখুন। বিক্রির আগে সঠিক দাম জানুন।" : "Check real-time commodity prices across Bangladesh markets. Know the fair price before you sell."}</p>
                <p className="text-gray-500 text-sm">{language === "bn" ? "বাংলাদেশের বাজারসমূহের দৈনিক পণ্যমূল্য — এক নজরে" : "Daily commodity prices across Bangladesh — at a glance"}</p>
              </div>
            </div>
            <div className="hidden lg:flex lg:col-span-2 justify-center">
              <div className="relative w-48 h-48"><div className="absolute inset-0 bg-gradient-to-br from-amber-200/60 to-yellow-200/40 rounded-full animate-pulse-gentle" /><div className="absolute inset-6 bg-white rounded-full shadow-lg flex items-center justify-center"><DollarSign className="w-20 h-20 text-earth-500" /></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container-cropiq max-w-4xl">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div><label className="block text-xs font-medium text-gray-500 mb-1.5"><MapPin className="w-3 h-3 inline mr-1" />{t("tools.market.district")}</label><select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 outline-none text-sm"><option value="">{language === "bn" ? "সব জেলা" : "All Districts"}</option>{DISTRICTS.map((d) => <option key={d.name_en} value={d.name_en}>{language === "bn" ? d.name_bn : d.name_en}</option>)}</select></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1.5"><Search className="w-3 h-3 inline mr-1" />{t("tools.market.commodity")}</label><select value={commodity} onChange={(e) => setCommodity(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 outline-none text-sm"><option value="">{language === "bn" ? "সব পণ্য" : "All Commodities"}</option>{COMMODITIES.map((c) => <option key={c.name_en} value={c.name_en}>{language === "bn" ? c.name_bn : c.name_en}</option>)}</select></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1.5"><Filter className="w-3 h-3 inline mr-1" />{t("tools.market.date")}</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 outline-none text-sm" /></div>
            </div>
            <button onClick={fetchPrices} className="text-sm text-leaf-600 hover:text-leaf-700 flex items-center gap-1.5 font-medium"><RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />{language === "bn" ? "রিফ্রেশ করুন" : "Refresh Prices"}</button>
          </div>
        </div>
      </section>

      {/* Data Table */}
      <section className="py-10 bg-gray-50/50">
        <div className="container-cropiq max-w-4xl">
          {loading ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm"><Loader2 className="w-8 h-8 text-leaf-600 animate-spin mx-auto mb-3" /><p className="text-gray-500">{t("general.loading")}</p></div>
          ) : prices.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm"><DollarSign className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">{t("tools.market.noData")}</p></div>
          ) : (
            <>
              <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full"><thead><tr className="bg-gray-50 border-b border-gray-100"><th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{t("tools.market.commodity")}</th><th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{t("tools.market.market")}</th><th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{t("tools.market.district")}</th><th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{t("tools.market.price")}</th><th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{t("tools.market.trend")}</th><th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{t("tools.market.date")}</th></tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {prices.map((p) => {
                    const trend = getTrend(prices, p.commodity)
                    return <tr key={p.id} className="hover:bg-leaf-50/30 transition-colors"><td className="px-4 py-3 text-sm font-medium text-gray-900">{language === "bn" ? COMMODITIES.find((c) => c.name_en === p.commodity)?.name_bn || p.commodity : p.commodity}</td><td className="px-4 py-3 text-sm text-gray-600">{p.market}</td><td className="px-4 py-3 text-sm text-gray-600">{language === "bn" ? DISTRICTS.find((d) => d.name_en === p.district)?.name_bn || p.district : p.district}</td><td className="px-4 py-3 text-sm font-bold text-right text-leaf-700">{formatPrice(p.price_per_kg)}</td><td className="px-4 py-3 text-center">{trend === "up" ? <TrendingUp className="w-4 h-4 text-red-500 inline" /> : trend === "down" ? <TrendingDown className="w-4 h-4 text-leaf-500 inline" /> : <Minus className="w-4 h-4 text-gray-400 inline" />}</td><td className="px-4 py-3 text-sm text-gray-400 text-right">{formatDate(p.date)}</td></tr>
                  })}
                </tbody></table>
              </div>
              <div className="md:hidden space-y-3">{prices.map((p) => { const trend = getTrend(prices, p.commodity); return <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"><div className="flex justify-between items-start mb-2"><div><p className="font-semibold text-gray-900 text-sm">{language === "bn" ? COMMODITIES.find((c) => c.name_en === p.commodity)?.name_bn || p.commodity : p.commodity}</p><p className="text-xs text-gray-400">{p.market} — {p.district}</p></div><div className="text-right"><p className="text-lg font-bold text-leaf-700">{formatPrice(p.price_per_kg)}</p><div className="flex items-center justify-end gap-1">{trend === "up" ? <TrendingUp className="w-3 h-3 text-red-500" /> : trend === "down" ? <TrendingDown className="w-3 h-3 text-leaf-500" /> : <Minus className="w-3 h-3 text-gray-400" />}</div></div></div><p className="text-xs text-gray-400">{formatDate(p.date)}</p></div>})}</div>
            </>
          )}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-amber-50/50 border-t border-amber-100"><div className="container-cropiq"><div className="max-w-3xl mx-auto flex gap-3 text-sm text-amber-800"><Info className="w-5 h-5 shrink-0 mt-0.5" /><div><p className="font-semibold mb-1">{language === "bn" ? "ডিসক্লেইমার" : "Disclaimer"}</p><p className="text-amber-700 leading-relaxed">{language === "bn" ? "মূল্যসমূহ তথ্যমূলক উদ্দেশ্যে। প্রকৃত বাজার মূল্য ভিন্ন হতে পারে।" : "Prices shown are for informational purposes. Actual market prices may vary."}</p></div></div></div></section>
    </div>
  )
}
