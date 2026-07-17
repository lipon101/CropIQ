"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/AuthContext"
import { createClient } from "@/lib/supabase/client"
import { Microscope, MessageCircle, CloudSun, Bookmark, TrendingUp, ChevronRight, Sprout, Zap, Clock, ArrowRight } from "lucide-react"
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
      try { const { data } = await supabase.from("disease_scans").select("id,crop_type,disease_name,confidence,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10); if (data) setScans(data) }
      catch { } finally { setLoading(false) }
    }; f()
  }, [user])

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

  return (
    <div>
      <div className="bg-gradient-to-r from-leaf-600 via-leaf-700 to-emerald-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_30%_50%,white_0%,transparent_60%)]" />
        <div className="container-cropiq relative py-10 md:py-12">
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

      <div className="container-cropiq py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <Link key={i} href={s.href} className="card-hover group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.iconBg} group-hover:scale-110 transition-transform`}><s.icon className="w-5 h-5" /></div>
              <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-0.5 font-medium">{s.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="card-default">
              <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 bg-leaf-100 rounded-xl flex items-center justify-center"><Zap className="w-4 h-4 text-leaf-600" /></div><h3 className="font-bold text-gray-800 text-sm">দ্রুত অ্যাকশন</h3></div>
              <div className="space-y-1">
                {quickActions.map((a, i) => (
                  <Link key={i} href={a.href} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${a.hover} group`}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-white border border-gray-100 group-hover:shadow-sm"><a.icon className="w-4 h-4 text-gray-500 group-hover:text-leaf-600" /></div>
                    <span className="text-sm font-semibold text-gray-700 flex-1">{a.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-leaf-500 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card-default">
              <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 bg-leaf-100 rounded-xl flex items-center justify-center"><Clock className="w-4 h-4 text-leaf-600" /></div><h3 className="font-bold text-gray-800 text-sm">সাম্প্রতিক কার্যক্রম</h3></div>
              {loading ? (
                <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="flex gap-3 p-3"><div className="w-10 h-10 bg-gray-100 rounded-xl animate-pulse" /><div className="flex-1 space-y-2"><div className="h-4 bg-gray-100 rounded-lg animate-pulse w-3/4" /><div className="h-3 bg-gray-50 rounded-lg animate-pulse w-1/2" /></div></div>)}</div>
              ) : scans.length === 0 ? (
                <div className="text-center py-8"><div className="w-14 h-14 bg-leaf-50 rounded-2xl flex items-center justify-center mx-auto mb-3"><Sprout className="w-7 h-7 text-leaf-300" /></div><p className="text-sm text-gray-500 font-medium mb-3">এখনও কোন তথ্য নেই। CropIQ টুল ব্যবহার শুরু করুন!</p><Link href="/tools/disease-detector" className="btn-primary-sm inline-flex"><Microscope className="w-4 h-4" />রোগ সনাক্তকরণ শুরু করুন</Link></div>
              ) : (
                <div className="space-y-2">
                  {scans.map(s => (
                    <div key={s.id} className="flex items-center gap-3.5 p-3.5 bg-gray-50/70 rounded-xl hover:bg-gray-100/70 transition-colors group">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.confidence > 0.8 ? "bg-red-100" : "bg-amber-100"}`}><Microscope className={`w-4.5 h-4.5 ${s.confidence > 0.8 ? "text-red-500" : "text-amber-500"}`} /></div>
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
