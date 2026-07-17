/**
 * OpenRouter AI Client — CropIQ
 * ফ্রি টিয়ার মডেল: openrouter/free
 */

const OPENROUTER_BASE = "https://openrouter.ai/api/v1"

const DISEASE_SYSTEM_PROMPT = `তুমি একজন কৃষি বিজ্ঞানী ও উদ্ভিদ রোগ বিশেষজ্ঞ। বাংলাদেশের কৃষি পদ্ধতি সম্পর্কে তোমার গভীর জ্ঞান আছে।

কৃষকের লক্ষণ বর্ণনা পড়ে:
1. সম্ভাব্য রোগ সনাক্ত করবে
2. কারণ ব্যাখ্যা করবে (ছত্রাক, ব্যাকটেরিয়া, ভাইরাস, পোকামাকড়)
3. জৈব ও রাসায়নিক চিকিৎসার পরামর্শ দেবে
4. ভবিষ্যতের জন্য প্রতিরোধের টিপস দেবে
5. বাংলাদেশে এই রোগ প্রচলিত কিনা উল্লেখ করবে

সহজ ও বাস্তবসম্মত ভাষায় উত্তর দেবে।`

const CHATBOT_SYSTEM_PROMPT = `তুমি CropIQ কৃষি সহায়ক — বাংলাদেশের কৃষকদের জন্য এআই পরামর্শক।

বিষয়সমূহ:
- ফসলের রোগ সনাক্তকরণ ও চিকিৎসা
- মৌসুমভিত্তিক চাষাবাদ ও ফসল কাটার পরামর্শ
- সার ও কীটনাশক সুপারিশ
- সেচ ও পানি ব্যবস্থাপনা
- বাজার তথ্য ও ফসল নির্বাচন
- জৈব কৃষি পদ্ধতি

নিয়মাবলী:
1. সবসময় বাংলায় উত্তর দেবে
2. সহজ ভাষায় লিখবে
3. বাংলাদেশের স্থানীয় সমাধান দেবে
4. কৃষকদের উৎসাহিত করবে
5. না জানলে সততার সাথে বলবে
6. উত্তর ৪০০ শব্দের মধ্যে রাখবে
7. জৈব ও রাসায়নিক উভয় সমাধান দেবে`

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
    throw new Error(`OpenRouter API ত্রুটি (${response?.status || "অজানা"}): ${err}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ""
}

export async function analyzeCropDisease(imageBase64: string, cropDescription?: string): Promise<any> {
  const userPrompt = cropDescription
    ? `এই ফসলের ছবি বিশ্লেষণ করো। কৃষক বলেছে: "${cropDescription}"। ফসল ও রোগ সনাক্ত করো।`
    : `এই ফসলের ছবি বিশ্লেষণ করো। ফসলের ধরন ও রোগ সনাক্ত করো।`

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
  const messages: ChatMessage[] = [{ role: "system", content: "তুমি বাংলাদেশের কৃষকদের জন্য আবহাওয়া পরামর্শক। বাংলায় উত্তর দেবে।" }, { role: "user", content: `জেলা: ${district}, বাংলাদেশ\nফসল: ${crop}\n৭ দিনের আবহাওয়া পূর্বাভাস: ${forecastText}\n\nকৃষককে বাংলায় বাস্তবসম্মত পরামর্শ দাও।` }]
  return await callOpenRouter(messages, { maxTokens: 600, temperature: 0.7 })
}
