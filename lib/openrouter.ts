/**
 * OpenRouter AI Client — replaces Gemini for CropIQ
 * Uses the free tier model: openrouter/free
 *
 * OpenRouter API docs: https://openrouter.ai/docs
 */

const OPENROUTER_BASE = "https://openrouter.ai/api/v1"

const DISEASE_SYSTEM_PROMPT = `You are an expert agricultural scientist and plant pathologist with deep knowledge of Bangladesh farming practices. Your role is to help farmers and growers identify and treat plant diseases.

When a user describes symptoms, you should:
1. Identify the possible disease(s)
2. Explain the cause (fungus, bacteria, virus, pest, etc.)
3. Suggest organic and chemical treatment options
4. Give prevention tips for the future
5. Mention if the disease is common in Bangladesh

Always be:
- Clear and beginner-friendly
- Practical and actionable
- Supportive and encouraging to farmers
- Include a short Bangla summary when addressing Bangladesh-specific issues

Format your response clearly with sections.`

const DISEASE_VISION_PROMPT = `You are an expert agricultural scientist and plant pathologist specializing in Bangladesh crops. Analyze the crop photo provided and identify any diseases.

Return your response in this JSON format:
{
  "crop_type": "name of the crop (e.g., rice, wheat, potato, tomato, eggplant, chili)",
  "disease_name": "name of the disease or 'Healthy' if no disease detected",
  "confidence": 0.95,
  "cause": "what causes this disease (fungus/bacteria/virus/pest/nutrient)",
  "remedy_bn": "চিকিৎসা পদ্ধতি বাংলায় লিখুন",
  "remedy_en": "Treatment method in English",
  "prevention_bn": "প্রতিরোধের উপায় বাংলায় লিখুন",
  "prevention_en": "Prevention tips in English",
  "is_common_in_bd": true
}

Be specific to Bangladesh agriculture. Mention local names of diseases.`

const CHATBOT_SYSTEM_PROMPT = `You are CropIQ কৃষি সহায়ক, an AI farming assistant for Bangladeshi farmers. You help with:
- Crop disease identification and treatment
- Planting and harvesting advice based on seasons
- Fertilizer and pesticide recommendations
- Irrigation and water management
- Market information and crop selection
- Organic farming practices

Rules:
1. Always respond in the SAME language the user writes in (Bangla or English)
2. If the user writes in Bangla, reply in Bangla with occasional English technical terms
3. Be practical — suggest locally available solutions in Bangladesh
4. Be encouraging and respectful to farmers
5. If you don't know something, say so honestly
6. Keep responses under 500 words unless the user asks for detail
7. For disease questions, ask about symptoms first before diagnosing
8. Suggest both organic (জৈব) and chemical (রাসায়নিক) options when relevant

You have knowledge about:
- Rice (ধান): blast, blight, tungro, stem borer
- Wheat (গম): rust, blight, aphids
- Potato (আলু): late blight, scab, aphids
- Vegetables (সবজি): various pests and diseases
- Jute (পাট): stem rot, anthracnose
- Fruits (ফল): mango hopper, banana wilt, papaya ringspot`

const WEATHER_ADVISORY_PROMPT = `You are a crop advisor for Bangladeshi farmers. Based on the weather forecast provided, give practical farming advice.

Format your response:
1. **আবহাওয়ার সারসংক্ষেপ** / **Weather Summary** — 2-3 lines
2. **রোপণের পরামর্শ** / **Planting Advice** — what to plant/not plant now
3. **সেচ পরামর্শ** / **Irrigation Advice** — water management tips
4. **ফসল কাটার পরামর্শ** / **Harvesting Advice** — timing tips
5. **সতর্কতা** / **Warnings** — any risks (storm, flood, pest risk)

Keep advice practical and specific to the weather conditions. Respond in Bengali with English summaries in parentheses.`

interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface OpenRouterResponse {
  choices: {
    message: { content: string }
    finish_reason: string
  }[]
}

/**
 * Call OpenRouter chat completion API
 */
async function callOpenRouter(
  messages: ChatMessage[],
  options: {
    maxTokens?: number
    temperature?: number
    stream?: boolean
  } = {}
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured")

  const body = {
    model: "openrouter/free",
    messages,
    max_tokens: options.maxTokens ?? 800,
    temperature: options.temperature ?? 0.7,
    stream: options.stream ?? false,
  }

  let retries = 0
  const maxRetries = 3
  let response: Response | null = null

  while (retries <= maxRetries) {
    response = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "CropIQ",
      },
      body: JSON.stringify(body),
    })

    if (response.status === 429 && retries < maxRetries) {
      const delay = Math.pow(2, retries) * 1000
      await new Promise((r) => setTimeout(r, delay))
      retries++
      continue
    }
    break
  }

  if (!response?.ok) {
    const err = response ? await response.text() : "No response"
    throw new Error(`OpenRouter API error (${response?.status || "unknown"}): ${err}`)
  }

  const data: OpenRouterResponse = await response.json()
  return data.choices[0]?.message?.content || ""
}

/**
 * Analyze crop image for disease detection using OpenRouter vision
 * Since OpenRouter free models may have limited vision support,
 * we fall back to descriptive prompt when needed.
 */
export async function analyzeCropDisease(
  imageBase64: string,
  cropDescription?: string
): Promise<{
  crop_type: string
  disease_name: string
  confidence: number
  cause: string
  remedy_bn: string
  remedy_en: string
  prevention_bn: string
  prevention_en: string
  is_common_in_bd: boolean
}> {
  const userPrompt = cropDescription
    ? `Analyze this crop photo. The user says: "${cropDescription}". Identify the crop and any disease.`
    : `Analyze this crop photo. Identify the crop type and check for any diseases. If you cannot see the image, ask the user to describe what they see.`

  try {
    const messages: ChatMessage[] = [
      { role: "system", content: DISEASE_VISION_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
          },
        ] as any,
      },
    ]

    const raw = await callOpenRouter(messages as any, { maxTokens: 600, temperature: 0.4 })

    // Try to extract JSON from response
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    // Fallback: parse from structured text
    return {
      crop_type: "Unknown",
      disease_name: "Analysis Incomplete",
      confidence: 0,
      cause: "",
      remedy_bn: raw,
      remedy_en: raw,
      prevention_bn: "",
      prevention_en: "",
      is_common_in_bd: false,
    }
  } catch (error) {
    console.error("Disease analysis failed:", error)
    throw error
  }
}

/**
 * Chat with the farming chatbot
 */
export async function chatWithFarmer(
  userMessage: string,
  chatHistory: ChatMessage[] = [],
  language: "bn" | "en" = "bn"
): Promise<string> {
  const langInstruction =
    language === "bn"
      ? "User prefers Bengali. Reply in Bengali (বাংলা)."
      : "User prefers English. Reply in English."

  const messages: ChatMessage[] = [
    { role: "system", content: `${CHATBOT_SYSTEM_PROMPT}\n\n${langInstruction}` },
    ...chatHistory.slice(-10), // keep last 10 messages for context
    { role: "user", content: userMessage },
  ]

  return await callOpenRouter(messages, { maxTokens: 800, temperature: 0.7 })
}

/**
 * Get disease diagnosis from text description (no image)
 */
export async function diagnoseFromDescription(description: string): Promise<string> {
  const messages: ChatMessage[] = [
    { role: "system", content: DISEASE_SYSTEM_PROMPT },
    { role: "user", content: description },
  ]
  return await callOpenRouter(messages, { maxTokens: 800, temperature: 0.5 })
}

/**
 * Generate weather-based crop advisory
 */
export async function generateWeatherAdvisory(
  district: string,
  crop: string,
  forecast: any
): Promise<string> {
  const forecastText = JSON.stringify(forecast, null, 2)
  const messages: ChatMessage[] = [
    { role: "system", content: WEATHER_ADVISORY_PROMPT },
    {
      role: "user",
      content: `District: ${district}, Bangladesh\nCrop: ${crop}\n7-day weather forecast: ${forecastText}\n\nGive the farmer practical advice in Bengali.`,
    },
  ]
  return await callOpenRouter(messages, { maxTokens: 600, temperature: 0.7 })
}
