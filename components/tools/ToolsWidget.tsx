"use client"

import Link from "next/link"
import { Microscope, MessageCircle, CloudSun, BarChart3, ArrowRight } from "lucide-react"
import { TOOLS } from "./ToolPageLayout"

const toolMeta = [
  { icon: Microscope, label: "রোগ সনাক্ত করুন", desc: "ফসলের রোগ", gradient: "from-red-500 to-rose-600", emoji: "🔬" },
  { icon: MessageCircle, label: "চ্যাটবট ব্যবহার করুন", desc: "কৃষি পরামর্শ", gradient: "from-blue-500 to-blue-700", emoji: "💬" },
  { icon: BarChart3, label: "বাজারদর দেখুন", desc: "লাইভ মূল্য", gradient: "from-amber-500 to-orange-600", emoji: "📊" },
  { icon: CloudSun, label: "আবহাওয়া দেখুন", desc: "পূর্বাভাস", gradient: "from-sky-500 to-blue-600", emoji: "🌤️" },
]

interface ToolsWidgetProps {
  currentIndex: number
}

export function ToolsWidget({ currentIndex }: ToolsWidgetProps) {
  return (
    <div className="mt-10 pt-8 border-t border-gray-100">
      {/* Section label */}
      <div className="text-center mb-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">সব টুল এক জায়গায়</p>
        <h3 className="text-lg font-extrabold text-gray-800 mt-1">আপনার প্রয়োজনীয় টুল বেছে নিন</h3>
      </div>

      {/* Tools grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        {toolMeta.map((tool, i) => {
          const isActive = i === currentIndex
          return (
            <Link
              key={tool.label}
              href={TOOLS[i].href}
              className={`group relative overflow-hidden rounded-2xl p-4 md:p-5 transition-all duration-300 ${
                isActive
                  ? "bg-gray-900 shadow-xl shadow-gray-900/20 scale-[1.03] ring-2 ring-gray-800"
                  : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1 shadow-sm"
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}

              {/* Icon */}
              <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 ${
                isActive
                  ? "bg-white/15"
                  : `bg-gradient-to-br ${tool.gradient}`
              }`}>
                <tool.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-white"}`} />
              </div>

              {/* Label */}
              <h4 className={`text-sm font-extrabold leading-tight mb-1 transition-colors ${
                isActive ? "text-white" : "text-gray-800 group-hover:text-gray-900"
              }`}>
                {tool.label}
              </h4>

              {/* Description */}
              <p className={`text-xs font-medium transition-colors ${
                isActive ? "text-gray-400" : "text-gray-500 group-hover:text-gray-600"
              }`}>
                {tool.desc}
              </p>

              {/* Arrow — only on hover for inactive */}
              {!isActive && (
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
