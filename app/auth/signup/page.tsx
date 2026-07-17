"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth/AuthContext"
import { Sprout, Mail, Eye, EyeOff, User, ArrowRight, ShieldCheck, CheckCircle } from "lucide-react"

export default function SignUpPage() {
  const { supabase } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("")
    if (password.length < 6) { setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"); setLoading(false); return }
    const { error: err } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
    if (err) setError("রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।")
    else setSuccess(true)
    setLoading(false)
  }

  if (success) return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="card-hover max-w-md w-full text-center space-y-5 p-10">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-leaf-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-leaf-200/50"><CheckCircle className="w-8 h-8 text-white" /></div>
        <h1 className="text-xl font-extrabold text-gray-900">রেজিস্ট্রেশন সফল হয়েছে!</h1>
        <p className="text-sm text-gray-500 leading-relaxed">আপনার ইমেইলে একটি ভেরিফিকেশন লিংক পাঠানো হয়েছে। দয়া করে ইমেইল চেক করুন।</p>
        <Link href="/auth/signin" className="btn-primary inline-flex">লগইন পেজে যান <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-leaf-50/50 via-white to-emerald-50/30" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-2xl mb-4 shadow-xl shadow-leaf-200/50"><Sprout className="w-7 h-7 text-white" /></div>
          <h1 className="text-2xl font-extrabold text-gray-900">CropIQ তে যোগ দিন</h1>
          <p className="text-sm text-gray-500 mt-1.5">বিনামূল্যে আপনার অ্যাকাউন্ট তৈরি করুন</p>
        </div>

        <form onSubmit={handleSignUp} className="card-hover space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">পুরো নাম</label>
            <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" /><input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field pl-11" placeholder="আপনার নাম লিখুন" required autoComplete="name" /></div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">ইমেইল</label>
            <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-11" placeholder="farmer@example.com" required autoComplete="email" /></div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">পাসওয়ার্ড</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="input-field pr-11" placeholder="কমপক্ষে ৬ অক্ষর" required minLength={6} autoComplete="new-password" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><EyeOff className="w-4.5 h-4.5" /></button>
            </div>
            <p className="text-xs text-gray-400 mt-1">সর্বনিম্ন ৬ অক্ষর</p>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3.5">
            {loading ? <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            : <span className="flex items-center gap-2">অ্যাকাউন্ট তৈরি করুন <ArrowRight className="w-4 h-4" /></span>}
          </button>

          <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div><div className="relative flex justify-center text-xs"><span className="px-3 bg-white text-gray-400">অথবা</span></div></div>

          <p className="text-center text-sm text-gray-500">ইতিমধ্যে অ্যাকাউন্ট আছে? <Link href="/auth/signin" className="text-leaf-600 hover:text-leaf-700 font-bold">লগইন করুন</Link></p>
        </form>

        <div className="mt-5 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-100 shadow-sm text-xs text-gray-500 font-medium"><ShieldCheck className="w-4 h-4 text-leaf-500" />সম্পূর্ণ বিনামূল্যে · কোন ক্রেডিট কার্ড লাগবে না</span>
        </div>
      </div>
    </div>
  )
}
