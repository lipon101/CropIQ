"use client"

import { useState, useEffect, useCallback } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { DISTRICTS } from "@/lib/constants/districts"
import { COMMODITIES } from "@/lib/constants/crops"
import { DollarSign, TrendingUp, TrendingDown, Minus, Search, Filter, MapPin, Loader2, RefreshCw } from "lucide-react"
import { formatPrice, formatDate } from "@/lib/utils"

interface PriceRecord {
  id: string
  commodity: string
  market: string
  district: string
  price_per_kg: number
  date: string
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
      if (response.ok) {
        const data = await response.json()
        setPrices(data.prices || [])
      }
    } catch (err) {
      console.error("Failed to fetch prices:", err)
    } finally {
      setLoading(false)
    }
  }, [district, commodity, date])

  useEffect(() => {
    fetchPrices()
  }, [fetchPrices])

  const getTrend = (prices: PriceRecord[], commodity: string) => {
    const commodityPrices = prices
      .filter((p) => p.commodity === commodity)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    if (commodityPrices.length < 2) return null
    const latest = commodityPrices[0].price_per_kg
    const prev = commodityPrices[1].price_per_kg
    if (latest > prev) return "up"
    if (latest < prev) return "down"
    return "stable"
  }

  return (
    <div className="container-cropiq py-8 md:py-12 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-earth-100 rounded-2xl mb-4">
          <DollarSign className="w-7 h-7 text-earth-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t("tools.market.title")}</h1>
        <p className="text-gray-500 mt-2">{t("tools.market.subtitle")}</p>
      </div>

      {/* Filters */}
      <div className="card-cropiq mb-6">
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {t("tools.market.district")}
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="input-field text-sm"
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
            <label className="block text-xs text-gray-400 mb-1 flex items-center gap-1">
              <Search className="w-3 h-3" /> {t("tools.market.commodity")}
            </label>
            <select
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              className="input-field text-sm"
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
            <label className="block text-xs text-gray-400 mb-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> {t("tools.market.date")}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field text-sm"
            />
          </div>
        </div>
        <button
          onClick={fetchPrices}
          className="mt-3 text-sm text-leaf-600 hover:text-leaf-700 flex items-center gap-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          {language === "bn" ? "রিফ্রেশ করুন" : "Refresh"}
        </button>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 text-leaf-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500">{t("general.loading")}</p>
        </div>
      ) : prices.length === 0 ? (
        <div className="text-center py-12 card-cropiq">
          <DollarSign className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t("tools.market.noData")}</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block card-cropiq overflow-hidden !p-0">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{t("tools.market.commodity")}</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{t("tools.market.market")}</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{t("tools.market.district")}</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{t("tools.market.price")}</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{t("tools.market.trend")}</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{t("tools.market.date")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {prices.map((p) => {
                  const trend = getTrend(prices, p.commodity)
                  return (
                    <tr key={p.id} className="hover:bg-leaf-50/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {language === "bn"
                          ? COMMODITIES.find((c) => c.name_en === p.commodity)?.name_bn || p.commodity
                          : p.commodity}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.market}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {language === "bn"
                          ? DISTRICTS.find((d) => d.name_en === p.district)?.name_bn || p.district
                          : p.district}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-right text-leaf-700">{formatPrice(p.price_per_kg)}</td>
                      <td className="px-4 py-3 text-center">
                        {trend === "up" && <TrendingUp className="w-4 h-4 text-red-500 inline" />}
                        {trend === "down" && <TrendingDown className="w-4 h-4 text-leaf-500 inline" />}
                        {trend === "stable" && <Minus className="w-4 h-4 text-gray-400 inline" />}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 text-right">{formatDate(p.date)}</td>
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
                <div key={p.id} className="card-cropiq">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {language === "bn"
                          ? COMMODITIES.find((c) => c.name_en === p.commodity)?.name_bn || p.commodity
                          : p.commodity}
                      </p>
                      <p className="text-xs text-gray-400">{p.market} — {p.district}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-leaf-700">{formatPrice(p.price_per_kg)}</p>
                      <div className="flex items-center justify-end gap-1">
                        {trend === "up" && <TrendingUp className="w-3 h-3 text-red-500" />}
                        {trend === "down" && <TrendingDown className="w-3 h-3 text-leaf-500" />}
                        {trend === "stable" && <Minus className="w-3 h-3 text-gray-400" />}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">{formatDate(p.date)}</p>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
