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

    const prompt = `তুমি একজন কৃষি বিজ্ঞানী ও উদ্ভিদ রোগ বিশেষজ্ঞ। বাংলাদেশের কৃষি সম্পর্কে তোমার গভীর জ্ঞান আছে। এই ফসলের ছবি বিশ্লেষণ করে ফসলের ধরন ও রোগ সনাক্ত করো।

শুধুমাত্র একটি JSON অবজেক্ট ফেরত দাও (কোন মার্কডাউন বা অতিরিক্ত টেক্সট নয়):

{
  "crop_type": "ফসলের নাম বাংলায়",
  "disease_name": "রোগের নাম বা 'সুস্থ'",
  "confidence": 0.95,
  "cause": "রোগের কারণ (ছত্রাক/ব্যাকটেরিয়া/ভাইরাস/পোকামাকড়/পুষ্টির অভাব)",
  "remedy_bn": "বাংলায় বিস্তারিত চিকিৎসা পদ্ধতি ও ঔষধের নাম",
  "remedy_en": "Treatment details in English",
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
          { role: "user", content: [
            { type: "image_url", image_url: { url: `data:${file.type || "image/jpeg"};base64,${base64}` } },
            { type: "text", text: "এই ফসল ও রোগ সনাক্ত করো। শুধুমাত্র JSON উত্তর দাও।" },
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
        result = { crop_type: "অজানা", disease_name: "বিশ্লেষণ অসম্পূর্ণ", confidence: 0, cause: "", remedy_bn: content, remedy_en: content, prevention_bn: "", prevention_en: "", is_common_in_bd: false }
      }
    } else {
      result = { crop_type: "অজানা", disease_name: "নির্ণয় করা যায়নি", confidence: 0, cause: "", remedy_bn: content, remedy_en: content, prevention_bn: "", prevention_en: "", is_common_in_bd: false }
    }

    return NextResponse.json({ result })
  } catch (error: any) {
    console.error("রোগ সনাক্তকরণ ত্রুটি:", error)
    return NextResponse.json({ error: error.message || "বিশ্লেষণ ব্যর্থ" }, { status: 500 })
  }
}
