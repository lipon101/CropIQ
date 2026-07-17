"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface Tool {
  href: string
  label: string
  color: string
}

export const TOOLS: Tool[] = [
  { href: "/tools/chatbot", label: "চ্যাটবট", color: "linear-gradient(135deg, #3b82f6, #1d4ed8)" },
  { href: "/tools/disease-detector", label: "রোগ সনাক্ত", color: "linear-gradient(135deg, #ef4444, #e11d48)" },
  { href: "/tools/market-prices", label: "বাজার মূল্য", color: "linear-gradient(135deg, #f59e0b, #ea580c)" },
  { href: "/tools/weather-advisory", label: "আবহাওয়া", color: "linear-gradient(135deg, #0ea5e9, #2563eb)" },
]

interface ToolPageLayoutProps {
  title: string
  icon: React.ReactNode
  currentIndex: number
  children: React.ReactNode
}

export function ToolPageLayout({ title, icon, currentIndex, children }: ToolPageLayoutProps) {
  const prev = currentIndex > 0 ? TOOLS[currentIndex - 1] : null
  const next = currentIndex < TOOLS.length - 1 ? TOOLS[currentIndex + 1] : null

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      {/* ── Premium Navigation Header ── */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-100 px-4 md:px-6 py-1.5 flex items-center shrink-0 shadow-sm">
        {/* Left: back button */}
        <div className="flex-1 flex justify-start min-w-0">
          {prev ? (
            <Link href={prev.href} className="group flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all whitespace-nowrap">
              <ChevronLeft className="w-3.5 h-3.5 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
              <span className="truncate">{prev.label}</span>
            </Link>
          ) : (
            <Link href="/" className="group flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all whitespace-nowrap">
              <ChevronLeft className="w-3.5 h-3.5 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
              <span>হোম</span>
            </Link>
          )}
        </div>

        {/* Center: title */}
        <div className="flex items-center gap-2 shrink-0 px-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center shadow-sm" style={{ background: TOOLS[currentIndex].color }}>
            {icon}
          </div>
          <h1 className="text-sm md:text-sm font-extrabold text-gray-800 whitespace-nowrap">{title}</h1>
        </div>

        {/* Right: next button */}
        <div className="flex-1 flex justify-end min-w-0">
          {next ? (
            <Link href={next.href} className="group flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all whitespace-nowrap">
              <span className="truncate">{next.label}</span>
              <ChevronRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <Link href={TOOLS[0].href} className="group flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all whitespace-nowrap">
              <span>CropIQ টুলস</span>
              <ChevronRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-hidden px-4 md:px-6 py-3 md:py-4 max-w-3xl mx-auto w-full">
        {children}

      </div>
    </div>
  )
}
