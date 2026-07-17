"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Tool {
  href: string
  label: string
  icon: React.ReactNode
  color: string
}

interface ToolPageLayoutProps {
  title: string
  icon: React.ReactNode
  tools: Tool[]
  currentIndex: number
  children: React.ReactNode
}

export function ToolPageLayout({ title, icon, tools, currentIndex, children }: ToolPageLayoutProps) {
  const prev = currentIndex > 0 ? tools[currentIndex - 1] : null
  const next = currentIndex < tools.length - 1 ? tools[currentIndex + 1] : null

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* ── Premium Navigation Header ── */}
      <div className="bg-white/85 backdrop-blur-xl border-b border-gray-100/80 px-4 md:px-8 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
        {/* Back button */}
        <div className="w-[100px] flex justify-start">
          {prev ? (
            <Link
              href={prev.href}
              className="group flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">{prev.label}</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="group flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">হোম</span>
            </Link>
          )}
        </div>

        {/* Centered Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm" style={{ background: tools[currentIndex].color }}>
            {icon}
          </div>
          <h1 className="text-sm md:text-base font-extrabold text-gray-800 text-center">{title}</h1>
        </div>

        {/* Next button */}
        <div className="w-[100px] flex justify-end">
          {next ? (
            <Link
              href={next.href}
              className="group flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all"
            >
              <span className="hidden sm:inline">{next.label}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <Link
              href={tools[0].href}
              className="group flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
            >
              <span className="hidden sm:inline">প্রথম টুল</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>

      {/* ── Content with premium spacing ── */}
      <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 py-5 md:py-7 max-w-4xl mx-auto w-full">
        {children}
      </div>
    </div>
  )
}
