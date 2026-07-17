export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { getOpenRouterKeys } from "@/lib/openrouter"

const ADVISORY_PROMPT = `তুমি একজন বাংলাদেশি কৃষি কর্মকর্তা। তুমি মাঠ পর্যায়ের কৃষি সম্প্রসারণ কর্মকর্তা — চাষির সাথে যেভাবে কথা বলবে সেভাবে সহজ বাংলায় ছোট ছোট পরামর্শ দেবে।

গুরুত্বপূর্ণ নিয়ম:
- প্রতিটি পয়েন্ট ১-২ বাক্যের বেশি নয়
- শুধু কাজের কথা — "এটা করুন", "এটা করবেন না"
- কোনো ব্যাখ্যা নয়, কোনো বিজ্ঞানী ভাষা নয়
- কোনো ইংরেজি শব্দ ব্যবহার করবে না — "রাইস" না বলে "ধান" বলবে
- প্রতিটি ফিল্ডে বাস্তব পরামর্শ লিখবে, টেমপ্লেট টেক্সট নয়

তোমার আউটপুট হবে একটি JSON অবজেক্ট যার ৪টি ফিল্ড:
- summary: আবহাওয়ার সারাংশ (১-২ বাক্য)
- actions: ২-৩টি করণীয় কাজের অ্যারে
- irrigation: সেচ সংক্রান্ত ১টি পরামর্শ
- warning: কোনো সতর্কতা থাকলে লিখবে, না থাকলে ফাঁকা স্ট্রিং`

// ─── BULLETPROOF garbage detection ───
function isGarbageResponse(parsed: any): boolean {
  if (!parsed) return true

  const summary = (parsed.summary || "").trim()
  const actions: string[] = parsed.actions || []
  const irrigation = (parsed.irrigation || "").trim()
  const warning = (parsed.warning || "").trim()

  // Empty or near-empty summary
  if (summary.length < 15 || summary.length > 400) return true

  // Placeholder text from template
  if (actions.length > 0) {
    const first = actions[0].trim()
    if (first === "কাজ ১" || first === "কাজ ২" || first === "কাজ ৩" || /^কাজ\s*\d/.test(first) || first.includes("কাজ ১")) return true
  }
  if (irrigation.includes("সেচ") && irrigation.includes("১") && irrigation.includes("লাইন") && irrigation.length < 30) return true
  if (warning.includes("সতর্কতা") && warning.includes("১") && warning.includes("লাইন") && warning.length < 30) return true

  // English words in Bengali output (model regurgitating English names)
  if (/\b(Barguna|Dhaka|Chattogram|Rajshahi|Khulna|Sylhet|Barishal|Rangpur|Mymensingh|Maize|Rice|Wheat|Potato|Corn)\b/i.test(summary)) return true

  // Mixed script broken text (Bengali + Latin in same word, like "ডrainaেজ")
  for (const field of [summary, ...actions, irrigation, warning]) {
    if (!field) continue
    if (/[\u0980-\u09FF][a-zA-Z][\u0980-\u09FF]/.test(field)) return true
    if (/[a-zA-Z]{3,}/.test(field)) return true
  }

  // Summary is just data regurgitation
  if (/^[A-Za-z\s,]+:\s*\d/.test(summary)) return true

  // Actions all same or empty
  const unique = new Set(actions.map((a: string) => a.trim()).filter(Boolean))
  if (unique.size === 0) return true
  for (const a of actions) {
    const at = a.trim()
    if (at.length > 250 || at.length < 5) return true
  }

  return false
}

// ─── Rule-based advisory generator (ALWAYS ACCURATE) ───
function generateFallbackAdvisory(district: string, crop: string, forecast: any[]) {
  const cropNames: Record<string, string> = {
    Rice: "ধান", Wheat: "গম", Potato: "আলু", Corn: "ভুট্টা", Maize: "ভুট্টা",
    Jute: "পাট", Sugarcane: "আখ", Tea: "চা", Mustard: "সরিষা", Onion: "পেঁয়াজ",
    Garlic: "রসুন", Chili: "মরিচ", Tomato: "টমেটো", Eggplant: "বেগুন", Lentil: "মসুর",
    Banana: "কলা", Mango: "আম", Cabbage: "বাঁধাকপি", Cauliflower: "ফুলকপি",
    Okra: "ঢেঁড়স", Pumpkin: "কুমড়া", Cucumber: "শসা",
  }
  const cropBn = cropNames[crop] || crop

  const today = forecast[0]
  if (!today) return { summary: "আবহাওয়ার তথ্য অসম্পূর্ণ", actions: ["নিয়মিত জমি পর্যবেক্ষণ করুন"], irrigation: "", warning: "" }

  const weekRain = forecast.reduce((sum: number, d: any) => sum + (d.rain_mm || 0), 0)
  const avgHumidity = Math.round(forecast.reduce((sum: number, d: any) => sum + d.humidity, 0) / forecast.length)
  const maxTemp = Math.max(...forecast.map((d: any) => d.temp_max))
  const minTemp = Math.min(...forecast.map((d: any) => d.temp_min))
  const rainDays = forecast.filter((d: any) => (d.rain_mm || 0) > 1).length

  let summary = ""
  const actions: string[] = []
  let irrigation = ""
  let warning = ""

  if (weekRain > 40) {
    summary = `আগামী ৭ দিনে ${Math.round(weekRain)} মিমি ভারী বৃষ্টির সম্ভাবনা — ${rainDays} দিন বৃষ্টি হতে পারে।`
    actions.push("বৃষ্টির আগে জমিতে সার বা কীটনাশক প্রয়োগ করবেন না।")
    actions.push("জমির পানি নিকাশের নালা পরিষ্কার রাখুন।")
    actions.push("ফসলের গোড়ায় যেন পানি জমতে না পারে সেদিকে খেয়াল রাখুন।")
    irrigation = "বৃষ্টির কারণে এ সপ্তাহে সেচের প্রয়োজন হবে না।"
    warning = "অতিরিক্ত বৃষ্টিতে জমিতে পানি জমতে পারে — নালা পরিষ্কার রাখুন।"
  } else if (weekRain < 3 && maxTemp > 33 && avgHumidity < 70) {
    summary = `আগামী সপ্তাহে বৃষ্টির সম্ভাবনা কম, তাপমাত্রা ${Math.round(maxTemp)}°C পর্যন্ত উঠতে পারে, আর্দ্রতা ${avgHumidity}%।`
    actions.push("সকালে বা বিকালে জমিতে সেচ দিন — দুপুরের রোদে সেচ দেবেন না।")
    actions.push("গাছের গোড়ায় খড় বা শুকনা পাতা দিয়ে মালচিং করুন।")
    actions.push("প্রতি ৩-৪ দিন পরপর সেচ দিন, সকালে বা সন্ধ্যায়।")
    irrigation = "প্রতি ৩-৪ দিন অন্তর সকালে বা বিকালে সেচ দিন। দুপুরে কখনোই সেচ দেবেন না।"
    warning = "খরার সম্ভাবনা — সেচের ব্যবস্থা আগে থেকে প্রস্তুত রাখুন।"
  } else if (weekRain >= 3 && weekRain <= 40) {
    summary = `আগামী সপ্তাহে মোট ${Math.round(weekRain)} মিমি বৃষ্টির সম্ভাবনা, আবহাওয়া মোটামুটি স্বাভাবিক। তাপমাত্রা ${Math.round(minTemp)}-${Math.round(maxTemp)}°C।`
    actions.push("বৃষ্টির আগে জমিতে সার বা কীটনাশক প্রয়োগ করবেন না।")
    actions.push("বৃষ্টির পর পোকা-মাকড় বাড়তে পারে — নিয়মিত জমি পর্যবেক্ষণ করুন।")
    actions.push("সেচের প্রয়োজন হলে বৃষ্টির ফাঁকে সকালে বা বিকালে দিন।")
    irrigation = "স্বাভাবিক বৃষ্টির কারণে নিয়মিত সেচের প্রয়োজন হবে না। প্রয়োজনে বৃষ্টির ফাঁকে সেচ দিন।"
    warning = ""
  } else {
    summary = `আবহাওয়া স্বাভাবিক থাকবে — তাপমাত্রা ${Math.round(minTemp)}-${Math.round(maxTemp)}°C, আর্দ্রতা ${avgHumidity}%।`
    actions.push("নিয়মিত জমি পর্যবেক্ষণ করুন।")
    actions.push("রোগ বা পোকার আক্রমণ দেখলে দ্রুত ব্যবস্থা নিন।")
    irrigation = "প্রয়োজন অনুযায়ী স্বাভাবিক নিয়মে সেচ দিন।"
    warning = ""
  }

  return { summary, actions, irrigation, warning }
}

export async function POST(req: NextRequest) {
  try {
    const { district, crop, forecast } = await req.json()
    if (!district || !forecast) return NextResponse.json({ error: "জেলা ও আবহাওয়ার তথ্য প্রয়োজন" }, { status: 400 })

    // Always generate accurate rule-based advisory as base
    const fallbackAdvisory = generateFallbackAdvisory(district, crop, forecast)

    const keys = getOpenRouterKeys()
    if (keys.length === 0) return NextResponse.json({ advisory: fallbackAdvisory })

    const cropNames: Record<string, string> = {
      Rice: "ধান", Wheat: "গম", Potato: "আলু", Corn: "ভুট্টা", Maize: "ভুট্টা",
      Jute: "পাট", Sugarcane: "আখ", Tea: "চা", Mustard: "সরিষা", Onion: "পেঁয়াজ",
      Garlic: "রসুন", Chili: "মরিচ", Tomato: "টমেটো", Eggplant: "বেগুন", Lentil: "মসুর",
    }
    const cropBn = cropNames[crop] || crop

    const forecastText = forecast.slice(0, 7).map((d: any) =>
      `${d.date}: ${Math.round(d.temp_min)}-${Math.round(d.temp_max)}°C, ${d.description_bn || d.description || ""}, বৃষ্টি ${d.rain_mm}মিমি, আর্দ্রতা ${d.humidity}%`
    ).join(" | ")

    let advisory = fallbackAdvisory

    // Try AI with key rotation — ONLY accept if output is clean
    for (let i = 0; i < keys.length; i++) {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 8000)

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keys[i]}`,
            "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
            "X-Title": "CropIQ",
          },
          body: JSON.stringify({
            model: "openrouter/free",
            messages: [
              { role: "system", content: ADVISORY_PROMPT },
              { role: "user", content: `জেলা: ${district}\nফসল: ${cropBn}\nআগামী ৭ দিনের আবহাওয়া:\n${forecastText}\n\nউপরে দেয়া তথ্যের ভিত্তিতে কৃষককে করণীয় পরামর্শ দাও। শুধু JSON দাও।` },
            ],
            max_tokens: 400,
            temperature: 0.2,
          }),
        })

        if (response.status === 429) { clearTimeout(timeout); console.warn(`Advisory key #${i + 1} rate limited`); continue }
        if (!response.ok) continue

        clearTimeout(timeout)
        const data = await response.json()
        const raw = (data.choices?.[0]?.message?.content || "").replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim()
        const jsonMatch = raw.match(/\{[\s\S]*\}/)
        if (!jsonMatch) continue

        const parsed = JSON.parse(jsonMatch[0])

        if (!isGarbageResponse(parsed)) {
          advisory = {
            summary: parsed.summary.trim(),
            actions: (parsed.actions || []).filter((a: string) => a?.trim()).slice(0, 4),
            irrigation: (parsed.irrigation || fallbackAdvisory.irrigation).trim(),
            warning: (parsed.warning || "").trim(),
          }
          break
        }
      } catch { /* try next key */ }
    }

    // 🔒 FINAL SAFETY NET: never return garbage
    if (isGarbageResponse(advisory)) {
      advisory = generateFallbackAdvisory(district, crop, forecast)
    }

    return NextResponse.json({ advisory })
  } catch (error: any) {
    console.error("আবহাওয়া পরামর্শ ত্রুটি:", error)
    return NextResponse.json({ error: error.message || "সার্ভার ত্রুটি" }, { status: 500 })
  }
}
