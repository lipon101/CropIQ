"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { useAuth } from "@/lib/auth/AuthContext"
import { createClient } from "@/lib/supabase/client"
import {
  Microscope, MessageCircle, CloudSun, Bookmark, TrendingUp,
  Activity, ChevronRight, Sprout, Sparkles, Clock, ArrowRight,
  ShieldCheck, Zap
} from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

interface ScanRecord {
  id: string
  crop_type: string
  disease_name: string
  confidence: number
  created_at: string
}

export default function DashboardPage() {
  const { t, language } = useLanguage()
  const { user } = useAuth()
  const [scans, setScans] = useState<ScanRecord[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      try {
        const { data } = await supabase
          .from("disease_scans")
          .select("id, crop_type, disease_name, confidence, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10)
        if (data) setScans(data)
      } catch { /* table might not exist yet */ }
      setLoading(false)
    }
    fetchData()
  }, [user])

  const statCards = [
    { icon: Microscope, gradient: "from-red-500 to-rose-600", iconBg: "bg-red-100 text-red-600", label: t("dashboard.scans"), value: scans.length, href: "/tools/disease-detector", metric: language === "bn" ? "টি স্ক্যান" : "scans" },
    { icon: MessageCircle, gradient: "from-blue-500 to-indigo-600", iconBg: "bg-blue-100 text-blue-600", label: t("dashboard.chats"), value: 0, href: "/tools/chatbot", metric: language === "bn" ? "টি চ্যাট" : "chats" },
    { icon: CloudSun, gradient: "from-sky-500 to-cyan-600", iconBg: "bg-sky-100 text-sky-600", label: t("dashboard.advisories"), value: 0, href: "/tools/weather-advisory", metric: language === "bn" ? "টি পরামর্শ" : "advisories" },
    { icon: Bookmark, gradient: "from-amber-500 to-orange-600", iconBg: "bg-amber-100 text-amber-600", label: t("dashboard.saved"), value: 0, href: "#", metric: language === "bn" ? "টি সংরক্ষিত" : "saved" },
  ]

  const quickActions = [
    { icon: Microscope, label: language === "bn" ? "রোগ সনাক্ত করুন" : "Detect Disease", href: "/tools/disease-detector", gradient: "from-red-500 to-rose-600", bgHover: "hover:bg-red-50" },
    { icon: MessageCircle, label: language === "bn" ? "চ্যাটবট ব্যবহার করুন" : "Use Chatbot", href: "/tools/chatbot", gradient: "from-blue-500 to-indigo-600", bgHover: "hover:bg-blue-50" },
    { icon: CloudSun, label: language === "bn" ? "আবহাওয়া দেখুন" : "Check Weather", href: "/tools/weather-advisory", gradient: "from-sky-500 to-cyan-600", bgHover: "hover:bg-sky-50" },
    { icon: TrendingUp, label: language === "bn" ? "বাজারদর দেখুন" : "View Market Prices", href: "/tools/market-prices", gradient: "from-amber-500 to-orange-600", bgHover: "hover:bg-amber-50" },
  ]

  return (
    <div>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-leaf-600 via-leaf-700 to-emerald-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.05]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-2xl" />
        <div className="container-cropiq relative py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Sprout className="w-4 h-4" />
                </div>
                <span className="text-emerald-200 text-xs font-bold uppercase tracking-wider">
                  {language === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {language === "bn" ? "স্বাগতম" : "Welcome"}, {user?.email?.split("@")[0] || "Farmer"}! 👋
              </h1>
              <p className="text-emerald-200 mt-1 text-sm">
                {language === "bn"
                  ? "আপনার স্মার্ট কৃষি ড্যাশবোর্ড"
                  : "Your smart agriculture dashboard"}
              </p>
            </div>
            <Link
              href="/tools/disease-detector"
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white font-bold px-5 py-3 rounded-xl hover:bg-white/25 transition-all border border-white/20 text-sm"
            >
              <Microscope className="w-4 h-4" />
              {language === "bn" ? "নতুন স্ক্যান" : "New Scan"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="container-cropiq py-8 md:py-10 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <Link key={i} href={stat.href} className="group card-cropiq hover:shadow-premium transition-all duration-300 hover:-translate-y-1">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-5.5 h-5.5" />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{stat.value}</p>
                  <span className="text-xs text-gray-400 font-medium">{stat.metric}</span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5 font-medium">{stat.label}</p>
              </div>
              {/* Gradient bar at bottom */}
              <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="card-cropiq">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-leaf-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-4 h-4 text-leaf-600" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">
                  {language === "bn" ? "দ্রুত অ্যাকশন" : "Quick Actions"}
                </h3>
              </div>
              <div className="space-y-1.5">
                {quickActions.map((action, i) => (
                  <Link
                    key={i}
                    href={action.href}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 ${action.bgHover} group`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-gray-100 group-hover:shadow-sm transition-all`}>
                      <action.icon className="w-4 h-4 text-gray-500 group-hover:text-leaf-600 transition-colors" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 flex-1">{action.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-leaf-500 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="card-cropiq">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-leaf-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-4 h-4 text-leaf-600" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">{t("dashboard.recent")}</h3>
                </div>
                {scans.length > 0 && (
                  <Link href="/tools/disease-detector" className="text-xs font-semibold text-leaf-600 hover:text-leaf-700 transition-colors">
                    {language === "bn" ? "সব দেখুন" : "View All"}
                  </Link>
                )}
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 p-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl skeleton" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-100 rounded-lg skeleton w-3/4" />
                        <div className="h-3 bg-gray-50 rounded-lg skeleton w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : scans.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-leaf-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sprout className="w-8 h-8 text-leaf-300" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium mb-2">{t("dashboard.noData")}</p>
                  <Link href="/tools/disease-detector" className="btn-primary text-sm inline-flex items-center gap-2 py-2.5 px-5">
                    <Microscope className="w-4 h-4" />
                    {language === "bn" ? "রোগ সনাক্তকরণ শুরু করুন" : "Start Disease Detection"}
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {scans.map((scan) => (
                    <div key={scan.id} className="flex items-center gap-4 p-4 bg-gray-50/70 rounded-xl hover:bg-gray-100/70 transition-colors group">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        scan.confidence > 0.8 ? "bg-red-100" : "bg-amber-100"
                      }`}>
                        <Microscope className={`w-5 h-5 ${
                          scan.confidence > 0.8 ? "text-red-500" : "text-amber-500"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {scan.crop_type} — {scan.disease_name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(scan.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                          scan.confidence > 0.8
                            ? "bg-leaf-50 text-leaf-700 border border-leaf-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {Math.round(scan.confidence * 100)}%
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-leaf-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
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
