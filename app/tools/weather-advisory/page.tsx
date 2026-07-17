"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { DISTRICTS } from "@/lib/constants/districts"
import { CROPS } from "@/lib/constants/crops"
import {
  CloudSun, CloudRain, Wind, Droplets, Thermometer, Sun, Cloud,
  Loader2, MapPin, Leaf, AlertTriangle, ChevronRight, RefreshCw,
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
      // 1. Fetch weather
      const wRes = await fetch(`/api/weather?district=${encodeURIComponent(district)}`)
      if (!wRes.ok) throw new Error("Weather fetch failed")
      const wData = await wRes.json()
      setWeather(wData)

      // 2. Get advisory
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
    <div className="container-cropiq py-8 md:py-12 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-sky-100 rounded-2xl mb-4">
          <CloudSun className="w-7 h-7 text-sky-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t("tools.weather.title")}</h1>
        <p className="text-gray-500 mt-2">{t("tools.weather.subtitle")}</p>
      </div>

      {/* Selectors */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="card-cropiq">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-sky-500" />
                {t("tools.weather.selectDistrict")}
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="input-field text-sm"
              >
                {DISTRICTS.map((d) => (
                  <option key={d.name_en} value={d.name_en}>
                    {language === "bn" ? d.name_bn : d.name_en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Leaf className="w-4 h-4 text-leaf-500" />
                {t("tools.weather.selectCrop")}
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="input-field text-sm"
              >
                {CROPS.map((c) => (
                  <option key={c.name_en} value={c.name_en}>
                    {language === "bn" ? `${c.name_bn} (${c.name_en})` : c.name_en}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={fetchWeatherAndAdvisory}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CloudSun className="w-5 h-5" />
            )}
            {loading ? t("general.loading") : t("tools.weather.getAdvisory")}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> {error}
          </div>
        )}
      </div>

      {/* Weather Display */}
      {weather && (
        <div className="space-y-6 animate-slide-up">
          {/* Current Weather */}
          <div className="card-cropiq bg-gradient-to-r from-sky-500 to-blue-600 text-white !border-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sky-100 text-sm">
                  {language === "bn"
                    ? DISTRICTS.find((d) => d.name_en === district)?.name_bn || district
                    : district}
                </p>
                <div className="text-5xl font-bold my-1">{Math.round(weather.current.temp)}°C</div>
                <p className="text-sky-100 capitalize">{weather.current.description}</p>
              </div>
              <div className="flex gap-4 text-center">
                <div>
                  <Droplets className="w-5 h-5 mx-auto mb-1 text-sky-200" />
                  <p className="text-sm font-medium">{weather.current.humidity}%</p>
                  <p className="text-xs text-sky-200">{t("tools.weather.humidity")}</p>
                </div>
                <div>
                  <Wind className="w-5 h-5 mx-auto mb-1 text-sky-200" />
                  <p className="text-sm font-medium">{weather.current.wind_kmh}</p>
                  <p className="text-xs text-sky-200">km/h</p>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Cloud className="w-5 h-5 text-sky-500" />
              {t("tools.weather.forecast")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {weather.forecast.map((day, i) => (
                <div key={i} className="card-cropiq text-center">
                  <p className="text-xs text-gray-400 mb-2">
                    {i === 0
                      ? language === "bn" ? "আজ" : "Today"
                      : new Date(day.date).toLocaleDateString("en", { weekday: "short" })}
                  </p>
                  <div className="text-2xl mb-2">{WEATHER_ICONS[day.icon] || "🌤️"}</div>
                  <p className="text-sm font-bold text-gray-800">
                    {Math.round(day.temp_max)}° <span className="text-gray-400 font-normal">{Math.round(day.temp_min)}°</span>
                  </p>
                  <div className="flex justify-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-0.5">
                      <Droplets className="w-3 h-3" /> {day.humidity}%
                    </span>
                    <span className="flex items-center gap-0.5">
                      <CloudRain className="w-3 h-3" /> {day.rain_mm}mm
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Advisory */}
          {advisory && (
            <div className="bg-gradient-to-r from-leaf-50 to-emerald-50 rounded-2xl border border-leaf-200 p-6 animate-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-leaf-500 rounded-lg flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-leaf-800">{t("tools.weather.advisory")}</h3>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                {advisory}
              </div>
              <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
                <span>🤖</span> {language === "bn" ? "OpenRouter AI দ্বারা উৎপাদিত পরামর্শ" : "AI-generated advice via OpenRouter"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
