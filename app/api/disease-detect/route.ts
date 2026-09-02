import { NextRequest, NextResponse } from "next/server"
import { getOpenRouterKeys } from "@/lib/openrouter"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) return NextResponse.json({ error: "কোন ছবি প্রদান করা হয়নি" }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")

    const keys = getOpenRouterKeys()
    if (keys.length === 0) return NextResponse.json({ error: "এআই সার্ভিস কনফিগার করা হয়নি" }, { status: 500 })

    const prompt = `তুমি একজন বাংলাদেশি অত্যন্ত দক্ষ কৃষিবিদ ও উদ্ভিদ রোগ বিশেষজ্ঞ। তোমার কাজ হচ্ছে ফসলের ছবির সূক্ষ্মতম উপসর্গ ও বিবরণী (যেমন দাগের রঙ, আকৃতি, পাতার প্রান্ত বা ফলের পচন) নিখুঁতভাবে বিশ্লেষণ করে ১০০% নির্ভুল রোগ সনাক্ত করা।

অত্যন্ত কঠোরভাবে নির্দেশিত বিষয়াবলি:
১. একই ছবি একাধিকবার আপলোড করা হলে যেন কোনো অবস্থাতেই ভিন্ন রোগ বা ফলাফল না আসে। প্রতিবার বিশ্লেষণের জন্য একই ডিস্ট্রিবিউশন লজিক ব্যবহার করবে। 
২. ব্যাকটেরিয়াল স্পট (Bacterial Spot) এবং অ্যানথ্রাকনোজ (Anthracnose) এর মতো রোগের উপসর্গের মূল পার্থক্য চিহ্নিত করো:
   - ব্যাকটেরিয়াল স্পট: পাতায় বা ফলের উপর ছোট, কুঁকড়ে যাওয়া বা ভেজা ভেজা পানির মতো দাগ (water-soaked spots) যার চারপাশে হলুদ রঙ থাকতে পারে।
   - অ্যানথ্রাকনোজ: সাধারণত গোলাকার বা ডিম্বাকার, ভেতরের দিকে দেবে যাওয়া ক্ষত বা ডার্ক সানকেন স্পট (sunken lesions) তৈরি করে।
৩. ছবির সূক্ষ্ম পিক্সেল পরীক্ষা করে অত্যন্ত সতর্কতার সাথে রোগ নির্ণয় করবে। কোনো রকম ভুল করা যাবে না।

শুধুমাত্র একটি ভ্যালিড JSON অবজেক্ট দাও (কোনো অতিরিক্ত টেক্সট বা ব্যাকটিক \`\`\`json ছাড়া):

{
  "crop_type": "ধান / গম / আলু / টমেটো...",
  "disease_name": "রোগের নাম বা 'সুস্থ' এবং বন্ধনীতে ইংরেজি নাম",
  "confidence": 0.95,
  "cause": "ছত্রাক / ব্যাকটেরিয়া / পোকা / ভাইরাস / পুষ্টির অভাব",
  "remedy_bn": "বাংলায় চিকিৎসা। কৃষকের সাথে কথা বলার মতো সহজ ভাষায়। ওষুধের নাম, মাত্রা (প্রতি লিটার/বিঘা), কখন দিতে হবে। যেমন: 'প্রতি লিটার পানিতে ২ গ্রাম ম্যানকোজেব মিশিয়ে ৭ দিন পরপর ৩ বার স্প্রে করুন।' বৈজ্ঞানিক শব্দ বা ইংরেজি-বাংলা মিশ্রণ নয়।",
  "prevention_bn": "বাংলায় প্রতিরোধের উপায়। সহজ ও কাজের কথা। যেমন: 'জমিতে পানি জমতে দেবেন না, ফসল কাটার পর নাড়া পুড়িয়ে ফেলবেন।'"
}`

    // Models ordered by quality, fallback availability, and free availability on OpenRouter.
    // We strictly use temperature: 0.0 to prevent any non-deterministic output or variance.
    const modelsToTry = [
      "google/gemma-4-26b-a4b-it:free",
      "google/gemma-4-31b-it:free"
    ]

    let lastError = ""

    // Loop through each model in order
    for (const model of modelsToTry) {
      const body = {
        model: model,
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: [
            { type: "image_url", image_url: { url: `data:${file.type || "image/jpeg"};base64,${base64}` } },
            { type: "text", text: "ফসলের রোগ সনাক্ত করো। ১০০% নির্ভুল ও সুনির্দিষ্ট বিশ্লেষণ প্রদান করো। শুধু JSON দাও।" },
          ]},
        ],
        max_tokens: 600,
        temperature: 0.0, // Strictly 0.0 to make it fully deterministic and avoid varying results on the same image
      }

      // Key rotation loop inside each model attempt
      for (let i = 0; i < keys.length; i++) {
        try {
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${keys[i]}`,
              "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
              "X-Title": "CropIQ",
            },
            body: JSON.stringify(body),
          })

          if (response.status === 429) {
            console.warn(`⚠️ Disease-detect: model ${model} - key #${i + 1} rate limited, rotating keys...`)
            continue
          }

          if (response.ok) {
            const data = await response.json()
            const content = data.choices?.[0]?.message?.content || ""

            // 🔒 Safety block detection
            const isSafetyBlocked = /(safety|unauthorized|harmful|dangerous|medical advice)/i.test(content) && !content.includes("{")
            if (isSafetyBlocked) {
              return NextResponse.json({ error: "ছবি বিশ্লেষণ করা যায়নি। আরও পরিষ্কার ও ভালো আলোতে তোলা ফসলের ছবি ব্যবহার করুন।" }, { status: 422 })
            }

            let result: any
            const jsonMatch = content.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              try {
                result = JSON.parse(jsonMatch[0])
              } catch {
                result = { crop_type: "অজানা", disease_name: "বিশ্লেষণ অসম্পূর্ণ", confidence: 0, cause: "", remedy_bn: "বিশ্লেষণ ব্যর্থ — আবার চেষ্টা করুন", prevention_bn: "" }
              }
            } else {
              result = { crop_type: "অজানা", disease_name: "নির্ণয় করা যায়নি", confidence: 0, cause: "", remedy_bn: "আরও পরিষ্কার ছবি দিয়ে আবার চেষ্টা করুন", prevention_bn: "" }
            }

            return NextResponse.json({ result })
          } else {
            const errText = await response.text()
            console.warn(`⚠️ Model ${model} failed with status ${response.status} using key #${i + 1}:`, errText)
            lastError = `Model ${model} returned ${response.status}`
          }
        } catch (fetchErr: any) {
          console.error(`Fetch error with model ${model} and key #${i + 1}:`, fetchErr)
          lastError = fetchErr.message || "Network error"
        }
      }
    }

    return NextResponse.json({ error: "ছবি বিশ্লেষণ ব্যর্থ — আরও পরিষ্কার ছবি দিয়ে চেষ্টা করুন" }, { status: 502 })
  } catch (error: any) {
    console.error("রোগ সনাক্তকরণ ত্রুটি:", error)
    return NextResponse.json({ error: error.message || "বিশ্লেষণ ব্যর্থ" }, { status: 500 })
  }
}
