export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"

const ADVISORY_PROMPT = `তুমি একজন বাংলাদেশি কৃষি কর্মকর্তা। চাষির সাথে যেভাবে কথা বলবে সেভাবে সহজ বাংলায় ছোট ছোট পরামর্শ দেবে।

গুরুত্বপূর্ণ:
- প্রতি পয়েন্ট ১-২ বাক্যের বেশি নয়
- শুধু কাজের কথা — "এটা করুন", "এটা করবেন না"
- কোনো ব্যাখ্যা নয়, কোনো বিজ্ঞানী ভাষা নয়
- "রাইস" না — "ধান" বলবে

শুধুমাত্র JSON দাও — কোনো markdown code block (যেমন ` + "`" + "`" + "`" + `json) দেবে না, কোনো অতিরিক্ত টেক্সট দেবে না। শুধু এই JSON:

{"summary":"আগামী ৭ দিনে কেমন আবহাওয়া — ১ লাইনে","actions":["কাজ ১","কাজ ২","কাজ ৩"],"irrigation":"সেচ — ১ লাইন","warning":"সতর্কতা — ১ লাইন, না থাকলে খালি স্ট্রিং"}`

// ─── Rule-based fallback advisory generator ───
function generateFallbackAdvisory(district: string, crop: string, forecast: any[]) {
  const cropNames: Record<string, string> = { Rice: "ধান", Wheat: "গম", Potato: "আলু", Corn: "ভুট্টা", Jute: "পাট", Sugarcane: "আখ", Tea: "চা", Mustard: "সরিষা", Onion: "পেঁয়াজ", Garlic: "রসুন", Chili: "মরিচ", Tomato: "টমেটো", Eggplant: "বেগুন", Lentil: "মসুর" }
  const cropBn = cropNames[crop] || crop

  const today = forecast[0]
  if (!today) return { summary: "আবহাওয়ার তথ্য অসম্পূর্ণ", actions: ["নিয়মিত জমি পর্যবেক্ষণ করুন"], irrigation: "", warning: "" }

  const weekRain = forecast.reduce((sum, d) => sum + (d.rain_mm || 0), 0)
  const avgHumidity = Math.round(forecast.reduce((sum, d) => sum + d.humidity, 0) / forecast.length)
  const maxTemp = Math.max(...forecast.map(d => d.temp_max))

  let summary = ""
  const actions: string[] = []
  let irrigation = ""
  let warning = ""

  if (weekRain > 30) {
    summary = `আগামী ৭ দিনে ${Math.round(weekRain)} মিমি বৃষ্টি হতে পারে (ভারী বর্ষণের সম্ভাবনা আছে).`
    actions.push("বৃষ্টির আগে জমিতে সার প্রয়োগ করবেন না।")
    actions.push("জমির পানি নিকাশের ব্যবস্থা রাখুন — নালা পরিষ্কার করুন।")
    irrigation = "বৃষ্টির কারণে এ সপ্তাহে সেচ দেওয়ার প্রয়োজন হবে না।"
    warning = "অতিরিক্ত বৃষ্টিতে জমিতে পানি জমতে পারে — নালা পরিষ্কার রাখুন।"
  } else if (weekRain < 3 && maxTemp > 33 && avgHumidity < 70) {
    summary = `আগামী সপ্তাহে বৃষ্টির সম্ভাবনা কম, তাপমাত্রা বেশি থাকবে — ${Math.round(maxTemp)}°C পর্যন্ত উঠতে পারে, আর্দ্রতা ${avgHumidity}% এর কাছাকাছি কম থাকবে।`
    actions.push("সকালে বা বিকালে জমিতে সেচ দিন, দুপুরের রোদে সেচ দিলে গাছ পুড়ে যাবে।")
    actions.push("গাছের গোড়ায় মালচিং করে আর্দ্রতা ধরে রাখুন — খড় বা শুকনা পাতা ব্যবহার করুন।")
    actions.push("প্রতি ৩-৪ দিন পরপর সেচ দিন, সকালে বা সন্ধ্যায়।")
    irrigation = "সকালে বা বিকালে নিয়মিত সেচ দিন — প্রতি ৩-৪ দিন অন্তর। দুপুরে কখনোই সেচ দেবেন না।"
    warning = "খরার সম্ভাবনা — সেচের ব্যবস্থা আগে থেকে প্রস্তুত রাখুন।"
  } else if (weekRain >= 3 && weekRain <= 30) {
    summary = `আগামী সপ্তাহে মোট ${Math.round(weekRain)} মিমি বৃষ্টির সম্ভাবনা আছে, আবহাওয়া তুলনামূলক স্বাভাবিক থাকবে।`
    actions.push("বৃষ্টির আগে জমিতে সার বা কীটনাশক প্রয়োগ করবেন না।")
    actions.push("রোগ বা পোকার আক্রমণ হলে দ্রুত ব্যবস্থা নিন — বৃষ্টির পর পোকা বাড়তে পারে।")
    actions.push("সেচের প্রয়োজন হলে বৃষ্টির ফাঁকে সকালে বা বিকালে সেচ দিন।")
    irrigation = "স্বাভাবিক বৃষ্টির কারণে নিয়মিত সেচের প্রয়োজন হবে না। বৃষ্টির ফাঁকে প্রয়োজন অনুযায়ী সেচ দিন।"
    warning = ""
  } else {
    summary = `আগামী সপ্তাহের আবহাওয়া তুলনামূলক স্বাভাবিক থাকবে। ${Math.round(maxTemp)}°C তাপমাত্রা, ${avgHumidity}% আর্দ্রতা।`
    actions.push("নিয়মিত জমি পর্যবেক্ষণ করুন।")
    actions.push("রোগ বা পোকার আক্রমণ হলে দ্রুত ব্যবস্থা নিন।")
    irrigation = "স্বাভাবিক নিয়মে সেচ দিন — প্রয়োজন অনুযায়ী।"
    warning = ""
  }

  return { summary, actions, irrigation, warning }
}

export async function POST(req: NextRequest) {
  try {
    const { district, crop, forecast } = await req.json()
    if (!district || !forecast) return NextResponse.json({ error: "জেলা ও আবহাওয়ার তথ্য প্রয়োজন" }, { status: 400 })

    const apiKey = process.env.OPENROUTER_API_KEY

    // Generate fallback advisory first (in case AI fails)
    const fallbackAdvisory = generateFallbackAdvisory(district, crop, forecast)

    if (!apiKey) {
      // No AI key: return rule-based fallback instead of error
      return NextResponse.json({ advisory: fallbackAdvisory })
    }

    const cropNames: Record<string, string> = { Rice: "ধান", Wheat: "গম", Potato: "আলু", Corn: "ভুট্টা", Jute: "পাট", Sugarcane: "আখ", Tea: "চা", Mustard: "সরিষা", Onion: "পেঁয়াজ", Garlic: "রসুন", Chili: "মরিচ", Tomato: "টমেটো", Eggplant: "বেগুন", Lentil: "মসুর" }
    const cropBn = cropNames[crop] || crop

    const forecastText = forecast.slice(0, 7).map((d: any) =>
      `${d.date}: ${Math.round(d.temp_min)}-${Math.round(d.temp_max)}°C, ${d.description_bn || d.description || ""}, বৃষ্টি ${d.rain_mm}মিমি, আর্দ্রতা ${d.humidity}%`
    ).join(" | ")

    // Try OpenRouter AI, fall back to rule-based if it fails
    let advisory: any = fallbackAdvisory

    try {
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
            { role: "user", content: `জেলা: ${district}\nফসল: ${cropBn}\nআবহাওয়া: ${forecastText}\n\nশুধু JSON দাও। কোনো markdown নয়, কোনো ব্যাকটিক নয়।` },
          ],
          max_tokens: 300,
          temperature: 0.5,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        let raw = data.choices?.[0]?.message?.content || ""
        raw = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim()
        try {
          const jsonMatch = raw.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            if (parsed.summary && parsed.summary.trim()) {
              advisory = {
                summary: parsed.summary,
                actions: parsed.actions || fallbackAdvisory.actions,
                irrigation: parsed.irrigation || fallbackAdvisory.irrigation,
                warning: parsed.warning || fallbackAdvisory.warning
              }
            }
          }
        } catch {
          console.warn("JSON parse failed, using fallback")
        }
      }
    } catch (err) {
      console.warn("OpenRouter AI failed, using rule-based fallback:", err)
    }

    return NextResponse.json({ advisory })
  } catch (error: any) {
    console.error("আবহাওয়া পরামর্শ ত্রুটি:", error)
    return NextResponse.json({ error: error.message || "সার্ভার ত্রুটি" }, { status: 500 })
  }
}
