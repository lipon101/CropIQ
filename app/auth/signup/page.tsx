"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/AuthContext"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Sprout, Mail, Eye, EyeOff, User, ArrowRight, ShieldCheck, CheckCircle } from "lucide-react"

export default function SignUpPage() {
  const { t, language } = useLanguage()
  const { supabase } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("")
    if (password.length < 6) { setError(language==="bn"?"পাসওয়ার্ড কমপক্ষে ৬ অক্ষর":"Password must be 6+ characters"); setLoading(false); return }
    const { error: err } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
    if (err) setError(language==="bn"?"রেজিস্ট্রেশন ব্যর্থ":"Registration failed")
    else setSuccess(true)
    setLoading(false)
  }

  if (success) return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="card-premium max-w-md w-full text-center space-y-6 p-10">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-leaf-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-leaf-200/50"><CheckCircle className="w-10 h-10 text-white" /></div>
        <h1 className="text-2xl font-extrabold text-gray-900">{language==="bn"?"রেজিস্ট্রেশন সফল!":"Registration Successful!"}</h1>
        <p className="text-gray-500 leading-relaxed">{language==="bn"?"আপনার ইমেইলে ভেরিফিকেশন লিংক পাঠানো হয়েছে। ইমেইল চেক করুন।":"Check your email for the verification link."}</p>
        <Link href="/auth/signin" className="btn-primary-md inline-flex"><ArrowRight className="w-4 h-4" />{language==="bn"?"লগইন পেজে যান":"Go to Sign In"}</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-leaf-50/50 via-white to-emerald-50/30" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-2xl mb-5 shadow-xl shadow-leaf-200/50"><Sprout className="w-8 h-8 text-white" /></div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{language==="bn"?"CropIQ তে যোগ দিন":"Join CropIQ"}</h1>
          <p className="text-gray-500 mt-1.5">{language==="bn"?"বিনামূল্যে অ্যাকাউন্ট তৈরি করুন":"Create your free account"}</p>
        </div>

        <form onSubmit={handleSignUp} className="card-premium space-y-5">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{language==="bn"?"পুরো নাম":"Full Name"}</label>
            <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={name} onChange={e=>setName(e.target.value)} className="input-field pl-12" placeholder={language==="bn"?"আপনার নাম":"Your name"} required autoComplete="name" /></div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{language==="bn"?"ইমেইল":"Email"}</label>
            <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input-field pl-12" placeholder="farmer@example.com" required autoComplete="email" /></div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{language==="bn"?"পাসওয়ার্ড":"Password"}</label>
            <div className="relative">
              <input type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} className="input-field pr-12" placeholder={language==="bn"?"কমপক্ষে ৬ অক্ষর":"At least 6 characters"} required minLength={6} autoComplete="new-password" />
              <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><EyeOff className="w-5 h-5" /></button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary-md w-full text-[15px] py-3.5">
            {loading ? <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            : <>{language==="bn"?"অ্যাকাউন্ট তৈরি করুন":"Create Account"}<ArrowRight className="w-4 h-4" /></>}
          </button>

          <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div><div className="relative flex justify-center text-xs"><span className="px-4 bg-white text-gray-400 font-medium">{language==="bn"?"অথবা":"or"}</span></div></div>

          <p className="text-center text-sm text-gray-500">{language==="bn"?"ইতিমধ্যে অ্যাকাউন্ট আছে?":"Already have an account?"} <Link href="/auth/signin" className="text-leaf-600 hover:text-leaf-700 font-bold">{language==="bn"?"লগইন করুন":"Sign In"}</Link></p>
        </form>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-100 shadow-sm"><ShieldCheck className="w-4 h-4 text-leaf-500" /><span className="text-xs text-gray-500 font-medium">{language==="bn"?"সম্পূর্ণ বিনামূল্যে · কোন ক্রেডিট কার্ড লাগবে না":"Free · No credit card needed"}</span></div>
        </div>
      </div>
    </div>
  )
}
