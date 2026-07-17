import { NextRequest, NextResponse } from "next/server"
export const dynamic = "force-dynamic"
import { DISTRICTS } from "@/lib/constants/districts"

export async function GET(req: NextRequest) {
  try {
    const district = req.nextUrl.searchParams.get("district") || "Dhaka"
    const districtData = DISTRICTS.find((d) => d.name_en === district) || DISTRICTS.find((d) => d.name_en === "Dhaka")!

    const apiKey = process.env.OPENWEATHERMAP_API_KEY
    if (!apiKey) return NextResponse.json({ error: "আবহাওয়া সার্ভিস কনফিগার করা হয়নি" }, { status: 500 })

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${districtData.lat}&lon=${districtData.lon}&appid=${apiKey}&units=metric&lang=bn`
    )
    if (!res.ok) return NextResponse.json({ error: "আবহাওয়ার তথ্য পাওয়া যায়নি" }, { status: 502 })

    const raw = await res.json()

    // Group by date
    const dailyMap = new Map<string, any>()
    for (const item of raw.list) {
      const date = item.dt_txt.split(" ")[0]
      const rainAmount = Math.round((item.rain?.["3h"] || 0) * 10) / 10
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date,
          temp: item.main.temp,          // ← বর্তমান তাপমাত্রা
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          humidity: item.main.humidity,
          rain_mm: rainAmount,
          wind_kmh: Math.round(item.wind.speed * 3.6),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        })
      } else {
        const d = dailyMap.get(date)
        d.temp_min = Math.min(d.temp_min, item.main.temp_min)
        d.temp_max = Math.max(d.temp_max, item.main.temp_max)
        d.humidity = Math.round((d.humidity + item.main.humidity) / 2)
        d.rain_mm = Math.round((d.rain_mm + rainAmount) * 10) / 10
      }
    }

    const forecast = Array.from(dailyMap.values()).slice(0, 7)
    const current = forecast[0]

    return NextResponse.json({ district, current, forecast })
  } catch (error) {
    console.error("আবহাওয়া ত্রুটি:", error)
    return NextResponse.json({ error: "আবহাওয়ার তথ্য সংগ্রহ ব্যর্থ" }, { status: 500 })
  }
}
