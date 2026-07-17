"use client"

import Link from "next/link"
import { Sprout, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.3)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(202,138,4,0.2)_0%,transparent_50%)]" />
      </div>

      <div className="relative container-cropiq py-8 md:py-10">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-3 group">
              <div className="w-8 h-8 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-lg flex items-center justify-center shadow-lg"><Sprout className="w-4 h-4 text-white" /></div>
              <span className="text-lg font-extrabold">Crop<span className="text-earth-400">IQ</span></span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed mb-3">বাংলাদেশের জন্য এআই-চালিত স্মার্ট কৃষি প্ল্যাটফর্ম।</p>
            <span className="text-[10px] bg-gray-800 px-2.5 py-1 rounded-full font-medium">🇧🇩 বাংলা</span>
          </div>

          <div>
            <h4 className="font-bold text-gray-200 mb-3 text-[10px] tracking-[0.2em] uppercase">নেভিগেশন</h4>
            <ul className="space-y-2">
              {[{ href: "/", label: "হোম" }, { href: "/tools/disease-detector", label: "রোগ সনাক্তকরণ" }, { href: "/dashboard", label: "ড্যাশবোর্ড" }, { href: "/auth/signin", label: "লগইন" }].map(l => (
                <li key={l.href}><Link href={l.href} className="text-gray-400 hover:text-white text-xs transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-leaf-400 transition-colors" />{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-200 mb-3 text-[10px] tracking-[0.2em] uppercase">টুলসমূহ</h4>
            <ul className="space-y-2">
              {[
                { href: "/tools/disease-detector", label: "এআই রোগ সনাক্তকারী", badge: true },
                { href: "/tools/chatbot", label: "কৃষি চ্যাটবট" },
                { href: "/tools/market-prices", label: "বাজার মূল্য বোর্ড" },
                { href: "/tools/weather-advisory", label: "আবহাওয়া ও ফসল পরামর্শ" },
              ].map(t => (
                <li key={t.href}><Link href={t.href} className="text-gray-400 hover:text-white text-xs transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-leaf-400 transition-colors" />{t.label}{t.badge && <span className="text-[8px] font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded ml-1">বিটা</span>}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-7 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-gray-500">&copy; {new Date().getFullYear()} CropIQ — গ্রুপ ৫ · সিএসই ৪০০ · বিইউবিটি · ইনটেক ৫১</p>
          <p className="flex items-center gap-1 text-[11px] text-gray-500">বাংলাদেশের কৃষকদের জন্য <Heart className="w-3 h-3 text-red-400 fill-red-400" /> 🇧🇩</p>
        </div>
      </div>
    </footer>
  )
}
