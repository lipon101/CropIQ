"use client"

import Link from "next/link"
import { Sprout, Heart, ArrowRight, MapPin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.3)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(202,138,4,0.2)_0%,transparent_50%)]" />
      </div>

      <div className="relative border-b border-gray-800/60">
        <div className="container-cropiq py-7">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <h3 className="text-lg font-bold mb-1">CropIQ ব্যবহার শুরু করুন</h3>
              <p className="text-gray-400 text-sm">সম্পূর্ণ বিনামূল্যে · কোন লুকানো খরচ নেই</p>
            </div>
            <Link href="/auth/signup" className="btn-primary inline-flex"><Sprout className="w-4 h-4" />বিনামূল্যে যুক্ত হন<ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </div>

      <div className="relative container-cropiq py-12 md:py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-xl flex items-center justify-center shadow-lg"><Sprout className="w-5 h-5 text-white" /></div>
              <span className="text-xl font-extrabold">Crop<span className="text-earth-400">IQ</span></span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">বাংলাদেশের জন্য এআই-চালিত স্মার্ট কৃষি প্ল্যাটফর্ম। কৃষি, কৃত্রিম বুদ্ধিমত্তা ও প্রযুক্তির সেতুবন্ধন।</p>
            <span className="text-xs bg-gray-800 px-3 py-1.5 rounded-full font-medium">🇧🇩 বাংলা</span>
          </div>

          <div>
            <h4 className="font-bold text-gray-200 mb-4 text-xs tracking-[0.2em] uppercase">নেভিগেশন</h4>
            <ul className="space-y-2.5">
              {[{ href: "/", label: "হোম" }, { href: "/tools/disease-detector", label: "রোগ সনাক্তকরণ" }, { href: "/dashboard", label: "ড্যাশবোর্ড" }, { href: "/auth/signin", label: "লগইন" }].map(l => (
                <li key={l.href}><Link href={l.href} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-leaf-400 transition-colors" />{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-200 mb-4 text-xs tracking-[0.2em] uppercase">টুলসমূহ</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/tools/disease-detector", label: "এআই রোগ সনাক্তকারী", badge: true },
                { href: "/tools/chatbot", label: "কৃষি চ্যাটবট" },
                { href: "/tools/market-prices", label: "বাজার মূল্য বোর্ড" },
                { href: "/tools/weather-advisory", label: "আবহাওয়া ও ফসল পরামর্শ" },
              ].map(t => (
                <li key={t.href}><Link href={t.href} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-leaf-400 transition-colors" />{t.label}{t.badge && <span className="text-[9px] font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full ml-1">বিটা</span>}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-200 mb-4 text-xs tracking-[0.2em] uppercase">তথ্য</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-500" /><span>BUBT · CSE 400 · গ্রুপ ৫</span></li>
              <li className="flex items-start gap-3"><Mail className="w-4 h-4 mt-0.5 shrink-0 text-gray-500" /><span>ইনটেক ৫১ · বাংলাদেশ</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} CropIQ — গ্রুপ ৫ · সিএসই ৪০০ · বিইউবিটি · ইনটেক ৫১</p>
          <p className="flex items-center gap-1.5 text-xs text-gray-500">বাংলাদেশের কৃষকদের জন্য <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> 🇧🇩</p>
        </div>
      </div>
    </footer>
  )
}
