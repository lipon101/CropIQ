"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth/AuthContext"
import { Sprout, Microscope, MessageCircle, DollarSign, CloudSun, ArrowRight, Users, TrendingUp, MapPin, ShieldCheck, Sparkles, ChevronRight, Leaf, Zap, Star, Globe } from "lucide-react"

export default function HomePage() {
  const { user } = useAuth()

  const features = [
    { icon: Microscope, color: "bg-red-50 text-red-600", title: "এআই ফসল রোগ সনাক্তকরণ", desc: "ফসলের ছবি আপলোড করে সাথে সাথে রোগ নির্ণয় ও চিকিৎসার পরামর্শ পান বাংলায়।", href: "/tools/disease-detector", badge: "এআই" },
    { icon: MessageCircle, color: "bg-blue-50 text-blue-600", title: "এআই কৃষি চ্যাটবট", desc: "কৃষি সংক্রান্ত যেকোনো প্রশ্ন করুন বাংলায় — চাষাবাদ, সার, পোকামাকড় ও আরও অনেক কিছু।", href: "/tools/chatbot" },
    { icon: DollarSign, color: "bg-amber-50 text-amber-600", title: "লাইভ বাজার মূল্য বোর্ড", desc: "বাংলাদেশের বিভিন্ন বাজারের পণ্যের দাম দেখুন। বিক্রির আগে সঠিক দাম জানুন।", href: "/tools/market-prices" },
    { icon: CloudSun, color: "bg-sky-50 text-sky-600", title: "আবহাওয়া ও ফসল পরামর্শ", desc: "আপনার জেলার ৭ দিনের আবহাওয়া পূর্বাভাস ও ফসল বিষয়ক এআই পরামর্শ।", href: "/tools/weather-advisory" },
  ]

  const stats = [
    { icon: Users, value: "১,২০০+", label: "সহায়তা প্রাপ্ত কৃষক", color: "text-leaf-600" },
    { icon: MapPin, value: "৬৪", label: "জেলা কাভার", color: "text-earth-500" },
    { icon: ShieldCheck, value: "২৫+", label: "রোগ সনাক্তকৃত", color: "text-red-500" },
    { icon: TrendingUp, value: "৩০+", label: "পণ্য ট্র্যাক", color: "text-blue-500" },
  ]

  return (
    <div>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-leaf-700 via-leaf-600 to-leaf-700 text-white text-xs md:text-sm py-2.5 px-4 text-center font-semibold tracking-wide">
        🌾 কৃষি ও প্রযুক্তির সেতুবন্ধন · বাংলাদেশের স্মার্ট কৃষি হাব · সম্পূর্ণ বিনামূল্যে
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-leaf-50/70 via-white to-emerald-50/40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(22,163,74,0.05)_0%,transparent_60%)]" />
        <div className="container-cropiq relative py-14 md:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-leaf-100/80 rounded-full text-leaf-700 text-xs md:text-sm font-bold border border-leaf-200/50">
                <Sparkles className="w-4 h-4 text-amber-500" /> এআই-চালিত · সম্পূর্ণ বিনামূল্যে
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                বাংলাদেশের জন্য <span className="text-leaf-600">স্মার্ট কৃষি</span>{" "}
                <span className="text-earth-600">&</span>{" "}
                <span className="text-leaf-600">বায়োইনফরমেটিক্স</span> হাব
              </h1>

              <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-xl">
                এআই-চালিত ফসলের রোগ সনাক্তকরণ, লাইভ বাজার মূল্য, আবহাওয়া পরামর্শ এবং কৃষি চ্যাটবট — বাংলায়, সম্পূর্ণ বিনামূল্যে।
              </p>

              <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-leaf-500" />৯৮% নির্ভুল</span>
                <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-blue-500" />বাংলা ভাষায়</span>
                <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" />তাৎক্ষণিক ফলাফল</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Link href={user ? "/dashboard" : "/auth/signup"} className="btn-primary text-base py-4 px-9">
                  <Sprout className="w-5 h-5" /> বিনামূল্যে শুরু করুন <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/tools/disease-detector" className="btn-accent text-base py-4 px-9">
                  <Microscope className="w-5 h-5" /> এআই রোগ সনাক্তকরণ <span className="badge-beta">বিটা</span>
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-leaf-200/50 to-earth-200/30 rounded-full animate-pulse-gentle" />
                <div className="absolute inset-8 bg-gradient-to-br from-leaf-100/70 to-emerald-100/50 rounded-full" />
                <div className="absolute inset-16 bg-white rounded-full shadow-2xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-leaf-200/50">
                      <Sprout className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-3xl md:text-4xl font-extrabold text-leaf-700">Crop<span className="text-earth-500">IQ</span></div>
                    <p className="text-xs text-gray-400 mt-2 font-bold tracking-[0.15em] uppercase">কৃষি · এআই · প্রযুক্তি</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 20L48 18C96 16 192 12 288 14C384 16 480 24 576 26C672 28 768 24 864 20C960 16 1056 12 1152 14C1248 16 1344 18 1392 19L1440 20V40H0V20Z" fill="white"/></svg>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-cropiq py-6">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-6">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-sm">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div><div className="text-lg font-extrabold text-gray-900">{s.value}</div><div className="text-xs text-gray-500 font-medium">{s.label}</div></div>
              </div>
            ))}
            <div className="flex items-center gap-2 px-4 py-2 bg-leaf-50 rounded-full border border-leaf-100">
              <span className="w-2 h-2 bg-leaf-500 rounded-full" /><span className="text-xs font-bold text-leaf-700 tracking-wider">বাংলাদেশ কেন্দ্রিক</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20">
        <div className="container-cropiq">
          <div className="text-center mb-10">
            <div className="section-badge mx-auto w-fit mb-4"><Zap className="w-3.5 h-3.5" />আমাদের সেবাসমূহ</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">একজন কৃষকের যা যা প্রয়োজন</h2>
            <p className="text-sm text-gray-500 max-w-xl mx-auto">একটি প্লাটফর্মে চারটি শক্তিশালী টুল — আপনার প্রয়োজন অনুযায়ী বেছে নিন</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {features.map((f, i) => (
              <Link key={i} href={f.href} className="card-default group cursor-pointer border-gray-100 hover:border-gray-200">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${f.color}`}><f.icon className="w-5 h-5" /></div>
                <h3 className="text-card-title mb-2">{f.title}</h3>
                <p className="text-body mb-4">{f.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-leaf-600 text-sm font-bold inline-flex items-center gap-1 group-hover:underline">ব্যবহার করুন<ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></span>
                  {f.badge && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{f.badge}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-cropiq text-center">
          <div className="section-badge mx-auto w-fit mb-4"><Star className="w-3.5 h-3.5" />ব্যবহার পদ্ধতি</div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-10">তিনটি সহজ ধাপে শুরু</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Users, title: "বিনামূল্যে রেজিস্টার", desc: "ইমেইল দিয়ে সেকেন্ডের মধ্যে অ্যাকাউন্ট তৈরি করুন — কোন পেমেন্ট লাগবে না।" },
              { icon: Zap, title: "একটি টুল বেছে নিন", desc: "ফসলের ছবি আপলোড, প্রশ্ন, বাজারদর বা আবহাওয়ার পরামর্শ নিন।" },
              { icon: Star, title: "ফলাফল দেখুন", desc: "তাৎক্ষণিক এআই-চালিত তথ্য ও বিশেষজ্ঞ পরামর্শ গ্রহণ করুন।" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className="w-14 h-14 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-leaf-200/50 group-hover:shadow-xl group-hover:scale-105 transition-all">
                  <s.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1.5">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Highlight */}
      <section className="py-14">
        <div className="container-cropiq">
          <div className="relative overflow-hidden bg-gradient-to-br from-leaf-600 via-leaf-700 to-emerald-800 rounded-3xl p-8 md:p-10 shadow-2xl shadow-leaf-500/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
            <div className="grid lg:grid-cols-5 gap-8 items-center relative">
              <div className="lg:col-span-3 space-y-4">
                <span className="inline-flex items-center gap-2 text-xs font-bold bg-white/20 text-white px-4 py-1.5 rounded-full backdrop-blur-sm"><Sparkles className="w-3.5 h-3.5" />বিশেষ নিবন্ধ</span>
                <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight">কিভাবে এআই ফসলের রোগ সনাক্ত করে</h3>
                <p className="text-emerald-100 text-sm leading-relaxed max-w-xl">কৃত্রিম বুদ্ধিমত্তা মাঠের ছবি থেকেই ফসলের রোগ সনাক্ত করতে পারে। ২৫টিরও বেশি রোগ ৯৮% নির্ভুলতার সাথে সনাক্ত করে।</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/tools/disease-detector" className="inline-flex items-center gap-2.5 bg-white text-leaf-700 font-bold px-5 py-3 rounded-2xl hover:bg-leaf-50 transition-all text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5"><Microscope className="w-4 h-4" />রোগ সনাক্তকরণ টুল<ArrowRight className="w-4 h-4" /></Link>
                  <Link href="/tools/chatbot" className="inline-flex items-center gap-2.5 bg-white/10 text-white font-bold px-5 py-3 rounded-2xl hover:bg-white/20 transition-all text-sm backdrop-blur-sm border border-white/20">কৃষি চ্যাটবট</Link>
                </div>
              </div>
              <div className="lg:col-span-2 flex justify-center">
                <div className="w-40 h-40 md:w-48 md:h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur">
                  <div className="w-28 h-28 md:w-36 md:h-36 bg-white/15 rounded-full flex items-center justify-center"><Microscope className="w-16 h-16 md:w-20 md:h-20 text-white/80" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container-cropiq max-w-xl text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-leaf-200/50"><Sprout className="w-7 h-7 text-white" /></div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">আজই CropIQ ব্যবহার শুরু করুন</h2>
          <p className="text-sm text-gray-500 mb-8">বাংলাদেশের প্রতিটি কৃষকের জন্য সম্পূর্ণ বিনামূল্যে। কোন লুকানো খরচ নেই।</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={user ? "/dashboard" : "/auth/signup"} className="btn-primary text-base py-4 px-9"><Sprout className="w-5 h-5" />বিনামূল্যে শুরু করুন<ArrowRight className="w-5 h-5" /></Link>
            <Link href="#features" className="btn-secondary text-base py-4 px-9">আরও জানুন</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
