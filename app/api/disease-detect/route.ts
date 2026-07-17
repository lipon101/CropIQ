import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) return NextResponse.json({ error: "কোন ছবি প্রদান করা হয়নি" }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) return NextResponse.json({ error: "এআই সার্ভিস কনফিগার করা হয়নি" }, { status: 500 })

    const prompt = `তুমি একজন বাংলাদেশি কৃষিবিদ। ফসলের ছবি দেখে রোগ সনাক্ত করো।

শুধুমাত্র একটি JSON দাও:

{
  "crop_type": "ধান / গম / আলু / টমেটো...",
  "disease_name": "রোগের নাম বা 'সুস্থ'",
  "confidence": 0.95,
  "cause": "ছত্রাক / ব্যাকটেরিয়া / পোকা / ভাইরাস / পুষ্টির অভাব",
  "remedy_bn": "বাংলায় চিকিৎসা। কৃষকের সাথে কথা বলার মতো সহজ ভাষায়। ওষুধের নাম, মাত্রা (প্রতি লিটার/বিঘা), কখন দিতে হবে। যেমন: 'প্রতি লিটার পানিতে ২ গ্রাম ম্যানকোজেব মিশিয়ে ৭ দিন পরপর ৩ বার স্প্রে করুন।' বৈজ্ঞানিক শব্দ বা ইংরেজি-বাংলা মিশ্রণ নয়।",
  "prevention_bn": "বাংলায় প্রতিরোধের উপায়। সহজ ও কাজের কথা। যেমন: 'জমিতে পানি জমতে দেবেন না, ফসল কাটার পর নাড়া পুড়িয়ে ফেলবেন।'"
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
          { role: "user", content: [
            { type: "image_url", image_url: { url: `data:${file.type || "image/jpeg"};base64,${base64}` } },
            { type: "text", text: "ফসলের রোগ সনাক্ত করো। সহজ বাংলায় চিকিৎসা বলো। শুধু JSON দাও।" },
          ]},
        ],
        max_tokens: 600,
        temperature: 0.2,
      }),
    })

    if (!response.ok) {
      console.error("OpenRouter error:", response.status)
      return NextResponse.json({ error: "ছবি বিশ্লেষণ ব্যর্থ — আরও পরিষ্কার ছবি দিয়ে চেষ্টা করুন" }, { status: 502 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ""

    let result: any
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try { result = JSON.parse(jsonMatch[0]) } catch {
        result = { crop_type: "অজানা", disease_name: "বিশ্লেষণ অসম্পূর্ণ", confidence: 0, cause: "", remedy_bn: content, prevention_bn: "" }
      }
    } else {
      result = { crop_type: "অজানা", disease_name: "নির্ণয় করা যায়নি", confidence: 0, cause: "", remedy_bn: content, prevention_bn: "" }
    }

    return NextResponse.json({ result })
  } catch (error: any) {
    console.error("রোগ সনাক্তকরণ ত্রুটি:", error)
    return NextResponse.json({ error: error.message || "বিশ্লেষণ ব্যর্থ" }, { status: 500 })
  }
}
