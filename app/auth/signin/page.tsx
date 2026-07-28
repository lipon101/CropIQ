"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/AuthContext"
import { Sprout, Mail, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react"

export default function SignInPage() {
  const { supabase } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("")
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) setError("লগইন ব্যর্থ হয়েছে। ইমেইল ও পাসওয়ার্ড চেক করুন।")
    else { router.push("/dashboard"); router.refresh() }
    setLoading(false)
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-leaf-50/50 via-white to-emerald-50/30" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-2xl mb-4 shadow-xl shadow-leaf-200/50"><Sprout className="w-7 h-7 text-white" /></div>
          <h1 className="text-2xl font-extrabold text-gray-900">আবার স্বাগতম</h1>
          <p className="text-sm text-gray-500 mt-1.5">আপনার CropIQ অ্যাকাউন্টে লগইন করুন</p>
        </div>

        <form onSubmit={handleSignIn} className="card-hover space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">ইমেইল</label>
            <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-11" placeholder="farmer@example.com" required autoComplete="email" /></div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">পাসওয়ার্ড</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="input-field pr-11" placeholder="••••••••" required autoComplete="current-password" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><EyeOff className="w-4.5 h-4.5" /></button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3.5">
            {loading ? <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            : <span className="flex items-center gap-2">লগইন করুন <ArrowRight className="w-4 h-4" /></span>}
          </button>

          <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div><div className="relative flex justify-center text-xs"><span className="px-3 bg-white text-gray-400">অথবা</span></div></div>

          <p className="text-center text-sm text-gray-500">অ্যাকাউন্ট নেই? <Link href="/auth/signup" className="text-leaf-600 hover:text-leaf-700 font-bold">রেজিস্টার করুন</Link></p>
        </form>

        <div className="mt-5 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-100 shadow-sm text-xs text-gray-500 font-medium"><ShieldCheck className="w-4 h-4 text-leaf-500" />সুরক্ষিত লগইন · আপনার তথ্য নিরাপদ</span>
        </div>
      </div>
    </div>
  )
}
