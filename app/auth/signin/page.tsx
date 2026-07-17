"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/AuthContext"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Sprout, Mail, Phone, Eye, EyeOff } from "lucide-react"

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
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-leaf-100 rounded-2xl mb-4">
            <Sprout className="w-8 h-8 text-leaf-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === "bn" ? "আবার স্বাগতম" : "Welcome Back"}
          </h1>
          <p className="text-gray-500 mt-1">
            {language === "bn" ? "আপনার CropIQ অ্যাকাউন্টে লগইন করুন" : "Sign in to your CropIQ account"}
          </p>
        </div>

        <form onSubmit={handleSignIn} className="card-cropiq space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === "bn" ? "ইমেইল" : "Email"}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="farmer@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === "bn" ? "পাসওয়ার্ড" : "Password"}
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-10"
                placeholder="••••••••"
                required
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPw ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading
              ? language === "bn"
                ? "লগইন হচ্ছে..."
                : "Signing in..."
              : language === "bn"
              ? "লগইন করুন"
              : "Sign In"}
          </button>

          <p className="text-center text-sm text-gray-500">
            {language === "bn" ? "অ্যাকাউন্ট নেই?" : "Don't have an account?"}{" "}
            <Link href="/auth/signup" className="text-leaf-600 hover:text-leaf-700 font-medium">
              {language === "bn" ? "রেজিস্টার করুন" : "Sign Up"}
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
