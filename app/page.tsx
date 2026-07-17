"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { useAuth } from "@/lib/auth/AuthContext"
import { Sprout, Microscope, MessageCircle, DollarSign, CloudSun, ArrowRight, Users, TrendingUp, MapPin, ShieldCheck, Sparkles, ChevronRight, Leaf, Zap, Star, Globe, Award } from "lucide-react"

export default function HomePage() {
  const { t, language } = useLanguage()
  const { user } = useAuth()

  const features = [
    { icon: Microscope, color: "bg-red-50 text-red-600", border: "border-red-100 hover:border-red-200", title: t("home.features.disease.title"), desc: t("home.features.disease.desc"), href: "/tools/disease-detector", badge: "AI" },
    { icon: MessageCircle, color: "bg-blue-50 text-blue-600", border: "border-blue-100 hover:border-blue-200", title: t("home.features.chatbot.title"), desc: t("home.features.chatbot.desc"), href: "/tools/chatbot" },
    { icon: DollarSign, color: "bg-amber-50 text-amber-600", border: "border-amber-100 hover:border-amber-200", title: t("home.features.market.title"), desc: t("home.features.market.desc"), href: "/tools/market-prices" },
    { icon: CloudSun, color: "bg-sky-50 text-sky-600", border: "border-sky-100 hover:border-sky-200", title: t("home.features.weather.title"), desc: t("home.features.weather.desc"), href: "/tools/weather-advisory" },
  ]

  const stats = [
    { icon: Users, value: "1,200+", label: t("home.stats.farmers"), color: "text-leaf-600" },
    { icon: MapPin, value: "64", label: t("home.stats.districts"), color: "text-earth-500" },
    { icon: ShieldCheck, value: "25+", label: t("home.stats.diseases"), color: "text-red-500" },
    { icon: TrendingUp, value: "30+", label: t("home.stats.commodities"), color: "text-blue-500" },
  ]

  return (
    <div>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-leaf-700 via-leaf-600 to-leaf-700 text-white text-xs md:text-sm py-2.5 px-4 text-center font-semibold tracking-wide">
        🌾 {language === "bn" ? "কৃষি ও প্রযুক্তির সেতুবন্ধন · বাংলাদেশের স্মার্ট কৃষি হাব" : "Bridge of Agriculture & Technology · Smart Agriculture Hub of Bangladesh"}
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-leaf-50/70 via-white to-emerald-50/40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(22,163,74,0.06)_0%,transparent_60%)]" />
        <div className="container-cropiq relative py-14 md:py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-leaf-100/80 rounded-full text-leaf-700 text-xs md:text-sm font-bold border border-leaf-200/50">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {language === "bn" ? "এআই-চালিত · সম্পূর্ণ বিনামূল্যে" : "AI-Powered · Completely Free"}
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.05] tracking-tight">
                {language === "bn" ? (
                  <>বাংলাদেশের জন্য{" "}<span className="text-leaf-600">স্মার্ট কৃষি</span></>
                ) : (
                  <><span className="text-leaf-600">Smart Agriculture</span>{" "}<span className="text-earth-600">&</span>{" "}<span className="text-leaf-600">Bioinformatics</span> Hub</>
                )}
              </h1>

              <div className="space-y-3">
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                  {language === "bn"
                    ? "এআই-চালিত ফসলের রোগ সনাক্তকরণ, লাইভ বাজার মূল্য, আবহাওয়া পরামর্শ এবং কৃষি চ্যাটবট — বাংলা ও ইংরেজিতে, সম্পূর্ণ বিনামূল্যে।"
                    : "AI-powered crop disease detection, live market prices, weather advisory, and farming chatbot — all in Bengali and English, completely free."}
                </p>
                <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-leaf-500" />{language==="bn"?"৯৮% নির্ভুল":"98% accurate"}</span>
                  <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-blue-500" />{language==="bn"?"বাংলা ও ইংরেজি":"BN & EN"}</span>
                  <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" />{language==="bn"?"তাৎক্ষণিক":"Instant"}</span>
                </div>
              </div>

              {/* ─── PREMIUM CONSISTENT CTAs ─── */}
              <div className="flex flex-col sm:flex-row gap-3.5 pt-1">
                <Link href={user ? "/dashboard" : "/auth/signup"} className="btn-primary-lg">
                  <Sprout className="w-5 h-5" />
                  {language === "bn" ? "বিনামূল্যে শুরু করুন" : "Get Started Free"}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/tools/disease-detector" className="btn-accent-lg">
                  <Microscope className="w-5 h-5" />
                  {language === "bn" ? "এআই রোগ সনাক্তকরণ" : "AI Disease Detector"}
                  <span className="badge-beta">BETA</span>
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
                    <p className="text-xs text-gray-400 mt-2 font-bold tracking-[0.15em] uppercase">{language === "bn" ? "কৃষি · এআই · প্রযুক্তি" : "AGRI · AI · TECH"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 25L48 22C96 19 192 13 288 17C384 21 480 35 576 39C672 43 768 37 864 31C960 25 1056 19 1152 17C1248 15 1344 17 1392 18L1440 19V50H1392C1344 50 1248 50 1152 50C1056 50 960 50 864 50C768 50 672 50 576 50C480 50 384 50 288 50C192 50 96 50 48 50H0V25Z" fill="white"/></svg>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-cropiq py-7">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-8">
            {stats.map((s,i) => (
              <div key={i} className="flex items-center gap-3.5 group">
                <div className="w-11 h-11 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
                  <s.icon className={`w-5.5 h-5.5 ${s.color}`} />
                </div>
                <div><div className="text-xl font-extrabold text-gray-900">{s.value}</div><div className="text-xs text-gray-500 font-medium">{s.label}</div></div>
              </div>
            ))}
            <div className="flex items-center gap-2 px-4 py-2 bg-leaf-50 rounded-full border border-leaf-100">
              <span className="w-2 h-2 bg-leaf-500 rounded-full" />
              <span className="text-xs font-bold text-leaf-700 uppercase tracking-wider">{language === "bn" ? "বাংলাদেশ কেন্দ্রিক" : "Bangladesh Focused"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-24">
        <div className="container-cropiq">
          <div className="text-center mb-12">
            <div className="section-badge mx-auto w-fit mb-4"><Zap className="w-3.5 h-3.5" />{language === "bn" ? "আমাদের সেবাসমূহ" : "Our Services"}</div>
            <h2 className="section-title mb-3">{language === "bn" ? "একজন কৃষকের যা যা প্রয়োজন" : "Everything a Farmer Needs"}</h2>
            <p className="section-subtitle">{language === "bn" ? "একটি প্লাটফর্মে চারটি শক্তিশালী টুল" : "Four powerful tools in one platform"}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f,i) => (
              <Link key={i} href={f.href} className={`card-cropiq group cursor-pointer ${f.border}`}>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${f.color}`}><f.icon className="w-5.5 h-5.5" /></div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{f.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-leaf-600 text-sm font-bold inline-flex items-center gap-1 group-hover:underline">{language === "bn" ? "ব্যবহার করুন" : "Try it"}<ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></span>
                  {f.badge && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{f.badge}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-cropiq">
          <div className="text-center mb-14">
            <div className="section-badge mx-auto w-fit mb-4"><Award className="w-3.5 h-3.5" />{language === "bn" ? "ব্যবহার পদ্ধতি" : "How It Works"}</div>
            <h2 className="section-title">{language === "bn" ? "তিনটি সহজ ধাপ" : "Three Simple Steps"}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {[
              { num:"1", icon:Users, title: language==="bn"?"বিনামূল্যে রেজিস্টার":"Sign Up Free", desc: language==="bn"?"ইমেইল দিয়ে সেকেন্ডের মধ্যে অ্যাকাউন্ট তৈরি করুন — কোন পেমেন্ট লাগবে না।":"Create your account in seconds — no payment required." },
              { num:"2", icon:Zap, title: language==="bn"?"একটি টুল বেছে নিন":"Choose a Tool", desc: language==="bn"?"ফসলের ছবি আপলোড, প্রশ্ন, বাজারদর বা আবহাওয়ার পরামর্শ নিন।":"Upload photos, ask questions, check prices, or get weather advice." },
              { num:"3", icon:Star, title: language==="bn"?"ফলাফল দেখুন":"Get Results", desc: language==="bn"?"তাৎক্ষণিক এআই-চালিত তথ্য ও পরামর্শ গ্রহণ করুন।":"Receive instant AI-powered insights and recommendations." },
            ].map((s,i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-leaf-200/50 group-hover:shadow-xl group-hover:scale-105 transition-all"><s.icon className="w-7 h-7 text-white" /></div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Highlight */}
      <section className="py-14">
        <div className="container-cropiq">
          <div className="relative overflow-hidden bg-gradient-to-br from-leaf-600 via-leaf-700 to-emerald-800 rounded-3xl p-8 md:p-12 shadow-2xl shadow-leaf-500/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3" />
            <div className="relative grid lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3 space-y-5">
                <span className="inline-flex items-center gap-2 text-xs font-bold bg-white/20 text-white px-4 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm"><Sparkles className="w-3.5 h-3.5" />{language === "bn" ? "বিশেষ নিবন্ধ" : "Featured Tool"}</span>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight">{language === "bn" ? "কিভাবে এআই ফসলের রোগ সনাক্ত করে" : "How AI Detects Plant Disease"}</h3>
                <p className="text-emerald-100 leading-relaxed max-w-xl text-base">{language === "bn" ? "কৃত্রিম বুদ্ধিমত্তা এখন মাঠের ছবি থেকেই ফসলের রোগ সনাক্ত করতে পারে। ২৫টিরও বেশি ফসলের রোগ ৯৮% নির্ভুলতার সাথে সনাক্ত করে।" : "AI identifies crop diseases from field photos with 98% accuracy across 25+ plant diseases."}</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/tools/disease-detector" className="inline-flex items-center gap-2.5 bg-white text-leaf-700 font-bold px-6 py-3 rounded-2xl hover:bg-leaf-50 transition-all duration-300 text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5"><Microscope className="w-4 h-4" />{language==="bn"?"রোগ সনাক্তকরণ টুল":"Try Disease Detector"}<ArrowRight className="w-4 h-4" /></Link>
                  <Link href="/tools/chatbot" className="inline-flex items-center gap-2.5 bg-white/10 text-white font-bold px-6 py-3 rounded-2xl hover:bg-white/20 transition-all duration-300 text-sm backdrop-blur-sm border border-white/20">{language==="bn"?"কৃষি চ্যাটবট":"Ask Chatbot"}</Link>
                </div>
              </div>
              <div className="lg:col-span-2 flex justify-center">
                <div className="relative w-44 h-44 md:w-52 md:h-52">
                  <div className="absolute inset-0 bg-white/10 rounded-full backdrop-blur animate-pulse-gentle" />
                  <div className="absolute inset-8 bg-white/15 rounded-full backdrop-blur flex items-center justify-center"><Microscope className="w-20 h-20 md:w-24 md:h-24 text-white/90" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-gray-50">
        <div className="container-cropiq max-w-2xl text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-2xl flex items-center justify-center mx-auto mb-7 shadow-xl shadow-leaf-200/50"><Sprout className="w-8 h-8 text-white" /></div>
          <h2 className="section-title mb-3 text-3xl md:text-4xl lg:text-5xl">{language === "bn" ? "আজই CropIQ ব্যবহার শুরু করুন" : "Start Using CropIQ Today"}</h2>
          <p className="section-subtitle mb-9">{language === "bn" ? "বাংলাদেশের প্রতিটি কৃষকের জন্য সম্পূর্ণ বিনামূল্যে। কোন লুকানো খরচ নেই।" : "Completely free for every farmer in Bangladesh. No hidden costs."}</p>
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
            <Link href={user ? "/dashboard" : "/auth/signup"} className="btn-primary-lg"><Sprout className="w-5 h-5" />{language === "bn" ? "বিনামূল্যে শুরু করুন" : "Get Started Free"}<ArrowRight className="w-5 h-5" /></Link>
            <Link href="#features" className="btn-secondary-lg">{language === "bn" ? "আরও জানুন" : "Learn More"}</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
