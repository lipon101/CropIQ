/**
 * OpenRouter AI Client — CropIQ
 */

const OPENROUTER_BASE = "https://openrouter.ai/api/v1"

const DISEASE_SYSTEM_PROMPT = `তুমি একজন অভিজ্ঞ বাংলাদেশি কৃষিবিদ। তুমি গ্রামে-গঞ্জে কৃষকদের ফসলের রোগ নিয়ে পরামর্শ দিয়ে থাকো।

তোমার ভাষা হবে কৃষকের সাথে কথা বলার মতো — সহজ, সরাসরি, কাজের কথা:
✅ "ভাই, এটা লিফ ব্লাইট রোগ। ছত্রাক থেকে হয়।"
✅ "প্রতি লিটার পানিতে ২ গ্রাম ম্যানকোজেব মিশিয়ে স্প্রে করেন।"
✅ "সকালে স্প্রে করবেন, দুপুরে করলে রোদে পুড়ে যাবে।"

এইরকম বলবে না:
❌ "ছত্রাকজনিত প্যাথোজেন দ্বারা সংক্রমিত"
❌ "রাসায়নিক নিয়ন্ত্রণ পদ্ধতি হিসেবে..."

ফসল ও রোগ সনাক্ত করে:
1. ফসলের নাম ও রোগের নাম বলবে
2. কারণ সহজ ভাষায় বলবে (ছত্রাক, পোকা, ভাইরাস, মাটির সমস্যা)
3. জৈব চিকিৎসা আগে বলবে, তারপর রাসায়নিক
4. ওষুধের নাম, মাত্রা, কখন কীভাবে দিতে হবে
5. বাংলাদেশে এই রোগ সাধারণ কিনা জানাবে
6. ভবিষ্যতে কীভাবে প্রতিরোধ করবে`

const CHATBOT_SYSTEM_PROMPT = `তুমি কৃষি বন্ধু — বাংলাদেশের কৃষকদের একজন চাষি ভাইয়ের মতো সহায়ক।

সহজ বাংলায় কথা বলবে:
- "আপনার গাছে..." — কৃষককে সম্মান দিয়ে
- ছোট ছোট বাক্য, সহজ শব্দ
- নির্দিষ্ট ওষুধের নাম ও মাত্রা
- খরচের ধারণা দেবে
- দেশি পদ্ধতি ও জৈব সমাধান আগে বলবে

বিষয়: ফসল রোগ, চাষাবাদ, সার, সেচ, বাজার, আবহাওয়া, পোকামাকড়`

interface ChatMessage { role: "system" | "user" | "assistant"; content: string }

async function callOpenRouter(messages: ChatMessage[], options: { maxTokens?: number; temperature?: number } = {}): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error("OPENROUTER_API_KEY কনফিগার করা হয়নি")

  const body = { model: "openrouter/free", messages, max_tokens: options.maxTokens ?? 800, temperature: options.temperature ?? 0.7 }

  let retries = 0
  const maxRetries = 3
  let response: Response | null = null

  while (retries <= maxRetries) {
    response = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}`, "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000", "X-Title": "CropIQ" },
      body: JSON.stringify(body),
    })
    if (response.status === 429 && retries < maxRetries) { await new Promise(r => setTimeout(r, Math.pow(2, retries) * 1000)); retries++; continue }
    break
  }

  if (!response?.ok) {
    const err = response ? await response.text() : "কোন সাড়া নেই"
    throw new Error(`OpenRouter ত্রুটি (${response?.status || "অজানা"}): ${err}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ""
}

export async function analyzeCropDisease(imageBase64: string, cropDescription?: string): Promise<any> {
  const userPrompt = cropDescription
    ? `ফসলের ছবি বিশ্লেষণ করো। কৃষক বলেছে: "${cropDescription}"।`
    : `ফসল ও রোগ সনাক্ত করো।`

  try {
    const messages: ChatMessage[] = [
      { role: "system", content: DISEASE_SYSTEM_PROMPT },
      { role: "user", content: [{ type: "text", text: userPrompt }, { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }] as any },
    ]
    const raw = await callOpenRouter(messages as any, { maxTokens: 600, temperature: 0.4 })
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (jsonMatch) return JSON.parse(jsonMatch[0])
    return { crop_type: "অজানা", disease_name: "বিশ্লেষণ অসম্পূর্ণ", confidence: 0, cause: "", remedy_bn: raw, remedy_en: raw, prevention_bn: "", prevention_en: "", is_common_in_bd: false }
  } catch (error) { console.error("রোগ বিশ্লেষণ ব্যর্থ:", error); throw error }
}

export async function chatWithFarmer(userMessage: string, chatHistory: ChatMessage[] = []): Promise<string> {
  const messages: ChatMessage[] = [{ role: "system", content: CHATBOT_SYSTEM_PROMPT }, ...chatHistory.slice(-10), { role: "user", content: userMessage }]
  return await callOpenRouter(messages, { maxTokens: 800, temperature: 0.7 })
}

export async function diagnoseFromDescription(description: string): Promise<string> {
  const messages: ChatMessage[] = [{ role: "system", content: DISEASE_SYSTEM_PROMPT }, { role: "user", content: description }]
  return await callOpenRouter(messages, { maxTokens: 800, temperature: 0.5 })
}

export async function generateWeatherAdvisory(district: string, crop: string, forecast: any): Promise<string> {
  const forecastText = JSON.stringify(forecast, null, 2)
  const messages: ChatMessage[] = [{ role: "system", content: "তুমি একজন বাংলাদেশি কৃষি কর্মকর্তা। কৃষকের সাথে কথা বলার মতো সহজ বাংলায় ৩-৪টি কাজের পরামর্শ দাও। বৈজ্ঞানিক শব্দ বা ইংরেজি-বাংলা মিশ্রণ নয়।" }, { role: "user", content: `জেলা: ${district}, ফসল: ${crop}\n${forecastText}\n\nকৃষককে সহজ বাংলায় করণীয় বলো। মাঠে কথা বলার ভাষায়।` }]
  return await callOpenRouter(messages, { maxTokens: 600, temperature: 0.7 })
}
