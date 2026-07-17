"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Sprout, Heart, Mail, ArrowRight } from "lucide-react"

export function Footer() {
  const { t, language } = useLanguage()

  const quickLinks = [
    { href: "/", label: language === "bn" ? "হোম" : "Home" },
    { href: "/tools/disease-detector", label: language === "bn" ? "টুলসমূহ" : "Tools" },
    { href: "/dashboard", label: language === "bn" ? "ড্যাশবোর্ড" : "Dashboard" },
  ]

  const tools = [
    { href: "/tools/disease-detector", label: language === "bn" ? "ফসল রোগ সনাক্তকরণ" : "Crop Disease Detector" },
    { href: "/tools/chatbot", label: language === "bn" ? "এআই কৃষি চ্যাটবট" : "AI Farming Chatbot" },
    { href: "/tools/market-prices", label: language === "bn" ? "বাজার মূল্য বোর্ড" : "Market Price Board" },
    { href: "/tools/weather-advisory", label: language === "bn" ? "আবহাওয়া পরামর্শ" : "Weather Advisory" },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-cropiq py-12 md:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-leaf-500 rounded-lg flex items-center justify-center">
                <Sprout className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">
                Crop<span className="text-earth-400">IQ</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {language === "bn"
                ? "কৃষি, কৃত্রিম বুদ্ধিমত্তা ও প্রযুক্তির উপর একটি দ্বিভাষিক জ্ঞান হাব।"
                : "A bilingual knowledge hub on agriculture, AI and technology in Bangladesh."}
            </p>
            <p className="text-gray-500 text-xs">
              {language === "bn"
                ? "আপনার স্মার্ট কৃষি, কৃত্রিম বুদ্ধিমত্তা ও জীবনের সেতুবন্ধন।"
                : "Your bridge between smart farming, artificial intelligence & life sciences."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-4 text-sm uppercase tracking-wider">
              {language === "bn" ? "দ্রুত লিংক" : "Quick Links"}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-leaf-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/auth/signin" className="text-gray-400 hover:text-leaf-400 text-sm transition-colors">
                  {language === "bn" ? "লগইন" : "Sign In"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-4 text-sm uppercase tracking-wider">
              {language === "bn" ? "টুলসমূহ" : "Tools"}
            </h4>
            <ul className="space-y-2.5">
              {tools.map((tool) => (
                <li key={tool.href}>
                  <Link href={tool.href} className="text-gray-400 hover:text-leaf-400 text-sm transition-colors">
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Info */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-4 text-sm uppercase tracking-wider">
              {language === "bn" ? "যোগাযোগ" : "Contact & Info"}
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              {language === "bn"
                ? "সর্বশেষ আপডেট পেতে আমাদের সাথে যুক্ত থাকুন।"
                : "Stay updated with the latest in agriculture & AI."}
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 text-sm font-semibold text-leaf-400 hover:text-leaf-300 transition-colors"
            >
              <Mail className="w-4 h-4" />
              {language === "bn" ? "বিনামূল্যে যুক্ত হন" : "Join Free"}
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} CropIQ — {t("footer.team")}
          </p>
          <p className="flex items-center gap-1">
            {language === "bn"
              ? "বাংলাদেশের কৃষকদের জন্য ভালোবাসা নিয়ে"
              : "Made with"} <Heart className="w-3 h-3 text-red-400 fill-red-400" /> {language === "bn" ? "🇧🇩" : "for Bangladeshi farmers 🇧🇩"}
          </p>
        </div>
      </div>
    </footer>
  )
}
