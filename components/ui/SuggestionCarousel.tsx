"use client"

import { useState } from "react"
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react"

interface SuggestionCarouselProps {
  suggestions: string[]
  onSelect: (question: string) => void
  disabled?: boolean
  title?: string
}

const PAGE_SIZE = 3

export default function SuggestionCarousel({
  suggestions,
  onSelect,
  disabled = false,
  title = "আরও জানতে চান?",
}: SuggestionCarouselProps) {
  const [page, setPage] = useState(0)

  if (!suggestions.length) return null

  const totalPages = Math.ceil(suggestions.length / PAGE_SIZE)
  const visible = suggestions.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  const goTo = (p: number) => setPage(Math.max(0, Math.min(totalPages - 1, p)))

  return (
    <div className="shrink-0 pb-4 w-full flex flex-col items-center">
      {/* ── Center Aligned Pill Header + LinkedIn-Style Premium Navigation Controls ── */}
      <div className="flex items-center justify-between w-full max-w-2xl px-6 mb-3">
        {/* Empty left spacer of same width as navigation controls to guarantee perfect centering of title */}
        <div className="w-14 hidden sm:block" />

        {/* Centered Pill Title */}
        <div className="flex items-center justify-center flex-1">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-full pl-2.5 pr-3.5 py-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span className="text-[11px] font-extrabold text-amber-700 tracking-wide">{title}</span>
          </div>
        </div>

        {/* LinkedIn-style Navigation Controls (< and >) — only reveal more when clicked */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
            className="w-7 h-7 rounded-full bg-white border border-gray-150 flex items-center justify-center hover:bg-emerald-50/20 hover:border-gray-300 disabled:opacity-25 disabled:cursor-default transition-all shadow-sm active:scale-95"
            title="পূর্ববর্তী"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-gray-600 font-extrabold" />
          </button>
          <button
            onClick={() => goTo(page + 1)}
            disabled={page >= totalPages - 1}
            className="w-7 h-7 rounded-full bg-white border border-gray-150 flex items-center justify-center hover:bg-emerald-50/20 hover:border-gray-300 disabled:opacity-25 disabled:cursor-default transition-all shadow-sm active:scale-95"
            title="আরও দেখুন"
          >
            <ChevronRight className="w-3.5 h-3.5 text-gray-600 font-extrabold" />
          </button>
        </div>
      </div>

      {/* ── Only 3 Questions Visible by Default — Remaining Stay Hidden Until Arrow Clicked ── */}
      <div className="flex flex-nowrap items-center justify-start md:justify-center gap-4.5 max-w-full w-full overflow-x-auto scrollbar-hide px-6 py-2 scroll-smooth">
        {visible.map((s, i) => (
          <button
            key={`${page}-${i}`}
            onClick={() => onSelect(s)}
            disabled={disabled}
            className="group shrink-0 text-left w-auto max-w-[85%] sm:max-w-md px-5 py-3 bg-white border border-gray-150 border-l-2 border-l-leaf-500 hover:border-l-leaf-600 hover:border-gray-200 hover:shadow-md hover:bg-emerald-50/20 rounded-2xl text-[12.5px] font-extrabold text-gray-700 hover:text-leaf-700 transition-all duration-200 disabled:opacity-40 whitespace-nowrap shadow-sm active:scale-95 animate-in fade-in"
          >
            {s}
          </button>
        ))}
      </div>

      {/* ── Page Indicator Dots (only shown when there's more than 1 page) ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === page
                  ? "w-5 h-1.5 bg-leaf-400 shadow-sm shadow-leaf-200"
                  : "w-1.5 h-1.5 bg-gray-200 hover:bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
