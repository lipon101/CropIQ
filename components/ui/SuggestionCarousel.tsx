"use client"

import { useRef, useState } from "react"
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react"

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
  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  if (!suggestions.length) return null

  const getClosestIndex = () => {
    const el = carouselRef.current
    if (!el) return 0
    const children = Array.from(el.children) as HTMLElement[]
    const viewCenter = el.scrollLeft + el.offsetWidth / 2
    let closest = 0
    let closestDist = Infinity
    children.forEach((child, i) => {
      const cardCenter = child.offsetLeft + child.offsetWidth / 2
      const dist = Math.abs(cardCenter - viewCenter)
      if (dist < closestDist) { closestDist = dist; closest = i }
    })
    return closest
  }

  const handleScroll = () => setActiveIndex(getClosestIndex())

  const scrollTo = (i: number) => {
    const el = carouselRef.current
    if (!el) return
    const children = Array.from(el.children) as HTMLElement[]
    const target = children[i]
    if (!target) return
    el.scrollTo({
      left: target.offsetLeft - (el.offsetWidth - target.offsetWidth) / 2,
      behavior: "smooth",
    })
  }

  const scroll = (dir: -1 | 1) => {
    const next = Math.max(0, Math.min(suggestions.length - 1, getClosestIndex() + dir))
    scrollTo(next)
  }

  return (
    <div className="shrink-0 pb-1">
      {/* ── Header: warm pill + glass nav ── */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="inline-flex items-center gap-1.5 bg-amber-50/80 border border-amber-100 rounded-full pl-2 pr-3 py-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span className="text-[11px] font-semibold text-amber-700">{title}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll(-1)}
            disabled={activeIndex === 0}
            className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 hover:border-gray-200 disabled:opacity-25 disabled:cursor-default transition-all shadow-sm"
          >
            <ChevronLeft className="w-3 h-3 text-gray-600" />
          </button>
          <button
            onClick={() => scroll(1)}
            disabled={activeIndex >= suggestions.length - 1}
            className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 hover:border-gray-200 disabled:opacity-25 disabled:cursor-default transition-all shadow-sm"
          >
            <ChevronRight className="w-3 h-3 text-gray-600" />
          </button>
        </div>
      </div>

      {/* ── Cards: left accent + hover arrow ── */}
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1"
      >
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s)}
            disabled={disabled}
            className="group shrink-0 w-auto max-w-[85%] snap-center text-left pl-3.5 pr-8 py-3 bg-white border border-gray-100 border-l-2 border-l-leaf-400 hover:border-l-leaf-500 hover:border-gray-200 hover:shadow-md rounded-xl text-[13px] font-medium text-gray-700 hover:text-leaf-700 transition-all duration-200 disabled:opacity-40 leading-relaxed"
          >
            {s}
            <ChevronRight className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 group-hover:text-leaf-400 group-hover:translate-x-0.5 transition-all" />
          </button>
        ))}
      </div>

      {/* ── Dots ── */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5">
        {suggestions.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-5 h-1.5 bg-leaf-400 shadow-sm shadow-leaf-200"
                : "w-1.5 h-1.5 bg-gray-200 hover:bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
