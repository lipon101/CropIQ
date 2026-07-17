"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { DISTRICTS } from "@/lib/constants/districts"
import { CROPS } from "@/lib/constants/crops"
import {
  CloudSun, CloudRain, Wind, Droplets, Thermometer, Sun, Cloud,
  Loader2, MapPin, Leaf, AlertTriangle, ChevronRight, RefreshCw,
  Sparkles, Info, Lightbulb, Sprout
} from "lucide-react"

interface ForecastDay {
  date: string
  temp_min: number
  temp_max: number
  humidity: number
  rain_mm: number
  wind_kmh: number
  description: string
  icon: string
}

interface WeatherData {
  district: string
  current: { temp: number; humidity: number; description: string; icon: string; wind_kmh: number }
  forecast: ForecastDay[]
}

const WEATHER_ICONS: Record<string, string> = {
  "01d": "☀️", "01n": "🌙", "02d": "⛅", "02n": "☁️",
  "03d": "☁️", "03n": "☁️", "04d": "☁️", "04n": "☁️",
  "09d": "🌧️", "09n": "🌧️", "10d": "🌦️", "10n": "🌧️",
  "11d": "⛈️", "11n": "⛈️", "13d": "🌨️", "13n": "🌨️",
  "50d": "🌫️", "50n": "🌫️",
}

export default function WeatherAdvisoryPage() {
  const { t, language } = useLanguage()
  const [district, setDistrict] = useState("Dhaka")
  const [crop, setCrop] = useState("Rice")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [advisory, setAdvisory] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchWeatherAndAdvisory = async () => {
    setLoading(true)
    setError("")
    setAdvisory("")
    try {
      const wRes = await fetch(`/api/weather?district=${encodeURIComponent(district)}`)
      if (!wRes.ok) throw new Error("Weather fetch failed")
      const wData = await wRes.json()
      setWeather(wData)

      const aRes = await fetch("/api/advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ district, crop, forecast: wData.forecast, language }),
      })
      if (aRes.ok) {
        const aData = await aRes.json()
        setAdvisory(aData.advisory)
      }
    } catch (err: any) {
      setError(err.message || (language === "bn" ? "আবহাওয়া তথ্য পাওয়া যায়নি" : "Could not fetch weather data"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* ─── Tool Hero ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50/50 border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.06)_0%,transparent_50%)]" />
        <div className="container-cropiq relative py-12 md:py-16">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 rounded-full text-amber-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                {language === "bn" ? "এআই-চালিত টুল" : "AI-Powered Tool"} — <span className="text-amber-800">BETA</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                {language === "bn" ? (
                  <>
                    <span className="text-sky-600">আবহাওয়া</span> ও{" "}
                    <span className="text-leaf-600">ফসল</span> পরামর্শ
                  </>
                ) : (
                  <>
                    <span className="text-sky-600">Weather</span> &{" "}
                    <span className="text-leaf-600">Crop</span> Advisory
                  </>
                )}
              </h1>
              <div className="space-y-2">
                <p className="text-gray-600 leading-relaxed">
                  {language === "bn"
                    ? "আপনার জেলার ৭ দিনের আবহাওয়া পূর্বাভাস দেখুন এবং ফসলের জন্য উপযোগী পরামর্শ নিন।"
                    : "Get 7-day weather forecast for your district with AI-generated planting and harvesting advice."}
                </p>
                <p className="text-gray-500 text-sm">
                  {language === "bn"
                    ? "আপনার জেলার পূর্বাভাস ও এআই কৃষি পরামর্শ — বাংলায়"
                    : "Your district's forecast & AI farming recommendations — in Bengali"}
                </p>
              </div>

              {/* Selectors */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {language === "bn" ? "জেলা নির্বাচন করুন" : "Select District"}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 outline-none transition-all bg-white text-sm"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d.name_en} value={d.name_en}>
                        {language === "bn" ? d.name_bn : d.name_en}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {language === "bn" ? "ফসল নির্বাচন করুন" : "Select Crop"}
                  </label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 outline-none transition-all bg-white text-sm"
                  >
                    {CROPS.map((c) => (
                      <option key={c.name_en} value={c.name_en}>
                        {language === "bn" ? `${c.name_bn}` : c.name_en}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={fetchWeatherAndAdvisory}
                    disabled={loading}
                    className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm shadow-lg shadow-leaf-200"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CloudSun className="w-4 h-4" />
                    )}
                    {loading ? t("general.loading") : t("tools.weather.getAdvisory")}
                  </button>
                </div>
              </div>
            </div>

            {/* Hero illustration */}
            <div className="hidden lg:flex lg:col-span-2 justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-200/60 to-leaf-200/40 rounded-full animate-pulse-gentle" />
                <div className="absolute inset-6 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <CloudSun className="w-20 h-20 text-sky-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container-cropiq">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">
            {language === "bn" ? "কীভাবে কাজ করে" : "How It Works"}
          </h3>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                num: "1",
                title: language === "bn" ? "জেলা ও ফসল নির্বাচন করুন" : "Select district & crop",
                desc: language === "bn"
                  ? "আপনার জেলা এবং যে ফসল চাষ করছেন তা বেছে নিন।"
                  : "Choose your district and the crop you're growing.",
              },
              {
                num: "2",
                title: language === "bn" ? "আবহাওয়ার পূর্বাভাস দেখুন" : "View weather forecast",
                desc: language === "bn"
                  ? "৭ দিনের তাপমাত্রা, বৃষ্টিপাত ও আর্দ্রতার তথ্য জানুন।"
                  : "See 7-day temperature, rainfall, and humidity data.",
              },
              {
                num: "3",
                title: language === "bn" ? "এআই পরামর্শ পান" : "Get AI advice",
                desc: language === "bn"
                  ? "আপনার ফসলের জন্য বিশেষজ্ঞ এআই পরামর্শ সরাসরি বাংলায়।"
                  : "Receive expert AI recommendations tailored to your crop.",
              },
            ].map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 bg-leaf-600 text-white rounded-lg flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">
                  {step.num}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{step.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Error ─── */}
      {error && (
        <div className="container-cropiq py-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl text-sm flex items-center gap-2 max-w-2xl">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
          </div>
        </div>
      )}

      {/* ─── Weather Display ─── */}
      {weather && (
        <section className="py-10 bg-gray-50/50">
          <div className="container-cropiq">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Current Weather Card */}
              <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <p className="text-sky-100 text-sm font-medium">
                      <MapPin className="w-3.5 h-3.5 inline mr-1" />
                      {language === "bn"
                        ? DISTRICTS.find((d) => d.name_en === district)?.name_bn || district
                        : district}
                    </p>
                    <div className="text-5xl md:text-6xl font-bold my-2">{Math.round(weather.current.temp)}°C</div>
                    <p className="text-sky-100 text-lg capitalize">{weather.current.description}</p>
                  </div>
                  <div className="flex gap-6 text-center">
                    <div>
                      <Droplets className="w-6 h-6 mx-auto mb-1 text-sky-200" />
                      <p className="text-lg font-bold">{weather.current.humidity}%</p>
                      <p className="text-xs text-sky-200">{t("tools.weather.humidity")}</p>
                    </div>
                    <div>
                      <Wind className="w-6 h-6 mx-auto mb-1 text-sky-200" />
                      <p className="text-lg font-bold">{weather.current.wind_kmh}</p>
                      <p className="text-xs text-sky-200">km/h</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 7-Day Forecast */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-sky-500" />
                  {t("tools.weather.forecast")}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                  {weather.forecast.map((day, i) => (
                    <div key={i} className="text-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <p className="text-xs text-gray-400 mb-1.5 font-medium">
                        {i === 0
                          ? language === "bn" ? "আজ" : "Today"
                          : new Date(day.date).toLocaleDateString("en", { weekday: "short" })}
                      </p>
                      <div className="text-2xl mb-1.5">{WEATHER_ICONS[day.icon] || "🌤️"}</div>
                      <p className="text-sm font-bold text-gray-800">
                        {Math.round(day.temp_max)}°{" "}
                        <span className="text-gray-400 font-normal">{Math.round(day.temp_min)}°</span>
                      </p>
                      <div className="flex justify-center gap-2 mt-2 text-[10px] text-gray-400">
                        <span className="flex items-center gap-0.5">
                          <Droplets className="w-2.5 h-2.5" /> {day.humidity}%
                        </span>
                        <span className="flex items-center gap-0.5">
                          <CloudRain className="w-2.5 h-2.5" /> {day.rain_mm}mm
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Advisory */}
              {advisory && (
                <div className="bg-gradient-to-r from-leaf-50 to-emerald-50 rounded-2xl border border-leaf-200 p-6 md:p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-leaf-600 rounded-xl flex items-center justify-center shadow-sm">
                      <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-leaf-800">{t("tools.weather.advisory")}</h3>
                      <p className="text-xs text-leaf-600">
                        {language === "bn" ? "OpenRouter AI দ্বারা উৎপাদিত" : "Generated by OpenRouter AI"}
                      </p>
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                    {advisory}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── Disclaimer ─── */}
      <section className="py-8 bg-amber-50/50 border-t border-amber-100">
        <div className="container-cropiq">
          <div className="max-w-3xl mx-auto flex gap-3 text-sm text-amber-800">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">
                {language === "bn" ? "ডিসক্লেইমার" : "Disclaimer"}
              </p>
              <p className="text-amber-700 leading-relaxed">
                {language === "bn"
                  ? "এআই পরামর্শ তথ্যমূলক উদ্দেশ্যে। গুরুতর সমস্যায় কৃষি বিশেষজ্ঞের পরামর্শ নিন।"
                  : "AI advice is for informational purposes only. For serious crop problems, consult a local agricultural extension officer."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
