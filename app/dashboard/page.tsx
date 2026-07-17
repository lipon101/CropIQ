"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/lib/auth/AuthContext"
import { createClient } from "@/lib/supabase/client"
import { Microscope, MessageCircle, CloudSun, Bookmark, TrendingUp, ChevronRight, Sprout, Zap, Clock, ArrowRight, Activity } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

interface ScanRecord { id: string; crop_type: string; disease_name: string; confidence: number; created_at: string }

export default function DashboardPage() {
  const { user } = useAuth()
  const [scans, setScans] = useState<ScanRecord[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return
    const f = async () => {
      try {
        const { data } = await supabase
          .from("disease_scans")
          .select("id,crop_type,disease_name,confidence,created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50)
        if (data) setScans(data)
      } catch { } finally { setLoading(false) }
    }; f()
  }, [user])

  // ── Activity wave chart data (last 7 days) ──
  const activityData = useMemo(() => {
    const dayNames = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি']
    const days: { day: string; count: number }[] = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      days.push({
        day: dayNames[d.getDay()],
        count: scans.filter(s => s.created_at?.startsWith(dateStr)).length
      })
    }
    return days
  }, [scans])

  const statCards = [
    { icon: Microscope, iconBg: "bg-red-100 text-red-600", label: "রোগ স্ক্যান", value: scans.length, href: "/tools/disease-detector" },
    { icon: MessageCircle, iconBg: "bg-blue-100 text-blue-600", label: "চ্যাট সেশন", value: 0, href: "/tools/chatbot" },
    { icon: CloudSun, iconBg: "bg-sky-100 text-sky-600", label: "আবহাওয়া পরামর্শ", value: 0, href: "/tools/weather-advisory" },
    { icon: Bookmark, iconBg: "bg-amber-100 text-amber-600", label: "সংরক্ষিত", value: 0, href: "#" },
  ]

  const quickActions = [
    { icon: Microscope, label: "রোগ সনাক্ত করুন", href: "/tools/disease-detector", hover: "hover:bg-red-50" },
    { icon: MessageCircle, label: "চ্যাটবট ব্যবহার করুন", href: "/tools/chatbot", hover: "hover:bg-blue-50" },
    { icon: CloudSun, label: "আবহাওয়া দেখুন", href: "/tools/weather-advisory", hover: "hover:bg-sky-50" },
    { icon: TrendingUp, label: "বাজারদর দেখুন", href: "/tools/market-prices", hover: "hover:bg-amber-50" },
  ]

  // ── Wave chart SVG helpers ──
  const maxVal = Math.max(...activityData.map(d => d.count), 1)
  const W = 280, H = 110, padT = 22, padB = 18, padL = 10, padR = 10
  const pw = W - padL - padR, ph = H - padT - padB

  const pts = activityData.map((d, i) => ({
    x: padL + (i / Math.max(activityData.length - 1, 1)) * pw,
    y: padT + ph - (d.count / maxVal) * ph,
    ...d
  }))

  // Smooth cubic bezier curve
  const curvePath = pts.map((p, i) => {
    if (i === 0) return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
    const prev = pts[i - 1]
    const cpx1 = (prev.x + p.x) / 2
    return `C ${cpx1.toFixed(1)} ${prev.y.toFixed(1)}, ${cpx1.toFixed(1)} ${p.y.toFixed(1)}, ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
  }).join(' ')

  const areaPath = `${curvePath} L ${pts[pts.length - 1].x.toFixed(1)} ${(padT + ph).toFixed(1)} L ${pts[0].x.toFixed(1)} ${(padT + ph).toFixed(1)} Z`
  const totalActivity = activityData.reduce((s, d) => s + d.count, 0)

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-leaf-600 via-leaf-700 to-emerald-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_30%_50%,white_0%,transparent_60%)]" />
        <div className="container-cropiq relative py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1"><Sprout className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center backdrop-blur-sm p-1" /><span className="text-emerald-200 text-xs font-bold uppercase tracking-wider">ড্যাশবোর্ড</span></div>
              <h1 className="text-xl md:text-2xl font-extrabold">স্বাগতম, {user?.email?.split("@")[0] || "কৃষক"}! 👋</h1>
              <p className="text-emerald-200 mt-1 text-sm">আপনার স্মার্ট কৃষি ড্যাশবোর্ড</p>
            </div>
            <Link href="/tools/disease-detector" className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-bold px-5 py-2.5 rounded-2xl transition-all border border-white/20 text-sm">
              <Microscope className="w-4 h-4" />নতুন স্ক্যান <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="container-cropiq py-5 md:py-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {statCards.map((s, i) => (
            <Link key={i} href={s.href} className="card-hover group p-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${s.iconBg} group-hover:scale-110 transition-transform`}><s.icon className="w-5 h-5" /></div>
              <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-0.5 font-medium">{s.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── LEFT COLUMN: Quick Actions + User Activity ── */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Quick Actions */}
            <div className="card-default">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-leaf-100 rounded-xl flex items-center justify-center"><Zap className="w-4 h-4 text-leaf-600" /></div>
                <h3 className="font-bold text-gray-800 text-sm">দ্রুত অ্যাকশন</h3>
              </div>
              <div className="space-y-1">
                {quickActions.map((a, i) => (
                  <Link key={i} href={a.href} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${a.hover} group`}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-gray-100 group-hover:shadow-sm"><a.icon className="w-4 h-4 text-gray-500 group-hover:text-leaf-600" /></div>
                    <span className="text-sm font-semibold text-gray-700 flex-1">{a.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-leaf-500 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs text-gray-400 font-medium">
                <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                <span>CropIQ টুলস</span>
              </div>
            </div>

            {/* ── User Activity Wave Chart ── */}
            <div className="card-default">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">User Activity</h3>
                  <p className="text-[10px] text-gray-400 font-medium">গত ৭ দিনের কার্যক্রম</p>
                </div>
                <div className="ml-auto text-right">
                  <span className="text-lg font-extrabold text-gray-800">{totalActivity}</span>
                  <span className="text-[10px] text-gray-400 ml-0.5">মোট</span>
                </div>
              </div>

              {/* Wave Chart */}
              <div className="relative">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                      <stop offset="50%" stopColor="#10b981" stopOpacity="0.10" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
                    </linearGradient>
                    <linearGradient id="waveStroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>

                  {/* Subtle grid lines */}
                  {[0.25, 0.5, 0.75].map(frac => (
                    <line key={frac} x1={padL} y1={(padT + ph * (1 - frac)).toFixed(1)} x2={padL + pw} y2={(padT + ph * (1 - frac)).toFixed(1)} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  ))}

                  {/* Area fill */}
                  <path d={areaPath} fill="url(#waveFill)" />

                  {/* Curve line */}
                  <path d={curvePath} fill="none" stroke="url(#waveStroke)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                  {/* Data dots + labels */}
                  {pts.map((p, i) => (
                    <g key={i}>
                      {/* Outer glow */}
                      <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="5" fill="#10b981" opacity="0.15" />
                      {/* Dot */}
                      <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="3" fill="white" stroke="#10b981" strokeWidth="2" />
                      {/* Value label (only if > 0) */}
                      {p.count > 0 && (
                        <text x={p.x.toFixed(1)} y={(p.y - 9).toFixed(1)} textAnchor="middle" fill="#374151" fontSize="10" fontWeight="800" fontFamily="system-ui">
                          {p.count}
                        </text>
                      )}
                    </g>
                  ))}

                  {/* Day labels */}
                  {pts.map((p, i) => (
                    <text key={i} x={p.x.toFixed(1)} y={H - 3} textAnchor="middle" fill="#9ca3af" fontSize="9" fontWeight="600" fontFamily="system-ui">
                      {p.day}
                    </text>
                  ))}
                </svg>

                {/* Bottom axis line */}
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] text-gray-300 font-medium">৭ দিন পূর্বে</span>
                  <span className="text-[9px] text-gray-300 font-medium">আজ</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Recent Activity ── */}
          <div className="lg:col-span-2">
            <div className="card-default h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 bg-leaf-100 rounded-xl flex items-center justify-center"><Clock className="w-4 h-4 text-leaf-600" /></div><h3 className="font-bold text-gray-800 text-sm">সাম্প্রতিক কার্যক্রম</h3></div>
              {loading ? (
                <div className="space-y-3 flex-1">{[1, 2, 3].map(i => <div key={i} className="flex gap-3 p-3"><div className="w-10 h-10 bg-gray-100 rounded-xl animate-pulse" /><div className="flex-1 space-y-2"><div className="h-4 bg-gray-100 rounded-lg animate-pulse w-3/4" /><div className="h-3 bg-gray-50 rounded-lg animate-pulse w-1/2" /></div></div>)}</div>
              ) : scans.length === 0 ? (
                <div className="flex-1 flex items-center justify-center"><div className="text-center py-8"><div className="w-14 h-14 bg-leaf-50 rounded-2xl flex items-center justify-center mx-auto mb-3"><Sprout className="w-7 h-7 text-leaf-300" /></div><p className="text-sm text-gray-500 font-medium mb-3">এখনও কোন তথ্য নেই। CropIQ টুল ব্যবহার শুরু করুন!</p><Link href="/tools/chatbot" className="btn-primary-sm inline-flex"><MessageCircle className="w-4 h-4" />চ্যাটবট ব্যবহার করুন</Link></div></div>
              ) : (
                <div className="flex-1 space-y-1.5 overflow-y-auto">
                  {scans.map(s => (
                    <div key={s.id} className="flex items-center gap-3 p-3 bg-gray-50/70 rounded-xl hover:bg-gray-100/70 transition-colors group">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${s.confidence > 0.8 ? "bg-red-100" : "bg-amber-100"}`}><Microscope className={`w-4 h-4 ${s.confidence > 0.8 ? "text-red-500" : "text-amber-500"}`} /></div>
                      <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-gray-800 truncate">{s.crop_type} — {s.disease_name}</p><p className="text-xs text-gray-400 mt-0.5">{formatDate(s.created_at)}</p></div>
                      <div className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${s.confidence > 0.8 ? "bg-leaf-50 text-leaf-700 border border-leaf-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>{Math.round(s.confidence * 100)}%</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
