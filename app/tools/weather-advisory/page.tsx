"use client"

import { useState } from "react"
import { DISTRICTS } from "@/lib/constants/districts"
import { CROPS } from "@/lib/constants/crops"
import { CloudSun, CloudRain, Wind, Droplets, Loader2, MapPin, AlertTriangle, Lightbulb, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react"

interface ForecastDay { date: string; temp: number; temp_min: number; temp_max: number; humidity: number; rain_mm: number; wind_kmh: number; description?: string; description_bn?: string; icon: string }
interface WeatherData { district: string; current: ForecastDay; forecast: ForecastDay[] }
interface Advisory { summary: string; actions: string[]; irrigation: string; warning: string }

const WI: Record<string, string> = { "01d": "☀️", "01n": "🌙", "02d": "⛅", "02n": "☁️", "03d": "☁️", "03n": "☁️", "04d": "☁️", "04n": "☁️", "09d": "🌧️", "09n": "🌧️", "10d": "🌦️", "10n": "🌧️", "11d": "⛈️", "11n": "⛈️", "13d": "🌨️", "13n": "🌨️", "50d": "🌫️", "50n": "🌫️" }
const WDAY: Record<string, string> = { "Sat": "শনি", "Sun": "রবি", "Mon": "সোম", "Tue": "মঙ্গল", "Wed": "বুধ", "Thu": "বৃহঃ", "Fri": "শুক্র" }

export default function WeatherAdvisoryPage() {
  const [district, setDistrict] = useState("Dhaka")
  const [crop, setCrop] = useState("Rice")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [advisory, setAdvisory] = useState<Advisory | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showForecast, setShowForecast] = useState(false)

  const districtBn = DISTRICTS.find(d => d.name_en === district)?.name_bn || district
  const cropBn = CROPS.find(c => c.name_en === crop)?.name_bn || crop

  const fetchAll = async () => {
    setLoading(true); setError(""); setAdvisory(null); setWeather(null)
    try {
      const wr = await fetch(`/api/weather?district=${encodeURIComponent(district)}`)
      if (!wr.ok) throw new Error("আবহাওয়া তথ্য পাওয়া যায়নি")
      const wd = await wr.json(); setWeather(wd)
      const ar = await fetch("/api/advisory", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ district, crop, forecast: wd.forecast }) })
      if (ar.ok) { const ad = await ar.json(); setAdvisory(ad.advisory) }
    } catch (e: any) { setError(e.message || "তথ্য পাওয়া যায়নি") }
    finally { setLoading(false) }
  }

  const desc = weather?.current?.description_bn || weather?.current?.description || ""

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-transparent">
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 py-2 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md"><CloudSun className="w-4 h-4 text-white" /></div>
        <h1 className="font-bold text-gray-900 text-sm">আবহাওয়া পরামর্শ</h1>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 py-1.5 shrink-0">
        <div className="flex gap-2 max-w-lg">
          <div className="relative flex-1 min-w-[100px]">
            <select value={district} onChange={e => setDistrict(e.target.value)} className="w-full pl-2.5 pr-7 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 focus:border-sky-400 outline-none bg-white appearance-none cursor-pointer">{DISTRICTS.map(d => <option key={d.name_en} value={d.name_en}>{d.name_bn}</option>)}</select>
            <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="relative flex-1 min-w-[80px]">
            <select value={crop} onChange={e => setCrop(e.target.value)} className="w-full pl-2.5 pr-7 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 focus:border-sky-400 outline-none bg-white appearance-none cursor-pointer">{CROPS.map(c => <option key={c.name_en} value={c.name_en}>{c.name_bn}</option>)}</select>
            <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button onClick={fetchAll} disabled={loading} className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md shadow-sky-200 active:scale-95 transition-all disabled:shadow-none flex items-center gap-1.5 shrink-0">
            {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> নিচ্ছে</> : "পরামর্শ নিন"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto p-3 space-y-3">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-xl text-xs flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5 shrink-0" />{error}</div>}
          {loading && <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-sky-500 animate-spin" /></div>}

          {weather && !loading && (<>
            {/* Current Weather - Compact Hero */}
            <div className="bg-gradient-to-br from-sky-500 to-blue-700 rounded-2xl p-4 text-white shadow-lg shadow-sky-200/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sky-100 text-[11px] font-bold flex items-center gap-1"><MapPin className="w-3 h-3" />{districtBn} · {cropBn}</p>
                  <div className="flex items-baseline gap-1 mt-0.5"><span className="text-5xl font-extrabold tracking-tight">{Math.round(weather.current.temp)}</span><span className="text-lg text-sky-200">°C</span></div>
                  <p className="text-sky-100 text-xs font-medium mt-0.5">{desc}</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-center"><Droplets className="w-4 h-4 mx-auto mb-1 text-sky-200" /><p className="text-lg font-bold">{weather.current.humidity}%</p><p className="text-[9px] text-sky-200">আর্দ্রতা</p></div>
                  <div className="text-center"><Wind className="w-4 h-4 mx-auto mb-1 text-sky-200" /><p className="text-lg font-bold">{weather.current.wind_kmh}</p><p className="text-[9px] text-sky-200">কিমি/ঘ</p></div>
                </div>
              </div>
            </div>

            {/* Collapsible Forecast */}
            <button onClick={() => setShowForecast(!showForecast)} className="w-full bg-white rounded-xl border border-gray-200 px-4 py-2.5 flex items-center justify-between text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
              <span>📅 ৭ দিনের পূর্বাভাস</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showForecast ? "rotate-180" : ""}`} />
            </button>
            {showForecast && (
              <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-sm">
                <div className="grid grid-cols-4 md:grid-cols-7 gap-1.5">
                  {weather.forecast.map((day, i) => {
                    const dayEn = new Date(day.date).toLocaleDateString("en", { weekday: "short" })
                    return (
                      <div key={i} className={`text-center p-2 rounded-lg ${i === 0 ? "bg-sky-50 border border-sky-100" : "hover:bg-gray-50"}`}>
                        <p className={`text-[10px] font-bold ${i === 0 ? "text-sky-600" : "text-gray-400"}`}>{i === 0 ? "আজ" : WDAY[dayEn] || dayEn}</p>
                        <div className="text-lg my-0.5">{WI[day.icon] || "🌤️"}</div>
                        <p className="text-[11px] font-bold">{Math.round(day.temp_max)}° <span className="text-gray-400 font-normal">{Math.round(day.temp_min)}°</span></p>
                        <div className="text-[9px] text-gray-400 mt-0.5 flex justify-center gap-1.5"><span>{day.humidity}%</span>{day.rain_mm > 0 && <span>💧{day.rain_mm}</span>}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Advisory Cards */}
            {advisory && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 px-1 pt-1">
                  <div className="w-7 h-7 bg-gradient-to-br from-leaf-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md"><Lightbulb className="w-3.5 h-3.5 text-white" /></div>
                  <h3 className="text-sm font-bold text-gray-800">{districtBn} — {cropBn} পরামর্শ</h3>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl border border-blue-100 p-4 shadow-sm">
                  <p className="text-sm text-blue-900 font-semibold leading-relaxed">{advisory.summary}</p>
                </div>

                {advisory.actions?.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">করণীয়</p>
                    {advisory.actions.map((a, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-leaf-50/50 transition-colors">
                        <div className="w-5 h-5 bg-leaf-500 rounded-full flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-3 h-3 text-white" /></div>
                        <p className="text-sm text-gray-700 font-semibold leading-relaxed">{a}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {advisory.irrigation && (
                    <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border border-sky-100 p-4 shadow-sm">
                      <p className="text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5" />সেচ</p>
                      <p className="text-sm text-sky-900 font-semibold leading-relaxed">{advisory.irrigation}</p>
                    </div>
                  )}
                  {advisory.warning && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-4 shadow-sm">
                      <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />সতর্কতা</p>
                      <p className="text-sm text-amber-900 font-semibold leading-relaxed">{advisory.warning}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>)}

          {!weather && !loading && !error && (
            <div className="flex items-center justify-center py-24 text-center">
              <div>
                <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-3"><CloudSun className="w-7 h-7 text-sky-400" /></div>
                <p className="text-sm font-bold text-gray-600">জেলা ও ফসল সিলেক্ট করে</p>
                <p className="text-xs text-gray-400">"পরামর্শ নিন" বাটনে ক্লিক করুন</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
