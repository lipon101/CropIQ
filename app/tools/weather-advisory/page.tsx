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
        // Wait for the insert to complete rather than running floating promise with .then() to guarantee it is saved to DB
        const { error: insErr } = await supabase.from("weather_advisories").insert({ user_id: user.id, district, crop })
        if (insErr) {
          console.error("Failed to insert weather advisory history:", insErr)
        } else {
          console.log("Weather advisory history saved successfully")
        }
      }
    } catch (e: any) { setError(e.message || "তথ্য পাওয়া যায়নি") }
    finally { setLoading(false) }
  }

  const desc = weather?.current?.description_bn || weather?.current?.description || ""

  return (
    <ToolPageLayout title="আবহাওয়া পরামর্শ" icon={<CloudSun className="w-4 h-4 text-white" />} currentIndex={3}>
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden w-full pt-1">

        {/* ── Selectors (Expanded and Wider spacing) ── */}
        <div className="flex flex-wrap items-stretch gap-3 mb-6 shrink-0 w-full">
          <div className="flex-1 min-w-[180px] relative">
            <select value={district} onChange={e => setDistrict(e.target.value)} className="w-full pl-4 pr-8 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white text-sm outline-none appearance-none font-bold text-gray-700">
              {DISTRICTS.map(d => <option key={d.name_en} value={d.name_en}>{d.name_bn}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="flex-1 min-w-[180px] relative">
            <select value={crop} onChange={e => setCrop(e.target.value)} className="w-full pl-4 pr-8 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white text-sm outline-none appearance-none font-bold text-gray-700">
              {CROPS.map(c => <option key={c.name_en} value={c.name_en}>{c.name_bn}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button onClick={fetchAll} disabled={loading} className="bg-gradient-to-r from-leaf-500 to-leaf-600 hover:from-leaf-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-md shadow-leaf-200/40 active:scale-[0.98] transition-all disabled:shadow-none flex items-center justify-center gap-2 shrink-0">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> নিচ্ছে</> : <><Search className="w-4 h-4" /> পরামর্শ নিন</>}
          </button>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-2 mb-4 shrink-0 border border-red-200"><AlertCircle className="w-4 h-4" />{error}</div>}

        {/* ── Main View ── */}
        {!weather && !loading && (
          <div className="flex-1 flex items-center justify-center border border-dashed border-gray-200 rounded-3xl p-6 bg-gray-50/50">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-leaf-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CloudSun className="w-8 h-8 text-leaf-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-1">আবহাওয়া পরামর্শ নিন</h2>
              <p className="text-sm text-gray-500 mb-5">জেলা ও ফসল সিলেক্ট করে আবহাওয়ার ভিত্তিতে সঠিক কৃষি পরামর্শ পান</p>
              <button onClick={fetchAll} className="btn-primary-sm">পরামর্শ নিন</button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-leaf-500 animate-spin" />
            <p className="text-sm text-gray-500 font-bold">আবহাওয়া ও এআই পরামর্শ তৈরি হচ্ছে...</p>
          </div>
        )}

        {weather && !loading && (
          <div className="flex-1 overflow-y-auto space-y-5 pb-4 pr-1 w-full">

            {/* ── Current & Seasonal (Beautiful wide horizontal alignment) ── */}
            <div className="grid md:grid-cols-2 gap-5 w-full">
              {/* Current Weather Card */}
              <div className="bg-gradient-to-br from-leaf-50 to-emerald-50/40 border border-leaf-100/60 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-sm min-h-[160px]">
                <div className="absolute top-0 right-0 text-7xl translate-x-4 -translate-y-2 opacity-15">{WI[weather.current.icon] || "☀️"}</div>
                <div>
                  <div className="flex items-center gap-2 text-leaf-700 text-xs font-bold uppercase tracking-wider mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{districtBn} জেলা</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-extrabold text-gray-900">{Math.round(weather.current.temp)}°C</span>
                    <span className="text-xs font-semibold text-gray-500">সর্বোচ্চ: {Math.round(weather.current.temp_max)}° / সর্বনিম্ন: {Math.round(weather.current.temp_min)}°</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800 capitalize flex items-center gap-1.5">{WI[weather.current.icon]} {desc}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-leaf-100/60 text-xs font-bold text-gray-600">
                  <div className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-blue-500" />{weather.current.humidity}% আর্দ্রতা</div>
                  <div className="flex items-center gap-1"><CloudRain className="w-3.5 h-3.5 text-sky-500" />{weather.current.rain_mm} মিমি বৃষ্টি</div>
                  <div className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-teal-500" />{weather.current.wind_kmh} কিমি/ঘণ্টা</div>
                </div>
              </div>

              {/* Seasonal Outlook Card */}
              {seasonal && (
                <div className="bg-white border border-gray-100 p-5 rounded-3xl flex flex-col justify-between shadow-sm min-h-[160px]">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
                      <CalendarDays className="w-3.5 h-3.5" />
                      <span>মৌসুমি পূর্বাভাস ({seasonal.season.name_bn})</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">{seasonal.season.desc_bn}</p>
                    {seasonal.phase && (
                      <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-100/40 text-xs leading-relaxed">
                        <span className="font-extrabold text-amber-800">ফসলের পর্যায়: </span>
                        <span className="font-bold text-gray-700">{seasonal.phase.phase_bn} — </span>
                        <span className="text-gray-500 font-semibold">{seasonal.phase.action_bn}</span>
                      </div>
                    )}
                  </div>
                  {seasonal.season.hazards_bn?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-50 flex flex-wrap gap-1.5">
                      {seasonal.season.hazards_bn.map((h, i) => (
                        <span key={i} className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{h}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── AI Advisory Card (Redesigned to be Wider and Clean) ── */}
            {advisory && (
              <div className="bg-white border border-gray-100 rounded-3xl p-5 md:p-6 shadow-sm space-y-5 w-full">
                <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
                  <div className="w-8 h-8 bg-leaf-100 rounded-xl flex items-center justify-center shrink-0">
                    <Lightbulb className="w-4 h-4 text-leaf-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">আবহাওয়া ভিত্তিক কাস্টম পরামর্শ ({cropBn})</h3>
                    <p className="text-xs text-gray-400 font-medium">কৃত্রিম বুদ্ধিমত্তা দ্বারা কাস্টমাইজড</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm w-full">
                  {/* Summary */}
                  <p className="text-gray-600 leading-relaxed font-semibold bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100/80">{advisory.summary}</p>

                  <div className="grid md:grid-cols-2 gap-5 pt-1 w-full">
                    {/* Actions */}
                    <div className="space-y-3">
                      <h4 className="font-extrabold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-leaf-500" />করণীয় পদক্ষেপ</h4>
                      <ul className="space-y-2.5 text-xs text-gray-600 font-semibold pl-1 leading-relaxed">
                        {advisory.actions.map((a, i) => (
                          <li key={i} className="flex items-start gap-2 border-b border-gray-50 pb-1.5 last:border-0 last:pb-0">
                            <ArrowRight className="w-3.5 h-3.5 text-leaf-500 mt-0.5 shrink-0" />
                            <span className="flex-1">{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Irrigation & Warning */}
                    <div className="space-y-3">
                      {advisory.irrigation && (
                        <div className="p-4 bg-blue-50/30 border border-blue-100/50 rounded-2xl space-y-1.5">
                          <h5 className="font-extrabold text-blue-700 text-xs flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5" />সেচ পরামর্শ</h5>
                          <p className="text-xs text-blue-600 font-bold leading-relaxed">{advisory.irrigation}</p>
                        </div>
                      )}
                      {advisory.warning && (
                        <div className="p-4 bg-red-50/30 border border-red-100/50 rounded-2xl space-y-1.5">
                          <h5 className="font-extrabold text-red-700 text-xs flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" />বিশেষ সতর্কতা</h5>
                          <p className="text-xs text-red-600 font-bold leading-relaxed">{advisory.warning}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── 7-Day Forecast (Optimized, Spacious and perfectly centered) ── */}
            {weather.forecast && (
              <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm w-full">
                <button onClick={() => setShowForecast(!showForecast)} className="flex items-center justify-between w-full font-bold text-gray-800 text-sm">
                  <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-leaf-500" />৭ দিনের আবহাওয়ার পূর্বাভাস</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showForecast ? "rotate-180" : ""}`} />
                </button>
                {showForecast && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-4 pt-1 w-full">
                    {weather.forecast.map((f, i) => {
                      const day = WDAY[f.date.split(",")[0].trim()] || f.date.split(",")[0]
                      const dateNum = f.date.split(",")[1]?.trim() || f.date
                      return (
                        <div key={i} className="p-3 bg-gray-50 border border-gray-100 rounded-2xl text-center space-y-2 hover:bg-leaf-50/30 hover:border-leaf-100/40 transition-all flex flex-col justify-between min-h-[140px] shadow-sm hover:shadow-md">
                          <div>
                            <p className="text-xs font-bold text-gray-700">{day}</p>
                            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{dateNum}</p>
                          </div>
                          <div className="text-3xl py-1">{WI[f.icon] || "☀️"}</div>
                          <div>
                            <p className="text-xs font-extrabold text-gray-800">{Math.round(f.temp)}°</p>
                            <p className="text-[9px] text-gray-400 font-bold truncate mt-0.5" title={f.description_bn || f.description}>{f.description_bn || f.description || ""}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </ToolPageLayout>
  )
}
