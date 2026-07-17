"use client"

import Link from "next/link"
import { Sprout } from "lucide-react"

const navLinks = [
  { href: "/", label: "হোম" },
  { href: "/tools/disease-detector", label: "রোগ সনাক্তকরণ" },
  { href: "/dashboard", label: "ড্যাশবোর্ড" },
  { href: "/auth/signin", label: "লগইন" },
]

const toolLinks = [
  { href: "/tools/disease-detector", label: "এআই রোগ সনাক্তকারী", badge: "বিটা" },
  { href: "/tools/chatbot", label: "কৃষি চ্যাটবট" },
  { href: "/tools/market-prices", label: "বাজার মূল্য বোর্ড" },
  { href: "/tools/weather-advisory", label: "আবহাওয়া ও ফসল পরামর্শ" },
]

export function Footer() {
  return (
    <footer className="relative bg-[#f4f0e8] border-t border-gray-200/60 overflow-hidden">
      <div className="relative container-cropiq py-10 md:py-12">
        {/* Main columns */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-xl blur-md opacity-20 group-hover:opacity-35 transition-opacity" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900">
                Crop<span className="text-emerald-500">IQ</span>
              </span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-[220px]">
              বাংলাদেশের জন্য এআই-চালিত স্মার্ট কৃষি প্ল্যাটফর্ম। কৃষি, কৃত্রিম বুদ্ধিমত্তা ও প্রযুক্তির সেতুবন্ধন।
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold text-gray-400 mb-4 text-[10px] tracking-[0.25em] uppercase relative inline-block">
              নেভিগেশন
              <span className="absolute -bottom-1 left-0 w-5 h-px bg-emerald-400/60" />
            </h4>
            <ul className="space-y-2">
              {navLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-gray-800 text-xs transition-all duration-200 flex items-center gap-2 group/link py-0.5">
                    <span className="w-0 h-px bg-emerald-400 group-hover/link:w-2 transition-all duration-300" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-bold text-gray-400 mb-4 text-[10px] tracking-[0.25em] uppercase relative inline-block">
              টুলসমূহ
              <span className="absolute -bottom-1 left-0 w-5 h-px bg-amber-400/60" />
            </h4>
            <ul className="space-y-2">
              {toolLinks.map(t => (
                <li key={t.href}>
                  <Link href={t.href} className="text-gray-400 hover:text-gray-800 text-xs transition-all duration-200 flex items-center gap-2 group/link py-0.5">
                    <span className="w-0 h-px bg-amber-400 group-hover/link:w-2 transition-all duration-300" />
                    {t.label}
                    {t.badge && (
                      <span className="text-[8px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full border border-amber-200">
                        {t.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact/Info */}
          <div>
            <h4 className="font-bold text-gray-400 mb-4 text-[10px] tracking-[0.25em] uppercase relative inline-block">
              যোগাযোগ
              <span className="absolute -bottom-1 left-0 w-5 h-px bg-gray-300" />
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>গ্রুপ ৫ · সিএসই ৪০০</li>
              <li>বিইউবিটি · ইনটেক ৫১</li>
              <li>বাংলাদেশ</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mt-10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} CropIQ. সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </div>
    </footer>
  )
}