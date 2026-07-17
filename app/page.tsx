"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth/AuthContext"
import { Sprout, Microscope, MessageCircle, DollarSign, CloudSun, ArrowRight, Users, TrendingUp, MapPin, ShieldCheck, ChevronRight, Zap, Star, Globe } from "lucide-react"
import { Footer } from '@/components/layout/Footer'

/* ─── SVG Rice Plant Illustration ─── */
function RicePlantSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Soil base */}
      <ellipse cx="60" cy="185" rx="55" ry="12" fill="url(#soilGrad)" opacity="0.4" />
      {/* Stem 1 */}
      <path d="M55 185 Q52 140 48 90 Q46 60 50 30" stroke="url(#stemGrad)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M50 30 Q48 20 55 15" stroke="url(#stemGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Rice grains 1 */}
      <ellipse cx="48" cy="85" rx="3" ry="7" fill="#d4a843" opacity="0.8" transform="rotate(-15 48 85)" />
      <ellipse cx="47" cy="95" rx="2.5" ry="6" fill="#c9952e" opacity="0.75" transform="rotate(-10 47 95)" />
      <ellipse cx="49" cy="75" rx="2.5" ry="5.5" fill="#dfb84c" opacity="0.7" transform="rotate(-18 49 75)" />
      {/* Leaf 1 */}
      <path d="M53 140 Q35 130 20 135" stroke="#4d7c0f" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M53 110 Q38 100 25 98" stroke="#65a30d" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* Stem 2 */}
      <path d="M60 185 Q58 150 62 100 Q64 70 60 40" stroke="url(#stemGrad)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M60 40 Q62 30 56 22" stroke="url(#stemGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Rice grains 2 */}
      <ellipse cx="60" cy="95" rx="3" ry="7" fill="#d4a843" opacity="0.8" transform="rotate(5 60 95)" />
      <ellipse cx="61" cy="105" rx="2.5" ry="6" fill="#c9952e" opacity="0.75" transform="rotate(8 61 105)" />
      <ellipse cx="59" cy="85" rx="2.5" ry="5.5" fill="#dfb84c" opacity="0.7" transform="rotate(2 59 85)" />
      {/* Leaf 2 */}
      <path d="M62 145 Q78 140 92 145" stroke="#4d7c0f" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M61 115 Q75 110 88 108" stroke="#65a30d" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* Stem 3 */}
      <path d="M65 185 Q68 155 65 105 Q63 80 66 50" stroke="url(#stemGrad)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M66 50 Q64 40 70 35" stroke="url(#stemGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Rice grains 3 */}
      <ellipse cx="65" cy="100" rx="3" ry="7" fill="#d4a843" opacity="0.75" transform="rotate(12 65 100)" />
      <ellipse cx="66" cy="110" rx="2.5" ry="6" fill="#c9952e" opacity="0.7" transform="rotate(15 66 110)" />
      <ellipse cx="64" cy="90" rx="2.5" ry="5.5" fill="#dfb84c" opacity="0.65" transform="rotate(8 64 90)" />
      {/* Tiny decorative dots (morning dew / data) */}
      <circle cx="48" cy="55" r="1.5" fill="#60a5fa" opacity="0.5" />
      <circle cx="62" cy="65" r="1.2" fill="#60a5fa" opacity="0.4" />
      <circle cx="55" cy="45" r="1" fill="#60a5fa" opacity="0.35" />
      {/* Gradients */}
      <defs>
        <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#65a30d" />
          <stop offset="100%" stopColor="#4d7c0f" />
        </linearGradient>
        <radialGradient id="soilGrad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#78350f" />
        </radialGradient>
      </defs>
    </svg>
  )
}

export default function HomePage() {
  const { user } = useAuth()

  const features = [
    { icon: Microscope, gradient: "from-rose-500 to-rose-600", title: "এআই ফসল রোগ সনাক্তকরণ", desc: "ফসলের ছবি আপলোড করে সাথে সাথে রোগ নির্ণয় ও চিকিৎসার পরামর্শ পান বাংলায়।", href: "/tools/disease-detector", badge: "এআই", emoji: "🔬" },
    { icon: MessageCircle, gradient: "from-blue-500 to-blue-600", title: "এআই কৃষি চ্যাটবট", desc: "কৃষি সংক্রান্ত যেকোনো প্রশ্ন করুন বাংলায় — চাষাবাদ, সার, পোকামাকড় ও আরও অনেক কিছু।", href: "/tools/chatbot", emoji: "💬" },
    { icon: DollarSign, gradient: "from-amber-500 to-amber-600", title: "লাইভ বাজার মূল্য বোর্ড", desc: "বাংলাদেশের বিভিন্ন বাজারের পণ্যের দাম দেখুন। বিক্রির আগে সঠিক দাম জানুন।", href: "/tools/market-prices", emoji: "📊" },
    { icon: CloudSun, gradient: "from-sky-500 to-sky-600", title: "আবহাওয়া ও ফসল পরামর্শ", desc: "আপনার জেলার ৭ দিনের আবহাওয়া পূর্বাভাস ও ফসল বিষয়ক এআই পরামর্শ।", href: "/tools/weather-advisory", emoji: "🌤️" },
  ]

  const orbitingIcons = [
    { icon: Microscope, label: "সনাক্তকরণ", color: "text-rose-500", bg: "bg-rose-50", angle: 0 },
    { icon: CloudSun, label: "আবহাওয়া", color: "text-sky-500", bg: "bg-sky-50", angle: 90 },
    { icon: MessageCircle, label: "চ্যাটবট", color: "text-blue-500", bg: "bg-blue-50", angle: 180 },
    { icon: DollarSign, label: "বাজার মূল্য", color: "text-amber-500", bg: "bg-amber-50", angle: 270 },
  ]

  const stats = [
    { icon: Users, value: "১,২০০+", label: "সহায়তা প্রাপ্ত কৃষক", color: "text-emerald-600" },
    { icon: MapPin, value: "৬৪", label: "জেলা কাভার", color: "text-amber-600" },
    { icon: ShieldCheck, value: "২৫+", label: "রোগ সনাক্তকৃত", color: "text-rose-500" },
    { icon: TrendingUp, value: "৩০+", label: "পণ্য ট্র্যাক", color: "text-blue-500" },
  ]

  return (
    <div className="overflow-hidden bg-warm bg-grain relative">
      {/* Global dot pattern */}
      <div className="fixed inset-0 pointer-events-none bg-dots opacity-40 z-0" />

      {/* ===== TOP BANNER ===== */}
      <div className="relative z-10 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 text-white py-1.5 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
        <p className="relative text-[11px] md:text-xs font-semibold tracking-wide">
          🌾 কৃষি ও প্রযুক্তির সেতুবন্ধন · বাংলাদেশের স্মার্ট কৃষি হাব · সম্পূর্ণ বিনামূল্যে
        </p>
      </div>

      {/* ===== HERO ===== */}
      <section className="relative z-10 overflow-hidden">
        {/* Rich earth-tone ambient background */}
        <div className="absolute inset-0 bg-organic" />
        
        {/* Large organic blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[700px] h-[700px] bg-gradient-to-bl from-emerald-200/20 via-leaf-100/15 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-amber-100/20 via-earth-100/15 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-sky-100/10 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Small floating crop icons */}
          <span className="absolute top-[15%] left-[8%] text-xl opacity-20 animate-float [animation-delay:0s]">🌾</span>
          <span className="absolute top-[25%] right-[12%] text-lg opacity-15 animate-float [animation-delay:2s]">🌿</span>
          <span className="absolute bottom-[20%] left-[15%] text-lg opacity-15 animate-float [animation-delay:1.2s]">🍃</span>
          <span className="absolute top-[70%] right-[8%] text-sm opacity-20 animate-float [animation-delay:3s]">💧</span>
          <span className="absolute top-[40%] left-[5%] text-sm opacity-10 animate-float [animation-delay:0.6s]">☀️</span>
        </div>

        <div className="container-cropiq relative py-14 md:py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* ── LEFT — Content ── */}
            <div className="space-y-7">
              {/* Live badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-emerald-200/60 shadow-sm shadow-emerald-100/30 cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs md:text-sm font-bold text-emerald-700">এআই-চালিত · সম্পূর্ণ বিনামূল্যে</span>
              </div>

              {/* Main heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black text-gray-900 leading-[1.05] tracking-tight">
                বাংলাদেশের{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  স্মার্ট কৃষি
                </span>
                <br />
                <span className="text-amber-600">&</span>{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  বায়োইনফরমেটিক্স
                </span>{" "}
                <span className="text-gray-800">হাব</span>
              </h1>

              <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-xl font-medium">
                এআই-চালিত ফসলের রোগ সনাক্তকরণ, লাইভ বাজার মূল্য, আবহাওয়া পরামর্শ এবং কৃষি চ্যাটবট — বাংলায়, সম্পূর্ণ বিনামূল্যে।
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400">
                <span className="flex items-center gap-1.5 font-semibold px-3 py-1.5 bg-white/60 rounded-lg border border-gray-100"><ShieldCheck className="w-4 h-4 text-emerald-500" />৯৮% নির্ভুল</span>
                <span className="flex items-center gap-1.5 font-semibold px-3 py-1.5 bg-white/60 rounded-lg border border-gray-100"><Globe className="w-4 h-4 text-blue-500" />বাংলা ভাষায়</span>
                <span className="flex items-center gap-1.5 font-semibold px-3 py-1.5 bg-white/60 rounded-lg border border-gray-100"><Zap className="w-4 h-4 text-amber-500" />তাৎক্ষণিক ফলাফল</span>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Link href={user ? "/dashboard" : "/auth/signup"} className="group btn-primary text-base py-2.5 px-6">
                  <Sprout className="w-5 h-5 group-hover:rotate-12 transition-transform" /> বিনামূল্যে শুরু করুন <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/tools/disease-detector" className="group btn-accent text-base py-2.5 px-6">
                  <Microscope className="w-5 h-5 group-hover:scale-110 transition-transform" /> এআই রোগ সনাক্তকরণ <span className="badge-beta">বিটা</span>
                </Link>
              </div>
            </div>

            {/* ── RIGHT — 3D Hologram Globe Scene ── */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-[440px] h-[440px] animate-[hologramFloat_8s_ease-in-out_infinite]">
                {/* Outer atmospheric glow */}
                <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-emerald-300/15 via-sky-300/10 to-amber-200/10 blur-xl animate-pulse-gentle" />

                {/* Ring 1 — thick metallic outer */}
                <div className="absolute inset-0 rounded-full animate-[spin_35s_linear_infinite]">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-300/30 via-sky-300/20 to-amber-300/15 shadow-[0_0_40px_-10px_rgba(16,185,129,0.2),inset_0_0_30px_-10px_rgba(16,185,129,0.1)]" />
                  <div className="absolute inset-[3px] rounded-full bg-white/5 backdrop-blur-[1px]" />
                </div>

                {/* Ring 2 — dashed metallic, reverse spin */}
                <div className="absolute inset-1 rounded-full animate-[spin_45s_linear_infinite_reverse]">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-300/25 shadow-[0_0_20px_-5px_rgba(16,185,129,0.15)]" />
                </div>

                {/* Ring 3 — thin inner metallic */}
                <div className="absolute inset-8 rounded-full animate-[spin_40s_linear_infinite]">
                  <div className="absolute inset-0 rounded-full border border-sky-300/25 shadow-[0_0_25px_-8px_rgba(56,189,248,0.15)]" />
                </div>

                {/* Hologram scanline sweep */}
                <div className="absolute inset-1 rounded-full overflow-hidden animate-[spin_12s_linear_infinite] opacity-25 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-300/40 to-transparent -translate-y-full animate-[scanSweep_3s_ease-in-out_infinite]" />
                </div>

                {/* 3D glowing data dots ring */}
                <div className="absolute inset-4 rounded-full animate-[spin_50s_linear_infinite]">
                  {[0, 45, 90, 120, 180, 220, 270, 315].map((deg, i) => (
                    <div key={i} className="absolute"
                      style={{
                        left: `calc(50% + ${Math.cos(deg * Math.PI / 180) * 210}px - 3px)`,
                        top: `calc(50% + ${Math.sin(deg * Math.PI / 180) * 210}px - 3px)`,
                      }}
                    >
                      <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full shadow-[0_0_8px_2px_rgba(16,185,129,0.5),0_0_2px_1px_rgba(16,185,129,0.8)]" />
                    </div>
                  ))}
                </div>

                {/* Orbiting tool icons */}
                <div className="absolute inset-0 animate-[spin_30s_linear_infinite]">
                  {orbitingIcons.map((item, i) => {
                    const rad = (item.angle * Math.PI) / 180
                    const cx = 220, cy = 220, r = 180
                    const x = cx + r * Math.cos(rad) - 22
                    const y = cy + r * Math.sin(rad) - 22
                    return (
                      <div key={i} className="absolute animate-[spin_30s_linear_infinite_reverse]" style={{ left: x, top: y }}>
                        <div className={`w-11 h-11 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg border border-gray-100/80 flex items-center justify-center z-10 hover:scale-125 hover:shadow-xl transition-all duration-300 cursor-default group/icon ${item.bg}`}>
                          <item.icon className={`w-5 h-5 ${item.color} relative z-10`} />
                          <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/icon:opacity-100 transition-all duration-200 whitespace-nowrap z-20">
                            <span className="text-[9px] font-bold bg-gray-900/85 text-white px-2.5 py-1 rounded-full backdrop-blur-md shadow-lg">{item.label}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Middle glass ring */}
                <div className="absolute inset-[56px] rounded-full bg-gradient-to-br from-white/15 via-emerald-100/10 to-amber-50/10 backdrop-blur-[2px] border border-white/15" />

                {/* Inner frosted globe */}
                <div className="absolute inset-[74px] rounded-full bg-gradient-to-br from-white/70 via-emerald-50/40 to-amber-50/30 backdrop-blur-sm border border-white/30 shadow-[inset_0_0_40px_-10px_rgba(34,197,94,0.08)]" />

                {/* Innermost center — CropIQ branding + rice illustration */}
                <div className="absolute inset-[100px] bg-white rounded-full shadow-[0_0_80px_-20px_rgba(34,197,94,0.12),0_20px_60px_-20px_rgba(0,0,0,0.06)] flex items-center justify-center overflow-hidden">
                  {/* Subtle rice field silhouette at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-[45%] opacity-25">
                    <RicePlantSVG className="w-full h-full" />
                  </div>

                  {/* Decorative inner rings */}
                  <div className="absolute inset-2 rounded-full border border-emerald-100/50" />
                  <div className="absolute inset-4 rounded-full border border-dashed border-emerald-100/25" />

                  {/* Center content */}
                  <div className="text-center relative z-10">
                    {/* Logo */}
                    <div className="relative mx-auto mb-3">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl blur-xl opacity-25 animate-pulse-gentle" />
                      <div className="absolute -inset-1.5 bg-gradient-to-br from-emerald-300/15 to-teal-300/15 rounded-2xl blur-md" />
                      <div className="relative w-[60px] h-[60px] bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-400/20 ring-1 ring-emerald-300/25">
                        <Sprout className="w-7 h-7 text-white drop-shadow-sm" />
                      </div>
                    </div>
                    {/* Brand */}
                    <div className="text-[1.6rem] font-black bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent leading-none">
                      Crop<span className="bg-gradient-to-br from-amber-500 to-orange-500 bg-clip-text text-transparent">IQ</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1.5 font-bold tracking-[0.22em] uppercase">কৃষি · এআই · প্রযুক্তি</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Organic wave divider */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-auto">
            <path d="M0 30L60 26C120 22 240 14 360 16C480 18 600 28 720 28C840 28 960 18 1080 14C1200 10 1320 12 1380 14L1440 16V40H0V30Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="relative z-10 bg-white border-b border-gray-100/80">
        <div className="container-cropiq py-6">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-6">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-3 group cursor-default">
                <div className="w-11 h-11 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-gray-200 transition-all duration-300">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-gray-900 group-hover:scale-105 transition-transform duration-300">{s.value}</div>
                  <div className="text-[10px] text-gray-400 font-semibold tracking-wide">{s.label}</div>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50/80 rounded-full border border-emerald-100 backdrop-blur-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-emerald-700 tracking-wider">বাংলাদেশ কেন্দ্রিক</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="relative z-10 py-16 md:py-20">
        <div className="container-cropiq">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-gray-200 text-xs font-bold mb-4 backdrop-blur-sm shadow-sm">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> আমাদের সেবাসমূহ
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">একজন কৃষকের যা যা প্রয়োজন</h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto font-medium">একটি প্লাটফর্মে চারটি শক্তিশালী টুল — আপনার প্রয়োজন অনুযায়ী বেছে নিন</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {features.map((f, i) => (
              <Link key={i} href={f.href} className="group bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{f.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-600 text-xs font-bold inline-flex items-center gap-1 group-hover:gap-1.5 transition-all">ব্যবহার করুন<ChevronRight className="w-3.5 h-3.5" /></span>
                  {f.badge && <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{f.badge}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative z-10 py-16 md:py-20 bg-gradient-to-b from-white via-gray-50/50 to-white">
        <div className="container-cropiq text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-gray-200 text-xs font-bold mb-4 backdrop-blur-sm shadow-sm">
            <Star className="w-3.5 h-3.5 text-amber-500" /> ব্যবহার পদ্ধতি
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-12">তিনটি সহজ ধাপে শুরু</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "০১", emoji: "📝", icon: Users, title: "বিনামূল্যে রেজিস্টার", desc: "ইমেইল দিয়ে সেকেন্ডের মধ্যে অ্যাকাউন্ট তৈরি করুন — কোন পেমেন্ট লাগবে না।" },
              { step: "০২", emoji: "🧰", icon: Zap, title: "একটি টুল বেছে নিন", desc: "ফসলের ছবি আপলোড, প্রশ্ন, বাজারদর বা আবহাওয়ার পরামর্শ নিন।" },
              { step: "০৩", emoji: "📈", icon: Star, title: "ফলাফল দেখুন", desc: "তাৎক্ষণিক এআই-চালিত তথ্য ও বিশেষজ্ঞ পরামর্শ গ্রহণ করুন।" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className="relative mb-5">
                  <span className="absolute -top-3 -right-3 text-[11px] font-extrabold text-emerald-300/60">{s.step}</span>
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200/20 group-hover:shadow-xl group-hover:shadow-emerald-300/25 group-hover:scale-105 transition-all duration-300">
                    <s.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <span className="text-2xl mb-2">{s.emoji}</span>
                <h3 className="text-base font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED HIGHLIGHT ===== */}
      <section className="relative z-10 py-14">
        <div className="container-cropiq">
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 rounded-3xl p-8 md:p-10 shadow-2xl shadow-emerald-900/10 group/highlight">
            {/* Inner glow orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-400/[0.04] rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
            <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/[0.02] rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 group-hover/highlight:scale-150 transition-transform duration-700" />

            <div className="grid lg:grid-cols-5 gap-8 items-center relative">
              <div className="lg:col-span-3 space-y-4">
                <span className="inline-flex items-center gap-2 text-xs font-bold bg-white/12 text-white px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/8">
                  ✨ বিশেষ নিবন্ধ
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight">কিভাবে এআই ফসলের রোগ সনাক্ত করে</h3>
                <p className="text-emerald-100/60 text-sm leading-relaxed max-w-xl font-medium">কৃত্রিম বুদ্ধিমত্তা মাঠের ছবি থেকেই ফসলের রোগ সনাক্ত করতে পারে। ২৫টিরও বেশি রোগ ৯৮% নির্ভুলতার সাথে সনাক্ত করে।</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/tools/disease-detector" className="inline-flex items-center gap-2.5 bg-white text-emerald-700 font-bold px-5 py-3 rounded-2xl hover:bg-emerald-50 transition-all text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]">
                    <Microscope className="w-4 h-4" />রোগ সনাক্তকরণ টুল<ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/tools/chatbot" className="inline-flex items-center gap-2.5 bg-white/8 text-white font-bold px-5 py-3 rounded-2xl hover:bg-white/15 transition-all text-sm backdrop-blur-sm border border-white/10 active:scale-[0.98]">
                    কৃষি চ্যাটবট
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-2 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/[0.03] rounded-full blur-2xl animate-pulse-gentle" />
                  <div className="relative w-48 h-48 md:w-56 md:h-56 bg-white/[0.04] rounded-full flex items-center justify-center backdrop-blur-sm border border-white/6 group-hover/highlight:scale-105 transition-transform duration-500">
                    <Microscope className="w-20 h-20 md:w-24 md:h-24 text-white/50 group-hover/highlight:text-white/70 transition-all duration-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative z-10 py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container-cropiq max-w-xl text-center">
          <div className="relative mx-auto mb-6 w-fit">
            <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-xl opacity-10 animate-pulse-gentle" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-200/15">
              <Sprout className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">আজই CropIQ ব্যবহার শুরু করুন</h2>
          <p className="text-sm text-gray-400 mb-8 font-medium">বাংলাদেশের প্রতিটি কৃষকের জন্য সম্পূর্ণ বিনামূল্যে। কোন লুকানো খরচ নেই।</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={user ? "/dashboard" : "/auth/signup"} className="group btn-primary text-base py-2.5 px-6">
              <Sprout className="w-5 h-5 group-hover:rotate-12 transition-transform" /> বিনামূল্যে শুরু করুন<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#features" className="btn-secondary text-base py-2.5 px-6">আরও জানুন</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
