"use client"

import { useState } from "react"
import { DISTRICTS } from "@/lib/constants/districts"
import { CROPS } from "@/lib/constants/crops"
import { CloudSun, CloudRain, Wind, Droplets, Loader2, MapPin, AlertTriangle, Calendar, Lightbulb } from "lucide-react"

interface ForecastDay { date: string; temp_min: number; temp_max: number; humidity: number; rain_mm: number; wind_kmh: number; description: string; icon: string }
interface WeatherData { district: string; current: { temp: number; humidity: number; description: string; icon: string; wind_kmh: number }; forecast: ForecastDay[] }
const WI: Record<string, string> = { "01d": "☀️", "01n": "🌙", "02d": "⛅", "02n": "☁️", "03d": "☁️", "03n": "☁️", "04d": "☁️", "04n": "☁️", "09d": "🌧️", "09n": "🌧️", "10d": "🌦️", "10n": "🌧️", "11d": "⛈️", "11n": "⛈️", "13d": "🌨️", "13n": "🌨️", "50d": "🌫️", "50n": "🌫️" }

export default function WeatherAdvisoryPage() {
  const [district, setDistrict] = useState("Dhaka")
  const [crop, setCrop] = useState("Rice")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [advisory, setAdvisory] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchAll = async () => {
    setLoading(true); setError(""); setAdvisory("")
    try {
      const wr = await fetch(`/api/weather?district=${encodeURIComponent(district)}`)
      if (!wr.ok) throw new Error("আবহাওয়া তথ্য পাওয়া যায়নি")
      const wd = await wr.json(); setWeather(wd)
      const ar = await fetch("/api/advisory", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ district, crop, forecast: wd.forecast, language: "bn" }) })
      if (ar.ok) { const ad = await ar.json(); setAdvisory(ad.advisory) }
    } catch (e: any) { setError(e.message || "তথ্য পাওয়া যায়নি") }
    finally { setLoading(false) }
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm"><CloudSun className="w-4.5 h-4.5 text-white" /></div>
        <h1 className="font-bold text-gray-900 text-sm flex-1">আবহাওয়া ও ফসল পরামর্শ</h1>
      </div>

      <div className="bg-white border-b border-gray-100 px-4 py-2.5 shrink-0">
        <div className="flex gap-2 max-w-lg">
          <select value={district} onChange={e => setDistrict(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium focus:border-leaf-500 outline-none bg-gray-50">{DISTRICTS.map(d => <option key={d.name_en} value={d.name_en}>{d.name_bn}</option>)}</select>
          <select value={crop} onChange={e => setCrop(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium focus:border-leaf-500 outline-none bg-gray-50">{CROPS.map(c => <option key={c.name_en} value={c.name_en}>{c.name_bn}</option>)}</select>
          <button onClick={fetchAll} disabled={loading} className="btn-primary-sm !py-2 !px-5">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "পরামর্শ নিন"}</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0" />{error}</div>}
          {loading && <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-leaf-600 animate-spin" /></div>}

          {weather && !loading && (<>
            <div className="bg-gradient-to-br from-sky-500 to-blue-700 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sky-100 text-xs font-bold flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{DISTRICTS.find(d => d.name_en === district)?.name_bn || district}</p>
                  <div className="flex items-baseline gap-1 my-1"><span className="text-5xl font-extrabold">{Math.round(weather.current.temp)}</span><span className="text-xl text-sky-200">°C</span></div>
                  <p className="text-sky-100 text-sm font-medium capitalize">{weather.current.description}</p>
                </div>
                <div className="flex gap-5">
                  <div className="text-center"><Droplets className="w-5 h-5 mx-auto mb-1 text-sky-200" /><p className="text-lg font-bold">{weather.current.humidity}%</p><p className="text-[10px] text-sky-200">আর্দ্রতা</p></div>
                  <div className="text-center"><Wind className="w-5 h-5 mx-auto mb-1 text-sky-200" /><p className="text-lg font-bold">{weather.current.wind_kmh}</p><p className="text-[10px] text-sky-200">বাতাস</p></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-sky-500" />৭ দিনের পূর্বাভাস</h3>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {weather.forecast.map((day, i) => (
                  <div key={i} className={`text-center p-2 rounded-xl ${i === 0 ? "bg-sky-50" : "hover:bg-gray-50"}`}>
                    <p className={`text-[11px] font-bold ${i === 0 ? "text-sky-600" : "text-gray-400"}`}>{i === 0 ? "আজ" : new Date(day.date).toLocaleDateString("en", { weekday: "short" })}</p>
                    <div className="text-2xl my-1">{WI[day.icon] || "🌤️"}</div>
                    <p className="text-xs font-bold">{Math.round(day.temp_max)}° <span className="text-gray-400 font-normal">{Math.round(day.temp_min)}°</span></p>
                    <div className="flex justify-center gap-2 mt-1.5 text-[10px] text-gray-400"><span><Droplets className="w-2.5 h-2.5 inline text-sky-400" />{day.humidity}%</span><span><CloudRain className="w-2.5 h-2.5 inline text-blue-400" />{day.rain_mm}মিমি</span></div>
                  </div>
                ))}
              </div>
            </div>

            {advisory && <div className="bg-gradient-to-r from-leaf-50 to-emerald-50 rounded-2xl border border-leaf-200 p-4 shadow-sm"><div className="flex items-center gap-3 mb-3"><div className="w-8 h-8 bg-leaf-600 rounded-xl flex items-center justify-center shadow-sm"><Lightbulb className="w-4 h-4 text-white" /></div><h3 className="text-sm font-bold text-leaf-800">এআই কৃষি পরামর্শ</h3></div><div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{advisory}</div></div>}
          </>)}

          {!weather && !loading && !error && <div className="flex items-center justify-center py-20 text-center"><div><CloudSun className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-sm text-gray-500">জেলা ও ফসল নির্বাচন করে "পরামর্শ নিন" বাটনে ক্লিক করুন</p></div></div>}
        </div>
      </div>
    </div>
  )
}
