"use client"

import { useState } from "react"
import { DISTRICTS } from "@/lib/constants/districts"
import { CROPS } from "@/lib/constants/crops"
import {
  CloudSun, CloudRain, Wind, Droplets, Loader2, MapPin, AlertTriangle,
  Lightbulb, CheckCircle2, AlertCircle, ChevronDown, CalendarDays, Sprout,
  Search, ArrowRight,
} from "lucide-react"
import { ToolPageLayout } from "@/components/tools/ToolPageLayout"
import { useAuth } from "@/lib/auth/AuthContext"
import { createClient } from "@/lib/supabase/client"

interface ForecastDay { date: string; temp: number; temp_min: number; temp_max: number; humidity: number; rain_mm: number; wind_kmh: number; description?: string; description_bn?: string; icon: string }
interface WeatherData { district: string; current: ForecastDay; forecast: ForecastDay[] }
interface Advisory { summary: string; actions: string[]; irrigation: string; warning: string }
interface SeasonalOutlook { season: { name_bn: string; desc_bn: string; hazards_bn: string[] }; crop: { crop_bn: string } | null; phase: { phase_bn: string; action_bn: string } | null }

const WI: Record<string, string> = { "01d": "☀️", "01n": "🌙", "02d": "⛅", "02n": "☁️", "03d": "☁️", "03n": "☁️", "04d": "☁️", "04n": "☁️", "09d": "🌧️", "09n": "🌧️", "10d": "🌦️", "10n": "🌧️", "11d": "⛈️", "11n": "⛈️", "13d": "🌨️", "13n": "🌨️", "50d": "🌫️", "50n": "🌫️" }
const WDAY: Record<string, string> = { "Sat": "শনি", "Sun": "রবি", "Mon": "সোম", "Tue": "মঙ্গল", "Wed": "বুধ", "Thu": "বৃহঃ", "Fri": "শুক্র" }

export default function WeatherAdvisoryPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [district, setDistrict] = useState("Dhaka")
  const [crop, setCrop] = useState("Rice")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [advisory, setAdvisory] = useState<Advisory | null>(null)
  const [seasonal, setSeasonal] = useState<SeasonalOutlook | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showForecast, setShowForecast] = useState(true)

  const districtBn = DISTRICTS.find(d => d.name_en === district)?.name_bn || district
  const cropBn = CROPS.find(c => c.name_en === crop)?.name_bn || crop
  const fetchAll = async () => {
    setLoading(true); setError(""); setAdvisory(null); setWeather(null); setSeasonal(null)
    try {
      const wr = await fetch(`/api/weather?district=${encodeURIComponent(district)}&crop=${encodeURIComponent(crop)}`)
      if (!wr.ok) throw new Error("আবহাওয়া তথ্য পাওয়া যায়নি")
      const wd = await wr.json(); setWeather(wd); setSeasonal(wd.seasonal || null)
      const ar = await fetch("/api/advisory", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ district, crop, forecast: wd.forecast }) })
      if (ar.ok) { const ad = await ar.json(); setAdvisory(ad.advisory) }

      if (user) {
        supabase.from("weather_advisories").insert({ user_id: user.id, district, crop }).then(() => {})
      }
    } catch (e: any) { setError(e.message || "তথ্য পাওয়া যায়নি") }
    finally { setLoading(false) }
  }

  const desc = weather?.current?.description_bn || weather?.current?.description || ""

  return (
    <ToolPageLayout title="আবহাওয়া পরামর্শ" icon={<CloudSun className="w-4 h-4 text-white" />} currentIndex={3}>
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden w-full pt-1">

        {/* ── Selectors ── */}
        <div className="flex flex-wrap items-stretch gap-2 mb-4 shrink-0">
          <div className="relative flex-1 min-w-[130px]">
            <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select value={district} onChange={e => setDistrict(e.target.value)} className="w-full pl-9 pr-8 py-2.5 rounded-2xl border-2 border-gray-100 text-sm font-semibold text-gray-700 focus:border-leaf-400 outline-none bg-white shadow-sm hover:border-leaf-200 transition-colors appearance-none cursor-pointer">
              {DISTRICTS.map(d => <option key={d.name_en} value={d.name_en}>{d.name_bn}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="relative flex-1 min-w-[130px]">
            <Sprout className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select value={crop} onChange={e => setCrop(e.target.value)} className="w-full pl-9 pr-8 py-2.5 rounded-2xl border-2 border-gray-100 text-sm font-semibold text-gray-700 focus:border-leaf-400 outline-none bg-white shadow-sm hover:border-leaf-200 transition-colors appearance-none cursor-pointer">
              {CROPS.map(c => <option key={c.name_en} value={c.name_en}>{c.name_bn}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button onClick={fetchAll} disabled={loading} className="bg-gradient-to-r from-leaf-500 to-leaf-600 hover:from-leaf-600 hover:to-leaf-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-md shadow-leaf-200/40 active:scale-[0.98] transition-all disabled:shadow-none flex items-center justify-center gap-2 shrink-0">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> নিচ্ছে</> : <><Search className="w-4 h-4" /> পরামর্শ নিন</>}
          </button>
        </div>

        {/* ── Content ── */}
        <div className={`flex-1 min-h-0 ${weather && !loading ? 'overflow-y-auto' : 'flex items-center justify-center'}`}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 text-leaf-500 animate-spin" />
              <p className="text-sm text-gray-400">আবহাওয়া ও পরামর্শ নেওয়া হচ্ছে…</p>
            </div>
          )}

          {!weather && !loading && !error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-xs">
                <div className="w-16 h-16 bg-gradient-to-br from-leaf-100 to-leaf-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <CloudSun className="w-8 h-8 text-leaf-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-1">আবহাওয়া পরামর্শ নিন</h2>
                <p className="text-sm text-gray-500 mb-5">জেলা ও ফসল সিলেক্ট করে আবহাওয়ার ভিত্তিতে সঠিক কৃষি পরামর্শ পান</p>
                <button onClick={fetchAll} className="btn-primary-sm">পরামর্শ নিন</button>
              </div>
            </div>
          )}

          {weather && !loading && (
            <div className="space-y-3 pb-4">
              {/* ── Current Weather Card ── */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-leaf-500 via-leaf-600 to-teal-600 p-5 text-white shadow-lg shadow-leaf-200/40">
                <div className="absolute -right-6 -top-6 w-36 h-36 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -left-8 -bottom-10 w-32 h-32 rounded-full bg-teal-400/20 blur-2xl" />
                <div className="relative flex items-center justify-between gap-4">
                  <div>
                    <p className="text-leaf-50 text-xs font-bold flex items-center gap-1.5 mb-2">
                      <MapPin className="w-3.5 h-3.5" />{districtBn} · {cropBn}
                    </p>
                    <div className="flex items-end gap-1">
                      <span className="text-5xl font-extrabold tracking-tight leading-none">{Math.round(weather.current.temp)}</span>
                      <span className="text-xl text-leaf-100 mb-0.5">°C</span>
                    </div>
                    <p className="text-leaf-50 text-sm font-medium mt-1.5">{desc}</p>
                  </div>
                  <div className="flex gap-5 pr-1">
                    <div className="text-center">
                      <Droplets className="w-5 h-5 mx-auto mb-1 text-leaf-100" />
                      <p className="text-lg font-bold">{weather.current.humidity}%</p>
                      <p className="text-[10px] text-leaf-100">আর্দ্রতা</p>
                    </div>
                    <div className="text-center">
                      <Wind className="w-5 h-5 mx-auto mb-1 text-leaf-100" />
                      <p className="text-lg font-bold">{weather.current.wind_kmh}</p>
                      <p className="text-[10px] text-leaf-100">কিমি/ঘ</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Seasonal Outlook ── */}
              {seasonal && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center border border-amber-100">
                      <CalendarDays className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-gray-800">{seasonal.season.name_bn}</p>
                      <p className="text-[11px] text-gray-400 font-semibold">মৌসুমভিত্তিক পরামর্শ</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-2.5">{seasonal.season.desc_bn}</p>
                  {seasonal.season.hazards_bn?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {seasonal.season.hazards_bn.map((h, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-[11px] font-bold">
                          ⚠️ {h}
                        </span>
                      ))}
                    </div>
                  )}
                  {seasonal.phase ? (
                    <div className="flex items-start gap-2.5 bg-leaf-50 rounded-xl border border-leaf-100 p-3">
                      <ArrowRight className="w-4 h-4 text-leaf-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-leaf-800">{seasonal.crop?.crop_bn || ""} — {seasonal.phase.phase_bn}</p>
                        <p className="text-xs text-leaf-700 leading-relaxed mt-0.5">{seasonal.phase.action_bn}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">এই ফসলের নির্দিষ্ট মৌসুম-উইন্ডো তথ্য এখনও যোগ করা হয়নি।</p>
                  )}
                </div>
              )}

              {/* ── 7-Day Forecast ── */}
              <button onClick={() => setShowForecast(!showForecast)} className="w-full bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center justify-between text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <span className="flex items-center gap-2"><CloudRain className="w-4 h-4 text-leaf-500" /> ৭ দিনের পূর্বাভাস</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showForecast ? "rotate-180" : ""}`} />
              </button>
              {showForecast && (
                <div className="grid grid-cols-7 gap-1.5 bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
                  {weather.forecast.map((day, i) => {
                    const dayEn = new Date(day.date).toLocaleDateString("en", { weekday: "short" })
                    return (
                      <div key={i} className={`text-center rounded-xl py-2.5 px-1 ${i === 0 ? "bg-leaf-50 border border-leaf-100" : "hover:bg-gray-50 transition-colors"}`}>
                        <p className={`text-[10px] font-bold ${i === 0 ? "text-leaf-600" : "text-gray-400"}`}>{i === 0 ? "আজ" : WDAY[dayEn] || dayEn}</p>
                        <div className="text-xl my-1.5">{WI[day.icon] || "🌤️"}</div>
                        <p className="text-xs font-bold text-gray-800">{Math.round(day.temp_max)}° <span className="text-gray-400 font-normal">{Math.round(day.temp_min)}°</span></p>
                        <div className="text-[9px] text-gray-400 mt-1 flex justify-center gap-1.5">
                          <span className="inline-flex items-center gap-0.5"><Droplets className="w-2.5 h-2.5" />{day.humidity}%</span>
                          {day.rain_mm > 0 && <span className="inline-flex items-center gap-0.5 text-sky-600">💧{day.rain_mm}</span>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* ── Advisory Section ── */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-7 h-7 bg-gradient-to-br from-leaf-500 to-leaf-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800">{districtBn} — {cropBn} কৃষি পরামর্শ</h3>
                </div>

                {advisory ? (
                  <>
                    <div className="bg-gradient-to-r from-leaf-50 to-teal-50 rounded-2xl border border-leaf-100 p-4 shadow-sm">
                      <p className="text-sm text-leaf-900 font-semibold leading-relaxed">{advisory.summary}</p>
                    </div>

                    {advisory.actions?.length > 0 && (
                      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-2.5">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">করণীয়</p>
                        {advisory.actions.map((a, i) => (
                          <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 hover:bg-leaf-50/60 transition-colors">
                            <div className="w-5 h-5 bg-leaf-500 rounded-full flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-3 h-3 text-white" /></div>
                            <p className="text-sm text-gray-700 font-semibold leading-relaxed">{a}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2.5">
                      {advisory.irrigation && (
                        <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border border-sky-100 p-4 shadow-sm">
                          <p className="text-[11px] font-bold text-sky-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5" />সেচ</p>
                          <p className="text-sm text-sky-900 font-semibold leading-relaxed">{advisory.irrigation}</p>
                        </div>
                      )}
                      {advisory.warning && (
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-4 shadow-sm">
                          <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />সতর্কতা</p>
                          <p className="text-sm text-amber-900 font-semibold leading-relaxed">{advisory.warning}</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 text-center">
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-400">পরামর্শ তৈরি হচ্ছে…</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolPageLayout>
  )
}
