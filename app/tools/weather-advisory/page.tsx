"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { DISTRICTS } from "@/lib/constants/districts"
import { CROPS } from "@/lib/constants/crops"
import {
  CloudSun, CloudRain, Wind, Droplets, Thermometer, Sun, Cloud,
  Loader2, MapPin, Leaf, AlertTriangle, Sparkles, Info, Lightbulb,
  Calendar, Umbrella
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
    } finally { setLoading(false) }
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50/60 via-white to-blue-50/40 border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.06)_0%,transparent_60%)]" />
        <div className="container-cropiq relative py-12 md:py-16">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 space-y-5 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-full text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                {language === "bn" ? "এআই-চালিত টুল" : "AI-Powered Tool"} — <span className="opacity-90">BETA</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                {language === "bn" ? (
                  <><span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-600">আবহাওয়া</span> ও <span className="bg-clip-text text-transparent bg-gradient-to-r from-leaf-600 to-emerald-600">ফসল</span> পরামর্শ</>
                ) : (
                  <><span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-600">Weather</span> & <span className="bg-clip-text text-transparent bg-gradient-to-r from-leaf-600 to-emerald-600">Crop</span> Advisory</>
                )}
              </h1>
              <div className="space-y-2">
                <p className="text-gray-600 leading-relaxed text-lg">
                  {language === "bn"
                    ? "আপনার জেলার ৭ দিনের আবহাওয়া পূর্বাভাস দেখুন এবং ফসলের জন্য উপযোগী এআই পরামর্শ নিন।"
                    : "Get 7-day weather forecast for your district with AI-generated planting and harvesting advice."}
                </p>
                <p className="text-gray-500 text-sm">
                  {language === "bn"
                    ? "৬৪ জেলা · ৭ দিনের পূর্বাভাস · এআই কৃষি পরামর্শ"
                    : "64 districts · 7-day forecast · AI farming advice"}
                </p>
              </div>

              {/* Selectors */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {language === "bn" ? "জেলা" : "District"}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-leaf-500 focus:ring-4 focus:ring-leaf-50 outline-none transition-all bg-white text-sm font-medium"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d.name_en} value={d.name_en}>
                        {language === "bn" ? d.name_bn : d.name_en}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    <Leaf className="w-3 h-3 inline mr-1" />
                    {language === "bn" ? "ফসল" : "Crop"}
                  </label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-leaf-500 focus:ring-4 focus:ring-leaf-50 outline-none transition-all bg-white text-sm font-medium"
                  >
                    {CROPS.map((c) => (
                      <option key={c.name_en} value={c.name_en}>
                        {language === "bn" ? `${c.name_bn} (${c.name_en})` : c.name_en}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={fetchWeatherAndAdvisory}
                    disabled={loading}
                    className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 text-sm font-bold"
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

            <div className="hidden lg:flex lg:col-span-2 justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-300/40 to-leaf-300/30 rounded-full animate-pulse-gentle" />
                <div className="absolute inset-6 bg-white rounded-full shadow-xl flex items-center justify-center">
                  <CloudSun className="w-20 h-20 text-sky-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container-cropiq">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-5">{language === "bn" ? "কীভাবে কাজ করে" : "HOW IT WORKS"}</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { num: "1", title: language === "bn" ? "জেলা ও ফসল নির্বাচন করুন" : "Select district & crop", desc: language === "bn" ? "আপনার জেলা এবং যে ফসল চাষ করছেন তা বেছে নিন।" : "Choose your district and the crop you're growing." },
              { num: "2", title: language === "bn" ? "পূর্বাভাস দেখুন" : "View forecast", desc: language === "bn" ? "৭ দিনের তাপমাত্রা, বৃষ্টিপাত ও আর্দ্রতার তথ্য জানুন।" : "See 7-day temperature, rainfall, and humidity data." },
              { num: "3", title: language === "bn" ? "পরামর্শ নিন" : "Get AI advice", desc: language === "bn" ? "আপনার ফসলের জন্য বিশেষজ্ঞ এআই পরামর্শ সরাসরি বাংলায়।" : "Receive expert AI recommendations tailored to your crop." },
            ].map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-leaf-500 to-leaf-700 text-white rounded-xl flex items-center justify-center text-sm font-bold shrink-0 shadow-md">{step.num}</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{step.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="container-cropiq py-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm flex items-center gap-3 max-w-2xl font-medium">
            <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
          </div>
        </div>
      )}

      {/* Weather Display */}
      {weather && (
        <section className="py-10 bg-gray-50/50">
          <div className="container-cropiq">
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Current Weather */}
              <div className="relative overflow-hidden bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 rounded-3xl p-8 md:p-10 text-white shadow-2xl shadow-sky-500/20">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl" />
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <p className="text-sky-100 text-sm font-bold flex items-center gap-1.5 mb-1">
                      <MapPin className="w-4 h-4" />
                      {language === "bn"
                        ? DISTRICTS.find((d) => d.name_en === district)?.name_bn || district
                        : district}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-7xl md:text-8xl font-extrabold tracking-tighter">{Math.round(weather.current.temp)}</span>
                      <span className="text-3xl md:text-4xl font-light text-sky-200">°C</span>
                    </div>
                    <p className="text-sky-100 text-lg mt-1 capitalize font-medium">{weather.current.description}</p>
                  </div>
                  <div className="flex gap-8 text-center">
                    <div>
                      <Droplets className="w-7 h-7 mx-auto mb-2 text-sky-200" />
                      <p className="text-2xl font-extrabold">{weather.current.humidity}%</p>
                      <p className="text-xs text-sky-200 font-medium mt-1">{t("tools.weather.humidity")}</p>
                    </div>
                    <div>
                      <Wind className="w-7 h-7 mx-auto mb-2 text-sky-200" />
                      <p className="text-2xl font-extrabold">{weather.current.wind_kmh}</p>
                      <p className="text-xs text-sky-200 font-medium mt-1">km/h</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 7-Day Forecast */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-premium">
                <h3 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-sky-500" />
                  {t("tools.weather.forecast")}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                  {weather.forecast.map((day, i) => (
                    <div key={i} className={`text-center p-4 rounded-2xl transition-all duration-200 hover:bg-gray-50 ${
                      i === 0 ? "bg-sky-50 border border-sky-100" : ""
                    }`}>
                      <p className={`text-xs font-bold mb-2 ${
                        i === 0 ? "text-sky-600" : "text-gray-400"
                      }`}>
                        {i === 0 ? (language === "bn" ? "আজ" : "Today") : new Date(day.date).toLocaleDateString("en", { weekday: "short" })}
                      </p>
                      <div className="text-3xl mb-2">{WEATHER_ICONS[day.icon] || "🌤️"}</div>
                      <p className="text-sm font-bold text-gray-800">
                        {Math.round(day.temp_max)}°{" "}
                        <span className="text-gray-400 font-medium">{Math.round(day.temp_min)}°</span>
                      </p>
                      <div className="flex justify-center gap-3 mt-3 pt-3 border-t border-gray-100">
                        <span className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                          <Droplets className="w-3 h-3 text-sky-400" /> {day.humidity}%
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                          <CloudRain className="w-3 h-3 text-blue-400" /> {day.rain_mm}mm
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Advisory */}
              {advisory && (
                <div className="relative overflow-hidden bg-gradient-to-br from-leaf-50 to-emerald-50 rounded-3xl border border-leaf-200 p-6 md:p-8 shadow-premium animate-slide-up">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-2xl flex items-center justify-center shadow-lg shadow-leaf-200/50">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-leaf-800">{t("tools.weather.advisory")}</h3>
                      <p className="text-xs text-leaf-600 font-medium mt-0.5">
                        {language === "bn" ? "OpenRouter AI দ্বারা উৎপাদিত" : "Generated by OpenRouter AI"}
                      </p>
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed text-[15px]">
                    {advisory}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="py-8 bg-amber-50/50 border-t border-amber-100">
        <div className="container-cropiq">
          <div className="max-w-3xl mx-auto flex gap-3 text-sm text-amber-800">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">{language === "bn" ? "ডিসক্লেইমার" : "Disclaimer"}</p>
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
