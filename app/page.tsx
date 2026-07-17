"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth/AuthContext"
import { Sprout, Microscope, MessageCircle, DollarSign, CloudSun, ArrowRight, Users, TrendingUp, MapPin, ShieldCheck, Sparkles, ChevronRight, Zap, Star, Globe } from "lucide-react"
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  const { user } = useAuth()

  const features = [
    { icon: Microscope, gradient: "from-rose-400 to-rose-600", bg: "bg-rose-50", color: "text-rose-600", title: "এআই ফসল রোগ সনাক্তকরণ", desc: "ফসলের ছবি আপলোড করে সাথে সাথে রোগ নির্ণয় ও চিকিৎসার পরামর্শ পান বাংলায়।", href: "/tools/disease-detector", badge: "এআই" },
    { icon: MessageCircle, gradient: "from-blue-400 to-blue-600", bg: "bg-blue-50", color: "text-blue-600", title: "এআই কৃষি চ্যাটবট", desc: "কৃষি সংক্রান্ত যেকোনো প্রশ্ন করুন বাংলায় — চাষাবাদ, সার, পোকামাকড় ও আরও অনেক কিছু।", href: "/tools/chatbot" },
    { icon: DollarSign, gradient: "from-amber-400 to-amber-600", bg: "bg-amber-50", color: "text-amber-600", title: "লাইভ বাজার মূল্য বোর্ড", desc: "বাংলাদেশের বিভিন্ন বাজারের পণ্যের দাম দেখুন। বিক্রির আগে সঠিক দাম জানুন।", href: "/tools/market-prices" },
    { icon: CloudSun, gradient: "from-sky-400 to-sky-600", bg: "bg-sky-50", color: "text-sky-600", title: "আবহাওয়া ও ফসল পরামর্শ", desc: "আপনার জেলার ৭ দিনের আবহাওয়া পূর্বাভাস ও ফসল বিষয়ক এআই পরামর্শ।", href: "/tools/weather-advisory" },
  ]

  const orbitingIcons = [
    { icon: Microscope, label: "সনাক্তকরণ", gradient: "from-rose-500 to-rose-600", bg: "bg-white", angle: 0 },
    { icon: CloudSun, label: "আবহাওয়া", gradient: "from-sky-500 to-sky-600", bg: "bg-white", angle: 90 },
    { icon: MessageCircle, label: "চ্যাটবট", gradient: "from-blue-500 to-blue-600", bg: "bg-white", angle: 180 },
    { icon: DollarSign, label: "বাজার মূল্য", gradient: "from-amber-500 to-amber-600", bg: "bg-white", angle: 270 },
  ]

  const stats = [
    { icon: Users, value: "১,২০০+", label: "সহায়তা প্রাপ্ত কৃষক", color: "text-leaf-600", glow: "shadow-leaf-200/50" },
    { icon: MapPin, value: "৬৪", label: "জেলা কাভার", color: "text-earth-500", glow: "shadow-earth-200/50" },
    { icon: ShieldCheck, value: "২৫+", label: "রোগ সনাক্তকৃত", color: "text-rose-500", glow: "shadow-rose-200/50" },
    { icon: TrendingUp, value: "৩০+", label: "পণ্য ট্র্যাক", color: "text-blue-500", glow: "shadow-blue-200/50" },
  ]

  return (
    <div className="overflow-hidden">
      {/* ===== TOP BANNER ===== */}
      <div className="bg-gradient-to-r from-leaf-700 via-leaf-600 to-leaf-700 text-white py-1.5 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06)_0%,transparent_70%)]" />
        <p className="relative text-[11px] md:text-xs font-semibold tracking-wide">
          🌾 কৃষি ও প্রযুক্তির সেতুবন্ধন · বাংলাদেশের স্মার্ট কৃষি হাব · সম্পূর্ণ বিনামূল্যে
        </p>
      </div>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-leaf-50/90 via-white to-emerald-50/70">
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-gradient-to-bl from-leaf-100/30 to-transparent rounded-full blur-3xl animate-pulse-gentle" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-100/20 to-transparent rounded-full blur-3xl animate-pulse-gentle [animation-delay:2s]" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-[10%] w-2 h-2 bg-leaf-400/30 rounded-full animate-float [animation-delay:0s]" />
          <div className="absolute top-1/3 right-[15%] w-1.5 h-1.5 bg-amber-400/30 rounded-full animate-float [animation-delay:1.5s]" />
          <div className="absolute bottom-1/3 left-[20%] w-2.5 h-2.5 bg-sky-400/25 rounded-full animate-float [animation-delay:3s]" />
          <div className="absolute top-[60%] right-[25%] w-1.5 h-1.5 bg-emerald-400/30 rounded-full animate-float [animation-delay:0.8s]" />
          <div className="absolute top-[15%] right-[30%] w-1 h-1 bg-leaf-400/40 rounded-full animate-float [animation-delay:2.2s]" />
        </div>

        <div className="container-cropiq relative py-14 md:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* LEFT — Content */}
            <div className="space-y-6">
              {/* Live badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-leaf-200/50 shadow-sm shadow-leaf-100/40 group cursor-default hover:shadow-md transition-shadow">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-leaf-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-leaf-500" />
                </span>
                <span className="text-xs md:text-sm font-bold text-leaf-700">এআই-চালিত · সম্পূর্ণ বিনামূল্যে</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold text-gray-900 leading-[1.06] tracking-tight">
                বাংলাদেশের<br className="sm:hidden" /> জন্য{" "}
                <span className="bg-gradient-to-r from-leaf-600 via-leaf-500 to-emerald-600 bg-clip-text text-transparent ">
                  স্মার্ট কৃষি
                </span>
                <br className="hidden sm:block" />
                <span className="text-earth-600">&</span>{" "}
                <span className="bg-gradient-to-r from-leaf-600 to-emerald-500 bg-clip-text text-transparent">
                  বায়োইনফরমেটিক্স
                </span>{" "}
                হাব
              </h1>

              <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-xl font-medium">
                এআই-চালিত ফসলের রোগ সনাক্তকরণ, লাইভ বাজার মূল্য, আবহাওয়া পরামর্শ এবং কৃষি চ্যাটবট — বাংলায়, সম্পূর্ণ বিনামূল্যে।
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-1.5 font-semibold"><ShieldCheck className="w-4 h-4 text-leaf-500" />৯৮% নির্ভুল</span>
                <span className="flex items-center gap-1.5 font-semibold"><Globe className="w-4 h-4 text-blue-500" />বাংলা ভাষায়</span>
                <span className="flex items-center gap-1.5 font-semibold"><Zap className="w-4 h-4 text-amber-500" />তাৎক্ষণিক ফলাফল</span>
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

            {/* RIGHT — Orbiting Circle */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-[420px] h-[420px]">
                {/* Spin rings */}
                <div className="absolute inset-0 rounded-full border border-leaf-200/20 animate-[spin_35s_linear_infinite]" />
                <div className="absolute inset-2 rounded-full border border-dashed border-leaf-300/15 animate-[spin_45s_linear_infinite_reverse]" />
                <div className="absolute inset-10 rounded-full border border-emerald-200/15 animate-[spin_40s_linear_infinite]" />

                {/* Orbiting tool icons — full orbit rotation */}
                <div className="absolute inset-0 animate-[spin_30s_linear_infinite]">
                  {orbitingIcons.map((item, i) => {
                    const rad = (item.angle * Math.PI) / 180
                    const cx = 210, cy = 210, r = 172
                    const x = cx + r * Math.cos(rad) - 22
                    const y = cy + r * Math.sin(rad) - 22
                    return (
                      <div
                        key={i}
                        className="absolute animate-[spin_30s_linear_infinite_reverse]"
                        style={{ left: x, top: y }}
                      >
                        <div className="w-11 h-11 rounded-xl bg-white shadow-lg shadow-gray-200/40 border border-gray-100 flex items-center justify-center z-10 hover:scale-125 hover:shadow-xl transition-all duration-300 cursor-default group/icon">
                          <div className={`w-full h-full rounded-xl bg-gradient-to-br ${item.gradient} opacity-10 absolute inset-0 group-hover/icon:opacity-20 transition-opacity`} />
                          <item.icon className="w-5 h-5 text-gray-700 relative z-10" />
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/icon:opacity-100 transition-all duration-200 whitespace-nowrap">
                            <span className="text-[9px] font-bold bg-gray-900/85 text-white px-2.5 py-1 rounded-full backdrop-blur-sm shadow-lg">{item.label}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Inner circle layers */}
                <div className="absolute inset-[54px] bg-gradient-to-br from-leaf-200/40 to-emerald-200/30 rounded-full blur-sm animate-pulse-gentle" />
                <div className="absolute inset-[68px] bg-gradient-to-br from-leaf-100/80 to-emerald-100/60 rounded-full shadow-inner" />
                <div className="absolute inset-[94px] bg-white rounded-full shadow-2xl shadow-gray-200/40 flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative mx-auto mb-3">
                      <div className="absolute inset-0 bg-leaf-500 rounded-2xl blur-xl opacity-25 animate-pulse-gentle" />
                      <div className="relative w-[68px] h-[68px] bg-gradient-to-br from-leaf-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-leaf-300/30">
                        <Sprout className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-extrabold bg-gradient-to-r from-leaf-600 to-emerald-600 bg-clip-text text-transparent">
                      Crop<span className="text-earth-500">IQ</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5 font-bold tracking-[0.2em] uppercase">কৃষি · এআই · প্রযুক্তি</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 18L48 16C96 14 192 10 288 12C384 14 480 22 576 24C672 26 768 22 864 18C960 14 1056 10 1152 12C1248 14 1344 16 1392 17L1440 18V36H0V18Z" fill="white"/></svg>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-cropiq py-6">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-6">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-3 group cursor-default">
                <div className={`w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-sm ${s.glow} group-hover:shadow-md group-hover:border-gray-200 transition-all duration-300`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-gray-900 group-hover:scale-105 transition-transform duration-300">{s.value}</div>
                  <div className="text-[10px] text-gray-400 font-semibold tracking-wide">{s.label}</div>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 px-4 py-2 bg-leaf-50/80 rounded-full border border-leaf-100 backdrop-blur-sm">
              <span className="w-2 h-2 bg-leaf-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-leaf-700 tracking-wider">বাংলাদেশ কেন্দ্রিক</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-16 md:py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.015)_0%,transparent_70%)]" />
        <div className="container-cropiq relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-leaf-50/80 rounded-full text-leaf-700 text-xs font-bold mb-4 border border-leaf-100 backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> আমাদের সেবাসমূহ
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">একজন কৃষকের যা যা প্রয়োজন</h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto font-medium">একটি প্লাটফর্মে চারটি শক্তিশালী টুল — আপনার প্রয়োজন অনুযায়ী বেছে নিন</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {features.map((f, i) => (
              <Link key={i} href={f.href} className="group bg-white rounded-2xl border border-gray-100 p-5 hover:border-leaf-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{f.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-leaf-600 text-xs font-bold inline-flex items-center gap-1 group-hover:gap-1.5 transition-all">ব্যবহার করুন<ChevronRight className="w-3.5 h-3.5" /></span>
                  {f.badge && <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{f.badge}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-leaf-200 to-transparent" />
        </div>
        <div className="container-cropiq text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100/80 rounded-full text-gray-600 text-xs font-bold mb-4 border border-gray-200 backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 text-amber-500" /> ব্যবহার পদ্ধতি
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-12">তিনটি সহজ ধাপে শুরু</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "০১", icon: Users, title: "বিনামূল্যে রেজিস্টার", desc: "ইমেইল দিয়ে সেকেন্ডের মধ্যে অ্যাকাউন্ট তৈরি করুন — কোন পেমেন্ট লাগবে না।" },
              { step: "০২", icon: Zap, title: "একটি টুল বেছে নিন", desc: "ফসলের ছবি আপলোড, প্রশ্ন, বাজারদর বা আবহাওয়ার পরামর্শ নিন।" },
              { step: "০৩", icon: Star, title: "ফলাফল দেখুন", desc: "তাৎক্ষণিক এআই-চালিত তথ্য ও বিশেষজ্ঞ পরামর্শ গ্রহণ করুন।" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className="relative mb-5">
                  <span className="absolute -top-2 -right-2 text-[10px] font-extrabold text-leaf-300 opacity-50">{s.step}</span>
                  <div className="w-16 h-16 bg-gradient-to-br from-leaf-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-leaf-200/20 group-hover:shadow-xl group-hover:shadow-leaf-300/30 group-hover:scale-105 transition-all duration-300">
                    <s.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED HIGHLIGHT ===== */}
      <section className="py-14">
        <div className="container-cropiq">
          <div className="relative overflow-hidden bg-gradient-to-br from-leaf-600 via-leaf-700 to-emerald-800 rounded-3xl p-8 md:p-10 shadow-2xl shadow-leaf-500/8 group/highlight">
            {/* Inner glow orbs */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover/highlight:scale-110 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-400/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
            <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/3 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
            
            <div className="grid lg:grid-cols-5 gap-8 items-center relative">
              <div className="lg:col-span-3 space-y-4">
                <span className="inline-flex items-center gap-2 text-xs font-bold bg-white/15 text-white px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                  <Sparkles className="w-3.5 h-3.5" /> বিশেষ নিবন্ধ
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight">কিভাবে এআই ফসলের রোগ সনাক্ত করে</h3>
                <p className="text-emerald-100/70 text-sm leading-relaxed max-w-xl font-medium">কৃত্রিম বুদ্ধিমত্তা মাঠের ছবি থেকেই ফসলের রোগ সনাক্ত করতে পারে। ২৫টিরও বেশি রোগ ৯৮% নির্ভুলতার সাথে সনাক্ত করে।</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/tools/disease-detector" className="inline-flex items-center gap-2.5 bg-white text-leaf-700 font-bold px-5 py-3 rounded-2xl hover:bg-leaf-50 transition-all text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]">
                    <Microscope className="w-4 h-4" />রোগ সনাক্তকরণ টুল<ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/tools/chatbot" className="inline-flex items-center gap-2.5 bg-white/10 text-white font-bold px-5 py-3 rounded-2xl hover:bg-white/20 transition-all text-sm backdrop-blur-sm border border-white/20 active:scale-[0.98]">
                    কৃষি চ্যাটবট
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-2 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl animate-pulse-gentle" />
                  <div className="relative w-44 h-44 md:w-52 md:h-52 bg-white/6 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/8 group-hover/highlight:scale-105 transition-transform duration-500">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-white/8 rounded-full flex items-center justify-center border border-white/5">
                      <Microscope className="w-16 h-16 md:w-20 md:h-20 text-white/60 group-hover/highlight:text-white/80 transition-colors duration-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-t from-leaf-200 to-transparent" />
        </div>
        <div className="container-cropiq max-w-xl text-center">
          <div className="relative mx-auto mb-6 w-fit">
            <div className="absolute inset-0 bg-leaf-500 rounded-2xl blur-xl opacity-15 animate-pulse-gentle" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-leaf-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-leaf-200/20">
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
