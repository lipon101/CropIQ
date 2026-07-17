"use client"

import Link from "next/link"
import { Microscope, MessageCircle, BarChart3, CloudSun, ArrowRight, ChevronLeft } from "lucide-react"

const allTools = [
  { href: "/tools/chatbot",        icon: MessageCircle, label: "চ্যাটবট",            cta: "চ্যাটবট ব্যবহার করুন",  desc: "কৃষি বিষয়ক যেকোনো প্রশ্নের উত্তর", color: "from-blue-500 to-blue-700",   bg: "from-blue-50 to-indigo-50",   emoji: "💬" },
  { href: "/tools/disease-detector", icon: Microscope,   label: "রোগ সনাক্তকারী",     cta: "রোগ সনাক্ত করুন",        desc: "ফসলের রোগ সনাক্ত ও চিকিৎসা",     color: "from-red-500 to-rose-600",    bg: "from-red-50 to-rose-50",      emoji: "🔬" },
  { href: "/tools/market-prices",   icon: BarChart3,     label: "বাজার মূল্য",         cta: "বাজারদর দেখুন",          desc: "লাইভ ফসলের বাজার মূল্য",         color: "from-amber-500 to-orange-600", bg: "from-amber-50 to-orange-50",  emoji: "📊" },
  { href: "/tools/weather-advisory",icon: CloudSun,      label: "আবহাওয়া",           cta: "আবহাওয়া দেখুন",         desc: "আবহাওয়ার পূর্বাভাস ও পরামর্শ",   color: "from-sky-500 to-blue-600",    bg: "from-sky-50 to-blue-50",      emoji: "🌤️" },
]

export default function ToolsPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-100 px-4 md:px-8 py-2.5 flex items-center shrink-0 shadow-sm">
        <Link href="/" className="group flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">হোম</span>
        </Link>
        <h1 className="text-sm md:text-base font-extrabold text-gray-800 mx-auto">CropIQ টুলস</h1>
        <div className="w-[68px]" />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 py-4 md:py-6 max-w-4xl mx-auto w-full flex items-center">
        <div className="w-full space-y-5">
          {/* Section heading */}
          <div className="text-center space-y-1.5">
            <h2 className="text-lg md:text-xl font-extrabold text-gray-800">আপনার প্রয়োজনীয় টুল বেছে নিন</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">স্মার্ট কৃষির জন্য চারটি শক্তিশালী এআই টুল — এক ক্লিকেই শুরু</p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {allTools.map(tool => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="relative space-y-3">
                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <tool.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-base font-extrabold text-gray-800 mb-0.5">{tool.label}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{tool.desc}</p>
                  </div>

                  {/* CTA */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r ${tool.color} text-white text-xs font-bold shadow-md group-hover:shadow-lg group-hover:gap-3 transition-all`}>
                    {tool.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
