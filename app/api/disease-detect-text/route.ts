import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json()
    if (!description?.trim()) return NextResponse.json({ error: "কোন লক্ষণ বর্ণনা করা হয়নি" }, { status: 400 })

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) return NextResponse.json({ error: "এআই সার্ভিস কনফিগার করা হয়নি" }, { status: 500 })

    const prompt = `তুমি একজন কৃষি বিজ্ঞানী। এই লক্ষণ বর্ণনা পড়ে ফসলের রোগ সনাক্ত করো।

শুধুমাত্র একটি JSON অবজেক্ট ফেরত দাও:

{
  "crop_type": "ফসলের নাম বাংলায়",
  "disease_name": "রোগের নাম বা 'পরিষ্কার নয় — আরও তথ্য প্রয়োজন'",
  "confidence": 0.85,
  "cause": "রোগের কারণ",
  "remedy_bn": "বাংলায় চিকিৎসা পদ্ধতি",
  "remedy_en": "Treatment in English",
  "prevention_bn": "বাংলায় প্রতিরোধের উপায়",
  "prevention_en": "Prevention tips in English",
  "is_common_in_bd": true
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
          { role: "user", content: `লক্ষণ বর্ণনা: ${description}\n\nরোগ সনাক্ত করো। শুধুমাত্র JSON উত্তর দাও।` },
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
      try { result = JSON.parse(jsonMatch[0]) } catch { result = { disease_name: "বিশ্লেষণ অসম্পূর্ণ", remedy_bn: content, remedy_en: content } }
    } else {
      result = { disease_name: "নির্ণয় করা যায়নি", remedy_bn: content, remedy_en: content }
    }
    return NextResponse.json({ result })
  } catch (error: any) {
    console.error("রোগ সনাক্তকরণ ত্রুটি:", error)
    return NextResponse.json({ error: error.message || "বিশ্লেষণ ব্যর্থ" }, { status: 500 })
  }
}
