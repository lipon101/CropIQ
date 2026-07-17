import { NextRequest, NextResponse } from "next/server"

const ADVISORY_PROMPT = `তুমি একজন বাংলাদেশি কৃষি কর্মকর্তা। চাষির সাথে যেভাবে কথা বলবে সেভাবে সহজ বাংলায় ছোট ছোট পরামর্শ দেবে।

গুরুত্বপূর্ণ:
- প্রতি পয়েন্ট ১-২ বাক্যের বেশি নয়
- শুধু কাজের কথা — "এটা করুন", "এটা করবেন না"
- কোনো ব্যাখ্যা নয়, কোনো বিজ্ঞানী ভাষা নয়
- "রাইস" না — "ধান" বলবে; "হুইট" না — "গম" বলবে
- ওষুধের নাম বললে মাত্রাও বলবে

শুধুমাত্র এই JSON ফরম্যাটে উত্তর দাও (কোনো অতিরিক্ত টেক্সট নয়):

{
  "summary": "আগামী ৭ দিনে কেমন আবহাওয়া থাকবে — ১ লাইনে",
  "actions": ["কাজের পয়েন্ট ১", "কাজের পয়েন্ট ২", "কাজের পয়েন্ট ৩"],
  "irrigation": "সেচের পরামর্শ — ১ লাইন",
  "warning": "কোনো সতর্কতা থাকলে ১ লাইন, না থাকলে null"
}`

export async function POST(req: NextRequest) {
  try {
    const { district, crop, forecast } = await req.json()
    if (!district || !forecast) return NextResponse.json({ error: "জেলা ও আবহাওয়ার তথ্য প্রয়োজন" }, { status: 400 })

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) return NextResponse.json({ error: "এআই সার্ভিস কনফিগার করা হয়নি" }, { status: 500 })

    const cropNames: Record<string, string> = { Rice: "ধান", Wheat: "গম", Potato: "আলু", Corn: "ভুট্টা", Jute: "পাট", Sugarcane: "আখ", Tea: "চা", Mustard: "সরিষা", Onion: "পেঁয়াজ", Garlic: "রসুন", Chili: "মরিচ", Tomato: "টমেটো", Eggplant: "বেগুন", Lentil: "মসুর" }
    const cropBn = cropNames[crop] || crop

    const forecastText = forecast.slice(0, 7).map((d: any) =>
      `${d.date}: ${Math.round(d.temp_min)}-${Math.round(d.temp_max)}°C, ${d.description_bn || d.description || ""}, বৃষ্টি ${d.rain_mm}মিমি, আর্দ্রতা ${d.humidity}%`
    ).join(" | ")

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "CropIQ",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          { role: "system", content: ADVISORY_PROMPT },
          { role: "user", content: `জেলা: ${district}\nফসল: ${cropBn}\nআবহাওয়া: ${forecastText}\n\nউপরের JSON ফরম্যাটে উত্তর দাও। ছোট ছোট পয়েন্ট, কোনো বাড়তি কথা নয়।` },
        ],
        max_tokens: 300,
        temperature: 0.5,
      }),
    })

    if (!response.ok) {
      console.error("Advisory error:", response.status)
      return NextResponse.json({ error: "পরামর্শ তৈরি করা যায়নি" }, { status: 502 })
    }

    const data = await response.json()
    const raw = data.choices?.[0]?.message?.content || ""
    
    // Try to parse JSON from response
    let advisory: any = null
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      if (jsonMatch) advisory = JSON.parse(jsonMatch[0])
    } catch { /* fallback */ }
    
    if (!advisory?.summary) {
      advisory = { summary: raw.slice(0, 200), actions: [], irrigation: "", warning: null }
    }

    return NextResponse.json({ advisory })
  } catch (error: any) {
    console.error("আবহাওয়া পরামর্শ ত্রুটি:", error)
    return NextResponse.json({ error: error.message || "সার্ভার ত্রুটি" }, { status: 500 })
  }
}
