"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { useAuth } from "@/lib/auth/AuthContext"
import { createClient } from "@/lib/supabase/client"
import {
  Microscope, MessageCircle, CloudSun, Bookmark, Settings, User,
  TrendingUp, Calendar, Activity, ChevronRight, Sprout,
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
    { icon: Microscope, color: "bg-red-100 text-red-600", label: t("dashboard.scans"), value: scans.length, href: "/tools/disease-detector" },
    { icon: MessageCircle, color: "bg-blue-100 text-blue-600", label: t("dashboard.chats"), value: 0, href: "/tools/chatbot" },
    { icon: CloudSun, color: "bg-sky-100 text-sky-600", label: t("dashboard.advisories"), value: 0, href: "/tools/weather-advisory" },
    { icon: Bookmark, color: "bg-earth-100 text-earth-600", label: t("dashboard.saved"), value: 0, href: "#" },
  ]

  const quickActions = [
    { icon: Microscope, label: language === "bn" ? "রোগ সনাক্ত করুন" : "Detect Disease", href: "/tools/disease-detector", color: "hover:bg-red-50" },
    { icon: MessageCircle, label: language === "bn" ? "চ্যাটবট ব্যবহার করুন" : "Use Chatbot", href: "/tools/chatbot", color: "hover:bg-blue-50" },
    { icon: CloudSun, label: language === "bn" ? "আবহাওয়া দেখুন" : "Check Weather", href: "/tools/weather-advisory", color: "hover:bg-sky-50" },
    { icon: TrendingUp, label: language === "bn" ? "বাজারদর দেখুন" : "View Market Prices", href: "/tools/market-prices", color: "hover:bg-amber-50" },
  ]

  return (
    <div className="container-cropiq py-8 md:py-12 animate-fade-in">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {language === "bn" ? "স্বাগতম" : "Welcome"}, {user?.email?.split("@")[0] || "Farmer"}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          {language === "bn"
            ? "আপনার CropIQ ড্যাশবোর্ডে স্বাগতম"
            : "Welcome to your CropIQ dashboard"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <Link key={i} href={stat.href} className="card-cropiq hover:shadow-md transition-all group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="card-cropiq">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-leaf-600" />
              {language === "bn" ? "দ্রুত অ্যাকশন" : "Quick Actions"}
            </h3>
            <div className="space-y-1">
              {quickActions.map((action, i) => (
                <Link
                  key={i}
                  href={action.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${action.color} group`}
                >
                  <action.icon className="w-5 h-5 text-gray-500 group-hover:text-leaf-600" />
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="card-cropiq">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-leaf-600" />
              {t("dashboard.recent")}
            </h3>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : scans.length === 0 ? (
              <div className="text-center py-8">
                <Sprout className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">{t("dashboard.noData")}</p>
                <Link href="/tools/disease-detector" className="btn-primary text-sm mt-4 inline-block">
                  {language === "bn" ? "রোগ সনাক্তকরণ শুরু করুন" : "Start Disease Detection"}
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {scans.map((scan) => (
                  <div key={scan.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                      <Microscope className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {scan.crop_type} — {scan.disease_name}
                      </p>
                      <p className="text-xs text-gray-400">{formatDate(scan.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        scan.confidence > 0.8 ? "bg-leaf-100 text-leaf-700" : "bg-earth-100 text-earth-700"
                      }`}>
                        {Math.round(scan.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
