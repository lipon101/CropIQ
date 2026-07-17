"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/AuthContext"
import { createClient } from "@/lib/supabase/client"
import { Microscope, MessageCircle, CloudSun, Bookmark, TrendingUp, ChevronRight, Sprout, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()
  const [scanCount, setScanCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return
    const f = async () => {
      try {
        const { count } = await supabase
          .from("disease_scans")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
        if (count !== null) setScanCount(count)
      } catch { }
    }; f()
  }, [user])


  const statCards = [
    { icon: Microscope, iconBg: "bg-red-100 text-red-600", label: "রোগ স্ক্যান", value: scanCount, href: "/tools/disease-detector" },
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


        {/* Quick Actions — centered */}
        <div className="max-w-md mx-auto">
          <div className="card-default">
            <div className="flex items-center gap-2 mb-4">
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
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 font-medium">
                <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                <span>CropIQ টুলস</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
