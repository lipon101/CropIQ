"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/AuthContext"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Sprout, Mail, Eye, EyeOff } from "lucide-react"

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
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password.length < 6) {
      setError(language === "bn" ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" : "Password must be at least 6 characters")
      setLoading(false)
      return
    }

    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })

    if (err) {
      setError(language === "bn" ? "রেজিস্ট্রেশন ব্যর্থ হয়েছে" : err.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="card-cropiq max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-leaf-100 rounded-full flex items-center justify-center mx-auto">
            <Sprout className="w-8 h-8 text-leaf-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === "bn" ? "রেজিস্ট্রেশন সফল হয়েছে!" : "Registration Successful!"}
          </h1>
          <p className="text-gray-500">
            {language === "bn"
              ? "আপনার ইমেইলে একটি ভেরিফিকেশন লিংক পাঠানো হয়েছে। দয়া করে ইমেইল চেক করুন।"
              : "A verification link has been sent to your email. Please check your inbox."}
          </p>
          <Link href="/auth/signin" className="btn-primary inline-block">
            {language === "bn" ? "লগইন পেজে যান" : "Go to Sign In"}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-leaf-100 rounded-2xl mb-4">
            <Sprout className="w-8 h-8 text-leaf-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === "bn" ? "CropIQ তে যোগ দিন" : "Join CropIQ"}
          </h1>
          <p className="text-gray-500 mt-1">
            {language === "bn" ? "বিনামূল্যে আপনার অ্যাকাউন্ট তৈরি করুন" : "Create your free account"}
          </p>
        </div>

        <form onSubmit={handleSignUp} className="card-cropiq space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === "bn" ? "নাম" : "Full Name"}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder={language === "bn" ? "আপনার নাম লিখুন" : "Enter your name"}
              required
            />
          </div>

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
                placeholder={language === "bn" ? "কমপক্ষে ৬ অক্ষর" : "At least 6 characters"}
                required
                minLength={6}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPw ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading
              ? language === "bn"
                ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
                : "Creating account..."
              : language === "bn"
              ? "অ্যাকাউন্ট তৈরি করুন"
              : "Create Account"}
          </button>

          <p className="text-center text-sm text-gray-500">
            {language === "bn" ? "ইতিমধ্যে অ্যাকাউন্ট আছে?" : "Already have an account?"}{" "}
            <Link href="/auth/signin" className="text-leaf-600 hover:text-leaf-700 font-medium">
              {language === "bn" ? "লগইন করুন" : "Sign In"}
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
