import { NextRequest, NextResponse } from "next/server"

const WEATHER_ADVISORY_PROMPT = `তুমি বাংলাদেশের কৃষকদের জন্য ফসল পরামর্শক। আবহাওয়ার পূর্বাভাসের উপর ভিত্তি করে বাস্তবসম্মত কৃষি পরামর্শ দেবে।

তোমার উত্তর এই ফরম্যাটে সাজাবে:
1. **আবহাওয়ার সারসংক্ষেপ** — ২-৩ লাইন
2. **রোপণের পরামর্শ** — এখন কী লাগানো যাবে বা যাবে না
3. **সেচ পরামর্শ** — পানি ব্যবস্থাপনার টিপস
4. **ফসল কাটার পরামর্শ** — সময় বিষয়ক টিপস
5. **সতর্কতা** — ঝড়, বন্যা, পোকামাকড়ের ঝুঁকি

পরামর্শগুলো বাস্তবসম্মত ও আবহাওয়ার সাথে সামঞ্জস্যপূর্ণ হবে। বাংলায় উত্তর দেবে।`

export async function POST(req: NextRequest) {
  try {
    const { district, crop, forecast, language } = await req.json()
    if (!district || !forecast) return NextResponse.json({ error: "জেলা ও আবহাওয়ার তথ্য প্রয়োজন" }, { status: 400 })

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) return NextResponse.json({ error: "এআই সার্ভিস কনফিগার করা হয়নি" }, { status: 500 })

    const forecastText = forecast.slice(0, 7).map((d: any) =>
      `${d.date}: ${d.temp_min}°-${d.temp_max}°C, ${d.description}, বৃষ্টি: ${d.rain_mm}মিমি, আর্দ্রতা: ${d.humidity}%`
    ).join("\n")

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "CropIQ Weather",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          { role: "system", content: WEATHER_ADVISORY_PROMPT },
          { role: "user", content: `জেলা: ${district}, বাংলাদেশ\nফসল: ${crop}\n৭ দিনের আবহাওয়া পূর্বাভাস:\n${forecastText}\n\nকৃষককে বাংলায় বাস্তবসম্মত পরামর্শ দাও।` },
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    })

    if (!response.ok) return NextResponse.json({ error: "পরামর্শ তৈরি করা যায়নি" }, { status: 502 })
    const data = await response.json()
    const advisory = data.choices?.[0]?.message?.content || "পরামর্শ তৈরি করা যায়নি।"

    return NextResponse.json({ advisory })
  } catch (error: any) {
    console.error("আবহাওয়া পরামর্শ ত্রুটি:", error)
    return NextResponse.json({ error: error.message || "সার্ভার ত্রুটি" }, { status: 500 })
  }
}
