"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/AuthContext"
import { createClient } from "@/lib/supabase/client"
import { Microscope, MessageCircle, CloudSun, Bookmark, TrendingUp, ChevronRight, Sprout, Zap, Clock, ArrowRight, Loader2, Trash2 } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

interface ActivityItem {
  type: "scan" | "chat" | "advisory"
  id: string
  created_at: string
  // scan fields
  crop_type?: string; disease_name?: string; confidence?: number
  // chat fields
  question?: string
  // advisory fields
  district?: string; crop?: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [stats, setStats] = useState({ scans: 0, chats: 0, advisories: 0, saved: 0 })
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    if (!user) return
    // ── Real counts (parallel) ──
    const [scanR, chatR, advR, savedR] = await Promise.allSettled([
      supabase.from("disease_scans").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("chat_sessions").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("weather_advisories").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("saved_items").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    ])
    setStats({
      scans: scanR.status === "fulfilled" ? (scanR.value.count ?? 0) : 0,
      chats: chatR.status === "fulfilled" ? (chatR.value.count ?? 0) : 0,
      advisories: advR.status === "fulfilled" ? (advR.value.count ?? 0) : 0,
      saved: savedR.status === "fulfilled" ? (savedR.value.count ?? 0) : 0,
    })

    // ── Unified recent activity ──
    const [scans, chats, advisories] = await Promise.allSettled([
      supabase.from("disease_scans").select("id,crop_type,disease_name,confidence,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
      supabase.from("chat_sessions").select("id,question,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
      supabase.from("weather_advisories").select("id,district,crop,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
    ])

    const items: ActivityItem[] = []
    if (scans.status === "fulfilled" && scans.value.data) items.push(...scans.value.data.map((s: any) => ({ type: "scan" as const, ...s })))
    if (chats.status === "fulfilled" && chats.value.data) items.push(...chats.value.data.map((c: any) => ({ type: "chat" as const, ...c })))
    if (advisories.status === "fulfilled" && advisories.value.data) items.push(...advisories.value.data.map((a: any) => ({ type: "advisory" as const, ...a })))

    items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    setRecentActivity(items.slice(0, 15))
    setLoading(false)
  }

  useEffect(() => {
    if (!user) return
    fetchAll().catch(() => setLoading(false))
  }, [user])

  // ── Delete activity item ──
  const deleteActivity = async (item: ActivityItem) => {
    if (!user) return
    const label = item.type === "scan" ? "স্ক্যান" : item.type === "chat" ? "চ্যাট" : "পরামর্শ"
    if (!confirm(`এই ${label} রেকর্ড ডিলিট করতে চান?`)) return

    // Animate out
    setRecentActivity(prev => prev.filter(a => !(a.type === item.type && a.id === item.id)))

    try {
      let table = ""
      if (item.type === "scan") table = "disease_scans"
      else if (item.type === "chat") table = "chat_sessions"
      else table = "weather_advisories"

      const { error } = await supabase.from(table).delete().eq("id", item.id)

      if (error) {
        console.error("Dashboard delete failed:", error)
        // Revert — re-fetch all
        setLoading(true)
        fetchAll()
        return
      }

      // Update stats
      setStats(prev => ({
        ...prev,
        scans: item.type === "scan" ? prev.scans - 1 : prev.scans,
        chats: item.type === "chat" ? prev.chats - 1 : prev.chats,
        advisories: item.type === "advisory" ? prev.advisories - 1 : prev.advisories,
      }))
    } catch {
      // Re-fetch on unexpected error
      fetchAll()
    }
  }

  const statCards = [
    { icon: Microscope, iconBg: "bg-red-100 text-red-600", label: "রোগ স্ক্যান", value: stats.scans, href: "/tools/disease-detector" },
    { icon: MessageCircle, iconBg: "bg-blue-100 text-blue-600", label: "চ্যাট সেশন", value: stats.chats, href: "/tools/chatbot" },
    { icon: CloudSun, iconBg: "bg-sky-100 text-sky-600", label: "আবহাওয়া পরামর্শ", value: stats.advisories, href: "/tools/weather-advisory" },
    { icon: Bookmark, iconBg: "bg-amber-100 text-amber-600", label: "সংরক্ষিত", value: stats.saved, href: "/tools/disease-detector" },
  ]

  const quickActions = [
    { icon: Microscope, label: "রোগ সনাক্ত করুন", href: "/tools/disease-detector", hover: "hover:bg-red-50" },
    { icon: MessageCircle, label: "চ্যাটবট ব্যবহার করুন", href: "/tools/chatbot", hover: "hover:bg-blue-50" },
    { icon: CloudSun, label: "আবহাওয়া দেখুন", href: "/tools/weather-advisory", hover: "hover:bg-sky-50" },
    { icon: TrendingUp, label: "বাজারদর দেখুন", href: "/tools/market-prices", hover: "hover:bg-amber-50" },
  ]

  const activityIcon = (item: ActivityItem) => {
    if (item.type === "scan") return { icon: Microscope, bg: item.confidence && item.confidence > 0.8 ? "bg-red-100 text-red-500" : "bg-amber-100 text-amber-500" }
    if (item.type === "chat") return { icon: MessageCircle, bg: "bg-blue-100 text-blue-500" }
    return { icon: CloudSun, bg: "bg-sky-100 text-sky-500" }
  }

  const activityText = (item: ActivityItem) => {
    if (item.type === "scan") return { title: `${item.crop_type || ""} — ${item.disease_name || ""}`, badge: item.confidence ? `${Math.round(item.confidence * 100)}%` : null, badgeClass: item.confidence && item.confidence > 0.8 ? "bg-leaf-50 text-leaf-700 border border-leaf-200" : "bg-amber-50 text-amber-700 border border-amber-200" }
    if (item.type === "chat") return { title: (item.question || "").slice(0, 60) + ((item.question || "").length > 60 ? "..." : ""), badge: null, badgeClass: "" }
    return { title: `${item.district || ""} — ${item.crop || ""}`, badge: null, badgeClass: "" }
  }

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
        {/* Stat cards — REAL counts from Supabase */}
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
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="card-default h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-leaf-100 rounded-xl flex items-center justify-center"><Zap className="w-4 h-4 text-leaf-600" /></div>
                <h3 className="font-bold text-gray-800 text-sm">দ্রুত অ্যাকশন</h3>
              </div>
              <div className="space-y-1 flex-1">
                {quickActions.map((a, i) => (
                  <Link key={i} href={a.href} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${a.hover} group`}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-gray-100 group-hover:shadow-sm"><a.icon className="w-4 h-4 text-gray-500 group-hover:text-leaf-600" /></div>
                    <span className="text-sm font-semibold text-gray-700 flex-1">{a.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-leaf-500 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 font-medium">
                  <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CropIQ টুলস</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity — FEED from all tools */}
          <div className="lg:col-span-2">
            <div className="card-default h-full flex flex-col min-h-[400px]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-leaf-100 rounded-xl flex items-center justify-center"><Clock className="w-4 h-4 text-leaf-600" /></div>
                <h3 className="font-bold text-gray-800 text-sm">সাম্প্রতিক কার্যক্রম</h3>
              </div>

              {loading ? (
                <div className="space-y-3 flex-1">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex gap-3 p-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-100 rounded-lg animate-pulse w-3/4" />
                        <div className="h-3 bg-gray-50 rounded-lg animate-pulse w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center py-8">
                    <div className="w-14 h-14 bg-leaf-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Sprout className="w-7 h-7 text-leaf-300" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium mb-3">এখনও কোন তথ্য নেই। CropIQ টুল ব্যবহার শুরু করুন!</p>
                    <Link href="/tools/chatbot" className="btn-primary-sm inline-flex"><MessageCircle className="w-4 h-4" />চ্যাটবট ব্যবহার করুন</Link>
                  </div>
                </div>
              ) : (
                <div className="flex-1 space-y-1.5 overflow-y-auto">
                  {recentActivity.map(item => {
                    const { icon: Icon, bg } = activityIcon(item)
                    const { title, badge, badgeClass } = activityText(item)
                    const linkHref = item.type === "scan" 
                      ? "/tools/disease-detector" 
                      : item.type === "chat" 
                        ? "/tools/chatbot" 
                        : "/tools/weather-advisory"
                    return (
                      <div key={`${item.type}_${item.id}`} className="flex items-center gap-3 p-3 bg-gray-50/70 rounded-xl hover:bg-gray-100/70 transition-colors group">
                        <Link href={linkHref} className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{formatDate(item.created_at)}</p>
                          </div>
                          {badge && (
                            <div className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${badgeClass}`}>{badge}</div>
                          )}
                        </Link>
                        <button
                          onClick={(e) => { e.preventDefault(); deleteActivity(item) }}
                          className="shrink-0 p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all "
                          title="ডিলিট"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
