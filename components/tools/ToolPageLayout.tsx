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
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* ── Premium Navigation Header ── */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-100 px-4 md:px-8 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="w-[100px] flex justify-start">
          {prev ? (
            <Link href={prev.href} className="group flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">{prev.label}</span>
            </Link>
          ) : (
            <Link href="/" className="group flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">হোম</span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm" style={{ background: TOOLS[currentIndex].color }}>
            {icon}
          </div>
          <h1 className="text-sm md:text-base font-extrabold text-gray-800">{title}</h1>
        </div>

        <div className="w-[100px] flex justify-end">
          {next ? (
            <Link href={next.href} className="group flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all">
              <span className="hidden sm:inline">{next.label}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <Link href={TOOLS[0].href} className="group flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
              <span className="hidden sm:inline">প্রথম টুল</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 px-4 sm:px-6 md:px-10 lg:px-14 py-6 md:py-8 max-w-3xl mx-auto w-full">
        {children}
      </div>
    </div>
  )
}
