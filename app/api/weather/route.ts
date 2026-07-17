export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { DISTRICTS } from "@/lib/constants/districts"

const weatherDescBn: Record<string, string> = {
  "light rain": "হালকা বৃষ্টি", "moderate rain": "মাঝারি বৃষ্টি", "heavy intensity rain": "ভারী বৃষ্টি",
  "very heavy rain": "অতি ভারী বৃষ্টি", "overcast clouds": "মেঘলা", "scattered clouds": "আংশিক মেঘলা",
  "few clouds": "সামান্য মেঘ", "clear sky": "পরিষ্কার আকাশ", "broken clouds": "ভাঙা মেঘ",
  "thunderstorm": "বজ্রসহ বৃষ্টি", "drizzle": "গুঁড়ি গুঁড়ি বৃষ্টি", "mist": "কুয়াশা",
  "haze": "ধোঁয়াশা", "fog": "ঘন কুয়াশা", "smoke": "ধোঁয়া",
}

export async function GET(req: NextRequest) {
  try {
    const district = req.nextUrl.searchParams.get("district") || "Dhaka"
    const districtData = DISTRICTS.find((d) => d.name_en === district) || DISTRICTS.find((d) => d.name_en === "Dhaka")!

    const apiKey = process.env.OPENWEATHERMAP_API_KEY
    if (!apiKey) return NextResponse.json({ error: "আবহাওয়া সার্ভিস কনফিগার করা হয়নি" }, { status: 500 })

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${districtData.lat}&lon=${districtData.lon}&appid=${apiKey}&units=metric`
    )
    if (!res.ok) return NextResponse.json({ error: "আবহাওয়ার তথ্য পাওয়া যায়নি" }, { status: 502 })

    const raw = await res.json()

    const dailyMap = new Map<string, any>()
    for (const item of raw.list) {
      const date = item.dt_txt.split(" ")[0]
      const rainAmount = Math.round((item.rain?.["3h"] || 0) * 10) / 10
      const descEn = item.weather[0].description.toLowerCase()
      const descBn = weatherDescBn[descEn] || descEn
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date,
          temp: item.main.temp,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          humidity: item.main.humidity,
          rain_mm: rainAmount,
          wind_kmh: Math.round(item.wind.speed * 3.6),
          description_bn: descBn,
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
