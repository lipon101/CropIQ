"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth/AuthContext"
import { Sprout, Microscope, MessageCircle, DollarSign, CloudSun, ArrowRight, Users, TrendingUp, MapPin, ShieldCheck, Sparkles, ChevronRight, Leaf, Zap, Star, Globe, Bug, Droplets, Sun } from "lucide-react"
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  const { user } = useAuth()

  const features = [
    { icon: Microscope, color: "bg-rose-50 text-rose-600", title: "এআই ফসল রোগ সনাক্তকরণ", desc: "ফসলের ছবি আপলোড করে সাথে সাথে রোগ নির্ণয় ও চিকিৎসার পরামর্শ পান বাংলায়।", href: "/tools/disease-detector", badge: "এআই" },
    { icon: MessageCircle, color: "bg-blue-50 text-blue-600", title: "এআই কৃষি চ্যাটবট", desc: "কৃষি সংক্রান্ত যেকোনো প্রশ্ন করুন বাংলায় — চাষাবাদ, সার, পোকামাকড় ও আরও অনেক কিছু।", href: "/tools/chatbot" },
    { icon: DollarSign, color: "bg-amber-50 text-amber-600", title: "লাইভ বাজার মূল্য বোর্ড", desc: "বাংলাদেশের বিভিন্ন বাজারের পণ্যের দাম দেখুন। বিক্রির আগে সঠিক দাম জানুন।", href: "/tools/market-prices" },
    { icon: CloudSun, color: "bg-sky-50 text-sky-600", title: "আবহাওয়া ও ফসল পরামর্শ", desc: "আপনার জেলার ৭ দিনের আবহাওয়া পূর্বাভাস ও ফসল বিষয়ক এআই পরামর্শ।", href: "/tools/weather-advisory" },
  ]

  const orbitingIcons = [
    { icon: Microscope, label: "সনাক্তকরণ", color: "text-rose-500", bg: "bg-rose-50", angle: 0 },
    { icon: CloudSun, label: "আবহাওয়া", color: "text-sky-500", bg: "bg-sky-50", angle: 90 },
    { icon: MessageCircle, label: "চ্যাটবট", color: "text-blue-500", bg: "bg-blue-50", angle: 180 },
    { icon: DollarSign, label: "বাজার মূল্য", color: "text-amber-500", bg: "bg-amber-50", angle: 270 },
  ]

  const stats = [
    { icon: Users, value: "১,২০০+", label: "সহায়তা প্রাপ্ত কৃষক", color: "text-leaf-600" },
    { icon: MapPin, value: "৬৪", label: "জেলা কাভার", color: "text-earth-500" },
    { icon: ShieldCheck, value: "২৫+", label: "রোগ সনাক্তকৃত", color: "text-rose-500" },
    { icon: TrendingUp, value: "৩০+", label: "পণ্য ট্র্যাক", color: "text-blue-500" },
  ]

  return (
    <div className="overflow-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-leaf-700 via-leaf-600 to-leaf-700 text-white text-xs md:text-sm py-2.5 px-4 text-center font-semibold tracking-wide relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
        <span className="relative">🌾 কৃষি ও প্রযুক্তির সেতুবন্ধন · বাংলাদেশের স্মার্ট কৃষি হাব · সম্পূর্ণ বিনামূল্যে</span>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-leaf-50/80 via-white to-emerald-50/60">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-leaf-100/40 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-100/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-leaf-300/60 rounded-full animate-pulse" />
          <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-amber-300/50 rounded-full animate-pulse [animation-delay:0.5s]" />
          <div className="absolute bottom-1/3 right-1/4 w-2.5 h-2.5 bg-sky-300/50 rounded-full animate-pulse [animation-delay:1s]" />
        </div>

        <div className="container-cropiq relative py-14 md:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-leaf-700 text-xs md:text-sm font-bold border border-leaf-200/40 shadow-sm shadow-leaf-100/50">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-leaf-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-leaf-500" /></span>
                এআই-চালিত · সম্পূর্ণ বিনামূল্যে
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.08] tracking-tight">
                বাংলাদেশের জন্য{" "}
                <span className="bg-gradient-to-r from-leaf-600 via-leaf-500 to-emerald-600 bg-clip-text text-transparent">স্মার্ট কৃষি</span>
                {" "}<span className="text-earth-600">&</span>{" "}
                <span className="bg-gradient-to-r from-leaf-600 to-emerald-500 bg-clip-text text-transparent">বায়োইনফরমেটিক্স</span>
                {" "}<span className="text-gray-900">হাব</span>
              </h1>

              <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-xl font-medium">
                এআই-চালিত ফসলের রোগ সনাক্তকরণ, লাইভ বাজার মূল্য, আবহাওয়া পরামর্শ এবং কৃষি চ্যাটবট — বাংলায়, সম্পূর্ণ বিনামূল্যে।
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-leaf-500" />৯৮% নির্ভুল</span>
                <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-blue-500" />বাংলা ভাষায়</span>
                <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" />তাৎক্ষণিক ফলাফল</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Link href={user ? "/dashboard" : "/auth/signup"} className="btn-primary text-base py-2.5 px-6">
                  <Sprout className="w-5 h-5" /> বিনামূল্যে শুরু করুন <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/tools/disease-detector" className="btn-accent text-base py-2.5 px-6">
                  <Microscope className="w-5 h-5" /> এআই রোগ সনাক্তকরণ <span className="badge-beta">বিটা</span>
                </Link>
              </div>
            </div>

            {/* Right - Premium Orbiting Circle */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-[420px] h-[420px]">
                {/* Outer glow rings */}
                <div className="absolute inset-0 rounded-full border border-leaf-200/30 animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border border-dashed border-leaf-300/20 animate-[spin_25s_linear_infinite_reverse]" />
                <div className="absolute inset-12 rounded-full border border-emerald-200/25 animate-[spin_30s_linear_infinite]" />

                {/* Orbiting icons */}
                {orbitingIcons.map((item, i) => {
                  const rad = (item.angle * Math.PI) / 180
                  const cx = 210, cy = 210, r = 172
                  const x = cx + r * Math.cos(rad) - 24
                  const y = cy + r * Math.sin(rad) - 24
                  return (
                    <div
                      key={i}
                      className="absolute w-12 h-12 rounded-2xl bg-white shadow-lg shadow-gray-200/50 border border-gray-100 flex items-center justify-center z-10 hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-default group"
                      style={{ left: x, top: y }}
                    >
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        <span className="text-[9px] font-bold bg-gray-900/80 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">{item.label}</span>
                      </div>
                    </div>
                  )
                })}

                {/* Inner decorative rings */}
                <div className="absolute inset-[60px] bg-gradient-to-br from-leaf-200/40 to-emerald-200/30 rounded-full blur-sm animate-pulse-gentle" />
                <div className="absolute inset-[72px] bg-gradient-to-br from-leaf-100/80 to-emerald-100/60 rounded-full shadow-inner" />
                <div className="absolute inset-[96px] bg-white rounded-full shadow-2xl shadow-gray-200/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative mx-auto mb-3">
                      <div className="absolute inset-0 bg-leaf-500 rounded-2xl blur-lg opacity-30" />
                      <div className="relative w-[72px] h-[72px] bg-gradient-to-br from-leaf-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-leaf-300/40">
                        <Sprout className="w-9 h-9 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-extrabold bg-gradient-to-r from-leaf-600 to-emerald-600 bg-clip-text text-transparent">Crop<span className="text-earth-500">IQ</span></div>
                    <p className="text-[11px] text-gray-400 mt-1.5 font-bold tracking-[0.18em] uppercase">কৃষি · এআই · প্রযুক্তি</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 20L48 18C96 16 192 12 288 14C384 16 480 24 576 26C672 28 768 24 864 20C960 16 1056 12 1152 14C1248 16 1344 18 1392 19L1440 20V40H0V20Z" fill="white"/></svg>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-cropiq py-6">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-6">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-gray-200 transition-all">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div><div className="text-xl font-extrabold text-gray-900">{s.value}</div><div className="text-[11px] text-gray-400 font-semibold">{s.label}</div></div>
              </div>
            ))}
            <div className="flex items-center gap-2 px-4 py-2 bg-leaf-50 rounded-full border border-leaf-100">
              <span className="w-2 h-2 bg-leaf-500 rounded-full animate-pulse" /><span className="text-xs font-bold text-leaf-700 tracking-wider">বাংলাদেশ কেন্দ্রিক</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.02)_0%,transparent_70%)]" />
        <div className="container-cropiq relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-leaf-50 rounded-full text-leaf-700 text-xs font-bold mb-4 border border-leaf-100">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> আমাদের সেবাসমূহ
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">একজন কৃষকের যা যা প্রয়োজন</h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto font-medium">একটি প্লাটফর্মে চারটি শক্তিশালী টুল — আপনার প্রয়োজন অনুযায়ী বেছে নিন</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {features.map((f, i) => (
              <Link key={i} href={f.href} className="group bg-white rounded-2xl border border-gray-100 p-5 hover:border-leaf-200 hover:shadow-xl hover:shadow-leaf-100/30 hover:-translate-y-1 transition-all duration-300">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${f.color}`}><f.icon className="w-5 h-5" /></div>
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

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-cropiq text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-600 text-xs font-bold mb-4 border border-gray-200">
            <Star className="w-3.5 h-3.5 text-amber-500" /> ব্যবহার পদ্ধতি
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-12">তিনটি সহজ ধাপে শুরু</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Users, title: "বিনামূল্যে রেজিস্টার", desc: "ইমেইল দিয়ে সেকেন্ডের মধ্যে অ্যাকাউন্ট তৈরি করুন — কোন পেমেন্ট লাগবে না।" },
              { icon: Zap, title: "একটি টুল বেছে নিন", desc: "ফসলের ছবি আপলোড, প্রশ্ন, বাজারদর বা আবহাওয়ার পরামর্শ নিন।" },
              { icon: Star, title: "ফলাফল দেখুন", desc: "তাৎক্ষণিক এআই-চালিত তথ্য ও বিশেষজ্ঞ পরামর্শ গ্রহণ করুন।" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-leaf-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-leaf-200/30 group-hover:shadow-xl group-hover:shadow-leaf-300/40 group-hover:scale-105 transition-all duration-300">
                  <s.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Highlight */}
      <section className="py-14">
        <div className="container-cropiq">
          <div className="relative overflow-hidden bg-gradient-to-br from-leaf-600 via-leaf-700 to-emerald-800 rounded-3xl p-8 md:p-10 shadow-2xl shadow-leaf-500/10">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-400/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
            <div className="grid lg:grid-cols-5 gap-8 items-center relative">
              <div className="lg:col-span-3 space-y-4">
                <span className="inline-flex items-center gap-2 text-xs font-bold bg-white/15 text-white px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10"><Sparkles className="w-3.5 h-3.5" />বিশেষ নিবন্ধ</span>
                <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight">কিভাবে এআই ফসলের রোগ সনাক্ত করে</h3>
                <p className="text-emerald-100/80 text-sm leading-relaxed max-w-xl font-medium">কৃত্রিম বুদ্ধিমত্তা মাঠের ছবি থেকেই ফসলের রোগ সনাক্ত করতে পারে। ২৫টিরও বেশি রোগ ৯৮% নির্ভুলতার সাথে সনাক্ত করে।</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/tools/disease-detector" className="inline-flex items-center gap-2.5 bg-white text-leaf-700 font-bold px-5 py-3 rounded-2xl hover:bg-leaf-50 transition-all text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5"><Microscope className="w-4 h-4" />রোগ সনাক্তকরণ টুল<ArrowRight className="w-4 h-4" /></Link>
                  <Link href="/tools/chatbot" className="inline-flex items-center gap-2.5 bg-white/10 text-white font-bold px-5 py-3 rounded-2xl hover:bg-white/20 transition-all text-sm backdrop-blur-sm border border-white/20">কৃষি চ্যাটবট</Link>
                </div>
              </div>
              <div className="lg:col-span-2 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl" />
                  <div className="relative w-44 h-44 md:w-52 md:h-52 bg-white/8 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-white/10 rounded-full flex items-center justify-center border border-white/5">
                      <Microscope className="w-16 h-16 md:w-20 md:h-20 text-white/70" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-cropiq max-w-xl text-center">
          <div className="relative mx-auto mb-6 w-fit">
            <div className="absolute inset-0 bg-leaf-500 rounded-2xl blur-xl opacity-20" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-leaf-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-leaf-200/30">
              <Sprout className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">আজই CropIQ ব্যবহার শুরু করুন</h2>
          <p className="text-sm text-gray-400 mb-8 font-medium">বাংলাদেশের প্রতিটি কৃষকের জন্য সম্পূর্ণ বিনামূল্যে। কোন লুকানো খরচ নেই।</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={user ? "/dashboard" : "/auth/signup"} className="btn-primary text-base py-2.5 px-6"><Sprout className="w-5 h-5" />বিনামূল্যে শুরু করুন<ArrowRight className="w-5 h-5" /></Link>
            <Link href="#features" className="btn-secondary text-base py-2.5 px-6">আরও জানুন</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
