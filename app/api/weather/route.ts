import { NextRequest, NextResponse } from "next/server"
import { DISTRICTS } from "@/lib/constants/districts"

export async function GET(req: NextRequest) {
  try {
    const district = req.nextUrl.searchParams.get("district") || "Dhaka"
    const districtData = DISTRICTS.find(
      (d) => d.name_en.toLowerCase() === district.toLowerCase()
    ) || DISTRICTS.find((d) => d.name_en === "Dhaka")!

    const apiKey = process.env.OPENWEATHERMAP_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Weather service not configured" }, { status: 500 })
    }

    // Fetch 7-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${districtData.lat}&lon=${districtData.lon}&units=metric&appid=${apiKey}`
    const forecastRes = await fetch(forecastUrl)

    if (!forecastRes.ok) {
      return NextResponse.json({ error: "Weather data unavailable" }, { status: 502 })
    }

    const forecastData = await forecastRes.json()

    // Process forecast: one entry per day (midday)
    const dailyMap = new Map<string, any>()
    for (const item of forecastData.list) {
      const date = item.dt_txt.split(" ")[0]
      if (!dailyMap.has(date)) {
        dailyMap.set(date, item)
      }
    }

    const forecast = Array.from(dailyMap.values()).slice(0, 7).map((item: any) => ({
      date: item.dt_txt.split(" ")[0],
      temp_min: Math.round(item.main.temp_min),
      temp_max: Math.round(item.main.temp_max),
      humidity: item.main.humidity,
      rain_mm: item.rain?.["3h"] || 0,
      wind_kmh: Math.round(item.wind.speed * 3.6),
      description: item.weather[0].description,
      icon: item.weather[0].icon,
    }))

    // Current weather from first entry
    const current = forecastData.list[0]

    return NextResponse.json({
      district: districtData.name_en,
      current: {
        temp: Math.round(current.main.temp),
        humidity: current.main.humidity,
        description: current.weather[0].description,
        icon: current.weather[0].icon,
        wind_kmh: Math.round(current.wind.speed * 3.6),
      },
      forecast,
    })
  } catch (error: any) {
    console.error("Weather error:", error)
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 })
  }
}
