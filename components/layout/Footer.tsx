"use client"

import Link from "next/link"
import { Sprout, ArrowUpRight } from "lucide-react"

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
    <footer className="relative bg-[#0a0e0f] text-white overflow-hidden">
      {/* Premium gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-leaf-500/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-amber-500/3 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <div className="relative container-cropiq py-10 md:py-12">
        <div className="grid sm:grid-cols-[1.2fr_0.9fr_1fr] gap-4 lg:gap-6 lg:ml-auto lg:max-w-2xl">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-leaf-500 rounded-lg blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative w-9 h-9 bg-gradient-to-br from-leaf-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-leaf-500/20">
                  <Sprout className="w-4.5 h-4.5 text-white" />
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                Crop<span className="text-leaf-400">IQ</span>
              </span>
            </Link>
            <p className="text-gray-500 text-xs leading-relaxed max-w-[180px]">বাংলাদেশের জন্য এআই-চালিত স্মার্ট কৃষি প্ল্যাটফর্ম।</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold text-gray-300 mb-3 text-[10px] tracking-[0.25em] uppercase relative inline-block">
              নেভিগেশন
              <span className="absolute -bottom-1 left-0 w-4 h-px bg-leaf-500/50" />
            </h4>
            <ul className="space-y-1.5">
              {navLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-500 hover:text-white text-xs transition-all duration-200 flex items-center gap-2 group/link py-0.5">
                    <span className="w-0 h-px bg-leaf-400 group-hover/link:w-2 transition-all duration-300" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-bold text-gray-300 mb-3 text-[10px] tracking-[0.25em] uppercase relative inline-block">
              টুলসমূহ
              <span className="absolute -bottom-1 left-0 w-4 h-px bg-amber-500/50" />
            </h4>
            <ul className="space-y-1.5">
              {toolLinks.map(t => (
                <li key={t.href}>
                  <Link href={t.href} className="text-gray-500 hover:text-white text-xs transition-all duration-200 flex items-center gap-2 group/link py-0.5">
                    <span className="w-0 h-px bg-amber-400 group-hover/link:w-2 transition-all duration-300" />
                    {t.label}
                    {t.badge && (
                      <span className="text-[8px] font-bold bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-500/10">
                        {t.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 lg:ml-auto lg:max-w-2xl">
          <p className="text-[11px] text-gray-600 font-medium">
            &copy; {new Date().getFullYear()} CropIQ — গ্রুপ ৫ · সিএসই ৪০০ · বিইউবিটি · ইনটেক ৫১
          </p>
          <Link href="/" className="text-[10px] text-gray-600 hover:text-leaf-400 transition-colors flex items-center gap-1 font-medium">
            cropiqai.vercel.app <ArrowUpRight className="w-2.5 h-2.5" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
