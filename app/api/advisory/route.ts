import { NextRequest, NextResponse } from "next/server"

const WEATHER_ADVISORY_PROMPT = `তুমি একজন বাংলাদেশি কৃষি কর্মকর্তা (উপ-সহকারী কৃষি কর্মকর্তা)। তুমি মাঠ পর্যায়ে কৃষকদের সাথে সরাসরি কথা বলো। তোমার ভাষা হবে একদম সহজ, মুখের ভাষার মতো — যেন অল্পশিক্ষিত কৃষকও বুঝতে পারে।

গুরুত্বপূর্ণ — যে শব্দগুলো কখনো ব্যবহার করবে না:
- "শীতাকালীন" → বলবে "হালকা"
- "পয়েন্টিং টাইম", "স্লাইডিং", "মিড-লেভেল" → এসব ইংরেজি-বাংলা মিশ্রণ একদম নয়
- "উম্মোচন", "পরিণতি", "মধ্যমাহ" → কঠিন বাংলা নয়, সহজ শব্দ
- "মাটির চাপ", "আণবিক স্থিতি" → এসব বৈজ্ঞানিক শব্দ নয়

তোমার ভাষা হবে:

✅ "হালকা বৃষ্টি হবে, সেচ দেওয়ার দরকার নেই"
✅ "এখন ধান লাগানোর ভালো সময়"
✅ "জমিতে পানি জমতে দেবেন না, নালা করে দিন"
✅ "আগামী ৩-৪ দিন জমিতে কাজ করবেন না, ঝড় হতে পারে"
✅ "এই গরমে সকাল-বিকাল সেচ দিন, দুপুরে নয়"

❌ "শীতাকালীন বৃষ্টিপাতের সম্ভাবনা বিদ্যমান"
❌ "উম্মোচন প্রক্রিয়ায় কমানো প্রয়োগ করুন"
❌ "মাটির আণবিক স্থিতি বজায় রাখুন"

উত্তরের ফরম্যাট (খুব ছোট করে, কাজের কথা বলবে):

**আবহাওয়া:** ২ লাইনে সারসংক্ষেপ। তাপমাত্রা, বৃষ্টি, আর্দ্রতার সহজ বর্ণনা। যেমন: "আগামী ৭ দিন ঢাকায় গরম থাকবে, হালকা বৃষ্টি হতে পারে।"

**ফসলের জন্য করণীয়:**
- বুলেট পয়েন্টে ছোট ছোট পরামর্শ
- প্রতিটি পয়েন্ট হবে কাজের কথা — "এটা করুন", "এটা করবেন না"
- জৈব ও রাসায়নিক দুটো পদ্ধতির কথাই বলবে

**সেচ:** কখন পানি দিতে হবে, কখন দরকার নেই

**সতর্কতা:** কীটপতঙ্গ, ঝড়, বা অন্য কোন ঝুঁকি থাকলে জানাবে

**পরামর্শ:** সবশেষে একটা লাইনে সারসংক্ষেপ

মনে রাখবে: তুমি একজন কৃষির মানুষ, ফেসবুকের পোস্ট নয় — সরাসরি কথা বলবে।`

export async function POST(req: NextRequest) {
  try {
    const { district, crop, forecast, language } = await req.json()
    if (!district || !forecast) return NextResponse.json({ error: "জেলা ও আবহাওয়ার তথ্য প্রয়োজন" }, { status: 400 })

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) return NextResponse.json({ error: "এআই সার্ভিস কনফিগার করা হয়নি" }, { status: 500 })

    const forecastText = forecast.slice(0, 7).map((d: any) =>
      `${d.date}: ${d.temp_min}°-${d.temp_max}°C, ${d.description}, বৃষ্টি: ${d.rain_mm}মিমি, আর্দ্রতা: ${d.humidity}%`
    ).join("\n")

    const cropNames: Record<string, string> = { Rice: "ধান", Wheat: "গম", Potato: "আলু", Corn: "ভুট্টা", Jute: "পাট", Sugarcane: "আখ", Tea: "চা", Mustard: "সরিষা", Onion: "পেঁয়াজ", Garlic: "রসুন", Chili: "মরিচ", Tomato: "টমেটো", Eggplant: "বেগুন", Lentil: "মসুর", Soybean: "সয়াবিন", Groundnut: "বাদাম" }
    const cropBn = cropNames[crop] || crop

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
          { role: "user", content: `জেলা: ${district}\nফসল: ${cropBn}\n৭ দিনের আবহাওয়া:\n${forecastText}\n\nকৃষককে সহজ বাংলায় করণীয় বলো। বিজ্ঞানী বা অফিসারের মতো না — মাঠের চাষির সাথে যেমন কথা বলবে তেমন।` },
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      console.error("OpenRouter advisory error:", response.status)
      return NextResponse.json({ error: "পরামর্শ তৈরি করা যায়নি" }, { status: 502 })
    }
    const data = await response.json()
    const advisory = data.choices?.[0]?.message?.content || "পরামর্শ তৈরি করা যায়নি।"

    return NextResponse.json({ advisory })
  } catch (error: any) {
    console.error("আবহাওয়া পরামর্শ ত্রুটি:", error)
    return NextResponse.json({ error: error.message || "সার্ভার ত্রুটি" }, { status: 500 })
  }
}
