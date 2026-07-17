"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Sprout, Heart, ArrowRight, Mail, MapPin, Phone, ExternalLink } from "lucide-react"

export function Footer() {
  const { t, language } = useLanguage()

  const quickLinks = [
    { href: "/", label: language === "bn" ? "হোম" : "Home" },
    { href: "/tools/disease-detector", label: language === "bn" ? "রোগ সনাক্তকরণ" : "Disease Detector" },
    { href: "/tools/chatbot", label: language === "bn" ? "কৃষি চ্যাটবট" : "Farming Chatbot" },
    { href: "/dashboard", label: language === "bn" ? "ড্যাশবোর্ড" : "Dashboard" },
  ]

  const tools = [
    { href: "/tools/disease-detector", label: language === "bn" ? "এআই ফসল রোগ সনাক্তকারী" : "AI Crop Disease Detector", badge: "BETA" },
    { href: "/tools/chatbot", label: language === "bn" ? "এআই কৃষি চ্যাটবট" : "AI Farming Chatbot" },
    { href: "/tools/market-prices", label: language === "bn" ? "বাজার মূল্য বোর্ড" : "Market Price Board" },
    { href: "/tools/weather-advisory", label: language === "bn" ? "আবহাওয়া পরামর্শ" : "Weather & Crop Advisory" },
  ]

  const teamInfo = [
    { icon: MapPin, text: language === "bn" ? "বাংলাদেশ ইউনিভার্সিটি অফ বিজনেস অ্যান্ড টেকনোলজি (BUBT)" : "Bangladesh University of Business & Technology" },
    { icon: Mail, text: language === "bn" ? "CSE 400 · গ্রুপ ৫ · ইনটেক ৫১" : "CSE 400 · Group 5 · Intake 51" },
  ]

  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.3)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(202,138,4,0.2)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-grid opacity-50" />
      </div>

      {/* Top CTA Bar */}
      <div className="relative border-b border-gray-800/60">
        <div className="container-cropiq py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold mb-1">
                {language === "bn" ? "CropIQ ব্যবহার শুরু করতে প্রস্তুত?" : "Ready to start using CropIQ?"}
              </h3>
              <p className="text-gray-400 text-sm">
                {language === "bn"
                  ? "সম্পূর্ণ বিনামূল্যে · কোন লুকানো খরচ নেই"
                  : "Completely free · No hidden costs"}
              </p>
            </div>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-leaf-500 to-leaf-600 text-white font-bold rounded-xl hover:from-leaf-600 hover:to-leaf-700 transition-all duration-300 shadow-lg shadow-leaf-500/25 hover:shadow-xl hover:shadow-leaf-500/30 hover:-translate-y-0.5 text-sm"
            >
              <Sprout className="w-4 h-4" />
              {language === "bn" ? "বিনামূল্যে যুক্ত হন" : "Join Free"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative container-cropiq py-12 md:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5 group">
              <div className="relative">
                <div className="absolute inset-0 bg-leaf-500 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                Crop<span className="bg-clip-text text-transparent bg-gradient-to-r from-earth-400 to-amber-400">IQ</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              {language === "bn"
                ? "বাংলাদেশের জন্য এআই-চালিত কৃষি বুদ্ধিমত্তা প্ল্যাটফর্ম। কৃষি, কৃত্রিম বুদ্ধিমত্তা ও প্রযুক্তির সেতুবন্ধন।"
                : "AI-powered agriculture intelligence platform for Bangladesh. Bridging farming, artificial intelligence & technology."}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 font-medium">
                {language === "bn" ? "ভাষা:" : "Language:"}
              </span>
              <span className="text-xs bg-gray-800 px-3 py-1 rounded-full font-medium">
                🇧🇩 বাংলা · 🇬🇧 English
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-gray-200 mb-5 text-xs uppercase tracking-[0.2em]">
              {language === "bn" ? "দ্রুত নেভিগেশন" : "Quick Navigation"}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-leaf-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/auth/signin" className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-leaf-400 transition-colors" />
                  {language === "bn" ? "লগইন / রেজিস্ট্রেশন" : "Sign In / Sign Up"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-bold text-gray-200 mb-5 text-xs uppercase tracking-[0.2em]">
              {language === "bn" ? "আমাদের টুল" : "Our Tools"}
            </h4>
            <ul className="space-y-3">
              {tools.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-leaf-400 transition-colors" />
                    {tool.label}
                    {tool.badge && (
                      <span className="text-[9px] font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full">
                        {tool.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Team Info */}
          <div>
            <h4 className="font-bold text-gray-200 mb-5 text-xs uppercase tracking-[0.2em]">
              {language === "bn" ? "দলের তথ্য" : "Team Info"}
            </h4>
            <ul className="space-y-4">
              {teamInfo.map((info, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                  <info.icon className="w-4 h-4 mt-0.5 shrink-0 text-gray-500" />
                  <span>{info.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} CropIQ — {t("footer.team")}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-gray-500">
            {language === "bn"
              ? "বাংলাদেশের কৃষকদের জন্য"
              : "Made for Bangladeshi farmers"} <Heart className="w-3 h-3 text-red-400 fill-red-400" /> {language === "bn" ? "🇧🇩" : "🇧🇩"}
          </p>
        </div>
      </div>
    </footer>
  )
}
