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

  // ── find closest card to viewport center ──
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

  const handleScroll = () => {
    setActiveIndex(getClosestIndex())
  }

  const scrollTo = (i: number) => {
    const el = carouselRef.current
    if (!el) return
    const children = Array.from(el.children) as HTMLElement[]
    const target = children[i]
    if (!target) return
    // center the target card in the viewport
    el.scrollTo({
      left: target.offsetLeft - (el.offsetWidth - target.offsetWidth) / 2,
      behavior: "smooth",
    })
  }

  const scroll = (dir: -1 | 1) => {
    const current = getClosestIndex()
    const next = Math.max(0, Math.min(suggestions.length - 1, current + dir))
    scrollTo(next)
  }

  const goTo = (i: number) => scrollTo(i)

  return (
    <div className="shrink-0 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => scroll(-1)}
            disabled={activeIndex === 0}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-default transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
          </button>
          <button
            onClick={() => scroll(1)}
            disabled={activeIndex >= suggestions.length - 1}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-default transition-all"
          >
            <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Scrollable cards — dynamic width per card */}
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1"
      >
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s)}
            disabled={disabled}
            className="shrink-0 w-auto max-w-[85%] snap-center text-left px-4 py-2.5 bg-white border border-gray-200 hover:border-leaf-300 hover:bg-leaf-50 rounded-2xl text-[12px] font-semibold text-gray-700 hover:text-leaf-700 transition-all disabled:opacity-50 shadow-sm leading-relaxed"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-2">
        {suggestions.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all ${
              i === activeIndex
                ? "w-5 h-1.5 bg-leaf-500"
                : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
