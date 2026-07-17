"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { useAuth } from "@/lib/auth/AuthContext"
import {
  Sprout, Microscope, MessageCircle, DollarSign, CloudSun, ArrowRight,
  Users, TrendingUp, MapPin, ShieldCheck, Sparkles, ChevronRight, Leaf
} from "lucide-react"

export default function HomePage() {
  const { t, language } = useLanguage()
  const { user } = useAuth()

  const features = [
    {
      icon: Microscope,
      color: "bg-red-50 text-red-600",
      border: "border-red-100 hover:border-red-200",
      title: t("home.features.disease.title"),
      desc: t("home.features.disease.desc"),
      href: "/tools/disease-detector",
      badge: "AI Powered",
    },
    {
      icon: MessageCircle,
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-100 hover:border-blue-200",
      title: t("home.features.chatbot.title"),
      desc: t("home.features.chatbot.desc"),
      href: "/tools/chatbot",
    },
    {
      icon: DollarSign,
      color: "bg-amber-50 text-amber-600",
      border: "border-amber-100 hover:border-amber-200",
      title: t("home.features.market.title"),
      desc: t("home.features.market.desc"),
      href: "/tools/market-prices",
    },
    {
      icon: CloudSun,
      color: "bg-sky-50 text-sky-600",
      border: "border-sky-100 hover:border-sky-200",
      title: t("home.features.weather.title"),
      desc: t("home.features.weather.desc"),
      href: "/tools/weather-advisory",
    },
  ]

  const stats = [
    { icon: Users, value: "1,000+", label: t("home.stats.farmers"), color: "text-leaf-600" },
    { icon: MapPin, value: "64", label: t("home.stats.districts"), color: "text-earth-500" },
    { icon: ShieldCheck, value: "25+", label: t("home.stats.diseases"), color: "text-red-500" },
    { icon: TrendingUp, value: "30+", label: t("home.stats.commodities"), color: "text-blue-500" },
  ]

  return (
    <div>
      {/* ─── Top Banner Bar ─── */}
      <div className="bg-leaf-700 text-white text-xs md:text-sm py-2 px-4 text-center font-medium tracking-wide">
        🌾 {language === "bn"
          ? "কৃষি ও প্রযুক্তির সেতুবন্ধন · বাংলাদেশের স্মার্ট কৃষি হাব"
          : "Bridge of Agriculture & Technology · Smart Agriculture Hub of Bangladesh"}
      </div>

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-leaf-50/80 via-white to-emerald-50/50">
        {/* Subtle pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(22,163,74,0.05)_0%,transparent_50%)]" />
        <div className="container-cropiq relative py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left — Text */}
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-leaf-100/80 rounded-full text-leaf-700 text-xs md:text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                {language === "bn"
                  ? "এআই-চালিত প্ল্যাটফর্ম · সম্পূর্ণ বিনামূল্যে"
                  : "AI-Powered Platform · Completely Free"}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                {language === "bn" ? (
                  <>
                    বাংলাদেশের জন্য{" "}
                    <span className="text-leaf-600">স্মার্ট কৃষি</span>
                  </>
                ) : (
                  <>
                    <span className="text-leaf-600">Smart Agriculture</span>{" "}
                    <span className="text-earth-600">&</span>{" "}
                    <span className="text-leaf-600">Bioinformatics</span> Hub
                  </>
                )}
              </h1>

              <div className="space-y-2">
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                  {language === "bn"
                    ? "এআই-চালিত ফসলের রোগ সনাক্তকরণ, লাইভ বাজার মূল্য, আবহাওয়া পরামর্শ এবং কৃষি চ্যাটবট — বাংলা ও ইংরেজিতে, সম্পূর্ণ বিনামূল্যে।"
                    : "AI-powered crop disease detection, live market prices, weather advisory, and farming chatbot — all in Bengali and English, completely free."}
                </p>
                <p className="text-base text-gray-500">
                  {language === "bn"
                    ? "কৃষি, কৃত্রিম বুদ্ধিমত্তা ও প্রযুক্তি শিখুন সহজ ভাষায়"
                    : "Learn farming, AI, and technology in a simple way"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href={user ? "/dashboard" : "/auth/signup"}
                  className="btn-primary text-base md:text-lg px-6 py-3 md:px-8 md:py-4 inline-flex items-center justify-center gap-2 shadow-lg shadow-leaf-200"
                >
                  {language === "bn" ? "টুল ব্যবহার করুন" : "Explore Tools"}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/tools/disease-detector"
                  className="inline-flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-semibold px-6 py-3 md:px-8 md:py-4 rounded-xl transition-all duration-200 text-base md:text-lg"
                >
                  {language === "bn" ? "এআই রোগ সনাক্তকরণ" : "Try AI Detector"}
                  <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">BETA</span>
                </Link>
              </div>
            </div>

            {/* Right — Illustration */}
            <div className="hidden lg:flex justify-center">
              <div className="relative w-full max-w-md aspect-square">
                {/* Decorative rings */}
                <div className="absolute inset-0 bg-gradient-to-br from-leaf-200/60 to-earth-200/40 rounded-full animate-pulse-gentle" />
                <div className="absolute inset-8 bg-gradient-to-br from-leaf-100/80 to-emerald-100/60 rounded-full" />
                <div className="absolute inset-16 bg-white rounded-full shadow-xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-leaf-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Sprout className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-3xl md:text-4xl font-extrabold text-leaf-700">Crop<span className="text-earth-500">IQ</span></div>
                    <p className="text-xs text-gray-400 mt-2 font-medium uppercase tracking-wider">
                      {language === "bn" ? "কৃষি · এআই · প্রযুক্তি" : "AGRI · AI · TECH"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 30L48 26C96 22 192 14 288 18C384 22 480 38 576 42C672 46 768 38 864 30C960 22 1056 14 1152 18C1248 22 1344 38 1392 44L1440 48V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0V30Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ─── Hub Stats Bar ─── */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-cropiq py-6">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-gray-100 shadow-sm`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-lg md:text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <span className="w-2 h-2 bg-leaf-500 rounded-full" />
              {language === "bn" ? "বাংলাদেশ কেন্দ্রিক" : "Bangladesh Focused"}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured Tools ─── */}
      <section id="features" className="py-16 md:py-20">
        <div className="container-cropiq">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-leaf-600 uppercase tracking-wider mb-2">
              {language === "bn" ? "আমাদের সেবাসমূহ" : "Our Services"}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {language === "bn" ? "একজন কৃষকের যা যা প্রয়োজন" : "Everything a Farmer Needs"}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              {language === "bn"
                ? "একটি প্লাটফর্মে চারটি শক্তিশালী টুল — আপনার আগ্রহের বিষয় বেছে নিন"
                : "Four powerful tools in one platform — choose your area of interest"}
            </p>
          </div>

          {/* Mobile: scrollable row, Desktop: 4-col grid */}
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
            {features.map((feat, i) => (
              <Link
                key={i}
                href={feat.href}
                className={`card-cropiq group cursor-pointer flex-shrink-0 w-[75vw] md:w-auto snap-start transition-all duration-300 ${feat.border} hover:shadow-md`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feat.color}`}>
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5">
                  {feat.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{feat.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-leaf-600 text-sm font-semibold group-hover:underline inline-flex items-center gap-1">
                    {language === "bn" ? "ব্যবহার করুন" : "Try it"} <ChevronRight className="w-4 h-4" />
                  </span>
                  {feat.badge && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase">
                      {feat.badge}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-cropiq">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-leaf-600 uppercase tracking-wider mb-2">
              {language === "bn" ? "ব্যবহার পদ্ধতি" : "How It Works"}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {language === "bn" ? "তিনটি সহজ ধাপ" : "Three Simple Steps"}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                num: "1",
                title: language === "bn" ? "বিনামূল্যে রেজিস্টার" : "Sign Up Free",
                desc: language === "bn"
                  ? "ইমেইল বা ফোন নম্বর দিয়ে সেকেন্ডের মধ্যে অ্যাকাউন্ট তৈরি করুন।"
                  : "Create your account in seconds with email — no payment required.",
              },
              {
                num: "2",
                title: language === "bn" ? "একটি টুল বেছে নিন" : "Choose a Tool",
                desc: language === "bn"
                  ? "ফসলের ছবি আপলোড করুন, প্রশ্ন করুন, বাজারদর দেখুন বা আবহাওয়ার পরামর্শ নিন।"
                  : "Upload crop photos, ask questions, check prices, or get weather advice.",
              },
              {
                num: "3",
                title: language === "bn" ? "ফলাফল দেখুন" : "Get Results",
                desc: language === "bn"
                  ? "তাৎক্ষণিক এআই-চালিত তথ্য ও পরামর্শ গ্রহণ করুন।"
                  : "Receive AI-powered insights and recommendations instantly.",
              },
            ].map((step, i) => (
              <div key={i} className="text-center group">
                <div className="w-14 h-14 bg-leaf-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg shadow-leaf-200 group-hover:scale-110 transition-transform">
                  {step.num}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute right-0 top-8 text-leaf-300 transform translate-x-1/2">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Tool Highlight ─── */}
      <section className="py-12 md:py-16">
        <div className="container-cropiq">
          <div className="relative overflow-hidden bg-gradient-to-r from-leaf-600 to-leaf-700 rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-xl">
            <div className="grid lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3 space-y-4">
                <span className="inline-block text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full uppercase tracking-wide">
                  {language === "bn" ? "বিশেষ নিবন্ধ" : "Featured Tool"}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  {language === "bn"
                    ? "কিভাবে এআই ফসলের রোগ সনাক্ত করে"
                    : "How AI Detects Plant Disease"}
                </h3>
                <p className="text-leaf-100 leading-relaxed max-w-lg">
                  {language === "bn"
                    ? "কৃত্রিম বুদ্ধিমত্তা এখন মাঠের ছবি থেকেই ফসলের রোগ সনাক্ত করতে পারে। লক্ষ লক্ষ ছবির উপর প্রশিক্ষিত মেশিন লার্নিং মডেল ২৫টিরও বেশি ফসলের রোগ ৯৮% নির্ভুলতার সাথে সনাক্ত করতে পারে।"
                    : "Artificial intelligence is revolutionizing how we identify crop diseases. Machine learning models trained on millions of images can now detect over 25 plant diseases with 98% accuracy — right from a field photo."}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/tools/disease-detector"
                    className="inline-flex items-center gap-2 bg-white text-leaf-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-leaf-50 transition-all text-sm shadow"
                  >
                    {language === "bn" ? "রোগ সনাক্তকরণ টুল" : "Try Disease Detector"}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/tools/chatbot"
                    className="inline-flex items-center gap-2 bg-leaf-800/40 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-leaf-800/60 transition-all text-sm"
                  >
                    {language === "bn" ? "কৃষি চ্যাটবট" : "Ask Farming Chatbot"}
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-2 flex justify-center">
                <div className="w-40 h-40 md:w-56 md:h-56 bg-white/10 rounded-full flex items-center justify-center backdrop-blur">
                  <div className="w-28 h-28 md:w-40 md:h-40 bg-white/20 rounded-full flex items-center justify-center">
                    <Microscope className="w-14 h-14 md:w-20 md:h-20 text-white/80" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA / Newsletter ─── */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container-cropiq max-w-2xl text-center">
          <div className="w-14 h-14 bg-leaf-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-7 h-7 text-leaf-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {language === "bn"
              ? "আজই CropIQ ব্যবহার শুরু করুন"
              : "Start Using CropIQ Today"}
          </h2>
          <p className="text-gray-500 mb-8">
            {language === "bn"
              ? "বাংলাদেশের প্রতিটি কৃষকের জন্য সম্পূর্ণ বিনামূল্যে। কোন লুকানো খরচ নেই।"
              : "Completely free for every farmer in Bangladesh. No hidden costs."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={user ? "/dashboard" : "/auth/signup"}
              className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2 shadow-lg shadow-leaf-200"
            >
              <Sprout className="w-5 h-5" />
              {language === "bn" ? "বিনামূল্যে শুরু করুন" : "Get Started Free"}
            </Link>
            <Link
              href="#features"
              className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center"
            >
              {language === "bn" ? "আরও জানুন" : "Learn More"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
