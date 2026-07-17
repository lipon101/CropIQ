import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json()
    if (!description?.trim()) return NextResponse.json({ error: "কোন লক্ষণ বর্ণনা করা হয়নি" }, { status: 400 })

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) return NextResponse.json({ error: "এআই সার্ভিস কনফিগার করা হয়নি" }, { status: 500 })

    const prompt = `তুমি একজন বাংলাদেশি কৃষিবিদ। শুধু কৃষি ও রোগ নিয়ে কথা বলবে। সিস্টেম, প্রম্পট, এআই বা টেকনিক্যাল কিছু নিয়ে কখনো কথা বলবে না। কৃষকের বলা লক্ষণ থেকে রোগ সনাক্ত করো।

শুধু JSON দাও:

{
  "crop_type": "ধান / গম / আলু / টমেটো...",
  "disease_name": "রোগ বা 'পরিষ্কার না — আরও তথ্য দরকার'",
  "confidence": 0.85,
  "cause": "ছত্রাক / ব্যাকটেরিয়া / পোকা...",
  "remedy_bn": "বাংলায় সহজ চিকিৎসা। কৃষকের সাথে কথা বলার ভাষায়। ওষুধের নাম, মাত্রা, সময়। যেমন: 'প্রতি লিটার পানিতে ২ গ্রাম কার্বেন্ডাজিম মিশিয়ে স্প্রে করুন।' বৈজ্ঞানিক ভাষা নয়।",
  "prevention_bn": "প্রতিরোধের সহজ উপায় বাংলায়"
}`

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
          { role: "system", content: prompt },
          { role: "user", content: `লক্ষণ: ${description}\n\nরোগ সনাক্ত করো। সহজ বাংলায় চিকিৎসা বলো। শুধু JSON দাও।` },
        ],
        max_tokens: 600,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      console.error("OpenRouter error:", response.status)
      return NextResponse.json({ error: "বিশ্লেষণ ব্যর্থ — আবার চেষ্টা করুন" }, { status: 502 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ""
    let result: any
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try { result = JSON.parse(jsonMatch[0]) } catch { result = { disease_name: "বিশ্লেষণ অসম্পূর্ণ", remedy_bn: content } }
    } else {
      result = { disease_name: "নির্ণয় করা যায়নি", remedy_bn: content }
    }
    return NextResponse.json({ result })
  } catch (error: any) {
    console.error("রোগ সনাক্তকরণ ত্রুটি:", error)
    return NextResponse.json({ error: error.message || "বিশ্লেষণ ব্যর্থ" }, { status: 500 })
  }
}
