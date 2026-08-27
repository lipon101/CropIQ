"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/AuthContext"
import Link from "next/link"
import { User, Mail, Shield, Sprout, ChevronLeft, ChevronDown, Save, Check, Phone, Calendar, AlertCircle, MapPin } from "lucide-react"
import { DISTRICTS } from "@/lib/constants/districts"

export default function SettingsPage() {
  const { supabase, user } = useAuth()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [district, setDistrict] = useState("")
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Load profile from the profiles table (fall back to auth user metadata for
  // pre-migration users whose row hasn't been created yet)
  useEffect(() => {
    if (!user?.id) return
    let cancelled = false
    const meta = user.user_metadata || {}

    ;(async () => {
      let profile: { full_name?: string | null; phone?: string | null; district?: string | null } | null = null
      try {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, phone, district")
          .eq("id", user.id)
          .maybeSingle()
        profile = data
      } catch {
        // profiles table missing (migration not applied yet) — keep metadata fallback
      }
      if (cancelled) return
      setName(profile?.full_name || meta.full_name || "")
      setPhone(profile?.phone || meta.phone || "")
      // Normalize legacy free-text / Bengali names to the canonical English district id
      const stored = profile?.district || meta.location || ""
      const matched = DISTRICTS.find(d => d.name_en === stored || d.name_bn === stored)
      setDistrict(matched ? matched.name_en : "")
    })()

    return () => { cancelled = true }
  }, [user?.id, supabase])

  const handleSave = async () => {
    if (!user) { setError("লগইন করা নেই"); return }
    setLoading(true)
    setError("")
    try {
      // Bulletproof split Insert / Update to completely bypass PostgreSQL/Supabase client upsert RLS bugs on new rows
      const { data: existing } = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle()
      
      let dbError = null
      if (existing) {
        const { error: err } = await supabase.from("profiles").update({
          full_name: name.trim(),
          phone: phone.trim(),
          district: district || null,
        }).eq("id", user.id)
        dbError = err
      } else {
        const { error: err } = await supabase.from("profiles").insert({
          id: user.id,
          full_name: name.trim(),
          phone: phone.trim(),
          district: district || null,
        })
        dbError = err
      }

      if (dbError) throw dbError
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: any) {
      setError(e?.message || "সংরক্ষণ ব্যর্থ হয়েছে — আবার চেষ্টা করুন")
    } finally {
      setLoading(false)
    }
  }

  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })
    : "—"

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col w-full">
      {/* ── Premium Navigation Header (Consistent with CropIQ layout) ── */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 md:px-6 py-2.5 flex items-center justify-between shrink-0 shadow-sm sticky top-0 z-40">
        <Link href="/dashboard" className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all">
          <ChevronLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
          <span>ড্যাশবোর্ড</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-gradient-to-br from-leaf-500 to-emerald-600 shadow-sm">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <h1 className="text-sm font-extrabold text-gray-800">প্রোফাইল সেটিংস</h1>
        </div>
        <div className="w-20" /> {/* Spacer for header balance */}
      </div>

      {/* ── Main Content Container ── */}
      <div className="flex-1 px-4 sm:px-6 py-6 max-w-xl mx-auto w-full space-y-6">
        
        {/* Error Notification */}
        {error && (
          <div className="bg-red-50/80 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* ── Premium Profile Settings Card ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden w-full">
          
          {/* Avatar & Subtitle Banner */}
          <div className="bg-gradient-to-r from-leaf-600 to-emerald-700 px-6 py-7 relative overflow-hidden flex items-center gap-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08)_0%,transparent_50%)]" />
            <div className="w-14 h-14 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center text-xl font-extrabold text-white border border-white/20 shadow-md">
              {user?.email?.[0]?.toUpperCase() || "কৃ"}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">{name || "কৃষক"}</h2>
              <p className="text-emerald-100 text-xs font-semibold mt-0.5 flex items-center gap-1">
                <Sprout className="w-3.5 h-3.5" />
                <span>CropIQ নিবন্ধিত কৃষক</span>
              </p>
            </div>
          </div>

          {/* Form Fields Block */}
          <div className="p-5 md:p-6 space-y-4">
            
            {/* Email Field (Read-only) */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 pl-0.5">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span>ইমেইল অ্যাকাউন্ট</span>
              </label>
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50/70 border border-gray-100 rounded-2xl w-full">
                <span className="text-xs font-bold text-gray-600">{user?.email || "bubt1337@gmail.com"}</span>
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">ভেরিফাইড</span>
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 pl-0.5">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span>সম্পূর্ণ নাম</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-leaf-400 focus:ring-4 focus:ring-leaf-50 outline-none text-xs font-bold text-gray-800 transition-all"
                placeholder="আপনার নাম লিখুন"
              />
            </div>

            {/* Phone Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 pl-0.5">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>মোবাইল নম্বর</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-leaf-400 focus:ring-4 focus:ring-leaf-50 outline-none text-xs font-bold text-gray-800 transition-all"
                placeholder="+৮৮০ ১XXX XXXXXX"
              />
            </div>

            {/* District Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 pl-0.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>জেলা নির্বাচন করুন</span>
              </label>
              <div className="relative">
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-leaf-400 focus:ring-4 focus:ring-leaf-50 outline-none text-xs font-bold text-gray-800 transition-all appearance-none cursor-pointer pr-10"
                >
                  <option value="">জেলা নির্বাচন করুন</option>
                  {DISTRICTS.map(d => (
                    <option key={d.name_en} value={d.name_en}>{d.name_bn}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>
        </div>

        {/* ── Account Information Card ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 md:p-6 space-y-3.5">
          <h3 className="text-xs font-extrabold text-gray-800 flex items-center gap-2 pl-0.5 border-b border-gray-50 pb-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <span>অ্যাকাউন্ট ইনফরমেশন</span>
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0 pb-1.5 last:pb-0">
              <span className="text-gray-400 font-bold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>যোগদানের তারিখ</span>
              </span>
              <span className="font-extrabold text-gray-700">{joinDate}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0 pb-1.5 last:pb-0">
              <span className="text-gray-400 font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>অ্যাকাউন্ট ধরন</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-leaf-700 bg-leaf-50 border border-leaf-100 px-3 py-0.5 rounded-full">
                <Sprout className="w-3 h-3" />
                <span>ফ্রি কৃষক অ্যাকাউন্ট</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Premium Action Save Button ── */}
        <button
          onClick={handleSave}
          disabled={loading}
          className={`w-full py-3 rounded-2xl font-extrabold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${
            saved
              ? "bg-leaf-500 text-white shadow-lg shadow-leaf-200/40"
              : "bg-gray-900 hover:bg-gray-800 text-white hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
          }`}
        >
          {saved ? (
            <><Check className="w-4 h-4" />সংরক্ষিত হয়েছে</>
          ) : loading ? (
            <><svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>সংরক্ষণ হচ্ছে...</>
          ) : (
            <><Save className="w-4 h-4" />পরিবর্তন সংরক্ষণ করুন</>
          )}
        </button>

        {/* Navigation Footer Links */}
        <div className="flex justify-center gap-3 pt-2 text-[11px] font-bold">
          <Link href="/dashboard" className="text-gray-400 hover:text-leaf-600 transition-colors">
            ← ড্যাশবোর্ডে ফিরুন
          </Link>
          <span className="text-gray-200">|</span>
          <Link href="/" className="text-gray-400 hover:text-leaf-600 transition-colors">
            হোম পেজ
          </Link>
        </div>

      </div>
    </div>
  )
}
