"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { useAuth } from "@/lib/auth/AuthContext"
import {
  Sprout, Microscope, MessageCircle, DollarSign, CloudSun, ArrowRight,
  Users, TrendingUp, MapPin, ShieldCheck, Sparkles, ChevronRight, Leaf,
  Star, Zap, Globe, Award, Clock
} from "lucide-react"

export default function HomePage() {
  const { t, language } = useLanguage()
  const { user } = useAuth()

  const features = [
    {
      icon: Microscope,
      gradient: "from-red-500 to-rose-600",
      bgGradient: "from-red-50 to-rose-50",
      borderColor: "border-red-100 hover:border-red-200",
      iconBg: "bg-red-100 text-red-600",
      title: t("home.features.disease.title"),
      desc: t("home.features.disease.desc"),
      href: "/tools/disease-detector",
      badge: "AI Powered",
      stat: "98%",
      statLabel: language === "bn" ? "নির্ভুলতা" : "Accuracy",
    },
    {
      icon: MessageCircle,
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-100 hover:border-blue-200",
      iconBg: "bg-blue-100 text-blue-600",
      title: t("home.features.chatbot.title"),
      desc: t("home.features.chatbot.desc"),
      href: "/tools/chatbot",
      stat: "24/7",
      statLabel: language === "bn" ? "সাপোর্ট" : "Support",
    },
    {
      icon: DollarSign,
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 to-orange-50",
      borderColor: "border-amber-100 hover:border-amber-200",
      iconBg: "bg-amber-100 text-amber-600",
      title: t("home.features.market.title"),
      desc: t("home.features.market.desc"),
      href: "/tools/market-prices",
      stat: "30+",
      statLabel: language === "bn" ? "পণ্য" : "Commodities",
    },
    {
      icon: CloudSun,
      gradient: "from-sky-500 to-cyan-600",
      bgGradient: "from-sky-50 to-cyan-50",
      borderColor: "border-sky-100 hover:border-sky-200",
      iconBg: "bg-sky-100 text-sky-600",
      title: t("home.features.weather.title"),
      desc: t("home.features.weather.desc"),
      href: "/tools/weather-advisory",
      stat: "64",
      statLabel: language === "bn" ? "জেলা" : "Districts",
    },
  ]

  const stats = [
    { icon: Users, value: "1,200+", label: t("home.stats.farmers"), color: "text-leaf-600", bg: "bg-leaf-50" },
    { icon: MapPin, value: "64", label: t("home.stats.districts"), color: "text-earth-500", bg: "bg-earth-50" },
    { icon: ShieldCheck, value: "25+", label: t("home.stats.diseases"), color: "text-red-500", bg: "bg-red-50" },
    { icon: TrendingUp, value: "30+", label: t("home.stats.commodities"), color: "text-blue-500", bg: "bg-blue-50" },
  ]

  const testimonials = [
    {
      name: language === "bn" ? "রহিম মিয়া" : "Rahim Miya",
      role: language === "bn" ? "ধান চাষি, ময়মনসিংহ" : "Rice Farmer, Mymensingh",
      text: language === "bn"
        ? "আমার ধান গাছে রোগ ধরেছিল, CropIQ দিয়ে ছবি তুলেই রোগের নাম আর চিকিৎসা জেনে গেলাম। অসাধারণ!"
        : "My paddy had a disease. I took a picture with CropIQ and instantly got the diagnosis and treatment. Amazing!",
      stars: 5,
    },
    {
      name: language === "bn" ? "ফাতেমা বেগম" : "Fatema Begum",
      role: language === "bn" ? "সবজি চাষি, যশোর" : "Vegetable Farmer, Jashore",
      text: language === "bn"
        ? "বাজারদর দেখতে এখন আর দালালের কাছে যেতে হয় না। CropIQ অ্যাপেই সব পেয়ে যাই।"
        : "I don't need to go to middlemen anymore for market prices. I get everything on the CropIQ app.",
      stars: 5,
    },
    {
      name: language === "bn" ? "করিম সরকার" : "Karim Sarkar",
      role: language === "bn" ? "আলু চাষি, রংপুর" : "Potato Farmer, Rangpur",
      text: language === "bn"
        ? "আবহাওয়ার পরামর্শটা খুব কাজের। কখন সার দেবো, কখন পানি দেবো — সব বলে দেয়।"
        : "The weather advisory is really useful. It tells me exactly when to fertilize and irrigate.",
      stars: 4,
    },
  ]

  return (
    <div>
      {/* ─── Top Banner ─── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-leaf-700 via-leaf-600 to-emerald-700 text-white py-2.5 px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
        <p className="relative text-xs md:text-sm font-semibold tracking-wide">
          🌾 {language === "bn"
            ? "কৃষি ও প্রযুক্তির সেতুবন্ধন · বাংলাদেশের স্মার্ট কৃষি হাব · সম্পূর্ণ বিনামূল্যে"
            : "Bridge of Agriculture & Technology · Smart Agriculture Hub of Bangladesh · Completely Free"}
        </p>
      </div>

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-leaf-50/60 via-white to-emerald-50/40">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-leaf-200/20 to-emerald-200/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-earth-200/15 to-amber-200/15 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
          <div className="bg-grid absolute inset-0 opacity-[0.4]" />
        </div>

        <div className="container-cropiq relative py-16 md:py-24 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Text */}
            <div className="space-y-8 animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-leaf-700 text-xs md:text-sm font-bold border border-leaf-200 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-leaf-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-leaf-500" />
                </span>
                <Sparkles className="w-4 h-4 text-amber-500" />
                {language === "bn" ? "এআই-চালিত প্ল্যাটফর্ম · সম্পূর্ণ বিনামূল্যে" : "AI-Powered Platform · Completely Free Forever"}
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.05] tracking-tight">
                {language === "bn" ? (
                  <>
                    বাংলাদেশের জন্য{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-leaf-600 via-leaf-500 to-emerald-600">
                      স্মার্ট কৃষি
                    </span>
                  </>
                ) : (
                  <>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-leaf-600 via-leaf-500 to-emerald-600">
                      Smart Agriculture
                    </span>
                    <br />
                    <span className="text-earth-600">&</span>{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-leaf-600 to-emerald-600">Bioinformatics</span>
                    {" "}Hub
                  </>
                )}
              </h1>

              <div className="space-y-4">
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                  {language === "bn"
                    ? "এআই-চালিত ফসলের রোগ সনাক্তকরণ, লাইভ বাজার মূল্য, আবহাওয়া পরামর্শ এবং কৃষি চ্যাটবট — বাংলা ও ইংরেজিতে, সম্পূর্ণ বিনামূল্যে।"
                    : "AI-powered crop disease detection, live market prices, weather advisory, and farming chatbot — all in Bengali and English, completely free."}
                </p>
                <p className="text-base text-gray-500 max-w-lg">
                  {language === "bn"
                    ? "কৃষি, কৃত্রিম বুদ্ধিমত্তা ও প্রযুক্তি শিখুন সহজ ভাষায় · আপনার স্মার্ট কৃষি সঙ্গী"
                    : "Learn farming, AI, and technology in a simple way · Your smart agriculture companion"}
                </p>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-leaf-500" />
                  <span>{language === "bn" ? "নির্ভরযোগ্য এআই" : "Reliable AI"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>{language === "bn" ? "তাৎক্ষণিক ফলাফল" : "Instant Results"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span>{language === "bn" ? "দ্বিভাষিক" : "Bilingual"}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href={user ? "/dashboard" : "/auth/signup"}
                  className="group btn-primary text-base md:text-lg px-8 py-4 inline-flex items-center justify-center gap-2.5 shadow-xl shadow-leaf-300/30"
                >
                  <Sprout className="w-5 h-5" />
                  {language === "bn" ? "বিনামূল্যে শুরু করুন" : "Get Started Free"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/tools/disease-detector"
                  className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-700 border-2 border-amber-200 font-bold px-8 py-4 rounded-xl transition-all duration-300 text-base md:text-lg shadow-sm hover:shadow-md"
                >
                  <Microscope className="w-5 h-5" />
                  {language === "bn" ? "এআই রোগ সনাক্তকরণ" : "Try AI Detector"}
                  <span className="badge-beta">BETA</span>
                </Link>
              </div>
            </div>

            {/* Right — Hero Visual */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative">
                {/* Floating cards */}
                <div className="absolute -top-8 -left-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 animate-float z-10" style={{ animationDelay: "0s" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-leaf-100 rounded-xl flex items-center justify-center">
                      <Sprout className="w-5 h-5 text-leaf-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{language === "bn" ? "সনাক্তকৃত রোগ" : "Diseases Identified"}</p>
                      <p className="text-lg font-bold text-gray-900">25+</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-4 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 animate-float z-10" style={{ animationDelay: "1.5s" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{language === "bn" ? "সহায়তা প্রাপ্ত কৃষক" : "Farmers Helped"}</p>
                      <p className="text-lg font-bold text-gray-900">1,200+</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-1/2 -right-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 animate-float z-10" style={{ animationDelay: "3s" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{language === "bn" ? "রেটিং" : "Rating"}</p>
                      <p className="text-lg font-bold text-gray-900">4.8/5</p>
                    </div>
                  </div>
                </div>

                {/* Central illustration */}
                <div className="relative w-72 h-72 md:w-80 md:h-80">
                  <div className="absolute inset-0 bg-gradient-to-br from-leaf-300/40 to-emerald-300/30 rounded-full animate-pulse-gentle blur-sm" />
                  <div className="absolute inset-8 bg-gradient-to-br from-leaf-200/60 to-emerald-200/40 rounded-full" />
                  <div className="absolute inset-16 bg-white rounded-full shadow-2xl flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-3xl shadow-xl shadow-leaf-300/40 animate-glow" />
                        <div className="absolute inset-0 rounded-3xl flex items-center justify-center">
                          <Sprout className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      <div className="text-4xl font-extrabold">
                        <span className="text-leaf-700">Crop</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-earth-500 to-amber-600">IQ</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2 font-bold tracking-[0.2em] uppercase">
                        {language === "bn" ? "কৃষি · এআই · প্রযুক্তি" : "AGRI · AI · TECH"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="relative">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 40L48 36C96 32 192 24 288 28C384 32 480 48 576 54C672 60 768 56 864 48C960 40 1056 28 1152 24C1248 20 1344 24 1392 26L1440 28V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V40Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-cropiq py-8">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{stat.value}</div>
                  <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2.5 px-4 py-2 bg-leaf-50 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-leaf-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-leaf-500" />
              </span>
              <span className="text-xs font-bold text-leaf-700 uppercase tracking-wider">
                {language === "bn" ? "বাংলাদেশ কেন্দ্রিক" : "Bangladesh Focused"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured Tools ─── */}
      <section id="features" className="py-20 md:py-28">
        <div className="container-cropiq">
          <div className="text-center mb-14">
            <div className="section-badge mx-auto w-fit mb-5">
              <Zap className="w-3.5 h-3.5" />
              {language === "bn" ? "আমাদের সেবাসমূহ" : "Our Services"}
            </div>
            <h2 className="section-title mb-4">
              {language === "bn" ? "একজন কৃষকের যা যা প্রয়োজন" : "Everything a Farmer Needs"}
            </h2>
            <p className="section-subtitle">
              {language === "bn"
                ? "একটি প্লাটফর্মে চারটি শক্তিশালী টুল — আপনার প্রয়োজন অনুযায়ী বেছে নিন"
                : "Four powerful tools in one platform — choose based on your needs"}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {features.map((feat, i) => (
              <Link
                key={i}
                href={feat.href}
                className={`group relative overflow-hidden bg-white rounded-2xl border ${feat.borderColor} p-6 transition-all duration-500 hover:shadow-premium hover:-translate-y-2`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Gradient top bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${feat.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2.5 text-lg">{feat.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">{feat.desc}</p>

                <div className="flex items-center justify-between">
                  <span className="text-leaf-600 text-sm font-bold group-hover:underline inline-flex items-center gap-1.5">
                    {language === "bn" ? "ব্যবহার করুন" : "Try it"}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {feat.badge && (
                    <span className="badge-beta">{feat.badge}</span>
                  )}
                </div>

                {/* Stat indicator */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2">
                  <span className="text-lg font-extrabold text-gray-900">{feat.stat}</span>
                  <span className="text-xs text-gray-400">{feat.statLabel}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="container-cropiq relative">
          <div className="text-center mb-16">
            <div className="section-badge mx-auto w-fit mb-5">
              <Clock className="w-3.5 h-3.5" />
              {language === "bn" ? "ব্যবহার পদ্ধতি" : "How It Works"}
            </div>
            <h2 className="section-title mb-4">
              {language === "bn" ? "তিনটি সহজ ধাপে শুরু" : "Start in Three Simple Steps"}
            </h2>
            <p className="section-subtitle">
              {language === "bn"
                ? "মাত্র কয়েক মিনিটেই শুরু করুন CropIQ ব্যবহার"
                : "Start using CropIQ in just a few minutes"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                num: "1",
                title: language === "bn" ? "বিনামূল্যে রেজিস্টার" : "Sign Up Free",
                desc: language === "bn"
                  ? "ইমেইল দিয়ে সেকেন্ডের মধ্যে অ্যাকাউন্ট তৈরি করুন — কোন পেমেন্টের প্রয়োজন নেই।"
                  : "Create your account in seconds with email — no payment required. Ever.",
                icon: Users,
              },
              {
                num: "2",
                title: language === "bn" ? "একটি টুল বেছে নিন" : "Choose a Tool",
                desc: language === "bn"
                  ? "ফসলের ছবি আপলোড করুন, প্রশ্ন করুন, বাজারদর দেখুন বা আবহাওয়ার পরামর্শ নিন।"
                  : "Upload crop photos, ask questions, check prices, or get weather advice.",
                icon: Zap,
              },
              {
                num: "3",
                title: language === "bn" ? "ফলাফল দেখুন" : "Get Results",
                desc: language === "bn"
                  ? "তাৎক্ষণিক এআই-চালিত তথ্য ও বিশেষজ্ঞ পরামর্শ গ্রহণ করুন — বাংলায়।"
                  : "Receive instant AI-powered insights and expert recommendations — in Bengali.",
                icon: Award,
              },
            ].map((step, i) => (
              <div key={i} className="relative text-center group">
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5">
                    <div className="w-full h-full bg-gradient-to-r from-leaf-200 to-leaf-300 rounded-full" />
                  </div>
                )}
                <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-110 bg-gradient-to-br ${
                  i === 0 ? "from-leaf-500 to-leaf-700 shadow-leaf-200" :
                  i === 1 ? "from-leaf-600 to-emerald-700 shadow-leaf-200" :
                  "from-leaf-700 to-green-800 shadow-leaf-300"
                }`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-20 md:py-24">
        <div className="container-cropiq">
          <div className="text-center mb-14">
            <div className="section-badge mx-auto w-fit mb-5">
              <Star className="w-3.5 h-3.5" />
              {language === "bn" ? "কৃষকদের মতামত" : "Farmer Testimonials"}
            </div>
            <h2 className="section-title mb-4">
              {language === "bn" ? "কৃষকরা যা বলছেন" : "What Farmers Are Saying"}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-premium transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className={`w-4 h-4 ${s < t.stars ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Tool Highlight ─── */}
      <section className="py-16">
        <div className="container-cropiq">
          <div className="relative overflow-hidden bg-gradient-to-br from-leaf-600 via-leaf-700 to-emerald-800 rounded-3xl p-8 md:p-12 shadow-2xl shadow-leaf-500/20">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

            <div className="relative grid lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3 space-y-5">
                <span className="inline-flex items-center gap-2 text-xs font-bold bg-white/20 text-white px-4 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  {language === "bn" ? "বিশেষ নিবন্ধ" : "Featured Tool"}
                </span>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                  {language === "bn"
                    ? "কিভাবে এআই ফসলের রোগ সনাক্ত করে"
                    : "How AI Detects Plant Disease"}
                </h3>
                <p className="text-emerald-100 leading-relaxed max-w-xl text-base">
                  {language === "bn"
                    ? "কৃত্রিম বুদ্ধিমত্তা এখন মাঠের ছবি থেকেই ফসলের রোগ সনাক্ত করতে পারে। লক্ষ লক্ষ ছবির উপর প্রশিক্ষিত মেশিন লার্নিং মডেল ২৫টিরও বেশি ফসলের রোগ ৯৮% নির্ভুলতার সাথে সনাক্ত করতে পারে।"
                    : "Artificial intelligence can now identify crop diseases from field photos. Machine learning models trained on millions of images detect over 25 plant diseases with 98% accuracy."}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/tools/disease-detector"
                    className="inline-flex items-center gap-2.5 bg-white text-leaf-700 font-bold px-6 py-3 rounded-xl hover:bg-leaf-50 transition-all duration-300 text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <Microscope className="w-4 h-4" />
                    {language === "bn" ? "রোগ সনাক্তকরণ টুল" : "Try Disease Detector"}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/tools/chatbot"
                    className="inline-flex items-center gap-2.5 bg-white/10 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 text-sm backdrop-blur-sm border border-white/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {language === "bn" ? "কৃষি চ্যাটবট" : "Ask Farming Chatbot"}
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-2 flex justify-center">
                <div className="relative w-48 h-48 md:w-56 md:h-56">
                  <div className="absolute inset-0 bg-white/10 rounded-full backdrop-blur animate-pulse-gentle" />
                  <div className="absolute inset-8 bg-white/15 rounded-full backdrop-blur flex items-center justify-center">
                    <Microscope className="w-20 h-20 md:w-24 md:h-24 text-white/90" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 md:py-28 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="container-cropiq relative max-w-2xl text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-leaf-200/50">
            <Sprout className="w-8 h-8 text-white" />
          </div>
          <h2 className="section-title mb-4 text-3xl md:text-4xl lg:text-5xl">
            {language === "bn"
              ? "আজই CropIQ ব্যবহার শুরু করুন"
              : "Start Using CropIQ Today"}
          </h2>
          <p className="section-subtitle mb-10">
            {language === "bn"
              ? "বাংলাদেশের প্রতিটি কৃষকের জন্য সম্পূর্ণ বিনামূল্যে। কোন লুকানো খরচ নেই। এখনই রেজিস্টার করুন।"
              : "Completely free for every farmer in Bangladesh. No hidden costs. No credit card required. Sign up now."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={user ? "/dashboard" : "/auth/signup"}
              className="btn-primary text-lg px-10 py-5 inline-flex items-center justify-center gap-2.5 shadow-xl shadow-leaf-300/30"
            >
              <Sprout className="w-5 h-5" />
              {language === "bn" ? "বিনামূল্যে শুরু করুন" : "Get Started Free"}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="btn-secondary text-lg px-10 py-5 inline-flex items-center justify-center font-bold"
            >
              {language === "bn" ? "আরও জানুন" : "Learn More"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
