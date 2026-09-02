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

  const handleGoogleSignIn = async () => {
    setLoading(true); setError("")
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (err) {
      setError("Google দিয়ে লগইন করা যায়নি। আবার চেষ্টা করুন।")
      setLoading(false)
    }
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

          <button type="button" onClick={handleGoogleSignIn} disabled={loading} className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-base hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
              <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
            Google দিয়ে চালিয়ে যান
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
