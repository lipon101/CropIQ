"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth/AuthContext"
import Link from "next/link"
import { User, Mail, Shield, Sprout, ChevronLeft, Save, Check, MapPin, Phone, Calendar } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.user_metadata?.full_name || "")
  const [phone, setPhone] = useState(user?.user_metadata?.phone || "")
  const [location, setLocation] = useState(user?.user_metadata?.location || "")
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    // Simulate save
    await new Promise(r => setTimeout(r, 800))
    setSaved(true)
    setLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })
    : "—"

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-100 px-4 md:px-8 py-2.5 flex items-center gap-3 shrink-0 shadow-sm">
        <Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all">
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">ড্যাশবোর্ড</span>
        </Link>
        <div className="flex items-center gap-2.5 flex-1 justify-center sm:justify-start sm:flex-none">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center shadow-sm">
            <User className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-sm md:text-base font-extrabold text-gray-800">প্রোফাইল সেটিংস</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 md:px-10 lg:px-14 py-6 md:py-8 max-w-xl mx-auto w-full space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Avatar Banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 px-6 py-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/[0.04] rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
            <div className="relative flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white shadow-lg border border-white/20">
                {user?.email?.[0]?.toUpperCase() || "কৃ"}
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-white">{name || "কৃষক"}</h2>
                <p className="text-emerald-200 text-sm font-medium flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />কৃষক
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-5">
            {/* Email (read-only) */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <Mail className="w-3.5 h-3.5" />ইমেইল
              </label>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-sm font-semibold text-gray-700">{user?.email || "bubt1337@gmail.com"}</span>
                <span className="ml-auto text-[10px] font-bold text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">ভেরিফাইড</span>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <User className="w-3.5 h-3.5" />পুরো নাম
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none text-sm font-semibold text-gray-800 transition-all"
                placeholder="আপনার নাম লিখুন"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <Phone className="w-3.5 h-3.5" />ফোন নম্বর
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none text-sm font-semibold text-gray-800 transition-all"
                placeholder="+৮৮০ ১XXX XXXXXX"
              />
            </div>

            {/* Location */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5" />অবস্থান
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none text-sm font-semibold text-gray-800 transition-all"
                placeholder="জেলা, বাংলাদেশ"
              />
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-extrabold text-gray-800 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-400" />অ্যাকাউন্ট তথ্য
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />যোগদানের তারিখ
              </span>
              <span className="text-sm font-semibold text-gray-700">{joinDate}</span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-gray-400" />অ্যাকাউন্ট টাইপ
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                <Sprout className="w-3.5 h-3.5" />কৃষক (বিনামূল্যে)
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className={`w-full py-3.5 rounded-2xl font-extrabold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
            saved
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200/30"
              : "bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/10 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]"
          }`}
        >
          {saved ? (
            <><Check className="w-4 h-4" />সংরক্ষিত হয়েছে</>
          ) : loading ? (
            <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>সংরক্ষণ হচ্ছে...</>
          ) : (
            <><Save className="w-4 h-4" />পরিবর্তন সংরক্ষণ করুন</>
          )}
        </button>

        {/* Nav Links */}
        <div className="flex justify-center gap-3 pt-2">
          <Link href="/dashboard" className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors">
            ← ড্যাশবোর্ডে ফিরুন
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/" className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors">
            হোম পেজ
          </Link>
        </div>
      </div>
    </div>
  )
}
