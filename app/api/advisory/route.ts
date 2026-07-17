export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { getOpenRouterKeys } from "@/lib/openrouter"

const ADVISORY_PROMPT = `তুমি একজন বাংলাদেশি কৃষি কর্মকর্তা। তুমি মাঠ পর্যায়ের কৃষি সম্প্রসারণ কর্মকর্তা — চাষির সাথে যেভাবে কথা বলবে সেভাবে সহজ বাংলায় ছোট ছোট পরামর্শ দেবে।

গুরুত্বপূর্ণ নিয়ম:
- প্রতিটি পয়েন্ট ১-২ বাক্যের বেশি নয়
- শুধু কাজের কথা — "এটা করুন", "এটা করবেন না"
- কোনো ব্যাখ্যা নয়, কোনো বিজ্ঞানী ভাষা নয়
- কোনো ইংরেজি শব্দ ব্যবহার করবে না — "রাইস" না বলে "ধান" বলবে
- কোনো টেমপ্লেট বা প্লেসহোল্ডার টেক্সট দেবে না — প্রতিটি ফিল্ডে বাস্তব পরামর্শ লিখবে

তোমার আউটপুট হবে একটি JSON অবজেক্ট যার ৪টি ফিল্ড:
- summary: আবহাওয়ার সারাংশ (১-২ বাক্য)
- actions: ২-৩টি করণীয় কাজের অ্যারে
- irrigation: সেচ সংক্রান্ত ১টি পরামর্শ
- warning: কোনো সতর্কতা থাকলে লিখবে, না থাকলে ফাঁকা স্ট্রিং`

// ─── Validate AI output is not garbage/placeholder ───
function isGarbageResponse(parsed: any): boolean {
  if (!parsed?.summary?.trim()) return true

  const summary = parsed.summary.trim()
  const actions: string[] = parsed.actions || []
  const irrigation = (parsed.irrigation || "").trim()
  const warning = (parsed.warning || "").trim()

  // Detect placeholder text copied from template
  if (/^কাজ\s*[১২৩]$/.test(actions[0]?.trim() || "")) return true
  if (/^সেচ\s*[—–-]\s*১\s*লাইন/.test(irrigation)) return true
  if (/^সতর্কতা\s*[—–-]\s*১\s*লাইন/.test(warning)) return true

  // Detect raw data regurgitation (district names + dates + numbers)
  if (/\b(Barguna|Dhaka|Chattogram|Rajshahi|Khulna|Sylhet|Barishal|Rangpur|Mymensingh|Maize|Rice|Wheat|Potato|Corn)\b/i.test(summary)) return true
  if (/১৬[—–-]\d{1,2}\s*জুলাই/.test(summary)) return true
  if (/\d{1,2}[—–-]\d{1,2}\s*°C/.test(summary)) return true

  // Detect if summary is just "X, Y: date range, rain, temp" pattern (regurgitation)
  if (/^[A-Za-z\s]+,\s*[A-Za-z\s]+:\s*\d/.test(summary)) return true

  // Summary too short or too long
  if (summary.length < 15 || summary.length > 400) return true

  // All actions are identical or empty
  const uniqueActions = new Set(actions.map((a: string) => a.trim()).filter(Boolean))
  if (uniqueActions.size === 0) return true
  if (uniqueActions.size === 1 && actions.length > 1) return true

  // Actions too long (probably raw data)
  for (const a of actions) {
    if (a.trim().length > 250) return true
  }

  return false
}

// ─── Rule-based fallback advisory generator ───
function generateFallbackAdvisory(district: string, crop: string, forecast: any[]) {
  const cropNames: Record<string, string> = { Rice: "ধান", Wheat: "গম", Potato: "আলু", Corn: "ভুট্টা", Jute: "পাট", Sugarcane: "আখ", Tea: "চা", Mustard: "সরিষা", Onion: "পেঁয়াজ", Garlic: "রসুন", Chili: "মরিচ", Tomato: "টমেটো", Eggplant: "বেগুন", Lentil: "মসুর", Maize: "ভুট্টা" }
  const cropBn = cropNames[crop] || crop

  const today = forecast[0]
  if (!today) return { summary: "আবহাওয়ার তথ্য অসম্পূর্ণ", actions: ["নিয়মিত জমি পর্যবেক্ষণ করুন"], irrigation: "", warning: "" }

  const weekRain = forecast.reduce((sum: number, d: any) => sum + (d.rain_mm || 0), 0)
  const avgHumidity = Math.round(forecast.reduce((sum: number, d: any) => sum + d.humidity, 0) / forecast.length)
  const maxTemp = Math.max(...forecast.map((d: any) => d.temp_max))
  const minTemp = Math.min(...forecast.map((d: any) => d.temp_min))

  let summary = ""
  const actions: string[] = []
  let irrigation = ""
  let warning = ""

  if (weekRain > 40) {
    summary = `আগামী ৭ দিনে ${Math.round(weekRain)} মিমি ভারী বৃষ্টির সম্ভাবনা আছে।`
    actions.push("বৃষ্টির আগে জমিতে সার বা কীটনাশক প্রয়োগ করবেন না।")
    actions.push("জমির পানি নিকাশের নালা পরিষ্কার রাখুন।")
    actions.push("ফসলের গোড়ায় যেন পানি না জমে সেদিকে খেয়াল রাখুন।")
    irrigation = "বৃষ্টির কারণে এ সপ্তাহে সেচের প্রয়োজন হবে না।"
    warning = "অতিরিক্ত বৃষ্টিতে জমিতে পানি জমতে পারে — নালা পরিষ্কার রাখুন।"
  } else if (weekRain < 3 && maxTemp > 33 && avgHumidity < 70) {
    summary = `আগামী সপ্তাহে বৃষ্টির সম্ভাবনা কম, তাপমাত্রা ${Math.round(maxTemp)}°C পর্যন্ত, আর্দ্রতা ${avgHumidity}%।`
    actions.push("সকালে বা বিকালে জমিতে সেচ দিন, দুপুরের রোদে সেচ দেবেন না।")
    actions.push("গাছের গোড়ায় খড় বা শুকনা পাতা দিয়ে মালচিং করুন।")
    actions.push("প্রতি ৩-৪ দিন পরপর সকালে বা সন্ধ্যায় সেচ দিন।")
    irrigation = "প্রতি ৩-৪ দিন অন্তর সকালে বা বিকালে সেচ দিন। দুপুরে কখনোই সেচ দেবেন না।"
    warning = "খরার সম্ভাবনা — সেচের ব্যবস্থা আগে থেকে প্রস্তুত রাখুন।"
  } else if (weekRain >= 3 && weekRain <= 40) {
    summary = `আগামী সপ্তাহে মোট ${Math.round(weekRain)} মিমি বৃষ্টির সম্ভাবনা, আবহাওয়া মোটামুটি স্বাভাবিক থাকবে।`
    actions.push("বৃষ্টির আগে জমিতে সার বা কীটনাশক প্রয়োগ করবেন না।")
    actions.push("বৃষ্টির পর পোকা-মাকড় বাড়তে পারে — নিয়মিত জমি পর্যবেক্ষণ করুন।")
    actions.push("সেচের প্রয়োজন হলে বৃষ্টির ফাঁকে সকালে বা বিকালে দিন।")
    irrigation = "স্বাভাবিক বৃষ্টির কারণে নিয়মিত সেচের প্রয়োজন হবে না। প্রয়োজনে বৃষ্টির ফাঁকে সেচ দিন।"
    warning = ""
  } else {
    summary = `আগামী সপ্তাহের আবহাওয়া স্বাভাবিক থাকবে — তাপমাত্রা ${Math.round(minTemp)}-${Math.round(maxTemp)}°C, আর্দ্রতা ${avgHumidity}%।`
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

    const keys = getOpenRouterKeys()

    // Always generate rule-based fallback first
    const fallbackAdvisory = generateFallbackAdvisory(district, crop, forecast)

    if (keys.length === 0) {
      return NextResponse.json({ advisory: fallbackAdvisory })
    }

    const cropNames: Record<string, string> = { Rice: "ধান", Wheat: "গম", Potato: "আলু", Corn: "ভুট্টা", Jute: "পাট", Sugarcane: "আখ", Tea: "চা", Mustard: "সরিষা", Onion: "পেঁয়াজ", Garlic: "রসুন", Chili: "মরিচ", Tomato: "টমেটো", Eggplant: "বেগুন", Lentil: "মসুর", Maize: "ভুট্টা" }
    const cropBn = cropNames[crop] || crop

    const forecastText = forecast.slice(0, 7).map((d: any) =>
      `${d.date}: ${Math.round(d.temp_min)}-${Math.round(d.temp_max)}°C, ${d.description_bn || d.description || ""}, বৃষ্টি ${d.rain_mm}মিমি, আর্দ্রতা ${d.humidity}%`
    ).join(" | ")

    let advisory: any = fallbackAdvisory

    // Try OpenRouter AI with key rotation
    try {
      for (let i = 0; i < keys.length; i++) {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
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
              { role: "user", content: `জেলা: ${district}\nফসল: ${cropBn}\nআগামী ৭ দিনের আবহাওয়া:\n${forecastText}\n\nউপরে দেয়া আবহাওয়ার তথ্যের ভিত্তিতে কৃষককে করণীয় পরামর্শ দাও। শুধু JSON দাও। কোনো markdown বা ব্যাকটিক দেবে না।` },
            ],
            max_tokens: 400,
            temperature: 0.5,
          }),
        })

        if (response.status === 429) {
          console.warn(`⚠️ Advisory: key #${i + 1} rate limited, rotating...`)
          continue
        }

        if (response.ok) {
          const data = await response.json()
          let raw = data.choices?.[0]?.message?.content || ""
          raw = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim()

          try {
            const jsonMatch = raw.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0])

              // 🔍 Validate: reject if garbage/placeholder
              if (!isGarbageResponse(parsed)) {
                advisory = {
                  summary: parsed.summary.trim(),
                  actions: (parsed.actions || []).filter((a: string) => a?.trim()).slice(0, 4),
                  irrigation: (parsed.irrigation || fallbackAdvisory.irrigation).trim(),
                  warning: (parsed.warning || "").trim()
                }
                break // success — use AI response
              } else {
                console.warn("⚠️ AI returned garbage/placeholder, using rule-based fallback")
              }
            }
          } catch {
            console.warn("Advisory JSON parse failed, using fallback")
          }
          break
        }

        console.warn(`⚠️ Advisory: key #${i + 1} returned ${response.status}, rotating...`)
      }
    } catch (err) {
      console.warn("OpenRouter AI failed for advisory, using rule-based fallback:", err)
    }

    return NextResponse.json({ advisory })
  } catch (error: any) {
    console.error("আবহাওয়া পরামর্শ ত্রুটি:", error)
    return NextResponse.json({ error: error.message || "সার্ভার ত্রুটি" }, { status: 500 })
  }
}
