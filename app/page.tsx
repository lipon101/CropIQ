"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { useAuth } from "@/lib/auth/AuthContext"
import {
  Sprout, Microscope, MessageCircle, DollarSign, CloudSun, ArrowRight,
  Upload, Search, TrendingUp, ShieldCheck, Users, Leaf, MapPin,
} from "lucide-react"

export default function HomePage() {
  const { t, language } = useLanguage()
  const { user } = useAuth()

  const features = [
    {
      icon: Microscope,
      color: "bg-red-100 text-red-600",
      title: t("home.features.disease.title"),
      desc: t("home.features.disease.desc"),
      href: "/tools/disease-detector",
    },
    {
      icon: MessageCircle,
      color: "bg-blue-100 text-blue-600",
      title: t("home.features.chatbot.title"),
      desc: t("home.features.chatbot.desc"),
      href: "/tools/chatbot",
    },
    {
      icon: DollarSign,
      color: "bg-earth-100 text-earth-600",
      title: t("home.features.market.title"),
      desc: t("home.features.market.desc"),
      href: "/tools/market-prices",
    },
    {
      icon: CloudSun,
      color: "bg-sky-100 text-sky-600",
      title: t("home.features.weather.title"),
      desc: t("home.features.weather.desc"),
      href: "/tools/weather-advisory",
    },
  ]

  const stats = [
    { icon: Users, value: "1,000+", label: t("home.stats.farmers") },
    { icon: ShieldCheck, value: "25+", label: t("home.stats.diseases") },
    { icon: MapPin, value: "64", label: t("home.stats.districts") },
    { icon: TrendingUp, value: "30+", label: t("home.stats.commodities") },
  ]

  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-leaf-50 via-white to-earth-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMmM1NWUiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzAtMS4xLjktMiAyLTJoNGMxLjEgMCAyIC45IDIgMnY0YzAgMS4xLS45IDItMiAyaC00YTEuOTkgMS45OSAwIDAxLTItMlYxOHpNMjAgMThjMC0xLjEuOS0yIDItMmg0YzEuMSAwIDIgLjkgMiAydjRjMCAxLjEtLjkgMi0yIDJoLTRhMS45OSAxLjk5IDAgMDEtMi0yVjE4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container-cropiq relative py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-leaf-100 rounded-full text-leaf-700 text-sm font-medium">
              <Sprout className="w-4 h-4" />
              {language === "bn" ? "বাংলাদেশের কৃষকদের জন্য বিনামূল্যে" : "Free for Bangladeshi Farmers"}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              {language === "bn" ? (
                <>
                  বাংলাদেশের জন্য{" "}
                  <span className="text-leaf-600">স্মার্ট কৃষি</span>
                </>
              ) : (
                <>
                  <span className="text-leaf-600">Smart Farming</span> for Bangladesh
                </>
              )}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t("home.hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href={user ? "/tools/disease-detector" : "/auth/signup"}
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2"
              >
                {user
                  ? language === "bn"
                    ? "টুল ব্যবহার করুন"
                    : "Use Tools"
                  : t("home.hero.cta")}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#features"
                className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                {t("home.hero.learn")}
              </Link>
            </div>
          </div>
        </div>
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40L48 35C96 30 192 20 288 25C384 30 480 50 576 55C672 60 768 50 864 40C960 30 1056 20 1152 25C1248 30 1344 50 1392 60L1440 70V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V40Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ─── Stats Banner ─── */}
      <section className="bg-white border-b">
        <div className="container-cropiq py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-6 h-6 text-leaf-600 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section id="features" className="py-16 md:py-24">
        <div className="container-cropiq">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t("home.features.title")}</h2>
            <p className="text-gray-500 text-lg">{t("home.features.subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <Link
                key={i}
                href={feat.href}
                className="card-cropiq group cursor-pointer hover:border-leaf-300 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feat.color}`}>
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-leaf-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {language === "bn" ? "ব্যবহার করুন" : "Try it"} <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-cropiq">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t("home.how.title")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", icon: Upload, title: t("home.how.step1"), desc: t("home.how.step1desc") },
              { step: "02", icon: Search, title: t("home.how.step2"), desc: t("home.how.step2desc") },
              { step: "03", icon: TrendingUp, title: t("home.how.step3"), desc: t("home.how.step3desc") },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-leaf-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <div className="w-12 h-12 bg-leaf-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-leaf-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-leaf-600 to-leaf-700">
        <div className="container-cropiq text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {language === "bn"
              ? "আজই CropIQ ব্যবহার শুরু করুন"
              : "Start Using CropIQ Today"}
          </h2>
          <p className="text-leaf-100 text-lg mb-8 max-w-xl mx-auto">
            {language === "bn"
              ? "সম্পূর্ণ বিনামূল্যে। কোন লুকানো খরচ নেই। বাংলাদেশের প্রতিটি কৃষকের জন্য।"
              : "Completely free. No hidden costs. For every farmer in Bangladesh."}
          </p>
          <Link
            href={user ? "/tools/disease-detector" : "/auth/signup"}
            className="inline-flex items-center gap-2 bg-white text-leaf-700 font-bold px-8 py-4 rounded-xl hover:bg-leaf-50 transition-all shadow-lg hover:shadow-xl text-lg"
          >
            <Sprout className="w-5 h-5" />
            {user
              ? language === "bn"
                ? "ড্যাশবোর্ডে যান"
                : "Go to Dashboard"
              : language === "bn"
              ? "বিনামূল্যে শুরু করুন"
              : "Get Started Free"}
          </Link>
        </div>
      </section>
    </div>
  )
}
