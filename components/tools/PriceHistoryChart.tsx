"use client"

import { useMemo, useState } from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface PricePoint {
  date: string
  price: number
}

interface PriceHistoryChartProps {
  /** Price rows, ascending by date (daily or monthly). Auto-slices by cadence. */
  data: PricePoint[]
  commodityBn: string
  districtBn: string
}

const W = 640
const H = 240
const PAD = { top: 18, right: 14, bottom: 32, left: 50 }

const shortDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("bn-BD", { day: "numeric", month: "short" })

export default function PriceHistoryChart({ data, commodityBn, districtBn }: PriceHistoryChartProps) {
  // Detect cadence: DAM national rows arrive daily, WFP district rows monthly.
  // Monthly series → last 12 months; daily series → last 30 points.
  const isMonthly = useMemo(() => {
    if (data.length < 3) return false
    const gaps = []
    for (let i = 1; i < data.length; i++) {
      gaps.push(Math.round((Date.parse(data[i].date) - Date.parse(data[i - 1].date)) / 86400000))
    }
    gaps.sort((a, b) => a - b)
    return gaps[Math.floor(gaps.length / 2)] > 20
  }, [data])

  const points = useMemo(() => data.slice(-(isMonthly ? 12 : 30)), [data, isMonthly])
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  if (points.length < 2) return null

  const prices = points.map((p) => p.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const first = points[0].price
  const last = points[points.length - 1].price
  const trend = last > first ? "up" : last < first ? "down" : "stable"

  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom

  let lo = min
  let hi = max
  if (lo === hi) {
    lo -= 1
    hi += 1
  }
  const pad = (hi - lo) * 0.12
  lo -= pad
  hi += pad

  const x = (i: number) => PAD.left + (i / (points.length - 1)) * innerW
  const y = (v: number) => PAD.top + innerH - ((v - lo) / (hi - lo)) * innerH

  const xs = points.map((_, i) => x(i))
  const ys = prices.map(y)

  const linePath = points
    .map((_, i) => `${i === 0 ? "M" : "L"}${xs[i].toFixed(1)},${ys[i].toFixed(1)}`)
    .join(" ")
  const areaPath = `${linePath} L${xs[xs.length - 1].toFixed(1)},${(PAD.top + innerH).toFixed(1)} L${xs[0].toFixed(1)},${(PAD.top + innerH).toFixed(1)} Z`

  const ticks = Array.from({ length: 5 }, (_, i) => lo + ((hi - lo) * i) / 4)

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    if (rect.width === 0) return
    const svgX = ((e.clientX - rect.left) / rect.width) * W
    let best = 0
    let bestDist = Infinity
    xs.forEach((v, i) => {
      const d = Math.abs(v - svgX)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    })
    setHoverIdx(best)
  }

  const hover = hoverIdx != null ? points[hoverIdx] : null
  const tooltipW = 96
  const tooltipX = hoverIdx != null ? Math.min(Math.max(xs[hoverIdx] - tooltipW / 2, PAD.left), W - PAD.right - tooltipW) : 0

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-extrabold text-gray-800 truncate">📈 {commodityBn} — {isMonthly ? "১২ মাসের" : "৩০ দিনের"} দামের চার্ট</p>
            <p className="text-[10px] text-gray-500 font-semibold mt-0.5">{districtBn}</p>
          </div>
          <div className="shrink-0">
            {trend === "up" ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />বাড়ছে
              </span>
            ) : trend === "down" ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                <TrendingDown className="w-3 h-3" />কমছে
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
                <Minus className="w-3 h-3" />স্থিতিশীল
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-3">
        {/* Summary chips */}
        <div className="flex items-center justify-center gap-5 mb-2">
          <div className="text-center">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">সর্বশেষ</p>
            <p className="text-base font-extrabold text-gray-900 leading-tight">{formatPrice(last)}</p>
          </div>
          <div className="text-center">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">{isMonthly ? "১ বছরের সর্বোচ্চ" : "৩০ দিনের সর্বোচ্চ"}</p>
            <p className="text-sm font-extrabold text-amber-600 leading-tight">{formatPrice(max)}</p>
          </div>
          <div className="text-center">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">সর্বনিম্ন</p>
            <p className="text-sm font-extrabold text-emerald-600 leading-tight">{formatPrice(min)}</p>
          </div>
        </div>

        {/* Chart */}
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" onMouseMove={onMove} onMouseLeave={() => setHoverIdx(null)}>
          <defs>
            <linearGradient id="priceArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Gridlines + y-axis price labels */}
          {ticks.map((t, i) => (
            <g key={i}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="#f1f5f9" strokeWidth="1" />
              <text x={PAD.left - 8} y={y(t) + 3.5} textAnchor="end" fontSize="10" fill="#94a3b8">
                {formatPrice(Math.round(t))}
              </text>
            </g>
          ))}

          {/* Area + line */}
          <path d={areaPath} fill="url(#priceArea)" />
          <path d={linePath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

          {/* Data points (title = native tooltip) */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={xs[i]}
              cy={ys[i]}
              r={hoverIdx === i ? 5 : 3}
              fill={hoverIdx === i ? "#f59e0b" : "#fff"}
              stroke="#f59e0b"
              strokeWidth="2"
            >
              <title>{`${shortDate(p.date)}: ${formatPrice(p.price)}`}</title>
            </circle>
          ))}

          {/* Hover crosshair + tooltip */}
          {hover && hoverIdx != null && (
            <g>
              <line x1={xs[hoverIdx]} x2={xs[hoverIdx]} y1={PAD.top} y2={PAD.top + innerH} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
              <rect x={tooltipX} y={Math.max(ys[hoverIdx] - 40, 2)} width={tooltipW} height={24} rx={7} fill="#1e293b" />
              <text x={tooltipX + tooltipW / 2} y={Math.max(ys[hoverIdx] - 40, 2) + 16} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
                {`${shortDate(hover.date)}: ${formatPrice(hover.price)}`}
              </text>
            </g>
          )}

          {/* X-axis date labels: first, middle, last */}
          {[0, Math.floor((points.length - 1) / 2), points.length - 1].map((i) => (
            <text key={i} x={xs[i]} y={H - 10} textAnchor="middle" fontSize="10" fill="#94a3b8">
              {shortDate(points[i].date)}
            </text>
          ))}
        </svg>
      </div>
    </div>
  )
}
