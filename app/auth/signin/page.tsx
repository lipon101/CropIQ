"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/AuthContext"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Sprout, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles } from "lucide-react"

export default function SignInPage() {
  const { t, language } = useLanguage()
  const { supabase } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError(language === "bn" ? "লগইন ব্যর্থ হয়েছে। ইমেইল ও পাসওয়ার্ড চেক করুন।" : err.message)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-leaf-50/60 via-white to-emerald-50/30" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-leaf-200/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-200/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

      <div className="relative w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-2xl mb-5 shadow-xl shadow-leaf-200/50">
            <Sprout className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {language === "bn" ? "আবার স্বাগতম" : "Welcome Back"}
          </h1>
          <p className="text-gray-500 mt-2">
            {language === "bn"
              ? "আপনার CropIQ অ্যাকাউন্টে লগইন করুন"
              : "Sign in to your CropIQ account"}
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSignIn} className="card-premium space-y-5 animate-slide-up">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl text-sm flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === "bn" ? "ইমেইল" : "Email Address"}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-12"
                placeholder="farmer@example.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">
                {language === "bn" ? "পাসওয়ার্ড" : "Password"}
              </label>
            </div>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-12"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3.5">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {language === "bn" ? "লগইন হচ্ছে..." : "Signing in..."}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                {language === "bn" ? "লগইন করুন" : "Sign In"}
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-gray-400 font-medium">
                {language === "bn" ? "অথবা" : "or"}
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              {language === "bn" ? "অ্যাকাউন্ট নেই?" : "Don't have an account?"}{" "}
              <Link href="/auth/signup" className="text-leaf-600 hover:text-leaf-700 font-bold transition-colors inline-flex items-center gap-1">
                {language === "bn" ? "রেজিস্টার করুন" : "Create one"}
                <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </form>

        {/* Trust Badge */}
        <div className="mt-6 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-100 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-leaf-500" />
            <span className="text-xs text-gray-500 font-medium">
              {language === "bn" ? "সুরক্ষিত লগইন · আপনার তথ্য নিরাপদ" : "Secure Login · Your data is safe"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
