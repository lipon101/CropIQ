import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { district, crop, forecast, language } = await req.json()

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 })
    }

    const forecastSummary = forecast
      .map((d: any) => `${d.date}: ${d.temp_min}°-${d.temp_max}°C, ${d.description}, Rain: ${d.rain_mm}mm, Humidity: ${d.humidity}%`)
      .join("\n")

    const prompt = `You are a crop advisor for Bangladeshi farmers. Based on this weather forecast, give practical farming advice for ${crop} cultivation in ${district}, Bangladesh.

7-day weather forecast:
${forecastSummary}

Respond in ${language === "bn" ? "Bengali (বাংলা) with occasional English terms in parentheses" : "English"}.
Format your response with these sections:
1. **আবহাওয়ার সারসংক্ষেপ** / **Weather Summary** — 2-3 lines overview
2. **রোপণের পরামর্শ** / **Planting Advice** — specific to ${crop}
3. **সেচ পরামর্শ** / **Irrigation Advice** — when and how much to water
4. **ফসল কাটার পরামর্শ** / **Harvesting Advice** — timing
5. **সতর্কতা** / **Warnings** — any risks (storm, flood, pest, disease risk due to weather)
6. **সার প্রয়োগ** / **Fertilizer Tips** — if applicable based on weather

Keep the advice practical, specific, and actionable. Use simple language farmers understand.`

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "CropIQ Weather Advisory",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: `Give me farming advice for ${crop} in ${district} based on this forecast.` },
        ],
        max_tokens: 700,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Advisory generation failed" }, { status: 502 })
    }

    const data = await response.json()
    const advisory = data.choices?.[0]?.message?.content || "Could not generate advisory."

    return NextResponse.json({ advisory })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
