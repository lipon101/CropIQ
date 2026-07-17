"use client"

import { useState, useEffect, useCallback } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { DISTRICTS } from "@/lib/constants/districts"
import { COMMODITIES } from "@/lib/constants/crops"
import { DollarSign, TrendingUp, TrendingDown, Minus, Search, Filter, MapPin, Loader2, RefreshCw, Sparkles, Info, Package } from "lucide-react"
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
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50/60 via-white to-yellow-50/40 border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(202,138,4,0.06)_0%,transparent_60%)]" />
        <div className="container-cropiq relative py-12 md:py-16">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 space-y-5 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                {language === "bn" ? "লাইভ ডাটা" : "Live Data"}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                {language === "bn" ? (
                  <>লাইভ <span className="bg-clip-text text-transparent bg-gradient-to-r from-earth-500 to-amber-600">বাজার মূল্য</span> বোর্ড</>
                ) : (
                  <>Live <span className="bg-clip-text text-transparent bg-gradient-to-r from-earth-500 to-amber-600">Market Price</span> Board</>
                )}
              </h1>
              <div className="space-y-2">
                <p className="text-gray-600 leading-relaxed text-lg">
                  {language === "bn"
                    ? "বাংলাদেশের বিভিন্ন বাজারের পণ্যের দাম দেখুন। বিক্রির আগে সঠিক দাম জানুন।"
                    : "Check real-time commodity prices across Bangladesh markets. Know the fair price before you sell."}
                </p>
                <p className="text-gray-500 text-sm">
                  {language === "bn"
                    ? "৩০+ পণ্য · ৬৪ জেলা · দৈনিক হালনাগাদ"
                    : "30+ commodities · 64 districts · Daily updates"}
                </p>
              </div>
            </div>
            <div className="hidden lg:flex lg:col-span-2 justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-300/40 to-yellow-300/30 rounded-full animate-pulse-gentle" />
                <div className="absolute inset-6 bg-white rounded-full shadow-xl flex items-center justify-center">
                  <DollarSign className="w-20 h-20 text-earth-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container-cropiq max-w-5xl">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-premium">
            <div className="grid sm:grid-cols-3 gap-5 mb-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <MapPin className="w-3 h-3 inline mr-1.5" />{t("tools.market.district")}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-leaf-500 focus:ring-4 focus:ring-leaf-50 outline-none transition-all text-sm bg-gray-50/50 font-medium"
                >
                  <option value="">{language === "bn" ? "সব জেলা" : "All Districts"}</option>
                  {DISTRICTS.map((d) => (
                    <option key={d.name_en} value={d.name_en}>
                      {language === "bn" ? d.name_bn : d.name_en}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <Package className="w-3 h-3 inline mr-1.5" />{t("tools.market.commodity")}
                </label>
                <select
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-leaf-500 focus:ring-4 focus:ring-leaf-50 outline-none transition-all text-sm bg-gray-50/50 font-medium"
                >
                  <option value="">{language === "bn" ? "সব পণ্য" : "All Commodities"}</option>
                  {COMMODITIES.map((c) => (
                    <option key={c.name_en} value={c.name_en}>
                      {language === "bn" ? c.name_bn : c.name_en}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <Filter className="w-3 h-3 inline mr-1.5" />{t("tools.market.date")}
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-leaf-500 focus:ring-4 focus:ring-leaf-50 outline-none transition-all text-sm bg-gray-50/50 font-medium"
                />
              </div>
            </div>
            <button onClick={fetchPrices} className="text-sm text-leaf-600 hover:text-leaf-700 flex items-center gap-2 font-bold transition-colors">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {language === "bn" ? "রিফ্রেশ করুন" : "Refresh Prices"}
            </button>
          </div>
        </div>
      </section>

      {/* Data Table */}
      <section className="py-10 bg-gray-50/50">
        <div className="container-cropiq max-w-5xl">
          {loading ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 bg-leaf-200 rounded-full animate-ping opacity-25" />
                <Loader2 className="relative w-16 h-16 text-leaf-600 animate-spin" />
              </div>
              <p className="text-gray-500 font-medium">{t("general.loading")}</p>
            </div>
          ) : prices.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-amber-300" />
              </div>
              <p className="text-gray-500 font-semibold">{t("tools.market.noData")}</p>
              <p className="text-gray-400 text-sm mt-1">
                {language === "bn" ? "অন্য জেলা বা ফসল নির্বাচন করে দেখুন" : "Try selecting a different district or commodity"}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-3xl border border-gray-100 shadow-premium overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                      <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">{t("tools.market.commodity")}</th>
                      <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">{t("tools.market.market")}</th>
                      <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">{t("tools.market.district")}</th>
                      <th className="text-right px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">{t("tools.market.price")}</th>
                      <th className="text-center px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">{t("tools.market.trend")}</th>
                      <th className="text-right px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">{t("tools.market.date")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {prices.map((p) => {
                      const trend = getTrend(prices, p.commodity)
                      return (
                        <tr key={p.id} className="hover:bg-leaf-50/20 transition-colors group">
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">
                            {language === "bn" ? COMMODITIES.find((c) => c.name_en === p.commodity)?.name_bn || p.commodity : p.commodity}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-medium">{p.market}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                            {language === "bn" ? DISTRICTS.find((d) => d.name_en === p.district)?.name_bn || p.district : p.district}
                          </td>
                          <td className="px-6 py-4 text-sm font-extrabold text-right text-leaf-700">
                            {formatPrice(p.price_per_kg)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {trend === "up" ? (
                              <span className="inline-flex items-center gap-1 text-red-600 font-bold text-xs">
                                <TrendingUp className="w-4 h-4" /> {t("tools.market.up")}
                              </span>
                            ) : trend === "down" ? (
                              <span className="inline-flex items-center gap-1 text-green-600 font-bold text-xs">
                                <TrendingDown className="w-4 h-4" /> {t("tools.market.down")}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-gray-400 font-medium text-xs">
                                <Minus className="w-4 h-4" /> {t("tools.market.stable")}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400 text-right font-medium">{formatDate(p.date)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {prices.map((p) => {
                  const trend = getTrend(prices, p.commodity)
                  return (
                    <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-extrabold text-gray-900 text-sm">
                            {language === "bn" ? COMMODITIES.find((c) => c.name_en === p.commodity)?.name_bn || p.commodity : p.commodity}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{p.market} — {language === "bn" ? DISTRICTS.find((d) => d.name_en === p.district)?.name_bn || p.district : p.district}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-extrabold text-leaf-700">{formatPrice(p.price_per_kg)}</p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            {trend === "up" ? <TrendingUp className="w-3.5 h-3.5 text-red-500" /> : trend === "down" ? <TrendingDown className="w-3.5 h-3.5 text-green-500" /> : <Minus className="w-3.5 h-3.5 text-gray-400" />}
                            <span className="text-[11px] font-semibold text-gray-500">{t("tools.market.trend")}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400">{formatDate(p.date)}</p>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-amber-50/50 border-t border-amber-100">
        <div className="container-cropiq">
          <div className="max-w-3xl mx-auto flex gap-3 text-sm text-amber-800">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">{language === "bn" ? "ডিসক্লেইমার" : "Disclaimer"}</p>
              <p className="text-amber-700 leading-relaxed">
                {language === "bn"
                  ? "মূল্যসমূহ তথ্যমূলক উদ্দেশ্যে। প্রকৃত বাজার মূল্য ভিন্ন হতে পারে।"
                  : "Prices shown are for informational purposes. Actual market prices may vary."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
