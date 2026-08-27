"use client"

import { Sparkles } from "lucide-react"

interface SuggestionCarouselProps {
  suggestions: string[]
  onSelect: (question: string) => void
  disabled?: boolean
  title?: string
}

export default function SuggestionCarousel({
  suggestions,
  onSelect,
  disabled = false,
  title = "আরও জানতে চান?",
}: SuggestionCarouselProps) {
  if (!suggestions.length) return null

  return (
    <div className="shrink-0 pb-3 w-full flex flex-col items-center">
      {/* ── Center Aligned Pill Header ── */}
      <div className="flex items-center justify-center mb-3">
        <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-full pl-2.5 pr-3.5 py-1 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span className="text-[11px] font-extrabold text-amber-700">{title}</span>
        </div>
      </div>

      {/* ── Single-Line Horizontal Suggestions (No wrap, scrollable, beautifully centered) ── */}
      <div className="flex flex-nowrap items-center justify-start md:justify-center gap-2.5 max-w-4xl w-full overflow-x-auto scrollbar-hide px-4 py-1">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s)}
            disabled={disabled}
            className="group shrink-0 text-center px-5 py-2.5 bg-white border border-gray-150 border-l-2 border-l-leaf-500 hover:border-l-leaf-600 hover:border-gray-200 hover:shadow-md rounded-2xl text-[12.5px] font-extrabold text-gray-700 hover:text-leaf-700 transition-all duration-200 disabled:opacity-40 whitespace-nowrap shadow-sm active:scale-95"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
